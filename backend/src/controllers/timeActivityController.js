const TimeActivity = require('../models/TimeActivity');
const AppError = require('../utils/AppError');

const getAll = async (req, res, next) => {
  try {
    const activities = await TimeActivity.find({ userId: req.user.uid }).sort({ createdAt: -1 });
    res.json({ success: true, data: activities });
  } catch (e) { next(e); }
};

const create = async (req, res, next) => {
  try {
    const activity = await TimeActivity.create({ ...req.body, userId: req.user.uid });
    res.status(201).json({ success: true, data: activity });
  } catch (e) { next(e); }
};

const update = async (req, res, next) => {
  try {
    const activity = await TimeActivity.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      req.body,
      { new: true, runValidators: true }
    );
    if (!activity) return next(new AppError('Activity not found', 404));
    res.json({ success: true, data: activity });
  } catch (e) { next(e); }
};

const remove = async (req, res, next) => {
  try {
    const activity = await TimeActivity.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    if (!activity) return next(new AppError('Activity not found', 404));
    res.json({ success: true, message: 'Deleted' });
  } catch (e) { next(e); }
};

module.exports = { getAll, create, update, remove };
