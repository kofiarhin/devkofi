require('dotenv').config();

// Use test DB; env.js requires MONGO_URI to be set
if (!process.env.MONGO_URI) {
  process.env.MONGO_URI =
    process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/devkofi_test';
}

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test_jwt_secret_for_testing_only';
}

if (!process.env.ADMIN_EMAIL) {
  process.env.ADMIN_EMAIL = 'test_admin@devkofi.com';
}

if (!process.env.ADMIN_PASSWORD) {
  process.env.ADMIN_PASSWORD = 'TestAdmin@Pass2026!';
}
