const { Router } = require("express");
const { getCourses } = require("../controllers/courseController");

const router = Router();

router.get("/", getCourses);

module.exports = router;
