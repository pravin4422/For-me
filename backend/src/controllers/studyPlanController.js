const StudyPlan     = require('../models/StudyPlan');
const StudyPlanItem = require('../models/StudyPlanItem');
const AppError      = require('../utils/AppError');

// Recursively collect all descendant plan IDs
async function collectDescendants(id) {
  const children = await StudyPlan.find({ parentId: id }).lean();
  let ids = [id];
  for (const child of children) {
    ids = ids.concat(await collectDescendants(child._id));
  }
  return ids;
}

// ── Plans ─────────────────────────────────────────────────────────────────────

const getPlans = async (req, res, next) => {
  try {
    const parentId = req.query.parentId || null;
    const type     = req.query.type || 'planner';
    const plans = await StudyPlan.find({ userId: req.user.uid, parentId, type }).sort({ createdAt: -1 });
    res.json({ success: true, data: plans });
  } catch (e) { next(e); }
};

const createPlan = async (req, res, next) => {
  try {
    const parentId = req.body.parentId || null;
    const type     = req.body.type || 'planner';
    const plan = await StudyPlan.create({ userId: req.user.uid, name: req.body.name, parentId, type });
    res.status(201).json({ success: true, data: plan });
  } catch (e) { next(e); }
};

const deletePlan = async (req, res, next) => {
  try {
    const plan = await StudyPlan.findOne({ _id: req.params.id, userId: req.user.uid });
    if (!plan) return next(new AppError('Plan not found', 404));
    const allIds = await collectDescendants(req.params.id);
    await StudyPlan.deleteMany({ _id: { $in: allIds } });
    await StudyPlanItem.deleteMany({ planId: { $in: allIds } });
    res.json({ success: true });
  } catch (e) { next(e); }
};

// ── Items ─────────────────────────────────────────────────────────────────────

const getItems = async (req, res, next) => {
  try {
    const items = await StudyPlanItem.find({ planId: req.params.id, userId: req.user.uid }).sort({ createdAt: 1 });
    res.json({ success: true, data: items });
  } catch (e) { next(e); }
};

const createItem = async (req, res, next) => {
  try {
    const plan = await StudyPlan.findOne({ _id: req.params.id, userId: req.user.uid });
    if (!plan) return next(new AppError('Plan not found', 404));
    const item = await StudyPlanItem.create({ planId: req.params.id, userId: req.user.uid, text: req.body.text });
    res.status(201).json({ success: true, data: item });
  } catch (e) { next(e); }
};

const deleteItem = async (req, res, next) => {
  try {
    const item = await StudyPlanItem.findOneAndDelete({ _id: req.params.itemId, userId: req.user.uid });
    if (!item) return next(new AppError('Item not found', 404));
    res.json({ success: true });
  } catch (e) { next(e); }
};

const toggleItem = async (req, res, next) => {
  try {
    const item = await StudyPlanItem.findOne({ _id: req.params.itemId, userId: req.user.uid });
    if (!item) return next(new AppError('Item not found', 404));
    item.completed = !item.completed;
    await item.save();
    res.json({ success: true, data: item });
  } catch (e) { next(e); }
};

const incrementItem = async (req, res, next) => {
  try {
    const item = await StudyPlanItem.findOneAndUpdate(
      { _id: req.params.itemId, userId: req.user.uid },
      { $inc: { revisionCount: 1 } },
      { new: true }
    );
    if (!item) return next(new AppError('Item not found', 404));
    res.json({ success: true, data: item });
  } catch (e) { next(e); }
};

module.exports = { getPlans, createPlan, deletePlan, getItems, createItem, deleteItem, toggleItem, incrementItem };
