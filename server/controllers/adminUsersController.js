const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const TeamMember = require("../models/TeamMember");
const Team = require("../models/Team");
const TeamEnrollment = require("../models/TeamEnrollment");

exports.getAdminUsers = async (req, res) => {
  try {
    // 1️⃣ Load users (never return passwords)
    const users = await User.find({}, "-password").lean();
    const userIds = users.map((u) => u._id);

    // 2️⃣ Load related collections in parallel (safe + fast)
    const [enrollments, teamMembers] = await Promise.all([
      Enrollment.find({ userId: { $in: userIds } }).lean(),
      TeamMember.find({ userId: { $in: userIds } }).lean(),
    ]);

    const teamIds = teamMembers.map((tm) => tm.teamId);

    const [teams, teamEnrollments] = await Promise.all([
      Team.find({ _id: { $in: teamIds } }).lean(),
      TeamEnrollment.find({ teamId: { $in: teamIds } }).lean(),
    ]);

    // 3️⃣ Build lookup maps (prevents O(n²) performance traps)
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

    // 4️⃣ Compose final response safely
    const enrichedUsers = users.map((user) => {
      const enrollment = enrollmentMap.get(String(user._id)) || null;
      const teamMember = teamMemberMap.get(String(user._id)) || null;

      let derivedPlan = "free";
      let derivedStatus = "none";

      // Individual enrollment logic
      if (enrollment) {
        derivedPlan = enrollment.planSlug || "standard";
        derivedStatus = enrollment.status || "pending";
      }

      // Team membership logic overrides individual free state
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

        // If team is active → user is effectively paid
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

        enrollment: enrollment
          ? {
              planSlug: enrollment.planSlug,
              status: enrollment.status,
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
