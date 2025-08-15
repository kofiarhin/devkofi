const { generateToken, createUser } = require("../utility/helper");
const jwt = require("jsonwebtoken");
const Mentorship = require("../Model/mentorshipModel");
const User = require("../Model/userModel");
const bcrypt = require("bcryptjs");

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("user not found");
    }

    // compare password;
    const check = await bcrypt.compare(password, user.password);

    if (!check) {
      res.status(400);
      throw new Error("invalid credentials");
    }

    const { password: userPassword, ...rest } = user._doc;
    const token = generateToken({ email });
    return res.json({ success: true, user: { ...rest }, token });
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      throw new Error("invalid credentials");
    }
  } catch (error) {
    next(error);
  }
};

// register user
const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password, pricingId } = req.body;
    if (!fullName || !email || !password || !pricingId) {
      res.status(400);
      throw new Error("please fill out all fields");
    }
    const user = await createUser({ fullName, email, password, pricingId });
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
