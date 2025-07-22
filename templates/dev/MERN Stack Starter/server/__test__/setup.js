const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const User = require("../models/userModel");
const { userOne } = require("./data");
const { createUser } = require("../utility/helper");

const clearDatabase = async () => {
  await User.deleteMany();
};
beforeAll(async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI_TEST);
    await clearDatabase();
    await createUser(userOne);
  } catch (error) {
    process.exit(1);
    console.log(error.message);
  }
});

afterAll(async () => {
  await clearDatabase();
  await mongoose.connection.close();
});
