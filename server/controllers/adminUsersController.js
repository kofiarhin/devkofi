const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const TeamMember = require("../models/TeamMember");
const Team = require("../models/Team");
const TeamEnrollment = require("../models/TeamEnrollment");

exports.getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password").lean();
    const userIds = users.map((u) => u._id);

    const [enrollments, teamMembers] = await Promise.all([
      Enrollment.find({ userId: { $in: userIds } }).lean(),
      TeamMember.find({ userId: { $in: userIds } }).lean(),
    ]);

    const teamIds = teamMembers.map((tm) => tm.teamId);

    const [teams, teamEnrollments] = await Promise.all([
      Team.find({ _id: { $in: teamIds } }).lean(),
      TeamEnrollment.find({ teamId: { $in: teamIds } }).lean(),
    ]);

    const enrollmentMap = new Map();
    enrollments.forEach((e) => enrollmentMap.set(String(e.userId), e));

    const teamMemberMap = new Map();
    teamMembers.forEach((tm) => teamMemberMap.set(String(tm.userId), tm));

    const teamMap = new Map();
    teams.forEach((t) => teamMap.set(String(t._id), t));

    const teamEnrollmentMap = new Map();
    teamEnrollments.forEach((te) =>
      teamEnrollmentMap.set(String(te.teamId), te),
    );

    const enrichedUsers = users.map((user) => {
      const enrollment = enrollmentMap.get(String(user._id)) || null;
      const teamMember = teamMemberMap.get(String(user._id)) || null;

      let derivedPlan = "free";
      let derivedStatus = "none";

      if (enrollment) {
        derivedPlan = enrollment.planSlug || "standard";
        derivedStatus = enrollment.status || "pending";
      }

      let team = null;

      if (teamMember) {
        const teamData = teamMap.get(String(teamMember.teamId));
        const teamEnrollment = teamEnrollmentMap.get(String(teamMember.teamId));

        team = {
          teamId: teamMember.teamId,
          teamName: teamData?.name || null,
          role: teamMember.role,
          status: teamMember.status,
          teamPlanStatus: teamEnrollment?.status || "pending",
          seatLimit: teamEnrollment?.seatLimit || null,
        };

        if (teamEnrollment?.status === "active") {
          derivedPlan = "team";
          derivedStatus = "active";
        }
      }

      return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        plan: derivedPlan,
        status: derivedStatus,
        profile: user.profile || {},
        enrollment: enrollment
          ? {
              _id: enrollment._id,
              planSlug: enrollment.planSlug,
              status: enrollment.status,
              applicationStatus: enrollment.applicationStatus || "submitted",
              paymentStatus: enrollment.paymentStatus || "not_required",
              approvedAt: enrollment.approvedAt || null,
              activatedAt: enrollment.activatedAt || null,
            }
          : null,
        team,
      };
    });

    return res.json({
      success: true,
      users: enrichedUsers,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
