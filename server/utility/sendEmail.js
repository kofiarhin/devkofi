const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (options) => {
  const username = process.env.EMAIL_USERNAME;
  const password = process.env.EMAIL_APP_PASSWORD;
  const skipSmtp =
    process.env.NODE_ENV !== "production" &&
    process.env.ENABLE_SMTP !== "true";

  if (skipSmtp) {
    console.warn(
      `[email] Skipping SMTP send in ${process.env.NODE_ENV} mode`,
      { to: options.to, subject: options.subject }
    ); // CODex: allow local flows to succeed without real email credentials

    return {
      accepted: [options.to],
      rejected: [],
      messageId: `dev-${Date.now()}`,
      envelope: { from: username || "dev@localhost", to: [options.to] },
    };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: username,
      pass: password,
    },
    tls: {
      rejectUnauthorized: false, // ✅ allow self-signed certs
    },
  });

  const mailOptions = {
    from: username,
    to: options.to,
    subject: options.subject,
    text: options.text || "",
    html: options.html || "",
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // console.log("Email sent:", info.response);
    return info;
  } catch (err) {
    console.error("Error sending email:", err);
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;
