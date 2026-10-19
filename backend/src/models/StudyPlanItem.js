const mongoose = require('mongoose');

const studyPlanItemSchema = new mongoose.Schema({
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudyPlan', required: true, index: true },
  userId: { type: String, required: true, index: true },
  text:      { type: String, required: true, trim: true },
  completed:     { type: Boolean, default: false },
  revisionCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('StudyPlanItem', studyPlanItemSchema);
