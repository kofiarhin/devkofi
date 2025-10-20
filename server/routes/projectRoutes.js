const { Router } = require("express");
const { getProjects } = require("../controllers/projectController");
const router = Router();

router.get("/", getProjects);

module.exports = router;
