const projectsData = require("../data/projectsData.json");

const getProjects = async (req, res, next) => {
  try {
    return res.json(projectsData);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

module.exports = { getProjects };
