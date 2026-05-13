const templatesData = require("../data/templates.json");

const getTemplates = (req, res) => {
  return res.json(templatesData);
};

module.exports = {
  getTemplates,
};
