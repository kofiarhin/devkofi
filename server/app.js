const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const projectProfile = require("./config/project-profile.json");

// Middlewares
const logger = require("./middlewares/logger");
const cleaner = require("./middlewares/cleaner");

// Routes
const messagesRoute = require("./routes/messagesRoute");
const contactRoute = require("./routes/contactRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const downloadRoutes = require("./routes/downloadRoutes");
const templateRoutes = require("./routes/templateRoutes");
const mentorshipRoutes = require("./routes/mentorshopRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(cleaner); //remove this code later

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

// Templates endpoint
app.get("/api/templates", (req, res) => {
  res.json(projectProfile);
});

// API Routes
app.use("/api/messages", messagesRoute);
app.use("/api/contact", contactRoute);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/download", downloadRoutes);
app.use("/api/mentorship", mentorshipRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
