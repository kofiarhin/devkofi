const { Router } = require("express");
const requireAuth = require("../middleware/requireAuth");
const { getStudentSummary } = require("../controllers/dashboardController");

const router = Router();

// GET /api/dashboard/student-summary
router.get("/student-summary", requireAuth, getStudentSummary);

module.exports = router;
