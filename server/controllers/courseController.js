const coursesData = require("../data/courses.json");

const getCourses = async (req, res, next) => {
  try {
    return res.json(coursesData);
  } catch (error) {
    next(error);
  }
};

module.exports = { getCourses };
