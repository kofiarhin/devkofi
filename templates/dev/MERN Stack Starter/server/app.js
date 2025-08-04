const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");
const auth = require("./middleware/auth");
const usersRoute = require("./routes/usersRoute");

const app = express();
// setup middlewaers
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoute);
app.get("/api/error", (req, res, next) => {
  res.status(400);
  throw new Error("testing mic");
  next();
});

app.use((req, res, next) => {
  const error = new Error("Page not found");
  res.status(404);
  next(error);
});

app.use(errorHandler);

module.exports = app;
