const mongoose = require('mongoose');

const savingSchema = new mongoose.Schema(
  {
    userId:    { type: String, required: true, index: true },
    userEmail: { type: String, required: true, index: true },
    goal:      { type: String, required: true, trim: true },
    category:  { type: String, required: true },
    amount:    { type: Number, required: true },
    date:      { type: String, default: '' },
    notes:     { type: String, default: '' },
    document:  { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Saving', savingSchema);
