const coursesData = require("../data/courses.json");

const getCourses = async (req, res, next) => {
  try {
    return res.json(coursesData);
  } catch (error) {
    next(error);
  }
};

// get course
const getCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("please provide a course id ");
    }

    const foundCourse = coursesData.courses.find((c) => c.id == id);

    if (!foundCourse) {
      return res.json([]);
    }
    return res.json(foundCourse);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

module.exports = { getCourses, getCourse };
