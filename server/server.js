const express = require("express");
const app = require("./app");
const connectDB = require("./config/db");
const { loadEnv } = require("./config/env");
console.log("server started");

const config = loadEnv();
const { mongoUri } = config;
const PORT = process.env.PORT || 5000;

connectDB(mongoUri);
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
