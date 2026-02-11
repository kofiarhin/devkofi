const { Router } = require("express");
const requireAuth = require("../middleware/requireAuth");
const {
  getMyEnrollments,
  createEnrollment,
} = require("../controllers/enrollmentController");

const router = Router();

// current user's enrollments
router.get("/me", requireAuth, getMyEnrollments);

// ✅ join enrollment by slug in URL
router.post("/join/:planSlug", requireAuth, createEnrollment);

// (optional) keep body-based create if you still use it anywhere
router.post("/", requireAuth, createEnrollment);

module.exports = router;
