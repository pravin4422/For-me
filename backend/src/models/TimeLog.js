const mongoose = require('mongoose');

const timeLogSchema = new mongoose.Schema(
  {
    userId:     { type: String, required: true, index: true },
    activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'TimeActivity', required: true },
    date:       { type: String, required: true }, // YYYY-MM-DD
    hours:      { type: Number, default: 0 },
    minutes:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

// one log per activity per day per user
timeLogSchema.index({ userId: 1, activityId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('TimeLog', timeLogSchema);
