const Enrollment = require("../models/Enrollment");
const TeamMember = require("../models/TeamMember");
const TeamEnrollment = require("../models/TeamEnrollment");

async function hasPaidAccess(userId) {
  const individual = await Enrollment.findOne({
    userId,
    status: "active",
  }).lean();
  if (individual) return true;

  const membership = await TeamMember.findOne({
    userId,
    status: "active",
  }).lean();
  if (!membership) return false;

  const teamEnrollment = await TeamEnrollment.findOne({
    teamId: membership.teamId,
    status: "active",
  }).lean();

  return !!teamEnrollment;
}

module.exports = { hasPaidAccess };
