const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');

const VALID_EMAIL = 'newsletter-user@test.com';
const DUPLICATE_EMAIL = 'already-subscribed@test.com';

beforeAll(async () => {
  const uri = process.env.MONGO_URI;

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }

  await NewsletterSubscriber.deleteMany({
    email: { $in: [VALID_EMAIL, DUPLICATE_EMAIL] },
  });
});

afterEach(async () => {
  await NewsletterSubscriber.deleteMany({
    email: { $in: [VALID_EMAIL, DUPLICATE_EMAIL] },
  });
});

afterAll(async () => {
  await NewsletterSubscriber.deleteMany({
    email: { $in: [VALID_EMAIL, DUPLICATE_EMAIL] },
  });
  await mongoose.disconnect();
});

describe('POST /api/newsletter/subscribe', () => {
  it('creates a subscriber for a valid email', async () => {
    const response = await request(app)
      .post('/api/newsletter/subscribe')
      .send({ email: VALID_EMAIL });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.alreadySubscribed).toBe(false);
    expect(response.body.message).toBe('Thanks for subscribing!');

    const subscriber = await NewsletterSubscriber.findOne({ email: VALID_EMAIL });
    expect(subscriber).not.toBeNull();
  });

  it('rejects an invalid email payload', async () => {
    const response = await request(app)
      .post('/api/newsletter/subscribe')
      .send({ email: 'not-an-email' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('A valid email address is required.');
  });

  it('returns a friendly success response for duplicate subscribers', async () => {
    await NewsletterSubscriber.create({ email: DUPLICATE_EMAIL });

    const response = await request(app)
      .post('/api/newsletter/subscribe')
      .send({ email: `  ${DUPLICATE_EMAIL.toUpperCase()}  ` });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.alreadySubscribed).toBe(true);
    expect(response.body.message).toBe("You're already subscribed.");
  });
});
