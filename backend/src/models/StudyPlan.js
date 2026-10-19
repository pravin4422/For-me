const mongoose = require('mongoose');

const studyPlanSchema = new mongoose.Schema({
  userId:   { type: String, required: true, index: true },
  name:     { type: String, required: true, trim: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudyPlan', default: null, index: true },
  type:     { type: String, enum: ['planner', 'revision', 'practice', 'mock-test'], default: 'planner', index: true },
}, { timestamps: true });

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
