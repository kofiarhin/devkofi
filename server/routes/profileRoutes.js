const { Router } = require("express");
const requireAuth = require("../middleware/requireAuth");
const { getProfileMe, patchProfileMe } = require("../controllers/profileController");

const router = Router();

router.get("/me", requireAuth, getProfileMe);
router.patch("/me", requireAuth, patchProfileMe);

module.exports = router;
