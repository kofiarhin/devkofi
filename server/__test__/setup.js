const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const User = require("../models/User");

beforeAll(async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI_TEST);
    await User.deleteMany();
  } catch (error) {
    console.log({ error: "failed to connect to database" });
    process.exit(1);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});
