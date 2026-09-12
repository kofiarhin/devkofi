const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const app = require('../app');
const Admin = require('../models/Admin');
const Booking = require('../models/Booking');
const ContactMessage = require('../models/ContactMessage');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const { getWeekMonday } = require('../utils/bookingSlots');

const TEST_EMAIL = 'testadmin@devkofi.com';
const TEST_PASSWORD = 'TestAdmin@2026!';
let testMessageId;
let authCookie;

const getFutureMonday = () => getWeekMonday('2099-02-02');

const getFutureSlot = (dayOffset = 0, hour = 16, minute = 0) => {
  const monday = getFutureMonday();
  return new Date(Date.UTC(
    monday.getUTCFullYear(),
    monday.getUTCMonth(),
    monday.getUTCDate() + dayOffset,
    hour,
    minute,
    0,
    0
  ));
};

const getSlotEnd = (slotStart) => new Date(slotStart.getTime() + 30 * 60 * 1000);

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

  await NewsletterSubscriber.insertMany([
    { email: 'older-subscriber@test.com', createdAt: new Date('2026-01-10T00:00:00.000Z') },
    { email: 'new-subscriber@test.com', createdAt: new Date('2026-04-22T10:30:00.000Z') },
  ]);

  await Booking.syncIndexes();
});

afterAll(async () => {
  await Admin.deleteMany({ email: TEST_EMAIL });
  await ContactMessage.deleteMany({ email: 'alice@test.com' });
  await NewsletterSubscriber.deleteMany({
    email: { $in: ['older-subscriber@test.com', 'new-subscriber@test.com'] },
  });
  await Booking.deleteMany({ email: /admin-booking/i });
  await mongoose.disconnect();
});

beforeEach(async () => {
  await Booking.deleteMany({ email: /admin-booking/i });
});

const getAuthCookie = async () => {
  if (authCookie) {
    return authCookie;
  }

  const res = await request(app)
    .post('/api/admin/auth/login')
    .send({ email: TEST_EMAIL, password: TEST_PASSWORD });
  authCookie = res.headers['set-cookie'];
  return authCookie;
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
  });
});

/* existing tests unchanged above export coverage */

describe('GET /api/admin/newsletter/export/csv', () => {
  it('returns csv file for authenticated admin', async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .get('/api/admin/newsletter/export/csv')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
    expect(res.headers['content-disposition']).toContain('.csv');
    expect(res.text).toContain('email,verified,subscribedAt');

    const lines = res.text.trim().split('\n');
    expect(lines[1]).toContain('new-subscriber@test.com');
    expect(lines[2]).toContain('older-subscriber@test.com');
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await request(app).get('/api/admin/newsletter/export/csv');
    expect(res.status).toBe(401);
  });

  it('returns headers only when list is empty', async () => {
    await NewsletterSubscriber.deleteMany({});

    const cookie = await getAuthCookie();
    const res = await request(app)
      .get('/api/admin/newsletter/export/csv')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.text).toBe('email,verified,subscribedAt\n');

    await NewsletterSubscriber.insertMany([
      { email: 'older-subscriber@test.com', createdAt: new Date('2026-01-10T00:00:00.000Z') },
      { email: 'new-subscriber@test.com', createdAt: new Date('2026-04-22T10:30:00.000Z') },
    ]);
  });
});

describe('GET /api/admin/newsletter/export/json', () => {
  it('returns json file for authenticated admin', async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .get('/api/admin/newsletter/export/json')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/json');
    expect(res.headers['content-disposition']).toContain('.json');

    const payload = JSON.parse(res.text);
    expect(Array.isArray(payload)).toBe(true);
    expect(payload[0]).toHaveProperty('email', 'new-subscriber@test.com');
    expect(payload[0]).toHaveProperty('verified', 'no');
    expect(payload[0]).toHaveProperty('subscribedAt', '2026-04-22T10:30:00.000Z');
    expect(payload[1]).toHaveProperty('email', 'older-subscriber@test.com');
    expect(payload[1]).toHaveProperty('verified', 'no');
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await request(app).get('/api/admin/newsletter/export/json');
    expect(res.status).toBe(401);
  });

  it('returns empty array when list is empty', async () => {
    await NewsletterSubscriber.deleteMany({});

    const cookie = await getAuthCookie();
    const res = await request(app)
      .get('/api/admin/newsletter/export/json')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(JSON.parse(res.text)).toEqual([]);

    await NewsletterSubscriber.insertMany([
      { email: 'older-subscriber@test.com', createdAt: new Date('2026-01-10T00:00:00.000Z') },
      { email: 'new-subscriber@test.com', createdAt: new Date('2026-04-22T10:30:00.000Z') },
    ]);
  });
});
