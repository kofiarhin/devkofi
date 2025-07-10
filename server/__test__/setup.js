const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const Newsletter = require("../Model/newsletterModel");
const newsletterModel = require("../Model/newsletterModel");

beforeAll(async () => {
  try {
    const url = process.env.MONGO_URI_TEST;
    const conn = await mongoose.connect(url);
    await Newsletter.deleteMany();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
});

beforeEach(async () => {
  await Newsletter.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});
