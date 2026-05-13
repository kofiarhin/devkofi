const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: process.env.SMTP_ALLOW_SELF_SIGNED !== "true",
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

async function sendNewsletterVerificationEmail({ email, verifyUrl }) {
  const safeTo = sanitizeHeaderText(email);
  const safeUrl = escapeHtml(verifyUrl);

  await transporter.sendMail({
    from: `"DevKofi" <${process.env.EMAIL_USER}>`,
    to: safeTo,
    subject: "Confirm your DevKofi newsletter subscription",
    text:
      `Thanks for subscribing to the DevKofi newsletter.\n\n` +
      `Confirm your email to start receiving updates:\n${verifyUrl}\n\n` +
      `This link expires in 24 hours. If you did not request this, you can ignore the email.`,
    html:
      `<p>Thanks for subscribing to the DevKofi newsletter.</p>` +
      `<p>Confirm your email to start receiving updates:</p>` +
      `<p><a href="${safeUrl}">Confirm my subscription</a></p>` +
      `<p>This link expires in 24 hours. If you did not request this, you can ignore the email.</p>`,
  });
}

module.exports = { sendContactEmail, sendNewsletterVerificationEmail };
