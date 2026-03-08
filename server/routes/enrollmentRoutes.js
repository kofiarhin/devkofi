const { Router } = require("express");
const requireAuth = require("../middleware/requireAuth");
const {
  getMyEnrollments,
  createEnrollment,
} = require("../controllers/enrollmentController");

const router = Router();

router.get("/me", requireAuth, getMyEnrollments);
router.post("/join/:planSlug", requireAuth, createEnrollment);
router.post("/apply/:planSlug", requireAuth, createEnrollment);
router.post("/", requireAuth, createEnrollment);

module.exports = router;
