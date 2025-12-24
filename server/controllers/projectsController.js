const projectsData = require("../data/projects.data.json");

const getProjects = async (req, res, next) => {
  console.log(projectsData);
  return res.json(projectsData);
};

module.exports = {
  getProjects,
};
