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
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      // add production domains here later:
      // "https://devkofi.com",
      // "https://www.devkofi.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

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
