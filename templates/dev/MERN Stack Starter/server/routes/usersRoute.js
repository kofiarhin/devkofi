const { Router } = require("express");
const auth = require("../middleware/auth");
const User = require("../models/userModel");

const router = Router();

router.get("/", auth, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new Error("unauthorized access: no user");
    }
    const users = await User.find();
    return res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
