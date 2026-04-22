const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const TeamMember = require("../models/TeamMember");
const Team = require("../models/Team");
const TeamEnrollment = require("../models/TeamEnrollment");

const pickBestEnrollment = (enrollmentsForUser) => {
  if (!Array.isArray(enrollmentsForUser) || enrollmentsForUser.length === 0)
    return null;

  // Prefer ACTIVE > PENDING > anything else
  const active = enrollmentsForUser.find((e) => e?.status === "active");
  if (active) return active;

  const pending = enrollmentsForUser.find((e) => e?.status === "pending");
  if (pending) return pending;

  // fallback to newest by updatedAt/createdAt if present, else last
  const sorted = [...enrollmentsForUser].sort((a, b) => {
    const at = new Date(a?.updatedAt || a?.createdAt || 0).getTime();
    const bt = new Date(b?.updatedAt || b?.createdAt || 0).getTime();
    return bt - at;
  });

  return sorted[0] || enrollmentsForUser[enrollmentsForUser.length - 1];
};

exports.getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password").lean();
    const userIds = users.map((u) => u._id);

    const [enrollments, teamMembers] = await Promise.all([
      Enrollment.find({ userId: { $in: userIds } }).lean(),
      TeamMember.find({ userId: { $in: userIds } }).lean(),
    ]);

    const teamIds = teamMembers.map((t) => t.teamId);

    const [teams, teamEnrollments] = await Promise.all([
      Team.find({ _id: { $in: teamIds } }).lean(),
      TeamEnrollment.find({ teamId: { $in: teamIds } }).lean(),
    ]);

    // group enrollments by userId (because a user may have >1 over time)
    const enrollmentGroup = new Map();
    for (const e of enrollments) {
      const key = String(e.userId);
      const arr = enrollmentGroup.get(key) || [];
      arr.push(e);
      enrollmentGroup.set(key, arr);
    }

    // team lookup maps
    const teamMap = new Map();
    teams.forEach((t) => teamMap.set(String(t._id), t));

    const teamEnrollmentMap = new Map();
    teamEnrollments.forEach((te) =>
      teamEnrollmentMap.set(String(te.teamId), te),
    );

    // if multiple team memberships exist, prefer active over invited
    const teamMemberMap = new Map();
    for (const tm of teamMembers) {
      const key = String(tm.userId);
      const existing = teamMemberMap.get(key);

      if (!existing) {
        teamMemberMap.set(key, tm);
        continue;
      }

      const rank = (x) => (x?.status === "active" ? 2 : x?.status === "invited" ? 1 : 0);
      if (rank(tm) > rank(existing)) teamMemberMap.set(key, tm);
    }

    const enrichedUsers = users.map((user) => {
      const bestEnrollment = pickBestEnrollment(enrollmentGroup.get(String(user._id)) || []);
      const teamMember = teamMemberMap.get(String(user._id)) || null;

      // defaults
      let plan = "free";
      let status = "none";

      // individual enrollment drives plan/status
      if (bestEnrollment) {
        plan = bestEnrollment.planSlug || "standard";
        status = bestEnrollment.status || "pending";
      }

      let team = null;

      if (teamMember) {
        const teamData = teamMap.get(String(teamMember.teamId)) || null;
        const teamEnrollment = teamEnrollmentMap.get(String(teamMember.teamId)) || null;

        team = {
          teamId: teamMember.teamId,
          teamName: teamData?.name || null,
          role: teamMember.role,
          status: teamMember.status,
          teamPlanStatus: teamEnrollment?.status || "pending",
          seatLimit: teamEnrollment?.seatLimit ?? null,
        };

        // If user doesn't have an ACTIVE individual enrollment,
        // but team enrollment is ACTIVE and member is ACTIVE => treat as paid via team
        const hasActiveIndividual = bestEnrollment?.status === "active";
        const hasActiveTeam = teamEnrollment?.status === "active" && teamMember?.status === "active";

        if (!hasActiveIndividual && hasActiveTeam) {
          plan = "team";
          status = "active";
        }
      }

      return {
        _id: user._id,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        role: user.role || "student",

        // frontend expects these
        plan,
        status,

        enrollment: bestEnrollment
          ? {
              planSlug: bestEnrollment.planSlug || null,
              status: bestEnrollment.status || null,
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
