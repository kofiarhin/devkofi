const Enrollment = require("../models/Enrollment");

const allowedPlanSlugs = ["standard", "pro"];

const getMyEnrollments = async (req, res) => {
  try {
    const userId = req.userId;

    const enrollments = await Enrollment.find({ userId }).sort({
      createdAt: -1,
    });

    return res.json({ enrollments });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

const createEnrollment = async (req, res) => {
  const userId = req.userId; // ✅ define OUTSIDE try so catch can use it

  try {
    const planSlugFromParams = req.params?.planSlug;
    const planSlugFromBody = req.body?.planSlug;

    const normalized = String(planSlugFromParams || planSlugFromBody || "")
      .trim()
      .toLowerCase();

    if (!allowedPlanSlugs.includes(normalized)) {
      return res.status(400).json({
        success: false,
        error: "Invalid plan. Only standard and pro can enroll.",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Not authorized. Missing userId.",
      });
    }

    // one enrollment per user (for now)
    const existing = await Enrollment.findOne({ userId });
    if (existing) {
      return res.json({ success: true, enrollment: existing });
    }

    const enrollment = await Enrollment.create({
      userId,
      planSlug: normalized,
      status: "pending",
    });

    return res.status(201).json({ success: true, enrollment });
  } catch (error) {
    // duplicate key => enrollment already exists
    if (error?.code === 11000) {
      const found = await Enrollment.findOne({ userId });
      return res.json({ success: true, enrollment: found });
    }

    return res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  getMyEnrollments,
  createEnrollment,
};
