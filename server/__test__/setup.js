const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const User = require("../models/User");
const { testUser, freeUser } = require("./data");
const { createUser } = require("../utility/helper");

beforeAll(async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI_TEST);
    await User.deleteMany();

    //create test user
  } catch (error) {
    console.log({ error: "failed to connect to database" });
    process.exit(1);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});
