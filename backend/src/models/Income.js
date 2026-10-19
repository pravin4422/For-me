const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema(
  {
    userId:     { type: String, required: true, index: true },
    userEmail:  { type: String, required: true, index: true },
    source:     { type: String, required: true, trim: true },
    amount:     { type: Number, required: true },
    category:   { type: String, required: true },
    salaryType: { type: String, default: 'N/A' },
    date:       { type: String, default: '' },
    notes:      { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Income', incomeSchema);
