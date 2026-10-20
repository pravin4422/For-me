const Saving = require('../models/Saving');
const AppError = require('../utils/AppError');

exports.getAll = async (req, res, next) => {
  try {
    const items = await Saving.find({ userId: req.user.uid }).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const { goal, category, amount, date, notes, document } = req.body;
    if (!goal || !amount || !category) return next(new AppError('goal, amount and category are required', 400));
    const item = await Saving.create({
      userId: req.user.uid,
      userEmail: req.user.email,
      goal, category, amount, date, notes, document
    });
    res.status(201).json(item);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const { goal, category, amount, date, notes, document } = req.body;
    const item = await Saving.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      { goal, category, amount, date, notes, document },
      { new: true, runValidators: true }
    );
    if (!item) return next(new AppError('Not found', 404));
    res.json(item);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await Saving.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    if (!item) return next(new AppError('Not found', 404));
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
};
