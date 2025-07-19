const express = require("express");
const cors = require("cors");

const app = express();
// setup middlewaers
app.use(cors());
app.use(express.json());

app.get("/api/users", (req, res) => {
  return res.json({ message: "hello world" });
});

module.exports = app;
