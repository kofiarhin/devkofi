const { Router } = require("express");
const router = require("./authRoutes");

router.get("/", async (req, res, next) => {
  return res.json({ message: "get posts" });
});

module.exports = router;
