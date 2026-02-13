const Enrollment = require("../models/Enrollment");
const TeamEnrollment = require("../models/TeamEnrollment");
const Team = require("../models/Team");
const TeamMember = require("../models/TeamMember");

const normalizeId = (v) => String(v || "").trim();

exports.getPendingTeamEnrollments = async (req, res) => {
  try {
    const pending = await TeamEnrollment.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .lean();

    // optional enrich: team name
    const teamIds = pending.map((p) => p.teamId);
    const teams = await Team.find({ _id: { $in: teamIds } }).lean();
    const teamMap = new Map();
    teams.forEach((t) => teamMap.set(String(t._id), t));

    const data = pending.map((p) => ({
      ...p,
      teamName: teamMap.get(String(p.teamId))?.name || null,
    }));

    return res.json({ success: true, enrollments: data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.approveTeamEnrollment = async (req, res) => {
  try {
    const teamId = normalizeId(req.body?.teamId);
    if (!teamId) {
      return res.status(400).json({ success: false, error: "Missing teamId." });
    }

    const updated = await TeamEnrollment.findOneAndUpdate(
      { teamId, status: "pending" },
      { $set: { status: "active" } },
      { new: true },
    ).lean();

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: "Pending team enrollment not found.",
      });
    }

    return res.json({ success: true, teamEnrollment: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ NEW: approve an individual enrollment (standard/pro)
exports.approveEnrollment = async (req, res) => {
  try {
    const userId = normalizeId(req.body?.userId);
    const enrollmentId = normalizeId(req.body?.enrollmentId);

    if (!userId && !enrollmentId) {
      return res.status(400).json({
        success: false,
        error: "Missing userId or enrollmentId.",
      });
    }

    const query = enrollmentId ? { _id: enrollmentId } : { userId };

    const existing = await Enrollment.findOne(query).lean();
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Enrollment not found.",
      });
    }

    if (existing.status === "active") {
      return res.json({ success: true, enrollment: existing });
    }

    const updated = await Enrollment.findOneAndUpdate(
      { ...query, status: "pending" },
      { $set: { status: "active" } },
      { new: true },
    ).lean();

    if (!updated) {
      // e.g. was cancelled or already active; return latest
      const latest = await Enrollment.findOne(query).lean();
      return res.json({ success: true, enrollment: latest });
    }

    return res.json({ success: true, enrollment: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
