const Enrollment = require("../models/Enrollment");
const AccessRequest = require("../models/AccessRequest");

const getStudentSummary = async (req, res) => {
  try {
    const userId = req.userId;

    const [enrollment, accessRequestsCount] = await Promise.all([
      Enrollment.findOne({ userId }).sort({ createdAt: -1 }).lean(),
      AccessRequest.countDocuments({ userId }).catch(() => 0),
    ]);

    return res.json({
      success: true,

      messages: { unreadCount: null, isPlaceholder: true },
      assignments: { dueThisWeek: null, isPlaceholder: true },
      progress: { percent: null, isPlaceholder: true },
      support: { online: null, isPlaceholder: true },

      enrollment: enrollment
        ? {
            planSlug: enrollment.planSlug,
            status: enrollment.status,
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
