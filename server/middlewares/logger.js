const Mentorship = require("../Model/mentorshipModel");
const fs = require("fs/promises");
const path = require("path");
const geoip = require("geoip-lite");
const useragent = require("express-useragent");
const crypto = require("crypto");

const logger = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "development") {
      await Mentorship.deleteMany();
      console.log("logger: mentorship cleared");
    }

    const start = process.hrtime();

    // Extract IP
    const ip =
      req.headers["x-forwarded-for"]?.split(",").shift() ||
      req.socket?.remoteAddress ||
      req.ip;

    // GeoIP Lookup
    const geo = geoip.lookup(ip) || {};

    // Parse User-Agent
    useragent.express()(req, res, () => {});
    const device = req.useragent.isMobile
      ? "Mobile"
      : req.useragent.isTablet
      ? "Tablet"
      : req.useragent.isDesktop
      ? "Desktop"
      : "Unknown";
    const isBot = req.useragent.isBot || false;

    // Fingerprint (hash of IP + User-Agent)
    const fingerprint = crypto
      .createHash("sha256")
      .update(ip + req.headers["user-agent"])
      .digest("hex");

    // Raw cookies string from header
    const rawCookies = req.headers.cookie || "None";

    // Parse cookies into an object
    const parsedCookies = {};
    if (rawCookies !== "None") {
      rawCookies.split(";").forEach((cookie) => {
        const [name, ...rest] = cookie.trim().split("=");
        parsedCookies[name] = decodeURIComponent(rest.join("="));
      });
    }

    // Request headers of interest
    const reqHeaders = {
      "content-type": req.headers["content-type"] || "Unknown",
      "accept-language": req.headers["accept-language"] || "Unknown",
      origin: req.headers["origin"] || "Unknown",
      referer: req.headers["referer"] || "Direct",
      "user-agent": req.headers["user-agent"] || "Unknown",
      "x-requested-with": req.headers["x-requested-with"] || "Unknown",
    };

    res.on("finish", async () => {
      const diff = process.hrtime(start);
      const responseTimeMs = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2);

      const data = {
        fingerprint, // unique visitor ID
        ip,
        geo: {
          country: geo.country || "Unknown",
          region: geo.region || "Unknown",
          city: geo.city || "Unknown",
          timezone: geo.timezone || "Unknown",
          ll: geo.ll || "Unknown", // latitude, longitude
          org: geo.org || "Unknown", // ISP/org
        },
        device: {
          type: device,
          brand: req.useragent.platform, // e.g., "iPhone"
          browser: `${req.useragent.browser} ${req.useragent.version}`,
          os: req.useragent.os,
          cpuArch: req.useragent.platform, // approximation
        },
        isBot,
        engagement: {
          method: req.method,
          url: req.originalUrl,
          query: req.query,
          referer: reqHeaders.referer,
          statusCode: res.statusCode,
          responseTimeMs,
        },
        cookies: {
          raw: rawCookies,
          parsed: parsedCookies,
        },
        headers: reqHeaders,
        connection: {
          protocol: req.protocol,
          secure: req.secure,
          httpVersion: req.httpVersion,
          port: req.socket.localPort,
        },
        timestamp: new Date().toISOString(),
      };

      const filePath = path.join(__dirname, "..", "logs", "logs.txt");
      try {
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.appendFile(filePath, JSON.stringify(data) + "\n", "utf8");
        console.log("Logger: Full analytics + cookies entry added for", ip);
      } catch (writeErr) {
        console.error("Logger file write error:", writeErr);
      }
    });
  } catch (err) {
    console.error("Logger error:", err);
  }

  next();
};

module.exports = logger;
