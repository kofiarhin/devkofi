const Mentorship = require("../Model/mentorshipModel");
const fs = require("fs/promises");
const path = require("path");

const logger = async (req, res, next) => {
  if (process.env.NODE_ENV == "development") {
    await Mentorship.deleteMany();
    console.log("logger: mentorship cleared");
  }

  //  analytics handler
  const ip =
    req.ip ||
    req.headers["x-forwarded-for"]?.split(",").shift() ||
    req.socket.remoteAddress;
  const filePath = path.join(__dirname, "..", "logs", "logs.txt");
  const data = {
    ip,
    time: new Date().toISOString(), // e.g., "2025-07-17T10:23:54.123Z"
  };

  await fs.appendFile(filePath, JSON.stringify(data) + "\n", "utf8");

  next();
};

module.exports = logger;
