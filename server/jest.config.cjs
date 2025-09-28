const path = require("path");

const config = {
  rootDir: path.resolve(__dirname),
  testMatch: [
    "<rootDir>/__tests__/**/*.test.js",
    "<rootDir>/tests/**/*.test.js",
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: [
    "prompts/systemPrompt.js",
    "services/askMentor.js",
    "controllers/mentorController.js",
    "routes/mentorRoutes.js",
  ],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
};

module.exports = config;
