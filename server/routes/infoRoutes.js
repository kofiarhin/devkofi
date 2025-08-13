const { Router } = require("express");
const { fetchDailyGitHubContributions } = require("../utility/helper");
const { getGitHubInfo } = require("../controllers/infoController");

const router = Router();

router.get("/", async (req, res, next) => {
  return res.json({ message: "get info" });
});

router.get("/github", getGitHubInfo);

module.exports = router;
