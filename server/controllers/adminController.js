const Enrollment = require("../models/Enrollment");
const TeamEnrollment = require("../models/TeamEnrollment");
const Team = require("../models/Team");

const normalizeId = (v) => String(v || "").trim();

exports.getPendingTeamEnrollments = async (req, res) => {
  try {
    const pending = await TeamEnrollment.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .lean();

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
      { $set: { status: "active", approvedAt: new Date() } },
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

const resolveQuery = (body = {}) => {
  const userId = normalizeId(body?.userId);
  const enrollmentId = normalizeId(body?.enrollmentId);
  if (!userId && !enrollmentId) return null;
  return enrollmentId ? { _id: enrollmentId } : { userId };
};

exports.approveEnrollment = async (req, res) => {
  try {
    const query = resolveQuery(req.body);
    if (!query) {
      return res.status(400).json({ success: false, error: "Missing userId or enrollmentId." });
    }

    const updated = await Enrollment.findOneAndUpdate(
      query,
      {
        $set: {
          status: "pending",
          applicationStatus: "approved",
          approvedAt: new Date(),
          adminNotes: req.body?.adminNotes || "",
        },
      },
      { new: true },
    ).lean();

    if (!updated) {
      return res.status(404).json({ success: false, error: "Enrollment not found." });
    }

    return res.json({ success: true, enrollment: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.rejectEnrollment = async (req, res) => {
  try {
    const query = resolveQuery(req.body);
    if (!query) {
      return res.status(400).json({ success: false, error: "Missing userId or enrollmentId." });
    }

    const updated = await Enrollment.findOneAndUpdate(
      query,
      {
        $set: {
          status: "cancelled",
          applicationStatus: "rejected",
          adminNotes: req.body?.adminNotes || "",
        },
      },
      { new: true },
    ).lean();

    if (!updated) {
      return res.status(404).json({ success: false, error: "Enrollment not found." });
    }

    return res.json({ success: true, enrollment: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.activateEnrollment = async (req, res) => {
  try {
    const query = resolveQuery(req.body);
    if (!query) {
      return res.status(400).json({ success: false, error: "Missing userId or enrollmentId." });
    }

    const updated = await Enrollment.findOneAndUpdate(
      query,
      {
        $set: {
          status: "active",
          applicationStatus: "approved",
          activatedAt: new Date(),
        },
      },
      { new: true },
    ).lean();

    if (!updated) {
      return res.status(404).json({ success: false, error: "Enrollment not found." });
    }

    return res.json({ success: true, enrollment: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
