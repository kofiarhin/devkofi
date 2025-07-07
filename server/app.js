const express = require("express");
const projectProfile = require("./config/project-profile.json");
const cors = require("cors");
const messagesRoute = require("./routes/messagesRoute");
const contactRoute = require("./routes/contactRoutes");

const app = express();

// setup middleware
app.use(cors());
app.use(express.json());

app.get("/", (Req, res) => {
  return res.json({ message: "hello world" });
});
app.get("/api/templates", (req, res) => {
  return res.json(projectProfile);
});

app.use("/api/messages", messagesRoute);
app.use("/api/contact", contactRoute);

module.exports = app;
