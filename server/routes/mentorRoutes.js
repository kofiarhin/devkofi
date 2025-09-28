const express = require("express");
const mentorController = require("../controllers/mentorController");

const router = express.Router();

router.post("/ask", mentorController.ask);

module.exports = router;
