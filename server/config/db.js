const mongoose = require("mongoose");
const { setupInMemoryModels } = require("../utility/inMemoryStore");

const connectDB = async (mongoUri) => {
  if (!mongoUri) {
    if (process.env.NODE_ENV === "test") {
      return null;
    }

    throw new Error("MONGODB_URI environment variable is required");
  }

  try {
    const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    }); // CODex: shorten selection timeout so local failures surface quickly

    if (process.env.NODE_ENV !== "test") {
      console.log(`MongoDB connected: ${connection.connection.host}`);
    }

    return connection;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);

    const allowMemoryFallback =
      process.env.NODE_ENV !== "production" &&
      process.env.USE_IN_MEMORY_DB !== "false";

    if (!allowMemoryFallback) {
      throw error; // CODex: bubble up in production where real Mongo is required
    }

    setupInMemoryModels(); // CODex: mirror Jest in-memory stores so dev server works offline

    if (process.env.NODE_ENV !== "test") {
      console.warn(
        "[db] Mongo unavailable; using in-memory stores that reset on restart"
      );
    }

    return null;
  }
};

module.exports = connectDB;
