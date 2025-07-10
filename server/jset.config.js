module.exports = {
  rootDir: "./", // Set server folder as root
  testMatch: ["<rootDir>/**/__test__/**/*.test.js", "<rootDir>/**/*.test.js"], // Match test files
  testPathIgnorePatterns: ["/node_modules/", "../client/"], // Ignore client folder
  testEnvironment: "node",
};
