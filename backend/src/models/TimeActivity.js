const mongoose = require('mongoose');

const timeActivitySchema = new mongoose.Schema(
  {
    userId:      { type: String, required: true, index: true },
    name:        { type: String, required: true, trim: true },
    category:    { type: String, enum: ['study','work','sleep','exercise','travel','other'], default: 'study' },
    hours:       { type: Number, default: 0 },
    minutes:     { type: Number, default: 0 },
    repeat:      { type: String, enum: ['daily','weekdays','weekends','weekly','monthly','custom','none'], default: 'daily' },
    repeatDay:   { type: Number, default: 1 },
    repeatDate:  { type: Number, default: 1 },
    customDays:  { type: [Number], default: [] },
    startDate:   { type: String, default: '' },
    notes:       { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TimeActivity', timeActivitySchema);
