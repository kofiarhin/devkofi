const express = require("express");
const projectProfile = require("./config/project-profile.json");

const app = express();

app.get("/", (Req, res) => {
  return res.json({ message: "hello world" });
});
app.get("/api/templates", (req, res) => {
  return res.json(projectProfile);
});

module.exports = app;
