const User = require("../models/User");

async function requireAdmin(req, res, next) {
  const user = await User.findById(req.userId).lean();

  if (!user || user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Admin access required",
    });
  }

  next();
}

module.exports = requireAdmin;
