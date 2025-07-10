const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const url =
      process.env.NODE_ENV === "development"
        ? process.env.MONGO_URI_DEV
        : process.env.MONGO_URI_PROD;
    console.log(url);
    const conn = await mongoose.connect(url);
    console.log(conn.connection.host);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
