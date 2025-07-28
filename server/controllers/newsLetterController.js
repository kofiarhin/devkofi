const NewsLetter = require("../Model/newsletterModel");
const sendEmail = require("../utility/sendEmail");
const { generateNewsLetterSubscriptionEmail } = require("../utility/templates");
const joinNewsLetter = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new Error("please fill out all fields");
    }
    // check if user already exist
    const check = await NewsLetter.findOne({ email });
    if (check) {
      throw new Error("user already exist");
    }
    const newUser = await NewsLetter.create({ email });
    const { subject, html } = generateNewsLetterSubscriptionEmail(email);
    await sendEmail({ to: email, subject, html });
    return res.json(newUser);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  joinNewsLetter,
};
