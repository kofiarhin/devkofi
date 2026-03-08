const Enrollment = require("../models/Enrollment");
const User = require("../models/User");

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
  const userId = req.userId;

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

    const user = await User.findById(userId).lean();
    const profile = user?.profile || {};
    const onboardingCompleted = Boolean(profile.onboardingCompleted);

    const existing = await Enrollment.findOne({ userId });
    if (existing) {
      const patch = {
        planSlug: normalized,
        intakeSnapshot: existing.intakeSnapshot || profile,
      };

      if (existing.applicationStatus === "rejected") {
        patch.applicationStatus = "submitted";
        patch.status = "pending";
      }

      const updated = await Enrollment.findByIdAndUpdate(
        existing._id,
        { $set: patch },
        { new: true },
      );

      return res.json({ success: true, enrollment: updated, onboardingCompleted });
    }

    const enrollment = await Enrollment.create({
      userId,
      planSlug: normalized,
      status: "pending",
      applicationStatus: onboardingCompleted ? "submitted" : "draft",
      paymentStatus: "not_required",
      selectedTrack: "ai-powered-mern",
      intakeSnapshot: profile,
      source: "join-flow",
    });

    return res.status(201).json({ success: true, enrollment, onboardingCompleted });
  } catch (error) {
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
