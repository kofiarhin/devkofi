const { Router } = require("express");

const router = Router();

router.get("/", async (req, res, next) => {
  return res.json({ message: "get list of all youtube videos" });
});

module.exports = router;
