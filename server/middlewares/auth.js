const jwt = require("jsonwebtoken");
const mentorship = require("../Model/mentorshipModel");

const auth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      console.log("ÿou are not authorized");
    }
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      throw new Error("unauthorized: no token");
    }
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    if (!email) {
      throw new Error("unauthorized access: invalid email");
    }
    const foundUser = await mentorship.findOne({ email });
    if (!foundUser) {
      throw new Error("unauthorized access: user not found");
    }

    req.user = {
      ...foundUser,
    };
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = auth;
