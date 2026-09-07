const required = [
  'MONGO_URI',
  'JWT_SECRET',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
  'CONTEXT_API_URL',
  'CONTEXT_API_KEY',
];

for (const key of required) {
  if (!process.env[key]) throw new Error(`Missing required env var: ${key}`);
}

module.exports = {
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  contextApiUrl: process.env.CONTEXT_API_URL,
  contextApiKey: process.env.CONTEXT_API_KEY,
  loginRateLimit: {
    max: parseInt(process.env.LOGIN_RATE_LIMIT_MAX || '10', 10),
    windowMs: parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS || '900000', 10),
  },
};
