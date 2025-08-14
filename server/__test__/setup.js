const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const Newsletter = require("../Model/newsletterModel");
const newsletterModel = require("../Model/newsletterModel");
const Mentorship = require("../Model/mentorshipModel");
const Contact = require("../Model/contactModel");
const { userOne } = require("./data/data");
const User = require("../Model/userModel");

const clearDB = async () => {
  await Newsletter.deleteMany();
  await Mentorship.deleteMany();
  await Contact.deleteMany();
  await User.deleteMany();
};

beforeAll(async () => {
  try {
    const url = process.env.MONGO_URI_TEST;
    const conn = await mongoose.connect(url);

    await Mentorship.create({ ...userOne });
    clearDB();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
});

beforeEach(async () => {
  await User.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});
