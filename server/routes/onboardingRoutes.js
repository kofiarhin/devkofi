const { Router } = require("express");
const requireAuth = require("../middleware/requireAuth");
const {
  postOnboardingIntake,
  getOnboardingStatus,
} = require("../controllers/profileController");

const router = Router();

router.post("/intake", requireAuth, postOnboardingIntake);
router.get("/status", requireAuth, getOnboardingStatus);

module.exports = router;
