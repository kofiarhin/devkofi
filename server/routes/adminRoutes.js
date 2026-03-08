const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireAdmin = require("../middleware/requireAdmin");

const controller = require("../controllers/adminController");

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

router.post(
  "/enrollments/approve",
  requireAuth,
  requireAdmin,
  controller.approveEnrollment,
);
router.post(
  "/enrollments/reject",
  requireAuth,
  requireAdmin,
  controller.rejectEnrollment,
);
router.post(
  "/enrollments/activate",
  requireAuth,
  requireAdmin,
  controller.activateEnrollment,
);

module.exports = router;
