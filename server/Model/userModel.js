const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // --- Personal Info (From Registration Form) ---
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // Do not return password by default in queries
    },
    avatar: {
      type: String,
      default: "", // URL to profile image
    },

    // --- Access & Pricing Strategy ---
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    plan: {
      type: String,
      enum: ["free", "standard", "pro", "enterprise"],
      default: "free",
    },

    // 1. Pro Tier: Mentorship Tracking
    mentorshipCredits: {
      type: Number,
      default: 0,
    },

    // 2. Enterprise Tier: Team Management
    team: {
      // If user is Owner: IDs of their employees (Max 5)
      members: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      // If user is Employee: ID of their Boss
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    },

    // 3. Billing & Refund Logic (14-day window)
    billing: {
      purchasedAt: { type: Date },
      transactionId: { type: String },
    },

    // --- System ---
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// --- Middleware: Enforce Enterprise Limit ---
userSchema.pre("save", function (next) {
  if (this.team.members.length > 5) {
    const err = new Error("Enterprise plan is limited to 5 team members.");
    return next(err);
  }
  next();
});

// --- Method: Match Password ---
// usage: const isMatch = await user.matchPassword(enteredPassword);
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
