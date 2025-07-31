const Contact = require("../Model/contactModel");
const sendEmail = require("../utility/sendEmail");
const {
  generateContactThankYouEmail,
  generateAdminContactNotificationEmail,
} = require("../utility/templates");

const createContactMessage = async (req, res, next) => {
  try {
    const { email, message, fullName } = req.body;
    if (!email || !message || !fullName) {
      throw new Error("please fill out all fields");
    }
    const contact = await Contact.create({ fullName, email, message });
    // notify user
    const { subject, html } = generateContactThankYouEmail({ fullName, email });
    // send email to user
    await sendEmail({ to: email, subject, html });

    // notify admin
    const { subject: adminSubject, html: adminHtml } =
      generateAdminContactNotificationEmail({ fullName, email, message });
    //   send email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: adminSubject,
      html: adminHtml,
    });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createContactMessage,
};
