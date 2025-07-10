const Newsletter = require("../Model/newsletterModel");

const createNewsletterUser = async (data) => {
  try {
    const { email } = data;
    const check = await Newsletter.findOne({ email });
    if (check) {
      throw new Error("user already exist");
    }

    const user = await Newsletter.create({ email });

    if (!user) {
      throw new Error("there was a problem createing user please try again");
    }
    return user;
  } catch (error) {
    console.log(error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  createNewsletterUser,
};
