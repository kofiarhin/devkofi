const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();
// setup middlewaers
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

module.exports = app;
