const Income = require('../models/Income');
const AppError = require('../utils/AppError');

exports.getAll = async (req, res, next) => {
  try {
    const items = await Income.find({ userId: req.user.uid }).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const { source, amount, category, salaryType, date, notes } = req.body;
    if (!source || !amount || !category) return next(new AppError('source, amount and category are required', 400));
    const item = await Income.create({
      userId: req.user.uid,
      userEmail: req.user.email,
      source, amount, category, salaryType, date, notes
    });
    res.status(201).json(item);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Income.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return next(new AppError('Not found', 404));
    res.json(item);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await Income.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    if (!item) return next(new AppError('Not found', 404));
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
};
