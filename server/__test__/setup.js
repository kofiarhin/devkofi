const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const Newsletter = require("../Model/newsletterModel");
const newsletterModel = require("../Model/newsletterModel");
const Mentorship = require("../Model/mentorshipModel");
const Contact = require("../Model/contactModel");
const { userOne, adminUser, userTwo } = require("./data/data");
const User = require("../Model/userModel");
const { createUser } = require("../utility/helper");

const clearDB = async () => {
  await Newsletter.deleteMany();
  await Mentorship.deleteMany();
  await Contact.deleteMany();
  await User.deleteMany();
};

const populateDataBase = async () => {
  await Promise.all(
    [adminUser, userOne, userTwo].map(async (user) => {
      const newUser = await createUser(user);
      return newUser;
    })
  );
};

beforeAll(async () => {
  try {
    const url = process.env.MONGO_URI_TEST;
    await mongoose.connect(url);

    await populateDataBase();

    clearDB();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});
