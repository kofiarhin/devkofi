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
    expect(res.body.authenticated).toBe(true);
    expect(res.body.data.email).toBe(TEST_EMAIL);
  });

  it('returns 200 with unauthenticated state when no cookie exists', async () => {
    const res = await request(app).get('/api/admin/auth/me');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.authenticated).toBe(false);
    expect(res.body.data).toBeNull();
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

describe('Admin booking management', () => {
  const createBooking = async (overrides = {}) => {
    const slotStart = overrides.slotStart || getFutureSlot();
    return Booking.create({
      name: 'Admin Booking',
      email: `admin-booking-${Date.now()}-${Math.random()}@test.com`,
      company: 'Booking Co',
      message: 'Booking management test',
      status: 'booked',
      slotStart,
      slotEnd: getSlotEnd(slotStart),
      ...overrides,
    });
  };

  describe('GET /api/admin/bookings', () => {
    it('returns paginated bookings when authenticated', async () => {
      await createBooking({ name: 'Booked Call', slotStart: getFutureSlot(0, 16, 0) });
      await createBooking({
        name: 'Cancelled Call',
        status: 'cancelled',
        slotStart: getFutureSlot(1, 16, 0),
      });

      const cookie = await getAuthCookie();
      const res = await request(app)
        .get('/api/admin/bookings?status=all&page=1&limit=10&search=admin-booking')
        .set('Cookie', cookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.bookings).toHaveLength(2);
      expect(res.body.data).toMatchObject({ page: 1, limit: 10, total: 2 });
      expect(res.body.data.bookings[0]).not.toHaveProperty('__v');
      expect(res.body.data.bookings[0]).toHaveProperty('updatedAt');
    });

    it('filters by status and search', async () => {
      await createBooking({
        name: 'Findable Active',
        company: 'Needle Studio',
        status: 'booked',
        slotStart: getFutureSlot(0, 16, 30),
      });
      await createBooking({
        name: 'Other Cancelled',
        company: 'Other Studio',
        status: 'cancelled',
        slotStart: getFutureSlot(1, 16, 30),
      });

      const cookie = await getAuthCookie();
      const res = await request(app)
        .get('/api/admin/bookings?status=booked&search=Needle')
        .set('Cookie', cookie);

      expect(res.status).toBe(200);
      expect(res.body.data.bookings).toHaveLength(1);
      expect(res.body.data.bookings[0]).toMatchObject({
        name: 'Findable Active',
        status: 'booked',
      });
    });

    it('rejects invalid filters', async () => {
      const cookie = await getAuthCookie();

      const invalidStatus = await request(app)
        .get('/api/admin/bookings?status=pending')
        .set('Cookie', cookie);
      const invalidFrom = await request(app)
        .get('/api/admin/bookings?from=not-a-date')
        .set('Cookie', cookie);

      expect(invalidStatus.status).toBe(400);
      expect(invalidFrom.status).toBe(400);
    });
  });

  describe('GET /api/admin/bookings/:bookingId', () => {
    it('returns one booking when authenticated', async () => {
      const booking = await createBooking({ name: 'Detail Booking' });
      const cookie = await getAuthCookie();

      const res = await request(app)
        .get(`/api/admin/bookings/${booking._id}`)
        .set('Cookie', cookie);

      expect(res.status).toBe(200);
      expect(res.body.data.booking).toMatchObject({
        id: booking._id.toString(),
        name: 'Detail Booking',
      });
    });

    it('rejects invalid and missing ids', async () => {
      const cookie = await getAuthCookie();
      const invalid = await request(app).get('/api/admin/bookings/not-an-id').set('Cookie', cookie);
      const missingId = new mongoose.Types.ObjectId().toString();
      const missing = await request(app).get(`/api/admin/bookings/${missingId}`).set('Cookie', cookie);

      expect(invalid.status).toBe(400);
      expect(missing.status).toBe(404);
    });
  });

  describe('PATCH /api/admin/bookings/:bookingId', () => {
    it('updates booking contact fields and normalizes email', async () => {
      const booking = await createBooking();
      const cookie = await getAuthCookie();

      const res = await request(app)
        .patch(`/api/admin/bookings/${booking._id}`)
        .set('Cookie', cookie)
        .send({
          name: 'Updated Booking',
          email: 'UPDATED-ADMIN-BOOKING@TEST.COM',
          company: 'Updated Co',
          message: 'Updated message',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.booking).toMatchObject({
        name: 'Updated Booking',
        email: 'updated-admin-booking@test.com',
        company: 'Updated Co',
        message: 'Updated message',
      });
    });

    it('reschedules to a valid slot and recomputes slotEnd', async () => {
      const booking = await createBooking({ slotStart: getFutureSlot(0, 16, 0) });
      const nextSlot = getFutureSlot(2, 17, 30);
      const cookie = await getAuthCookie();

      const res = await request(app)
        .patch(`/api/admin/bookings/${booking._id}`)
        .set('Cookie', cookie)
        .send({ slotStart: nextSlot.toISOString() });

      expect(res.status).toBe(200);
      expect(res.body.data.booking.slotStart).toBe(nextSlot.toISOString());
      expect(res.body.data.booking.slotEnd).toBe(getSlotEnd(nextSlot).toISOString());
    });

    it('allows keeping the same active slot', async () => {
      const slotStart = getFutureSlot(0, 17, 0);
      const booking = await createBooking({ slotStart });
      const cookie = await getAuthCookie();

      const res = await request(app)
        .patch(`/api/admin/bookings/${booking._id}`)
        .set('Cookie', cookie)
        .send({ name: 'Same Slot', slotStart: slotStart.toISOString(), status: 'booked' });

      expect(res.status).toBe(200);
      expect(res.body.data.booking.slotStart).toBe(slotStart.toISOString());
    });

    it('rejects invalid slots and duplicate active slots', async () => {
      const booking = await createBooking({ slotStart: getFutureSlot(0, 16, 0) });
      const other = await createBooking({ slotStart: getFutureSlot(1, 16, 0) });
      const cookie = await getAuthCookie();

      const weekend = await request(app)
        .patch(`/api/admin/bookings/${booking._id}`)
        .set('Cookie', cookie)
        .send({ slotStart: getFutureSlot(5, 16, 0).toISOString() });
      const outsideHours = await request(app)
        .patch(`/api/admin/bookings/${booking._id}`)
        .set('Cookie', cookie)
        .send({ slotStart: getFutureSlot(0, 9, 0).toISOString() });
      const duplicate = await request(app)
        .patch(`/api/admin/bookings/${booking._id}`)
        .set('Cookie', cookie)
        .send({ slotStart: other.slotStart.toISOString() });

      expect(weekend.status).toBe(400);
      expect(outsideHours.status).toBe(400);
      expect(duplicate.status).toBe(409);
    });

    it('reactivates a cancelled booking when its slot is available', async () => {
      const booking = await createBooking({
        status: 'cancelled',
        slotStart: getFutureSlot(3, 16, 30),
      });
      const cookie = await getAuthCookie();

      const res = await request(app)
        .patch(`/api/admin/bookings/${booking._id}`)
        .set('Cookie', cookie)
        .send({ status: 'booked' });

      expect(res.status).toBe(200);
      expect(res.body.data.booking.status).toBe('booked');
    });
  });

  describe('PATCH /api/admin/bookings/:bookingId/cancel', () => {
    it('cancels a booking and releases the slot', async () => {
      const slotStart = getFutureSlot(4, 16, 0);
      const booking = await createBooking({ slotStart });
      const cookie = await getAuthCookie();

      const cancelRes = await request(app)
        .patch(`/api/admin/bookings/${booking._id}/cancel`)
        .set('Cookie', cookie);

      expect(cancelRes.status).toBe(200);
      expect(cancelRes.body.data.booking.status).toBe('cancelled');

      const createRes = await request(app)
        .post('/api/bookings')
        .send({
          name: 'Admin Booking Replacement',
          email: 'admin-booking-replacement@test.com',
          slotStart: slotStart.toISOString(),
        });

      expect(createRes.status).toBe(201);
    });

    it('is idempotent for already cancelled bookings', async () => {
      const booking = await createBooking({ status: 'cancelled', slotStart: getFutureSlot(2, 16, 30) });
      const cookie = await getAuthCookie();

      const res = await request(app)
        .patch(`/api/admin/bookings/${booking._id}/cancel`)
        .set('Cookie', cookie);

      expect(res.status).toBe(200);
      expect(res.body.data.booking.status).toBe('cancelled');
    });
  });

  describe('DELETE /api/admin/bookings/:bookingId', () => {
    it('deletes a booking', async () => {
      const booking = await createBooking();
      const cookie = await getAuthCookie();

      const res = await request(app)
        .delete(`/api/admin/bookings/${booking._id}`)
        .set('Cookie', cookie);

      const deleted = await Booking.findById(booking._id);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(deleted).toBeNull();
    });

    it('rejects invalid and missing ids', async () => {
      const cookie = await getAuthCookie();
      const invalid = await request(app).delete('/api/admin/bookings/not-an-id').set('Cookie', cookie);
      const missingId = new mongoose.Types.ObjectId().toString();
      const missing = await request(app).delete(`/api/admin/bookings/${missingId}`).set('Cookie', cookie);

      expect(invalid.status).toBe(400);
      expect(missing.status).toBe(404);
    });
  });

  describe('admin booking auth protection', () => {
    it('requires auth for detail and write routes', async () => {
      const booking = await createBooking();

      const detail = await request(app).get(`/api/admin/bookings/${booking._id}`);
      const update = await request(app).patch(`/api/admin/bookings/${booking._id}`).send({ name: 'Nope' });
      const cancel = await request(app).patch(`/api/admin/bookings/${booking._id}/cancel`);
      const remove = await request(app).delete(`/api/admin/bookings/${booking._id}`);

      expect(detail.status).toBe(401);
      expect(update.status).toBe(401);
      expect(cancel.status).toBe(401);
      expect(remove.status).toBe(401);
    });
  });
});

describe('GET /api/admin/newsletter/export/csv', () => {
  it('returns csv file for authenticated admin', async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .get('/api/admin/newsletter/export/csv')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
    expect(res.headers['content-disposition']).toContain('.csv');
    expect(res.text).toContain('email,subscribedAt');

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
    expect(res.text).toBe('email,subscribedAt\n');

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
    expect(payload[0]).toHaveProperty('subscribedAt', '2026-04-22T10:30:00.000Z');
    expect(payload[1]).toHaveProperty('email', 'older-subscriber@test.com');
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

describe('Rate limiting on POST /api/admin/auth/login', () => {
  it('returns 429 after exceeding rate limit', async () => {
    const results = [];

    for (let i = 0; i < 25; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const res = await request(app)
        .post('/api/admin/auth/login')
        .send({ email: 'spam@test.com', password: 'wrong' });
      results.push(res);
    }

    const tooMany = results.some((r) => r.status === 429);
    expect(tooMany).toBe(true);
  }, 30000);
});
