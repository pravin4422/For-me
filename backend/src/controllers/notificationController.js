const Notification = require('../models/Notification');
const AppError = require('../utils/AppError');

const getAll = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const filter = { userId: req.user.uid };
    if (category) filter.category = category;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [items, total] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      Notification.countDocuments(filter),
    ]);
    const unreadCount = await Notification.countDocuments({ userId: req.user.uid, read: false });
    res.json({
      success: true,
      items: items.map(n => ({ ...n, id: n._id })),
      unreadCount,
      hasMore: skip + items.length < total,
    });
  } catch (e) { next(e); }
};

const create = async (req, res, next) => {
  try {
    const { type, category, title, body, taskId } = req.body;
    if (!title) return next(new AppError('Title is required', 400));
    const notif = await Notification.create({ userId: req.user.uid, type, category, title, body, taskId });
    res.status(201).json({ success: true, data: { ...notif.toObject(), id: notif._id } });
  } catch (e) { next(e); }
};

const markRead = async (req, res, next) => {
  try {
    await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user.uid }, { read: true });
    res.json({ success: true });
  } catch (e) { next(e); }
};

const markUnread = async (req, res, next) => {
  try {
    await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user.uid }, { read: false });
    res.json({ success: true });
  } catch (e) { next(e); }
};

const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user.uid, read: false }, { read: true });
    res.json({ success: true });
  } catch (e) { next(e); }
};

const remove = async (req, res, next) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    res.json({ success: true });
  } catch (e) { next(e); }
};

const clearAll = async (req, res, next) => {
  try {
    await Notification.deleteMany({ userId: req.user.uid });
    res.json({ success: true });
  } catch (e) { next(e); }
};

// Settings — stored as a single doc per user (simple key-value in Notification collection is overkill,
// so we just return defaults and accept patches silently for now)
const getSettings = async (req, res) => {
  res.json({ Task: true, StudyReminder: true, RevisionReminder: true, ExamReminder: true, MockTestReminder: true, ShoppingReminder: true, BudgetReminder: true, CareerUpdate: true, Announcement: true });
};

const updateSettings = async (req, res) => {
  // Future: persist per-user settings. For now acknowledge.
  res.json({ success: true });
};

module.exports = { getAll, create, markRead, markUnread, markAllRead, remove, clearAll, getSettings, updateSettings };
