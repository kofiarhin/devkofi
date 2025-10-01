const express = require("express");
const createCors = require("./middleware/cors");

// Middlewares
const cleaner = require("./middlewares/cleaner");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

// Routes
const messagesRoute = require("./routes/messagesRoute");
const contactRoute = require("./routes/contactRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const downloadRoutes = require("./routes/downloadRoutes");
const templateRoutes = require("./routes/templateRoutes");
const mentorshipRoutes = require("./routes/mentorshipRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const infoRoutes = require("./routes/infoRoutes");
const pricingRoutes = require("./routes/pricingRoutes");
const healthRoute = require("./health.route");
const askMentorRoutes = require("./routes/askMentorRoutes");
const chatRoutes = require("./routes/chat.routes");

const app = express();

// Middleware setup
app.disable("x-powered-by");
app.use(createCors());
app.use(express.json());
app.use(cleaner); //remove this code later

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "welcome to king" });
});

// Templates endpoint
app.get("/api/templates", (req, res) => {
  res.json([]);
});

// API Routes
app.use("/api/messages", messagesRoute);
app.use("/api/contact", contactRoute);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/download", downloadRoutes);
app.use("/api/mentorship", mentorshipRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/info", infoRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/ask-mentor", askMentorRoutes);
app.use("/api/chat", chatRoutes);
app.use(["/health", "/api/health"], healthRoute);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
