const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      res.status(401);
      throw new Error("no token");
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      res.status(401);
      throw new Error("invalid credentials: no token");
    }
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    if (!id) {
      throw new Error("unauthorized access: invalid token");
    }
    const user = await User.findById(id);
    if (!user) {
      throw new Error("unauthorized access: user not found");
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: error.message });
  }
};

module.exports = auth;
