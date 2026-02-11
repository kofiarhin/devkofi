const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const cleaner = require("./middleware/cleaner");
const connectDB = require("./config/db");
const projectRoutes = require("./routes/projectRoutes");
const pricingRoute = require("./routes/pricingRoutes");

// ✅ add these
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const accessRequestRoutes = require("./routes/accessRequestRoutes");

// ✅ add this
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// connect database
connectDB();

// setup middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://devkofi.com",
      "https://www.devkofi.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(cleaner);

app.get("/", async (req, res) => {
  return res.json({
    status: "ok",
    timeStamp: new Date(),
    message: "welcome to dev kofi",
  });
});

app.use("/api/pricing", pricingRoute);
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);

// ✅ mount these so your client stops getting 404
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/access-requests", accessRequestRoutes);

// ✅ mount dashboard summary endpoint
app.use("/api/dashboard", dashboardRoutes);

app.get("/api/health", async (req, res) => {
  return res.json({ message: "get health" });
});

app.get("/health", async (req, res) => {
  return res.json({ message: "get health" });
});

module.exports = app;
