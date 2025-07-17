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
  console.log("Client IP:", ip);
  const filePath = path.join(__dirname, "..", "logs", "logs.txt");
  await fs.appendFile(filePath, `${ip}\n`, "utf8");
  next();
};

module.exports = logger;
