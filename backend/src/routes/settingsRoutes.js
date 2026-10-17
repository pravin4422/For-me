const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const UserProfile = require('../models/UserProfile');

router.use(verifyToken);

router.get('/profile', async (req, res, next) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user.uid });
    res.json(profile || {});
  } catch (err) {
    next(err);
  }
});

router.patch('/profile', async (req, res, next) => {
  try {
    const allowed = [
      'fullName', 'email', 'phone', 'bio', 'dob',
      'gender', 'location', 'targetExam', 'education', 'occupation', 'pictureUrl',
    ];
    const update = Object.fromEntries(
      Object.entries(req.body).filter(([k]) => allowed.includes(k))
    );
    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.user.uid },
      { $set: update },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
