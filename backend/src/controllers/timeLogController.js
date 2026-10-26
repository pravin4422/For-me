const TimeLog = require('../models/TimeLog');
const AppError = require('../utils/AppError');

// GET /time-logs?from=YYYY-MM-DD&to=YYYY-MM-DD
const getLogs = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const filter = { userId: req.user.uid };
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = from;
      if (to)   filter.date.$lte = to;
    }
    const logs = await TimeLog.find(filter).sort({ date: -1 });
    res.json({ success: true, data: logs });
  } catch (e) { next(e); }
};

// POST /time-logs/toggle  { activityId, date, hours, minutes }
// if log exists → delete (untick); if not → create (tick)
const toggle = async (req, res, next) => {
  try {
    const { activityId, date, hours, minutes } = req.body;
    const existing = await TimeLog.findOne({ userId: req.user.uid, activityId, date });
    if (existing) {
      await existing.deleteOne();
      return res.json({ success: true, action: 'removed', data: null });
    }
    const log = await TimeLog.create({ userId: req.user.uid, activityId, date, hours, minutes });
    res.status(201).json({ success: true, action: 'added', data: log });
  } catch (e) { next(e); }
};

module.exports = { getLogs, toggle };
