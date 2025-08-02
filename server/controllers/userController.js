const MEntorship = require("../Model/mentorshipModel");
const getUsers = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new Error("unauthorized");
    }
    const users = await MEntorship.find();
    return res.json(users);
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
};

module.exports = {
  getUsers,
};
