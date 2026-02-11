const { Router } = require("express");
const requireAuth = require("../middleware/requireAuth");
const {
  createTeamRequest,
  getMyRequests,
} = require("../controllers/accessRequestController");

const router = Router();

router.get("/me", requireAuth, getMyRequests);
router.post("/team", requireAuth, createTeamRequest);

module.exports = router;
