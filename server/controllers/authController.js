const User = require("../models/User");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // generate salt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const { password: userPassword, ...rest } = user._doc;
    return res.status(201).json(rest);
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, error: error.message });
  }
};

const loginUser = async (req, res, next) => {
  return res.json({ message: "login user" });
};

module.exports = {
  registerUser,
  loginUser,
};
