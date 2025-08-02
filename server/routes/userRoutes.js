const { Router } = require("express");
const auth = require("../middlewares/auth");
const { getUsers } = require("../controllers/userController");

const router = Router();

router.get("/", auth, getUsers);

module.exports = router;
