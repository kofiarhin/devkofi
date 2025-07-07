const { Router } = require("express");
const sendEmail = require("../utility/sendEmail");

const router = Router();

router.get("/", async (req, res) => {
  return res.json({ message: "get contact" });
});

router.post("/", async (req, res) => {
  const capitalizeFirstLetter = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const emailOptions = {
    to: req.body.email,
    subject: "Thank You for Reaching Out!",
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Hi ${capitalizeFirstLetter(req.body.name)},</p>
      <p>Thank you so much for reaching out—I truly appreciate you taking the time to contact me.</p>
      <p>I’ve received your message and will review it carefully. You can expect to hear back from me within the next 24–48 hours. If it’s something urgent or time-sensitive, feel free to reply directly to this email, and I’ll do my best to respond sooner.</p>
      <p>In the meantime, if there’s any additional information you’d like to share, or if you have specific questions, please don’t hesitate to let me know.</p>
      <p>Looking forward to connecting with you soon!</p>
      <p>Best regards,<br><strong>Kofi Arhin</strong><br>Full Stack Developer</p>
    </div>
  `,
  };

  const emailResponse = await sendEmail(emailOptions);
  return res.json({ message: "contact success" });
});
module.exports = router;
