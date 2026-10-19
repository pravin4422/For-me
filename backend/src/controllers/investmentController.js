const Investment = require('../models/Investment');
const AppError = require('../utils/AppError');

exports.getAll = async (req, res, next) => {
  try {
    const items = await Investment.find({ userId: req.user.uid }).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const { name, category, amount, currentValue, date, notes, document } = req.body;
    if (!name || !amount || !category) return next(new AppError('name, amount and category are required', 400));
    const item = await Investment.create({
      userId: req.user.uid,
      userEmail: req.user.email,
      name, category, amount, currentValue, date, notes, document
    });
    res.status(201).json(item);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Investment.findOneAndUpdate(
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
    const item = await Investment.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    if (!item) return next(new AppError('Not found', 404));
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
};
