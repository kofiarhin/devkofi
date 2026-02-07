const User = require("../models/User");

const cleaner = async (req, res, next) => {
  //   await User.deleteMany();
  // console.log("cleaner: database cleared");
  next();
};

module.exports = cleaner;
