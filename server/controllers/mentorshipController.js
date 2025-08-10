const {
  generateJoinEmail,
  generateAdminNotificationEmail,
  generateVerifyUserEmail,
} = require("../utility/templates");
const sendEmail = require("../utility/sendEmail");

const Mentorship = require("../Model/mentorshipModel");
const { generateToken } = require("../utility/helper");
const createMentorship = async (req, res, next) => {
  try {
    const { fullName, email, phone, packageName } = req.body;
    if (!fullName || !email || !phone) {
      throw new Error("please fill out all fields");
    }
    // check if useralready exist
    const check = await Mentorship.findOne({ email });
    if (check) {
      throw new Error("user already exist");
    }
    const newUser = await Mentorship.create({
      fullName,
      email,
      phone,
      packageName,
    });
    // notify user
    const { subject, html } = generateJoinEmail({
      fullName,
      email,
      packageName,
    });
    await sendEmail({ to: email, subject, html });

    // send verification code
    const token = generateToken({ email });
    const { subject: verificationSubject, html: verificationHtml } =
      generateVerifyUserEmail({ fullName, token });
    await sendEmail({
      to: email,
      subject: verificationSubject,
      html: verificationHtml,
    });

    // notify admin
    const { subject: adminSubject, html: adminHtml } =
      generateAdminNotificationEmail({ fullName, email, phone, packageName });
    await sendEmail({
      to: "devkofiteam@gmail.com",
      subject: adminSubject,
      html: adminHtml,
    });

    // return data
    return res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createMentorship,
};
