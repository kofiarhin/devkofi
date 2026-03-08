const { Router } = require("express");
const { registerUser, loginUser, me } = require("../controllers/authController");
const requireAuth = require("../middleware/requireAuth");

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", requireAuth, me);

module.exports = router;
