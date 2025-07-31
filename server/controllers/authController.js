const { generateToken } = require("../utility/helper");
const jwt = require("jsonwebtoken");
const Mentorship = require("../Model/mentorshipModel");

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      throw new Error("invalid credentials");
    }
    const token = generateToken({ email });
    return res.json({ success: true, user: { token } });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// register user
const registerUser = async (req, res, next) => {
  return res.json({ message: "register user" });
};
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
    // return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  loginUser,
  registerUser,
  verifyUser,
};
