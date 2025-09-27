const path = require("path");

const config = {
  rootDir: path.resolve(__dirname),
  testMatch: ["<rootDir>/__tests__/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/**/*.js",
    "!<rootDir>/**/__tests__/**",
    "!<rootDir>/jest.config.cjs",
    "!<rootDir>/jest.setup.js",
    "!<rootDir>/server.js",
    "!<rootDir>/base.js",
    "!<rootDir>/logs/**",
    "!<rootDir>/files/**",
    "!<rootDir>/public/**",
    "!<rootDir>/config/**",
    "!<rootDir>/data/**",
    "!<rootDir>/coverage/**",
    "!<rootDir>/__test__/**",
    "!<rootDir>/utility/sendEmail.js",
    "!<rootDir>/middlewares/logger.js",
    "!<rootDir>/middlewares/verifyAdminMiddleware.js",
    "!<rootDir>/routes/templateRoutes.js",
    "!<rootDir>/routes/downloadRoutes.js",
    "!<rootDir>/routes/messagesRoute.js",
    "!<rootDir>/jset.config.js",
  ],
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 85,
      functions: 85,
      lines: 85,
    },
  },
};

module.exports = config;
