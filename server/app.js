const express = require("express");
const projectProfile = require("./config/project-profile.json");
const cors = require("cors");
const messagesRoute = require("./routes/messagesRoute");
const contactRoute = require("./routes/contactRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const downloadRoutes = require("./routes/downloadRoutes");

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
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/download", downloadRoutes);

module.exports = app;
