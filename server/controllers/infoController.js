const {
  fetchDailyGitHubContributions,
  fetchGitHubContributions,
} = require("../utility/helper");

const getGitHubInfo = async (req, res, next) => {
  const { query } = req.query;

  try {
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
    const status = res.statusCode || 500;

    if (status === 400) {
      return next(error); // CODex: preserve validation errors for invalid query params
    }

    if (process.env.NODE_ENV !== "production") {
      if (query === "daily") {
        return res.json({
          success: true,
          fallback: true,
          data: [],
          message: "GitHub API unavailable; returning empty heatmap",
        }); // CODex: keep client stable when GitHub fetch fails locally
      }

      return res.json({
        success: true,
        fallback: true,
        totalContributions: 0,
        message: "GitHub API unavailable; returning zero contributions",
      }); // CODex: provide deterministic fallback for totals endpoint
    }

    next(error);
  }
};

module.exports = {
  getGitHubInfo,
};
