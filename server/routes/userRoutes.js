const { Router } = require("express");
const auth = require("../middlewares/auth");
const { getUsers } = require("../controllers/userController");

const router = Router();

router.get("/", auth, getUsers);
router.get("/:id", auth, async (req, res, next) => {
  const { password, ...rest } = req.user._doc;
  return res.json({ ...rest });
});

module.exports = router;
