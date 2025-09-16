const jwt = require("jsonwebtoken");
const mentorship = require("../Model/mentorshipModel");
const User = require("../Model/userModel");

const auth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      console.log("ÿou are not authorized");
    }
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      throw new Error("unauthorized: no token");
    }

    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    if (!user) {
      throw new Error("user not found");
    }
    const { password, ...rest } = user._doc;
    req.user = rest;
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = auth;
