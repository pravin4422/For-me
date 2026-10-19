const Expense = require('../models/Expense');
const AppError = require('../utils/AppError');

exports.getAll = async (req, res, next) => {
  try {
    const items = await Expense.find({ userId: req.user.uid }).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const { name, category, amount, date, notes, document } = req.body;
    if (!name || !category || !amount || !date) return next(new AppError('name, category, amount and date are required', 400));
    const item = await Expense.create({
      userId: req.user.uid,
      userEmail: req.user.email,
      name, category, amount, date, notes, document
    });
    res.status(201).json(item);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Expense.findOneAndUpdate(
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
    const item = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    if (!item) return next(new AppError('Not found', 404));
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
};
