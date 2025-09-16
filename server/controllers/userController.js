const MEntorship = require("../Model/mentorshipModel");
const User = require("../Model/userModel");
const getUsers = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new Error("unauthorized");
    }
    if (req?.user?.role !== "admin") {
      res.status(400);
      throw new Error("unauthrized access");
    }
    const users = await User.find().select("-password");
    return res.json(users);
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
};

module.exports = {
  getUsers,
};
