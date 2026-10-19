const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema(
  {
    userId:       { type: String, required: true, index: true },
    userEmail:    { type: String, required: true, index: true },
    name:         { type: String, required: true, trim: true },
    category:     { type: String, required: true },
    amount:       { type: Number, required: true },
    currentValue: { type: Number, default: 0 },
    date:         { type: String, default: '' },
    notes:        { type: String, default: '' },
    document:     { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Investment', investmentSchema);
