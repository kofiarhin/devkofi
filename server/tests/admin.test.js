const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const app = require('../app');
const Admin = require('../models/Admin');
const ContactMessage = require('../models/ContactMessage');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');

const TEST_EMAIL = 'testadmin@devkofi.com';
const TEST_PASSWORD = 'TestAdmin@2026!';
let testMessageId;

beforeAll(async () => {
  const uri = process.env.MONGO_URI;
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }

  const hash = await bcrypt.hash(TEST_PASSWORD, 12);
  await Admin.deleteMany({ email: TEST_EMAIL });
  await Admin.create({ email: TEST_EMAIL, password: hash, role: 'admin' });

  const seededMessage = await ContactMessage.create({
    name: 'Alice',
    email: 'alice@test.com',
    subject: 'Hello',
    message: 'Test message',
  });
  testMessageId = seededMessage._id.toString();

  await NewsletterSubscriber.create({ email: 'subscriber@test.com' });
});

afterAll(async () => {
  await Admin.deleteMany({ email: TEST_EMAIL });
  await ContactMessage.deleteMany({ email: 'alice@test.com' });
  await NewsletterSubscriber.deleteMany({ email: 'subscriber@test.com' });
  await mongoose.disconnect();
});

const getAuthCookie = async () => {
  const res = await request(app)
    .post('/api/admin/auth/login')
    .send({ email: TEST_EMAIL, password: TEST_PASSWORD });
  return res.headers['set-cookie'];
};

describe('POST /api/admin/auth/login', () => {
  it('returns 200 and sets cookie on valid credentials', async () => {
    const res = await request(app)
      .post('/api/admin/auth/login')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(TEST_EMAIL);
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('returns 401 on wrong password', async () => {
    const res = await request(app)
      .post('/api/admin/auth/login')
      .send({ email: TEST_EMAIL, password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 on missing fields', async () => {
    const res = await request(app)
      .post('/api/admin/auth/login')
      .send({ email: TEST_EMAIL });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 401 on unknown email (no enumeration)', async () => {
    const res = await request(app)
      .post('/api/admin/auth/login')
      .send({ email: 'nobody@devkofi.com', password: 'somepassword' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Invalid credentials');
  });
});

describe('GET /api/admin/auth/me', () => {
  it('returns 200 with admin data when authenticated', async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .get('/api/admin/auth/me')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(TEST_EMAIL);
  });

  it('returns 401 with no cookie', async () => {
    const res = await request(app).get('/api/admin/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /api/admin/auth/logout', () => {
  it('returns 200 and clears cookie', async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .post('/api/admin/auth/logout')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('GET /api/admin/contact-messages', () => {
  it('returns 200 with pagination when authenticated', async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .get('/api/admin/contact-messages')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('messages');
    expect(res.body.data).toHaveProperty('page');
    expect(res.body.data).toHaveProperty('limit');
    expect(res.body.data).toHaveProperty('total');
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await request(app).get('/api/admin/contact-messages');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/admin/contact-messages/:messageId', () => {
  it('returns 200 with a single message when authenticated', async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .get(`/api/admin/contact-messages/${testMessageId}`)
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('message');
    expect(res.body.data.message._id).toBe(testMessageId);
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await request(app).get(`/api/admin/contact-messages/${testMessageId}`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 for invalid object id', async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .get('/api/admin/contact-messages/not-a-valid-id')
      .set('Cookie', cookie);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Invalid message id');
  });

  it('returns 404 for a valid id that does not exist', async () => {
    const cookie = await getAuthCookie();
    const missingId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .get(`/api/admin/contact-messages/${missingId}`)
      .set('Cookie', cookie);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Message not found');
  });
});

describe('GET /api/admin/newsletter-subscribers', () => {
  it('returns 200 with pagination when authenticated', async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .get('/api/admin/newsletter-subscribers')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('subscribers');
    expect(res.body.data).toHaveProperty('page');
    expect(res.body.data).toHaveProperty('limit');
    expect(res.body.data).toHaveProperty('total');
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await request(app).get('/api/admin/newsletter-subscribers');
    expect(res.status).toBe(401);
  });
});

describe('Rate limiting on POST /api/admin/auth/login', () => {
  it('returns 429 after exceeding rate limit', async () => {
    const requests = Array.from({ length: 12 }, () =>
      request(app)
        .post('/api/admin/auth/login')
        .send({ email: 'spam@test.com', password: 'wrong' })
    );
    const results = await Promise.all(requests);
    const tooMany = results.some((r) => r.status === 429);
    expect(tooMany).toBe(true);
  }, 15000);
});
