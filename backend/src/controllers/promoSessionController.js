const PromoSession = require('../models/PromoSession');
const AppError = require('../utils/AppError');

const getAll = async (req, res, next) => {
  try {
    const sessions = await PromoSession.find({ userId: req.user.uid }).sort({ createdAt: -1 });
    res.json({ success: true, data: sessions });
  } catch (e) { next(e); }
};

const create = async (req, res, next) => {
  try {
    const session = await PromoSession.create({ ...req.body, userId: req.user.uid });
    res.status(201).json({ success: true, data: session });
  } catch (e) { next(e); }
};

const remove = async (req, res, next) => {
  try {
    const session = await PromoSession.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    if (!session) return next(new AppError('Session not found', 404));
    res.json({ success: true, message: 'Deleted' });
  } catch (e) { next(e); }
};

// Save remaining seconds for an activity (so next session resumes from here)
const saveProgress = async (req, res, next) => {
  try {
    const { actId, remainingSecs, setSecs, category, label } = req.body;
    const existing = await PromoSession.findOne({ userId: req.user.uid, actId, remainingSecs: { $ne: null } });
    if (existing) {
      existing.remainingSecs = remainingSecs;
      await existing.save();
      return res.json({ success: true, data: existing });
    }
    const doc = await PromoSession.create({
      userId: req.user.uid, actId, remainingSecs, setSecs, category, label,
      seconds: 0, pomodoroMode: false,
    });
    res.status(201).json({ success: true, data: doc });
  } catch (e) { next(e); }
};

module.exports = { getAll, create, remove, saveProgress };
