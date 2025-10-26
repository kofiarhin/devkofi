const { Router } = require("express");
const { getCourses, getCourse } = require("../controllers/courseController");

const router = Router();

router.get("/", getCourses);

// get course
router.get("/:id", getCourse);

module.exports = router;
