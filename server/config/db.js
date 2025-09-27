const mongoose = require("mongoose");

const connectDB = async (mongoUri) => {
  if (!mongoUri) {
    if (process.env.NODE_ENV === "test") {
      return null;
    }

    throw new Error("MONGODB_URI environment variable is required");
  }

  try {
    const connection = await mongoose.connect(mongoUri);

    if (process.env.NODE_ENV !== "test") {
      console.log(`MongoDB connected: ${connection.connection.host}`);
    }

    return connection;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

module.exports = connectDB;
