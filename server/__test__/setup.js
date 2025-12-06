const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

beforeAll(async () => {
  const url = process.env.MONGO_URI_TEST;
  try {
    const conn = await mongoose.connect(url);
    console.log(`connected to database ${conn.connection.host}`);
  } catch (error) {
    process.exit(1);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});
