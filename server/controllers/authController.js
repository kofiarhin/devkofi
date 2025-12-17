const User = require("../models/User");
const { createUser, generateToken } = require("../utility/helper");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    await User.deleteMany();
    const newUser = await createUser({ firstName, lastName, email, password });
    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error.message);
    return rs.status(400).json({ success: false, error: error.message });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      throw new Error("user not found");
    }

    // compare password
    const isAuth = await bcrypt.compare(password, foundUser.password);
    if (!isAuth) {
      throw new Error("invalid credentials");
    }

    // generate token
    const token = generateToken(foundUser._id);

    // format data to return no password
    const { password: userPassword, ...rest } = foundUser._doc;

    const dataToSend = {
      token,
      ...rest,
    };

    return res.json(dataToSend);
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  loginUser,
  registerUser,
};
