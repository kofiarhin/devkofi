const { generateToken } = require("../utility/helper");

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

module.exports = {
  loginUser,
  registerUser,
};
