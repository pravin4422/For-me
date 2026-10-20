const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  category: { type: String, required: true },
  amount:   { type: Number, required: true, min: 0 },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  notes:    { type: String, default: '' },
});

const budgetPlanSchema = new mongoose.Schema(
  {
    userId:      { type: String, required: true, index: true },
    userEmail:   { type: String, required: true },
    month:       { type: Number, required: true },   // 0-11
    year:        { type: Number, required: true },
    budgetLimit: { type: Number, default: 0 },
    items:       [itemSchema],
  },
  { timestamps: true }
);

// one plan per user per month/year
budgetPlanSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('BudgetPlan', budgetPlanSchema);
