const crypto = require('crypto');
const request = require('supertest');
const mongoose = require('mongoose');

jest.mock('../utils/emailService', () => ({
  sendContactEmail: jest.fn().mockResolvedValue(undefined),
  sendNewsletterVerificationEmail: jest.fn().mockResolvedValue(undefined),
}));

const app = require('../app');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const emailService = require('../utils/emailService');

const VALID_EMAIL = 'newsletter-user@test.com';
const DUPLICATE_EMAIL = 'already-subscribed@test.com';
const PENDING_EMAIL = 'pending-rotate@test.com';
const VERIFY_EMAIL = 'verify-flow@test.com';
const EXPIRED_EMAIL = 'expired-token@test.com';
const ALREADY_EMAIL = 'already-verified@test.com';

const TEST_EMAILS = [
  VALID_EMAIL,
  DUPLICATE_EMAIL,
  PENDING_EMAIL,
  VERIFY_EMAIL,
  EXPIRED_EMAIL,
  ALREADY_EMAIL,
];

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

jest.setTimeout(30000);

beforeAll(async () => {
  const uri = process.env.MONGO_URI;

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }

  await NewsletterSubscriber.deleteMany({ email: { $in: TEST_EMAILS } });
}, 30000);

beforeEach(() => {
  emailService.sendNewsletterVerificationEmail.mockClear();
});

afterEach(async () => {
  await NewsletterSubscriber.deleteMany({ email: { $in: TEST_EMAILS } });
});

afterAll(async () => {
  await NewsletterSubscriber.deleteMany({ email: { $in: TEST_EMAILS } });
  await mongoose.disconnect();
});

describe('POST /api/newsletter/subscribe', () => {
  it('creates a pending subscriber and sends a verification email for a valid email', async () => {
    const response = await request(app)
      .post('/api/newsletter/subscribe')
      .send({ email: VALID_EMAIL });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.alreadySubscribed).toBe(false);
    expect(response.body.pendingVerification).toBe(true);
    expect(response.body.message).toBe('Check your email to confirm your subscription.');

    const subscriber = await NewsletterSubscriber.findOne({ email: VALID_EMAIL });
    expect(subscriber).not.toBeNull();
    expect(subscriber.verified).toBe(false);
    expect(typeof subscriber.verifyToken).toBe('string');
    expect(subscriber.verifyToken).toHaveLength(64);
    expect(subscriber.verifyTokenExpiresAt instanceof Date).toBe(true);
    expect(subscriber.verifyTokenExpiresAt.getTime()).toBeGreaterThan(Date.now());

    expect(emailService.sendNewsletterVerificationEmail).toHaveBeenCalledTimes(1);
    const sendArgs = emailService.sendNewsletterVerificationEmail.mock.calls[0][0];
    expect(sendArgs.email).toBe(VALID_EMAIL);
    expect(sendArgs.verifyUrl).toMatch(/\/newsletter\/verify\?token=[a-f0-9]{64}$/);
  });

  it('rejects an invalid email payload', async () => {
    const response = await request(app)
      .post('/api/newsletter/subscribe')
      .send({ email: 'not-an-email' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('A valid email address is required.');
    expect(emailService.sendNewsletterVerificationEmail).not.toHaveBeenCalled();
  });

  it('rotates the token and resends the email when a pending subscriber resubmits', async () => {
    const firstHash = hashToken('original-token-value');
    const firstExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await NewsletterSubscriber.create({
      email: PENDING_EMAIL,
      verified: false,
      verifyToken: firstHash,
      verifyTokenExpiresAt: firstExpiry,
    });

    const response = await request(app)
      .post('/api/newsletter/subscribe')
      .send({ email: PENDING_EMAIL });

    expect(response.status).toBe(201);
    expect(response.body.pendingVerification).toBe(true);
    expect(response.body.alreadySubscribed).toBe(false);

    const rotated = await NewsletterSubscriber.findOne({ email: PENDING_EMAIL });
    expect(rotated.verifyToken).toBeDefined();
    expect(rotated.verifyToken).not.toBe(firstHash);
    expect(rotated.verifyTokenExpiresAt.getTime()).toBeGreaterThanOrEqual(firstExpiry.getTime());
    expect(emailService.sendNewsletterVerificationEmail).toHaveBeenCalledTimes(1);
  });

  it('returns a friendly response for an already-verified subscriber and does not resend mail', async () => {
    await NewsletterSubscriber.create({
      email: DUPLICATE_EMAIL,
      verified: true,
      verifiedAt: new Date(),
    });

    const response = await request(app)
      .post('/api/newsletter/subscribe')
      .send({ email: `  ${DUPLICATE_EMAIL.toUpperCase()}  ` });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.alreadySubscribed).toBe(true);
    expect(response.body.pendingVerification).toBe(false);
    expect(response.body.message).toBe("You're already subscribed.");
    expect(emailService.sendNewsletterVerificationEmail).not.toHaveBeenCalled();
  });
});

describe('GET /api/newsletter/verify', () => {
  it('marks the subscriber verified for a valid token', async () => {
    const plainToken = 'verify-flow-token-' + Date.now();
    await NewsletterSubscriber.create({
      email: VERIFY_EMAIL,
      verified: false,
      verifyToken: hashToken(plainToken),
      verifyTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    const response = await request(app)
      .get('/api/newsletter/verify')
      .query({ token: plainToken });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe('verified');

    const subscriber = await NewsletterSubscriber.findOne({ email: VERIFY_EMAIL });
    expect(subscriber.verified).toBe(true);
    expect(subscriber.verifyToken).toBeUndefined();
    expect(subscriber.verifyTokenExpiresAt).toBeUndefined();
    expect(subscriber.verifiedAt instanceof Date).toBe(true);
  });

  it('returns expired for a token whose expiry has passed', async () => {
    const plainToken = 'expired-token-' + Date.now();
    await NewsletterSubscriber.create({
      email: EXPIRED_EMAIL,
      verified: false,
      verifyToken: hashToken(plainToken),
      verifyTokenExpiresAt: new Date(Date.now() - 1000),
    });

    const response = await request(app)
      .get('/api/newsletter/verify')
      .query({ token: plainToken });

    expect(response.status).toBe(410);
    expect(response.body.success).toBe(false);
    expect(response.body.status).toBe('expired');

    const subscriber = await NewsletterSubscriber.findOne({ email: EXPIRED_EMAIL });
    expect(subscriber.verified).toBe(false);
  });

  it('returns invalid when the token is unknown', async () => {
    const response = await request(app)
      .get('/api/newsletter/verify')
      .query({ token: 'not-a-real-token' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.status).toBe('invalid');
  });

  it('returns invalid when the token query is missing', async () => {
    const response = await request(app).get('/api/newsletter/verify');

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('invalid');
  });

  it('treats a re-click of a consumed token as invalid (tokens are single-use)', async () => {
    const plainToken = 'idempotent-token-' + Date.now();
    await NewsletterSubscriber.create({
      email: ALREADY_EMAIL,
      verified: false,
      verifyToken: hashToken(plainToken),
      verifyTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    const first = await request(app)
      .get('/api/newsletter/verify')
      .query({ token: plainToken });
    expect(first.status).toBe(200);
    expect(first.body.status).toBe('verified');

    const second = await request(app)
      .get('/api/newsletter/verify')
      .query({ token: plainToken });

    expect(second.status).toBe(400);
    expect(second.body.status).toBe('invalid');
    expect(second.body.message).toMatch(/invalid|already been used/i);
  });

  it('responds with already_verified when the row still has a token but is already verified', async () => {
    const plainToken = 'race-token-' + Date.now();
    await NewsletterSubscriber.create({
      email: ALREADY_EMAIL,
      verified: true,
      verifiedAt: new Date(),
      verifyToken: hashToken(plainToken),
      verifyTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    const response = await request(app)
      .get('/api/newsletter/verify')
      .query({ token: plainToken });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('already_verified');
  });
});
