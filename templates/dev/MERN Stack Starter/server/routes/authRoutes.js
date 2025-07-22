const { Router } = require("express");
const {
  getUsers,
  registerUser,
  loginUser,
} = require("../controllers/authController");

const router = Router();

// routes
router.get("/users", getUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
