const { Router } = require("express");
const {
  loginUser,
  registerUser,
  verifyUser,
} = require("../controllers/authController");

const router = Router();

router.post("/login", loginUser);
router.get("/verify", verifyUser);
router.post("/register", registerUser);

module.exports = router;
