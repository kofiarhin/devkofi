const User = require("../models/User");

const editableFields = [
  "timezone",
  "country",
  "currentRole",
  "skillLevel",
  "mernExperience",
  "aiExperience",
  "primaryGoal",
  "biggestBlocker",
  "githubUrl",
  "portfolioUrl",
  "linkedinUrl",
  "currentProjectSummary",
  "preferredStartTimeline",
<<<<<<< HEAD
];

const urlFields = ["githubUrl", "portfolioUrl", "linkedinUrl"];
const allowedSkillLevels = ["beginner", "intermediate", "advanced"];
const allowedPreferredStartTimelines = [
  "immediately",
  "within_30_days",
  "within_90_days",
  "just_exploring",
=======
>>>>>>> agent-zero/implement-account-settings-page
];

const skillLevelValues = ["beginner", "intermediate", "advanced"];
const startTimelineValues = ["immediately", "within_30_days", "within_90_days", "just_exploring"];
const optionalUrlFields = ["githubUrl", "portfolioUrl", "linkedinUrl"];

const hasValue = (v) => typeof v === "string" ? v.trim().length > 0 : Boolean(v);
const isPlainObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

const isValidUrl = (value) => {
  try {
    const parsed = new URL(value);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
};

const normalizeProfileField = (field, value) => {
  if (typeof value !== "string") {
    throw new Error(`${field} must be a string`);
  }

  const trimmed = value.trim();

  if (field === "skillLevel") {
    if (trimmed && !allowedSkillLevels.includes(trimmed)) {
      throw new Error("skillLevel must be one of: beginner, intermediate, advanced");
    }

    return trimmed;
  }

  if (field === "preferredStartTimeline") {
    if (trimmed && !allowedPreferredStartTimelines.includes(trimmed)) {
      throw new Error(
        "preferredStartTimeline must be one of: immediately, within_30_days, within_90_days, just_exploring",
      );
    }

    return trimmed;
  }

  if (urlFields.includes(field)) {
    if (!trimmed) {
      return "";
    }

    if (!isValidUrl(trimmed)) {
      throw new Error(`${field} must be a valid URL`);
    }
  }

  return trimmed;
};

const sanitizeString = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return value.trim();
};

const isValidUrl = (urlValue) => {
  try {
    const parsed = new URL(urlValue);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const getProfileMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("firstName lastName email role profile").lean();
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.json({ success: true, profile: user.profile || {}, user });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const patchProfileMe = async (req, res) => {
  try {
    const body = req.body;

    if (!isPlainObject(body)) {
      return res.status(400).json({ success: false, error: "Invalid request body" });
    }

    const updates = {};

    for (const field of editableFields) {
<<<<<<< HEAD
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        updates[`profile.${field}`] = normalizeProfileField(field, body[field]);
=======
      if (!Object.prototype.hasOwnProperty.call(body, field)) {
        continue;
>>>>>>> agent-zero/implement-account-settings-page
      }

      const rawValue = body[field];
      if (typeof rawValue !== "string") {
        return res.status(400).json({ success: false, error: `${field} must be a string` });
      }
      const value = sanitizeString(rawValue);

      if (optionalUrlFields.includes(field)) {
        if (value !== "" && !isValidUrl(value)) {
          return res.status(400).json({ success: false, error: `${field} must be a valid URL` });
        }
      }

      if (field === "skillLevel" && value && !skillLevelValues.includes(value)) {
        return res.status(400).json({ success: false, error: "skillLevel is invalid" });
      }

      if (field === "preferredStartTimeline" && value && !startTimelineValues.includes(value)) {
        return res.status(400).json({ success: false, error: "preferredStartTimeline is invalid" });
      }

      updates[`profile.${field}`] = value;
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({ success: false, error: "No valid profile fields provided" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
<<<<<<< HEAD
      { new: true, runValidators: true },
    ).select("firstName lastName email profile").lean();

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.json({ success: true, profile: user?.profile || {} });
=======
      { new: true },
    ).select("firstName lastName email role profile").lean();

    return res.json({ success: true, message: "Profile updated successfully", profile: user?.profile || {} });
>>>>>>> agent-zero/implement-account-settings-page
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

const postOnboardingIntake = async (req, res) => {
  try {
    const {
      currentRole,
      skillLevel,
      mernExperience,
      aiExperience,
      primaryGoal,
      biggestBlocker,
      githubUrl = "",
      portfolioUrl = "",
      currentProjectSummary,
      timezone,
      country,
      preferredStartTimeline,
      selectedPlan,
      supportPreference = "",
    } = req.body || {};

    if (!currentRole) return res.status(400).json({ success: false, error: "currentRole is required" });
    if (!skillLevel) return res.status(400).json({ success: false, error: "skillLevel is required" });
    if (!mernExperience) return res.status(400).json({ success: false, error: "mernExperience is required" });
    if (!aiExperience) return res.status(400).json({ success: false, error: "aiExperience is required" });
    if (!primaryGoal) return res.status(400).json({ success: false, error: "primaryGoal is required" });
    if (!biggestBlocker) return res.status(400).json({ success: false, error: "biggestBlocker is required" });
    if (!currentProjectSummary) return res.status(400).json({ success: false, error: "currentProjectSummary is required" });
    if (!timezone) return res.status(400).json({ success: false, error: "timezone is required" });
    if (!country) return res.status(400).json({ success: false, error: "country is required" });
    if (!preferredStartTimeline) return res.status(400).json({ success: false, error: "preferredStartTimeline is required" });

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          "profile.currentRole": currentRole,
          "profile.skillLevel": skillLevel,
          "profile.mernExperience": mernExperience,
          "profile.aiExperience": aiExperience,
          "profile.primaryGoal": primaryGoal,
          "profile.biggestBlocker": biggestBlocker,
          "profile.githubUrl": githubUrl,
          "profile.portfolioUrl": portfolioUrl,
          "profile.currentProjectSummary": currentProjectSummary,
          "profile.timezone": timezone,
          "profile.country": country,
          "profile.preferredStartTimeline": preferredStartTimeline,
          "profile.selectedPlan": selectedPlan || "",
          "profile.supportPreference": supportPreference,
          "profile.onboardingStep": 2,
          "profile.onboardingCompleted": true,
        },
      },
      { new: true },
    ).select("firstName lastName email profile").lean();

    return res.json({ success: true, profile: user?.profile || {} });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

const getOnboardingStatus = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("profile").lean();
    const profile = user?.profile || {};

    const completed = Boolean(profile.onboardingCompleted);
    const readinessScore = [
      hasValue(profile.currentRole),
      hasValue(profile.skillLevel),
      hasValue(profile.mernExperience),
      hasValue(profile.aiExperience),
      hasValue(profile.primaryGoal),
      hasValue(profile.biggestBlocker),
      hasValue(profile.currentProjectSummary),
      hasValue(profile.timezone),
      hasValue(profile.country),
      hasValue(profile.preferredStartTimeline),
    ].filter(Boolean).length;

    return res.json({
      success: true,
      onboardingCompleted: completed,
      onboardingStep: profile.onboardingStep || 0,
      selectedPlan: profile.selectedPlan || "",
      readinessScore,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getProfileMe,
  patchProfileMe,
  postOnboardingIntake,
  getOnboardingStatus,
};
