const { Router } = require("express");
const { ask } = require("../controllers/chat.controller");

const router = Router();

router.post("/ask", ask);

module.exports = router;
