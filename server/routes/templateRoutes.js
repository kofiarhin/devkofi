const { Router } = require("express");
const projectProfile = require("../config/project-profile.json");

const router = Router();

router.get("/", async (req, res) => {
  return res.json(projectProfile);
});

module.exports = router;
