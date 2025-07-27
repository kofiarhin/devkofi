const NewsLetter = require("../Model/newsletterModel");
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
    return res.json(newUser);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  joinNewsLetter,
};
