const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const app = require("../app");
const Admin = require("../models/Admin");
const Booking = require("../models/Booking");
const {
  generateWeekSlots,
  getWeekMonday,
  isValidBookableSlot,
} = require("../utils/bookingSlots");

const TEST_EMAIL = "booking-admin@devkofi.com";
const TEST_PASSWORD = "BookingAdmin@2026!";

const getFutureMonday = () => getWeekMonday("2099-01-07");

const getFutureSlot = (dayOffset = 0, hour = 16, minute = 0) => {
  const monday = getFutureMonday();
  return new Date(
    Date.UTC(
      monday.getUTCFullYear(),
      monday.getUTCMonth(),
      monday.getUTCDate() + dayOffset,
      hour,
      minute,
      0,
      0
    )
  );
};

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  await Booking.syncIndexes();

  const hash = await bcrypt.hash(TEST_PASSWORD, 12);
  await Admin.deleteMany({ email: TEST_EMAIL });
  await Admin.create({ email: TEST_EMAIL, password: hash, role: "admin" });
});

beforeEach(async () => {
  await Booking.deleteMany({ email: /booking-test/i });
});

afterAll(async () => {
  await Admin.deleteMany({ email: TEST_EMAIL });
  await Booking.deleteMany({ email: /booking-test/i });
  await mongoose.disconnect();
});

const getAuthCookie = async () => {
  const res = await request(app)
    .post("/api/admin/auth/login")
    .send({ email: TEST_EMAIL, password: TEST_PASSWORD });
  return res.headers["set-cookie"];
};

const createPayload = (overrides = {}) => ({
  name: "Booking Test",
  email: `booking-test-${Date.now()}@example.com`,
  company: "DevKofi QA",
  message: "I want to talk through a full-stack project.",
  slotStart: getFutureSlot().toISOString(),
  ...overrides,
});

describe("booking slot utilities", () => {
  it("normalizes any date in a week to Monday", () => {
    expect(getWeekMonday("2099-01-05").toISOString()).toBe("2099-01-05T00:00:00.000Z");
    expect(getWeekMonday("2099-01-07").toISOString()).toBe("2099-01-05T00:00:00.000Z");
  });

  it("generates Monday-Friday 30-minute business slots", () => {
    const days = generateWeekSlots("2099-01-07", new Set(), new Date("2098-01-01T00:00:00.000Z"));

    expect(days).toHaveLength(5);
    expect(days.map((day) => day.weekday)).toEqual(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
    expect(days[0].slots).toHaveLength(4);
    expect(days[0].slots[0].label).toBe("16:00");
    expect(days[0].slots[3].label).toBe("17:30");
  });

  it("rejects weekend and outside-hours slots", () => {
    expect(isValidBookableSlot("2099-01-10T16:00:00.000Z")).toBe(false);
    expect(isValidBookableSlot("2099-01-05T18:00:00.000Z")).toBe(false);
    expect(isValidBookableSlot("2099-01-05T16:15:00.000Z")).toBe(false);
    expect(isValidBookableSlot("2099-01-05T16:00:00.000Z")).toBe(true);
  });
});

describe("GET /api/bookings/availability", () => {
  it("returns Monday-Friday slots from 16:00 to 17:30 GMT", async () => {
    const res = await request(app).get("/api/bookings/availability?weekStart=2099-01-07");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.timezone).toBe("GMT");
    expect(res.body.slotDurationMinutes).toBe(30);
    expect(res.body.days).toHaveLength(5);
    expect(res.body.days[0].slots[0]).toMatchObject({ label: "16:00", available: true });
    expect(res.body.days[0].slots[3]).toMatchObject({ label: "17:30", available: true });
  });

  it("marks booked slots unavailable", async () => {
    const slotStart = getFutureSlot(1, 16, 30);
    await Booking.create({
      name: "Booked Slot",
      email: "booking-test-booked@example.com",
      slotStart,
      slotEnd: new Date(slotStart.getTime() + 30 * 60 * 1000),
    });

    const res = await request(app).get("/api/bookings/availability?weekStart=2099-01-07");
    const tuesdaySlot = res.body.days[1].slots.find((slot) => slot.label === "16:30");

    expect(tuesdaySlot.available).toBe(false);
  });

  it("marks past slots unavailable", async () => {
    const res = await request(app).get("/api/bookings/availability?weekStart=2020-01-06");

    expect(res.status).toBe(200);
    expect(res.body.days[0].slots.every((slot) => slot.available === false)).toBe(true);
  });
});

describe("POST /api/bookings", () => {
  it("creates a valid booking", async () => {
    const payload = createPayload();
    const res = await request(app).post("/api/bookings").send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.booking).toMatchObject({
      name: payload.name,
      email: payload.email,
      slotStart: payload.slotStart,
      status: "booked",
    });
  });

  it("rejects weekend slots", async () => {
    const res = await request(app)
      .post("/api/bookings")
      .send(createPayload({ slotStart: getFutureSlot(5, 16, 0).toISOString() }));

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects outside-hours slots and non-30-minute boundaries", async () => {
    const outsideHours = await request(app)
      .post("/api/bookings")
      .send(createPayload({ slotStart: getFutureSlot(0, 9, 0).toISOString() }));

    const invalidBoundary = await request(app)
      .post("/api/bookings")
      .send(createPayload({ slotStart: getFutureSlot(0, 16, 15).toISOString() }));

    expect(outsideHours.status).toBe(400);
    expect(invalidBoundary.status).toBe(400);
  });

  it("rejects duplicate slots with 409", async () => {
    const slotStart = getFutureSlot(2, 17, 0).toISOString();
    await request(app).post("/api/bookings").send(createPayload({ slotStart }));

    const res = await request(app)
      .post("/api/bookings")
      .send(createPayload({ email: "booking-test-duplicate@example.com", slotStart }));

    expect(res.status).toBe(409);
    expect(res.body.error).toBe("This slot is no longer available");
  });
});

describe("GET /api/admin/bookings", () => {
  it("requires admin auth", async () => {
    const res = await request(app).get("/api/admin/bookings");

    expect(res.status).toBe(401);
  });

  it("returns sanitized bookings when authenticated", async () => {
    const slotStart = getFutureSlot(3, 13, 30);
    await Booking.create({
      name: "Admin Booking",
      email: "booking-test-admin@example.com",
      company: "Admin Co",
      message: "Admin list check",
      slotStart,
      slotEnd: new Date(slotStart.getTime() + 30 * 60 * 1000),
    });

    const cookie = await getAuthCookie();
    const res = await request(app)
      .get("/api/admin/bookings?search=booking-test-admin")
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.bookings[0]).toEqual(
      expect.objectContaining({
        name: "Admin Booking",
        email: "booking-test-admin@example.com",
        status: "booked",
      })
    );
    expect(res.body.data.bookings[0]).not.toHaveProperty("__v");
  });
});
