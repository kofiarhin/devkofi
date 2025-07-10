const dotenv = require("dotenv").config();
const { connect } = require("mongoose");
const app = require("./app");
const connectDB = require("./config/db");

// connect to database
connectDB();
const port = process.env.PORT || 5000;

app.listen(port, () => console.log("server started on port:", port));
