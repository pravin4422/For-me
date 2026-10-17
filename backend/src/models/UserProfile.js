const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema(
  {
    userId:     { type: String, required: true, unique: true, index: true },
    fullName:   { type: String, default: '' },
    email:      { type: String, default: '' },
    phone:      { type: String, default: '' },
    bio:        { type: String, default: '' },
    dob:        { type: String, default: '' },
    gender:     { type: String, default: '' },
    location:   { type: String, default: '' },
    targetExam: { type: String, default: '' },
    education:  { type: String, default: '' },
    occupation: { type: String, default: '' },
    pictureUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserProfile', userProfileSchema);
