const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");

const controller = require("../controllers/teamController");

router.post("/request", requireAuth, controller.requestTeamPlan);
router.post("/invite", requireAuth, controller.inviteMember);
router.post("/accept", requireAuth, controller.acceptInvite);

module.exports = router;
