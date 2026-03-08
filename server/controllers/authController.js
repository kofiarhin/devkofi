const User = require("../models/User");
const { createUser, generateToken } = require("../utility/helper");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName) {
      return res.status(400).json({ success: false, error: "firstName is required" });
    }
    if (!lastName) {
      return res.status(400).json({ success: false, error: "lastName is required" });
    }
    if (!email) {
      return res.status(400).json({ success: false, error: "email is required" });
    }
    if (!password) {
      return res.status(400).json({ success: false, error: "password is required" });
    }

    const newUser = await createUser({ firstName, lastName, email, password });
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email });
    if (!foundUser) throw new Error("user not found");

    const isAuth = await bcrypt.compare(password, foundUser.password);
    if (!isAuth) throw new Error("invalid credentials");

    const token = generateToken(foundUser._id);

    const { password: userPassword, ...rest } = foundUser._doc;

    return res.json({
      token,
      ...rest,
    });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password").lean();
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  loginUser,
  registerUser,
  me,
};
