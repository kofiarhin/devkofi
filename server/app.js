const express = require("express");
const projectProfile = require("./config/project-profile.json");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const messagesRoute = require("./routes/messagesRoute");
const contactRoute = require("./routes/contactRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const downloadRoutes = require("./routes/downloadRoutes");
const templateRoutes = require("./routes/templateRoutes");
const mentorshipRoutes = require("./routes/mentorshopRoutes");
const logger = require("./middlewares/logger");

const app = express();

// setup middleware
app.use(cors());
app.use(express.json());

app.use(logger);

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
app.use("/api/mentorship", mentorshipRoutes);
app.use("/api/logger", async (req, res) => {
  const filePath = path.join(__dirname, "..", "server", "logs", "logs.txt");
  if (fs.existsSync(filePath)) {
    const fileContent = await fs.readFileSync(filePath, "utf-8");
    const result = fileContent
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => JSON.parse(line));

    console.log(result);
    return res.json(result);
  }
  return res.json({ message: "logger" });
});

module.exports = app;
