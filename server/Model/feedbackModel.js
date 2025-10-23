const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    sentiment: {
      type: String,
      enum: ['up', 'down'],
      required: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: 500,
    },
    source: {
      type: String,
      default: 'web',
    },
    metadata: {
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
