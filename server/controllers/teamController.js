const crypto = require("crypto");
const Team = require("../models/Team");
const TeamEnrollment = require("../models/TeamEnrollment");
const TeamMember = require("../models/TeamMember");
const Invite = require("../models/Invite");

exports.requestTeamPlan = async (req, res) => {
  const userId = req.userId;
  const { teamName } = req.body;

  const team = await Team.create({ name: teamName, ownerId: userId });

  await TeamEnrollment.create({ teamId: team._id });

  await TeamMember.create({
    userId,
    teamId: team._id,
    role: "owner",
    status: "active",
  });

  res.json({ success: true });
};

exports.inviteMember = async (req, res) => {
  const { teamId, email } = req.body;

  const enrollment = await TeamEnrollment.findOne({ teamId });
  if (!enrollment || enrollment.status !== "active")
    return res.status(400).json({ success: false, error: "Team not active" });

  const seatCount = await TeamMember.countDocuments({
    teamId,
    status: { $in: ["active", "invited"] },
  });

  if (seatCount >= enrollment.seatLimit)
    return res
      .status(400)
      .json({ success: false, error: "No seats available" });

  const token = crypto.randomBytes(24).toString("hex");

  await Invite.create({
    teamId,
    email,
    token,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.json({ success: true });
};

exports.acceptInvite = async (req, res) => {
  const userId = req.userId;
  const { token } = req.body;

  const invite = await Invite.findOne({ token });
  if (!invite)
    return res.status(400).json({ success: false, error: "Invalid invite" });

  await TeamMember.findOneAndUpdate(
    { userId, teamId: invite.teamId },
    { status: "active" },
    { upsert: true },
  );

  invite.usedAt = new Date();
  await invite.save();

  res.json({ success: true });
};
