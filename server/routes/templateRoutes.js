const { Router } = require("express");
const { getTemplates } = require("../controllers/templatesController");

const router = Router();

router.get("/", getTemplates);

module.exports = router;
