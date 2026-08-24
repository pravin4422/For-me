const mongoose = require('mongoose');

const todoLogSchema = new mongoose.Schema(
  {
    todoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Todo', required: true, index: true },
    userId: { type: String, required: true, index: true },
    date:   { type: Date, required: true },   // stored as midnight UTC for day-level granularity
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// one log entry per task per day per user
todoLogSchema.index({ todoId: 1, userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('TodoLog', todoLogSchema);
