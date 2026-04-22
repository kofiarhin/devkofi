require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment');
  process.exit(1);
}

(async () => {
  await connectDB();

  const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  await Admin.findOneAndUpdate(
    { email: ADMIN_EMAIL.toLowerCase() },
    { email: ADMIN_EMAIL.toLowerCase(), password: hash, role: 'admin' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`Admin seeded: ${ADMIN_EMAIL}`);
  await mongoose.disconnect();
  process.exit(0);
})();
