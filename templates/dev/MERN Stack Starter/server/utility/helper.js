const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
  return token;
};
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};
const createUser = async (userData) => {
  const { password, ...rest } = userData;
  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    ...rest,
    password: hashedPassword,
  });
  return user;
};

module.exports = {
  generateToken,
  hashPassword,
  createUser,
};
