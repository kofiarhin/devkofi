const User = require("../models/userModel");
const { generateToken, hashPassword } = require("../utility/helper");
const bcrypt = require("bcryptjs");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users) {
      throw new Error("users not found");
    }
    return res.json(users);
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
};

// register users
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new Error("please fill out all fields");
    }

    // hash password
    const hashedPassword = await hashPassword(password);
    const user = await User.create({ name, email, password: hashedPassword });
    return res.status(201).json(user);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// login user
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("invalid credentials");
    }
    // check if user exist
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("user not found");
    }

    // compare the password
    const check = await bcrypt.compare(password, user.password);

    if (!check) {
      throw new Error("invalid credentials: password");
    }

    // generate token
    const token = generateToken(user._id);
    const { password: userPassword, ...rest } = user._doc;
    return res.json({ ...rest, token });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getUsers,
  registerUser,
  loginUser,
};
