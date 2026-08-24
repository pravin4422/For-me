const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    category: { type: String, default: 'Personal' },
    dueDate: { type: Date, default: null },
    repeat: { type: String, enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'], default: 'none' },
    completed: { type: Boolean, default: false },
    overdue: { type: Boolean, default: false },
    reminderEnabled: { type: Boolean, default: false },
    reminder: { type: Date, default: null },
    reminderTime: { type: String, default: '' },
    description: { type: String, default: '' },
    taskType: { type: String, enum: ['ONE_TIME', 'RECURRING'], default: 'ONE_TIME' },
    frequencyDays: { type: [String], enum: ['MON','TUE','WED','THU','FRI','SAT','SUN'], default: [] },
    startDate: { type: Date, default: null },
    currentStreak:   { type: Number, default: 0 },
    bestStreak:      { type: Number, default: 0 },
    bestStreakStart:  { type: Date,   default: null },
    bestStreakEnd:    { type: Date,   default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Todo', todoSchema);
