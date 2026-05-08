const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const sanitizeHeaderText = (value) =>
  String(value ?? "").replace(/[\r\n"]/g, " ").trim();

async function sendContactEmail({ name, email, subject, message }) {
  const safeFromName = sanitizeHeaderText(name) || "Contact form";
  const safeSubject = sanitizeHeaderText(subject);
  const safeReplyTo = sanitizeHeaderText(email);

  await transporter.sendMail({
    from: `"${safeFromName}" <${process.env.EMAIL_USER}>`,
    to: process.env.CONTACT_TO_EMAIL,
    replyTo: safeReplyTo,
    subject: `[Contact] ${safeSubject}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
  });
}

module.exports = { sendContactEmail };
