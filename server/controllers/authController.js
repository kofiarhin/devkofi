const { generateToken, createUser } = require("../utility/helper");
const jwt = require("jsonwebtoken");
const Mentorship = require("../Model/mentorshipModel");
const User = require("../Model/userModel");
const bcrypt = require("bcryptjs");

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("please fill out all fields");
    }
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      res.status(404);
      throw new Error("user not found");
    }

    // compare passwords
    const auth = await bcrypt.compare(password, foundUser.password);
    if (!auth) {
      res.status(400);
      throw new Error("invalid credentials");
    }

    const token = await generateToken(foundUser._id);
    const { password: userPassword, ...rest } = foundUser._doc;
    return res.json({ success: true, user: { ...rest }, token });
  } catch (error) {
    next(error);
  }
};

// register user
const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, plan } = req.body;
    if (!firstName || !lastName || !email || !password || !plan) {
      res.status(400);
      throw new Error("please fill out all fields");
    }
    const user = await createUser({
      firstName,
      lastName,
      email,
      password,
      plan,
      // role defaults to student if not provided
    });
    res.status(201);
    return res.json(user);
  } catch (error) {
    next(error);
  }
};

// verify user
const verifyUser = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) {
      throw new Error(" no token");
    }
    const data = jwt.verify(token, process.env.JWT_SECRET);
    if (!data) {
      throw new Error("token invalid");
    }
    const { email } = data;
    const user = await Mentorship.findOne({ email });
    if (!user) {
      throw new Error("user not found");
    }

    const updatedUser = await Mentorship.findOneAndUpdate(
      { email },
      {
        $set: {
          verified: true,
        },
      },
      { new: true }
    );
    return res.send(
      `<p> you account with email address ${email} has been successfully activated </p>`
    );
  } catch (error) {
    return res.status(500).send(`<p> ${error.message} </p>`);
  }
};

module.exports = {
  loginUser,
  registerUser,
  verifyUser,
};
