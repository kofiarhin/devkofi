const express = require("express");
const projectProfile = require("./config/project-profile.json");

const app = express();

app.get("/api/templates", (req, res) => {
  return res.json(projectProfile);
});

module.exports = app;
