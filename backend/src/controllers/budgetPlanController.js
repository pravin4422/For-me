const BudgetPlan = require('../models/BudgetPlan');
const AppError   = require('../utils/AppError');

// GET /budget-plan/all — summary of all months that have a plan
exports.getAllPlans = async (req, res, next) => {
  try {
    const plans = await BudgetPlan.find({ userId: req.user.uid }).sort({ year: -1, month: -1 });
    const summary = plans.map(p => ({
      month:       p.month,
      year:        p.year,
      budgetLimit: p.budgetLimit,
      total:       p.items.reduce((s, i) => s + (i.amount || 0), 0),
      itemCount:   p.items.length,
    }));
    res.json(summary);
  } catch (e) { next(e); }
};

// GET /budget-plan?month=&year=
exports.getPlan = async (req, res, next) => {
  try {
    const month = parseInt(req.query.month);
    const year  = parseInt(req.query.year);
    if (isNaN(month) || isNaN(year)) return next(new AppError('month and year are required', 400));

    const plan = await BudgetPlan.findOne({ userId: req.user.uid, month, year });
    res.json(plan || { items: [], budgetLimit: 0 });
  } catch (e) { next(e); }
};

// POST /budget-plan  — upsert the whole plan (items + budgetLimit)
exports.savePlan = async (req, res, next) => {
  try {
    const { month, year, budgetLimit, items } = req.body;
    if (month === undefined || year === undefined) return next(new AppError('month and year are required', 400));

    const plan = await BudgetPlan.findOneAndUpdate(
      { userId: req.user.uid, month, year },
      { userEmail: req.user.email, budgetLimit: budgetLimit || 0, items: items || [] },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(plan);
  } catch (e) { next(e); }
};
