const { Router } = require("express");
const router = Router();
const { getProjects } = require("../controllers/projectsController");

router.get("/", getProjects);

module.exports = router;
