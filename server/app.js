const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const cleaner = require("./middleware/cleaner");
const connectDB = require("./config/db");
const projectRoutes = require("./routes/projectRoutes");

const app = express();

// connect database
connectDB();

// setup middleware
app.use(cors());
app.use(express.json());
app.use(cleaner);

app.get("/", async (req, res, next) => {
  return res.json({
    status: "ok",
    timeStamp: new Date(),
    message: "welcome to dev kofi",
  });
});

app.get("/api/health", async (req, res, next) => {
  return res.json({ message: "get health" });
});

app.get("/health", async (req, res, next) => {
  return res.json({ message: "get health" });
});

app.use("/api/projects", projectRoutes);

app.use("/api/auth", authRoutes);

module.exports = app;
