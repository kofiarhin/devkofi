const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGO_URI_TEST;
    if (!uri) {
      if (process.env.NODE_ENV === "test") return;
      throw new Error("Missing MONGO_URI");
    }

    if (mongoose.connection.readyState === 1) return;

    const conn = await mongoose.connect(uri);
    console.log("connected to database", conn.connection.host);
  } catch (error) {
    console.log(error.message);
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
