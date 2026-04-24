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

// Raise the login rate limit so regular test calls don't exhaust it, but keep
// it low enough that the rate-limit test (12 concurrent calls) still triggers
// a 429. Regular tests make ~15 login calls; with max=25 the remaining 10
// in the rate-limit test push over the limit (calls 26-27 → 429).
process.env.LOGIN_RATE_LIMIT_MAX = '25';
process.env.LOGIN_RATE_LIMIT_WINDOW_MS = '60000';
