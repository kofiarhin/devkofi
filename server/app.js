const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();

// setup middleware
app.use(cors());
app.use(express.json());

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

app.use("/api/auth", authRoutes);

module.exports = app;
