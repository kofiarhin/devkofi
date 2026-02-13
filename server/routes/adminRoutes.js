const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireAdmin = require("../middleware/requireAdmin");

const controller = require("../controllers/adminController");

// ✅ TEAM approvals
router.get(
  "/team/pending",
  requireAuth,
  requireAdmin,
  controller.getPendingTeamEnrollments,
);

router.post(
  "/team/approve",
  requireAuth,
  requireAdmin,
  controller.approveTeamEnrollment,
);

// ✅ INDIVIDUAL enrollment approvals (standard/pro)
router.post(
  "/enrollments/approve",
  requireAuth,
  requireAdmin,
  controller.approveEnrollment,
);

module.exports = router;
