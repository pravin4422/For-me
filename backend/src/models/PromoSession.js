const mongoose = require('mongoose');

const promoSessionSchema = new mongoose.Schema(
  {
    userId:      { type: String, required: true, index: true },
    actId:       { type: String, default: null },
    category:    { type: String, default: 'study' },
    label:       { type: String, default: '' },
    setSecs:     { type: Number, default: 0 },
    seconds:     { type: Number, default: 0 },   // actual elapsed this log
    // pomodoro
    pomodoroMode:    { type: Boolean, default: false },
    studyMins:       { type: Number, default: 25 },
    breakMins:       { type: Number, default: 5 },
    totalSessions:   { type: Number, default: 4 },
    completedSessions: { type: Number, default: 0 },
    // per-activity remaining tracking
    remainingSecs:   { type: Number, default: null }, // null = not started yet
  },
  { timestamps: true }
);

module.exports = mongoose.model('PromoSession', promoSessionSchema);
