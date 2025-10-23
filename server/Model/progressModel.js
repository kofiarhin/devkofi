const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
    },
  },
  { _id: false }
);

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
      unique: true,
    },
    activeCourseId: {
      type: String,
    },
    activeCourseTitle: {
      type: String,
    },
    completedLessons: {
      type: Number,
      default: 0,
    },
    totalLessons: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    badges: {
      type: [badgeSchema],
      default: [],
    },
    milestones: {
      type: [String],
      default: [],
    },
    nextLessonId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Progress', progressSchema);
