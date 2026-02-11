const AccessRequest = require("../models/AccessRequest");
const pricingData = require("../data/pricingData.json");

const teamPlan = pricingData?.plans?.find((p) => p.slug === "team");

const createTeamRequest = async (req, res) => {
  try {
    if (!teamPlan) {
      return res
        .status(500)
        .json({ success: false, error: "Team plan not configured." });
    }

    if (teamPlan?.availability?.isActive === false) {
      return res.status(400).json({
        success: false,
        error: teamPlan?.availability?.note || "Team access is not available.",
      });
    }

    if (teamPlan?.cta?.type !== "request") {
      return res.status(400).json({
        success: false,
        error: "Team plan is not set to request mode.",
      });
    }

    const userId = req.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: "Not authorized. Missing userId." });
    }
    const { message = "", companyName = "", companySize = "" } = req.body || {};

    const existing = await AccessRequest.findOne({ userId, planSlug: "team" });
    if (existing) {
      return res.json({ success: true, request: existing });
    }

    const request = await AccessRequest.create({
      userId,
      planSlug: "team",
      status: "request",
      message,
      companyName,
      companySize,
    });

    return res.status(201).json({ success: true, request });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: "Not authorized. Missing userId." });
    }

    const requests = await AccessRequest.find({ userId }).sort({
      createdAt: -1,
    });
    return res.json({ success: true, requests });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = { createTeamRequest, getMyRequests };
