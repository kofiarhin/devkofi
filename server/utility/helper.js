const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const createUser = async (userData) => {
  const { password, ...rest } = userData;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({
    ...rest,
    password: hashedPassword,
  });

  const { password: userPassword, ...dataToSend } = user._doc;

  return dataToSend;
};

const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET);
  return token;
};

module.exports = { createUser, generateToken };
