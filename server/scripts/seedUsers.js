/**
 * Seed Users (admin, free, pro/paid)
 *
 * Usage:
 *   node server/scripts/seedUsers.js
 *
 * Env required:
 *   MONGO_URI=...
 *
 * Optional:
 *   SEED_ADMIN_EMAIL=admin@devkofi.com
 *   SEED_ADMIN_PASSWORD=Admin123!
 *   SEED_FREE_EMAIL=free@devkofi.com
 *   SEED_FREE_PASSWORD=Free123!
 *   SEED_PRO_EMAIL=pro@devkofi.com
 *   SEED_PRO_PASSWORD=Pro123!
 *   SEED_RESET=true   (deletes existing seeded users first)
 */

require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const AccessRequest = require("../models/AccessRequest");

const reqEnv = (key) => {
  const v = process.env[key];
  if (!v) throw new Error(`Missing required env var: ${key}`);
  return v;
};

const getEnv = (key, fallback) => {
  const v = process.env[key];
  return v && String(v).trim() ? v : fallback;
};

const toBool = (v) => String(v).toLowerCase() === "true";

const hashPassword = async (plain) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

const upsertUser = async ({ firstName, lastName, email, password, role }) => {
  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });

  if (existing) return existing;

  const hashed = await hashPassword(password);

  const created = await User.create({
    firstName,
    lastName,
    email: normalizedEmail,
    password: hashed,
    role,
  });

  return created;
};

const ensureEnrollment = async ({ userId, planSlug, status = "active" }) => {
  const existing = await Enrollment.findOne({ userId });
  if (existing) return existing;

  return Enrollment.create({
    userId,
    planSlug,
    status,
  });
};

const main = async () => {
  const mongoUri = reqEnv("MONGO_URI");
  await mongoose.connect(mongoUri);

  const reset = toBool(getEnv("SEED_RESET", "false"));

  const adminEmail = getEnv("SEED_ADMIN_EMAIL", "admin@devkofi.com");
  const adminPassword = getEnv("SEED_ADMIN_PASSWORD", "Admin123!");

  const freeEmail = getEnv("SEED_FREE_EMAIL", "free@devkofi.com");
  const freePassword = getEnv("SEED_FREE_PASSWORD", "Free123!");

  const proEmail = getEnv("SEED_PRO_EMAIL", "pro@devkofi.com");
  const proPassword = getEnv("SEED_PRO_PASSWORD", "Pro123!");

  const seededEmails = [
    adminEmail.toLowerCase(),
    freeEmail.toLowerCase(),
    proEmail.toLowerCase(),
  ];

  if (reset) {
    const users = await User.find(
      { email: { $in: seededEmails } },
      { _id: 1 },
    ).lean();

    const userIds = users.map((u) => u._id);

    if (userIds.length) {
      await Enrollment.deleteMany({ userId: { $in: userIds } });
      await AccessRequest.deleteMany({ userId: { $in: userIds } });
    }

    await User.deleteMany({ email: { $in: seededEmails } });
  }

  const admin = await upsertUser({
    firstName: "Admin",
    lastName: "User",
    email: adminEmail,
    password: adminPassword,
    role: "admin",
  });

  const freeUser = await upsertUser({
    firstName: "Free",
    lastName: "User",
    email: freeEmail,
    password: freePassword,
    role: "student",
  });

  const proUser = await upsertUser({
    firstName: "Pro",
    lastName: "User",
    email: proEmail,
    password: proPassword,
    role: "student",
  });

  const proEnrollment = await ensureEnrollment({
    userId: proUser._id,
    planSlug: "pro",
    status: "active",
  });

  console.log("✅ Seed complete");
  console.log({
    admin: { email: admin.email, password: adminPassword, role: admin.role },
    freeUser: {
      email: freeUser.email,
      password: freePassword,
      role: freeUser.role,
    },
    proUser: {
      email: proUser.email,
      password: proPassword,
      role: proUser.role,
      enrollmentId: proEnrollment._id,
      enrollmentStatus: proEnrollment.status,
      planSlug: proEnrollment.planSlug,
    },
  });

  await mongoose.disconnect();
};

main().catch(async (err) => {
  console.error("❌ Seed failed:", err.message);
  try {
    await mongoose.disconnect();
  } catch (_) {}
  process.exit(1);
});
