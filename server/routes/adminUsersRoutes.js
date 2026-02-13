const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireAdmin = require("../middleware/requireAdmin");

const controller = require("../controllers/adminUsersController");

router.get("/", requireAuth, requireAdmin, controller.getAdminUsers);

module.exports = router;
