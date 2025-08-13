const {
  fetchDailyGitHubContributions,
  fetchGitHubContributions,
} = require("../utility/helper");

const getGitHubInfo = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      const data = await fetchGitHubContributions();
      return res.json(data);
    }

    if (query === "daily") {
      const { data } = await fetchDailyGitHubContributions();
      return res.json(data);
    }

    res.status(400);
    throw new Error("ïnvalid query");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGitHubInfo,
};
