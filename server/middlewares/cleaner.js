const NewsLetter = require("../Model/newsletterModel");
const Mentorship = require("../Model/mentorshipModel");
const cleaner = async (req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.log("we are here");
    await NewsLetter.deleteMany();
    await Mentorship.deleteMany();
    console.log("eleaner: users cleared ");
  }
  next();
};

module.exports = cleaner;
