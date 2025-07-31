const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const Newsletter = require("../Model/newsletterModel");
const newsletterModel = require("../Model/newsletterModel");
const Mentorship = require("../Model/mentorshipModel");
const Contact = require("../Model/contactModel");
const { userOne } = require("./data/data");

beforeAll(async () => {
  try {
    const url = process.env.MONGO_URI_TEST;
    const conn = await mongoose.connect(url);
    await Newsletter.deleteMany();
    await Mentorship.deleteMany();
    await Mentorship.create({ ...userOne });
    await Contact.deleteMany();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});
