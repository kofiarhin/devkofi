const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    timezone: { type: String, default: "" },
    country: { type: String, default: "" },
    currentRole: { type: String, default: "" },
    skillLevel: {
      type: String,
      enum: ["", "beginner", "intermediate", "advanced"],
      default: "",
    },
    mernExperience: { type: String, default: "" },
    aiExperience: { type: String, default: "" },
    primaryGoal: { type: String, default: "" },
    biggestBlocker: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    portfolioUrl: { type: String, default: "" },
    linkedinUrl: { type: String, default: "" },
    currentProjectSummary: { type: String, default: "" },
    preferredStartTimeline: { type: String, default: "" },
    onboardingCompleted: { type: Boolean, default: false },
    onboardingStep: { type: Number, default: 0 },
    selectedPlan: {
      type: String,
      enum: ["", "standard", "pro", "team"],
      default: "",
    },
    supportPreference: { type: String, default: "" },
  },
  { _id: false },
);

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },

    // legacy fields (keep for now so app doesn’t break)
    plan: {
      type: String,
      enum: ["none", "standard", "pro", "enterprise"],
      default: "none",
    },
    hasPaid: { type: Boolean, default: false },
    purchaseDate: { type: Date },

    discordUsername: { type: String },
    mentorshipCredits: { type: Number, default: 0 },
    teamName: { type: String },

    role: {
      type: String,
      enum: ["student", "admin", "mentor"],
      default: "student",
    },
    authProvider: { type: String, default: "local" },
    profile: { type: userProfileSchema, default: () => ({}) },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
