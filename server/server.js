const app = require("./app");
const connectDB = require("./config/db");
const { loadEnv } = require("./config/env");

const startServer = async () => {
  const config = loadEnv();
  const { port, mongoUri, nodeEnv } = config;

  try {
    await connectDB(mongoUri);

    const server = app.listen(port, () => {
      if (nodeEnv !== "test") {
        console.log(`Server started on port: ${port}`);
      }
    });

    return server;
  } catch (error) {
    if (nodeEnv !== "test") {
      console.error("Failed to start server:", error.message);
    }

    throw error;
  }
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { app, startServer };
