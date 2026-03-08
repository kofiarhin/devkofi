const Enrollment = require("../models/Enrollment");
const AccessRequest = require("../models/AccessRequest");
const User = require("../models/User");

const getStudentSummary = async (req, res) => {
  try {
    const userId = req.userId;

    const [enrollment, accessRequestsCount, user] = await Promise.all([
      Enrollment.findOne({ userId }).sort({ createdAt: -1 }).lean(),
      AccessRequest.countDocuments({ userId }).catch(() => 0),
      User.findById(userId).select("firstName profile").lean(),
    ]);

    const profile = user?.profile || {};
    const onboardingCompleted = Boolean(profile.onboardingCompleted);
    const selectedPlan = enrollment?.planSlug || profile.selectedPlan || "none";

    const nextAction = enrollment
      ? enrollment.status === "active"
        ? "Continue mentorship track and ship your next feature."
        : enrollment.applicationStatus === "pending_review" || enrollment.applicationStatus === "submitted"
          ? "Application submitted. Await admin review."
          : onboardingCompleted
            ? "Your application is in draft. Submit via join flow."
            : "Complete onboarding intake to continue your mentorship application."
      : onboardingCompleted
        ? "Select Standard or Pro to submit your application."
        : "Complete your intake profile to begin mentorship application.";

    return res.json({
      success: true,
      mentorship: {
        onboardingCompleted,
        selectedPlan,
        skillLevel: profile.skillLevel || "",
        supportLevel: selectedPlan === "pro" ? "high-touch" : selectedPlan === "standard" ? "structured" : "not-set",
        aiWorkflowReadiness: onboardingCompleted ? "ready" : "incomplete",
        nextAction,
      },
      enrollment: enrollment
        ? {
            planSlug: enrollment.planSlug,
            status: enrollment.status,
            applicationStatus: enrollment.applicationStatus,
            paymentStatus: enrollment.paymentStatus,
            createdAt: enrollment.createdAt,
          }
        : null,
      accessRequests: { count: accessRequestsCount || 0 },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to load student dashboard summary.",
    });
  }
};

module.exports = { getStudentSummary };
