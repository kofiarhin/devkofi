const express = require("express");
const cors = require("cors");

const app = express();

// setup middleware
app.use(cors());

app.get("/", async (req, res, next) => {
  console.log("connected to client");
  return res.json({
    status: "ok",
    timeStamp: new Date(),
    message: "welcome to dev kofi",
  });
});

module.exports = app;
