const Newsletter = require("../Model/newsletterModel");
const Mentorship = require("../Model/mentorshipModel");

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

// upload image
const uploadImage = async (file, folder = "test") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "gzbuxpwt");
  formData.append("folder", folder);

  const url = "https://api.cloudinary.com/v1_1/dlsiabgiw/image/upload";

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("something went wrong");
  }

  const data = await response.json();
  return data.secure_url;
};

const joinMentorship = async (data) => {
  try {
    const user = await Mentorship.create(data);
    return user;
  } catch (error) {
    console.log(error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  createNewsletterUser,
  uploadImage,
  joinMentorship,
};
