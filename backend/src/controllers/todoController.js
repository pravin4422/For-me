const Todo = require('../models/Todo');
const TodoLog = require('../models/TodoLog');
const AppError = require('../utils/AppError');

const getAll = async (req, res, next) => {
  try {
    const todos = await Todo.find({ userId: req.user.uid, deletedAt: null }).sort({ createdAt: -1 });
    res.json({ success: true, data: todos });
  } catch (e) { next(e); }
};

const create = async (req, res, next) => {
  try {
    const todo = await Todo.create({ ...req.body, userId: req.user.uid });
    res.status(201).json({ success: true, data: todo });
  } catch (e) { next(e); }
};

const update = async (req, res, next) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      req.body,
      { new: true, runValidators: true }
    );
    if (!todo) return next(new AppError('Todo not found', 404));
    res.json({ success: true, data: todo });
  } catch (e) { next(e); }
};

const remove = async (req, res, next) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );
    if (!todo) return next(new AppError('Todo not found', 404));
    res.json({ success: true, message: 'Moved to trash' });
  } catch (e) { next(e); }
};

const getDeleted = async (req, res, next) => {
  try {
    const todos = await Todo.find({ userId: req.user.uid, deletedAt: { $ne: null } }).sort({ deletedAt: -1 });
    res.json({ success: true, data: todos });
  } catch (e) { next(e); }
};

const permanentDelete = async (req, res, next) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.uid, deletedAt: { $ne: null } });
    if (!todo) return next(new AppError('Todo not found', 404));
    await TodoLog.deleteMany({ todoId: todo._id });
    res.json({ success: true, message: 'Permanently deleted' });
  } catch (e) { next(e); }
};

const toggleComplete = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user.uid });
    if (!todo) return next(new AppError('Todo not found', 404));
    todo.completed = !todo.completed;
    if (todo.completed) todo.overdue = false;
    await todo.save();
    // sync today's log and recalc streaks for recurring tasks
    if (todo.taskType === 'RECURRING') {
      const today = midnightUTC(new Date());
      await TodoLog.findOneAndUpdate(
        { todoId: todo._id, userId: req.user.uid, date: today },
        { $set: { completed: todo.completed } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      await recalcStreaks(todo, req.user.uid);
    }
    res.json({ success: true, data: todo });
  } catch (e) { next(e); }
};

// ── helpers ──────────────────────────────────────────────────────────────────
function midnightUTC(d) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

// Count expected days for a RECURRING task within [from, to] (both midnight UTC)
function expectedDays(todo, from, to) {
  const start = todo.startDate ? midnightUTC(new Date(todo.startDate)) : from;
  const effectiveFrom = start > from ? start : from;
  if (effectiveFrom > to) return 0;

  // If no frequencyDays set, task is expected every day
  if (!todo.frequencyDays || todo.frequencyDays.length === 0) {
    return Math.round((to - effectiveFrom) / 86400000) + 1;
  }

  const DAY_MAP = { SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6 };
  const days = new Set(todo.frequencyDays.map(d => DAY_MAP[d]));
  let count = 0;
  const cur = new Date(effectiveFrom);
  while (cur <= to) {
    if (days.has(cur.getUTCDay())) count++;
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return count;
}

const getOverview = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user.uid });
    if (!todo) return next(new AppError('Todo not found', 404));

    if (todo.taskType === 'ONE_TIME') {
      return res.json({ success: true, data: { taskType: 'ONE_TIME', completed: todo.completed } });
    }

    const now = new Date();
    const todayStart = midnightUTC(now);
    const todayEnd   = new Date(todayStart.getTime() + 86400000 - 1); // end of today

    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const monthEnd   = todayEnd;

    const yearStart  = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
    const yearEnd    = todayEnd;

    // Fetch all logs up to end of today in one query
    const allLogs = await TodoLog.find({
      todoId: todo._id,
      userId: req.user.uid,
      completed: true,
      date: { $lte: todayEnd },
    }).lean();

    const totalCompletions = allLogs.length;

    const inRange = (log, from, to) => log.date >= from && log.date <= to;

    const completedToday = allLogs.filter(l => inRange(l, todayStart, todayEnd)).length;
    const completedMonth = allLogs.filter(l => inRange(l, monthStart, monthEnd)).length;
    const completedYear  = allLogs.filter(l => inRange(l, yearStart,  yearEnd)).length;

    const expToday = expectedDays(todo, todayStart, todayEnd);
    const expMonth = expectedDays(todo, monthStart, monthEnd);
    const expYear  = expectedDays(todo, yearStart,  yearEnd);

    const pct = (c, e) => (e === 0 ? 0 : Math.round((c / e) * 100));

    // Month-over-month delta: compare this month so far vs same span last month
    const lastMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
    const lastMonthEnd   = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, now.getUTCDate()));
    const completedLastMonth = allLogs.filter(l => inRange(l, lastMonthStart, lastMonthEnd)).length;
    const expLastMonth = expectedDays(todo, lastMonthStart, lastMonthEnd);
    const monthDelta = pct(completedMonth, expMonth) - pct(completedLastMonth, expLastMonth);

    // Year-over-year delta: compare this year so far vs same span last year
    const lastYearStart = new Date(Date.UTC(now.getUTCFullYear() - 1, 0, 1));
    const lastYearEnd   = new Date(Date.UTC(now.getUTCFullYear() - 1, now.getUTCMonth(), now.getUTCDate()));
    const completedLastYear = allLogs.filter(l => inRange(l, lastYearStart, lastYearEnd)).length;
    const expLastYear = expectedDays(todo, lastYearStart, lastYearEnd);
    const yearDelta = pct(completedYear, expYear) - pct(completedLastYear, expLastYear);

    res.json({
      success: true,
      data: {
        taskType: 'RECURRING',
        today:  { completed: completedToday, expected: expToday, score: pct(completedToday, expToday) },
        month:  { completed: completedMonth, expected: expMonth, score: pct(completedMonth, expMonth), delta: monthDelta },
        year:   { completed: completedYear,  expected: expYear,  score: pct(completedYear,  expYear),  delta: yearDelta },
        totalCompletions,
      },
    });
  } catch (e) { next(e); }
};

// Recalculate currentStreak, bestStreak, bestStreakStart, bestStreakEnd for a todo
async function recalcStreaks(todo, userId) {
  const DAY_MAP = { SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6 };
  const dueDays = todo.frequencyDays && todo.frequencyDays.length
    ? new Set(todo.frequencyDays.map(d => DAY_MAP[d]))
    : null; // null = every day

  const logs = await TodoLog.find({ todoId: todo._id, userId }).sort({ date: 1 }).lean();
  const completedSet = new Set(logs.filter(l => l.completed).map(l => l.date.getTime()));

  // use the first completed log date as origin (not createdAt)
  // so days before the user ever started are not counted as missed
  const today = midnightUTC(new Date());
  const firstLog = logs.length > 0 ? midnightUTC(new Date(logs[0].date)) : today;
  const origin = todo.startDate
    ? midnightUTC(new Date(todo.startDate))
    : firstLog;

  const dueDates = [];
  const cur = new Date(origin);
  while (cur <= today) {
    if (!dueDays || dueDays.has(cur.getUTCDay())) dueDates.push(new Date(cur));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }

  let best = 0, bestStart = null, bestEnd = null;
  let run = 0, runStart = null;

  for (let i = 0; i < dueDates.length; i++) {
    const d = dueDates[i];
    if (completedSet.has(d.getTime())) {
      if (run === 0) runStart = d;
      run++;
      if (run > best) { best = run; bestStart = runStart; bestEnd = d; }
    } else {
      run = 0; runStart = null;
    }
  }

  // current streak: count backwards — allow today to be incomplete (streak still alive if yesterday done)
  let current = 0;
  const lastDueIdx = dueDates.length - 1;
  // start from today if completed, else from yesterday
  let startIdx = lastDueIdx;
  if (lastDueIdx >= 0 && !completedSet.has(dueDates[lastDueIdx].getTime())) {
    startIdx = lastDueIdx - 1;
  }
  for (let i = startIdx; i >= 0; i--) {
    if (completedSet.has(dueDates[i].getTime())) current++;
    else break;
  }

  todo.currentStreak  = current;
  todo.bestStreak     = best;
  todo.bestStreakStart = bestStart;
  todo.bestStreakEnd   = bestEnd;
  await todo.save();
}


const logComplete = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user.uid });
    if (!todo) return next(new AppError('Todo not found', 404));

    // normalise to midnight UTC for the given date (default today)
    const raw = req.body.date ? new Date(req.body.date) : new Date();
    const date = new Date(Date.UTC(raw.getUTCFullYear(), raw.getUTCMonth(), raw.getUTCDate()));

    const log = await TodoLog.findOneAndUpdate(
      { todoId: todo._id, userId: req.user.uid, date },
      { $set: { completed: req.body.completed !== undefined ? req.body.completed : true } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    await recalcStreaks(todo, req.user.uid);
    res.json({ success: true, data: log });
  } catch (e) { next(e); }
};

const getScore = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user.uid });
    if (!todo) return next(new AppError('Todo not found', 404));
    if (todo.taskType !== 'RECURRING') {
      return res.json({ success: true, data: [] });
    }

    const range = req.query.range || 'week';
    const now   = new Date();
    const today = midnightUTC(now);
    const pct   = (c, e) => (e === 0 ? 0 : Math.round((c / e) * 100));

    // Build array of bucket boundaries depending on range
    // Each bucket: { label, from, to }
    const buckets = [];

    if (range === 'day') {
      // Last 24 hours in 2-hour slots — score per slot (completed that hour / expected)
      // Simpler: last 7 days, one point per day ("day" range = last 7 days daily)
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today); d.setUTCDate(d.getUTCDate() - i);
        const label = d.toLocaleDateString('en-IN', { weekday: 'short', timeZone: 'UTC' });
        buckets.push({ label, from: d, to: d });
      }
    } else if (range === 'week') {
      // Last 8 weeks, one point per week
      for (let i = 7; i >= 0; i--) {
        const weekEnd   = new Date(today); weekEnd.setUTCDate(weekEnd.getUTCDate() - i * 7);
        const weekStart = new Date(weekEnd); weekStart.setUTCDate(weekStart.getUTCDate() - 6);
        const label = `W${weekEnd.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' })}`;
        buckets.push({ label, from: weekStart, to: weekEnd });
      }
    } else if (range === 'month') {
      // Last 12 months, one point per month
      for (let i = 11; i >= 0; i--) {
        const y = now.getUTCFullYear(), m = now.getUTCMonth() - i;
        const from = new Date(Date.UTC(y, m, 1));
        const to   = new Date(Date.UTC(y, m + 1, 0)); // last day of month
        const label = from.toLocaleDateString('en-IN', { month: 'short', timeZone: 'UTC' });
        buckets.push({ label, from, to: to > today ? today : to });
      }
    } else if (range === 'year') {
      // Last 5 years, one point per year
      for (let i = 4; i >= 0; i--) {
        const y     = now.getUTCFullYear() - i;
        const from  = new Date(Date.UTC(y, 0, 1));
        const to    = new Date(Date.UTC(y, 11, 31));
        const label = String(y);
        buckets.push({ label, from, to: to > today ? today : to });
      }
    }

    // Fetch all completed logs in the full range in one query
    const rangeFrom = buckets[0].from;
    const rangeTo   = buckets[buckets.length - 1].to;
    const logs = await TodoLog.find({
      todoId: todo._id, userId: req.user.uid, completed: true,
      date: { $gte: rangeFrom, $lte: rangeTo },
    }).lean();

    const series = buckets.map(({ label, from, to }) => {
      const completed = logs.filter(l => l.date >= from && l.date <= to).length;
      const expected  = expectedDays(todo, from, to);
      return { label, score: pct(completed, expected) };
    });

    res.json({ success: true, data: series });
  } catch (e) { next(e); }
};

const getHistory = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user.uid });
    if (!todo) return next(new AppError('Todo not found', 404));
    if (todo.taskType !== 'RECURRING') return res.json({ success: true, data: [] });

    const range = req.query.range || 'week';
    const now   = new Date();
    const today = midnightUTC(now);
    const buckets = [];

    if (range === 'week') {
      // Last 7 days, one bucket per day
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setUTCDate(d.getUTCDate() - i);
        const label = d.toLocaleDateString('en-IN', { weekday: 'short', timeZone: 'UTC' });
        buckets.push({ label, from: d, to: d });
      }
    } else if (range === 'month') {
      // Last 12 months, one bucket per month
      for (let i = 11; i >= 0; i--) {
        const y = now.getUTCFullYear(), m = now.getUTCMonth() - i;
        const from = new Date(Date.UTC(y, m, 1));
        const to   = new Date(Date.UTC(y, m + 1, 0));
        const label = from.toLocaleDateString('en-IN', { month: 'short', timeZone: 'UTC' });
        buckets.push({ label, from, to: to > today ? today : to });
      }
    } else {
      // Last 5 years, one bucket per year
      for (let i = 4; i >= 0; i--) {
        const y    = now.getUTCFullYear() - i;
        const from = new Date(Date.UTC(y, 0, 1));
        const to   = new Date(Date.UTC(y, 11, 31));
        const label = String(y);
        buckets.push({ label, from, to: to > today ? today : to });
      }
    }

    const logs = await TodoLog.find({
      todoId: todo._id, userId: req.user.uid, completed: true,
      date: { $gte: buckets[0].from, $lte: buckets[buckets.length - 1].to },
    }).lean();

    const data = buckets.map(({ label, from, to }) => ({
      label,
      count: logs.filter(l => l.date >= from && l.date <= to).length,
    }));

    res.json({ success: true, data });
  } catch (e) { next(e); }
};

const getCalendar = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user.uid });
    if (!todo) return next(new AppError('Todo not found', 404));
    if (todo.taskType !== 'RECURRING') return res.json({ success: true, data: [] });

    const year  = parseInt(req.query.year)  || new Date().getUTCFullYear();
    const month = parseInt(req.query.month) || (new Date().getUTCMonth() + 1); // 1-based

    const from = new Date(Date.UTC(year, month - 1, 1));
    const to   = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)); // end of last day of month

    const logs = await TodoLog.find({
      todoId: todo._id, userId: req.user.uid,
      date: { $gte: from, $lte: to },
    }).lean();

    res.json({ success: true, data: logs.map(l => ({ date: l.date, completed: l.completed })) });
  } catch (e) { next(e); }
};

const getStreaks = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user.uid });
    if (!todo) return next(new AppError('Todo not found', 404));
    if (todo.taskType !== 'RECURRING') return res.json({ success: true, data: null });
    res.json({
      success: true,
      data: {
        currentStreak:  todo.currentStreak  || 0,
        bestStreak:     todo.bestStreak     || 0,
        bestStreakStart: todo.bestStreakStart || null,
        bestStreakEnd:   todo.bestStreakEnd   || null,
      },
    });
  } catch (e) { next(e); }
};

const getFrequency = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user.uid });
    if (!todo) return next(new AppError('Todo not found', 404));
    if (todo.taskType !== 'RECURRING') return res.json({ success: true, data: [] });
    res.json({ success: true, data: todo.frequencyDays || [] });
  } catch (e) { next(e); }
};

module.exports = { getAll, create, update, remove, getDeleted, permanentDelete, toggleComplete, logComplete, getOverview, getScore, getHistory, getCalendar, getStreaks, getFrequency };
