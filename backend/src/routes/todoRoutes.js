const express = require('express');
const { getAll, create, update, remove, getDeleted, permanentDelete, toggleComplete, logComplete, getOverview, getScore, getHistory, getCalendar, getStreaks, getFrequency } = require('../controllers/todoController');
const verifyToken = require('../middleware/verifyToken');
const AppError = require('../utils/AppError');

const router = express.Router();

// ── CSRF mitigation for Bearer-token APIs ─────────────────
// For stateless JWT auth, validate Origin/Referer on mutating requests
const csrfGuard = (req, res, next) => {
  const allowedOrigin = process.env.FRONTEND_ORIGIN;
  if (!allowedOrigin) return next(); // skip in dev if not set
  const origin = req.headers.origin || req.headers.referer || '';
  if (!origin.startsWith(allowedOrigin)) {
    return next(new AppError('Forbidden: invalid origin', 403));
  }
  next();
};

// ── MongoDB ObjectId validation ───────────────────────────
const MONGO_ID_RE = /^[a-f\d]{24}$/i;
const validateId = (req, res, next) => {
  if (req.params.id && !MONGO_ID_RE.test(req.params.id)) {
    return next(new AppError('Invalid id', 400));
  }
  next();
};

router.use(verifyToken);

router.get('/trash',           getDeleted);
router.delete('/trash/:id',    validateId, csrfGuard, permanentDelete);
router.get('/',                getAll);
router.post('/',               csrfGuard, create);
router.put('/:id',             validateId, csrfGuard, update);
router.delete('/:id',          validateId, csrfGuard, remove);
router.patch('/:id/toggle',    validateId, csrfGuard, toggleComplete);
router.post('/:id/complete',   validateId, csrfGuard, logComplete);
router.get('/:id/overview',    validateId, getOverview);
router.get('/:id/score',       validateId, getScore);
router.get('/:id/history',     validateId, getHistory);
router.get('/:id/calendar',    validateId, getCalendar);
router.get('/:id/streaks',     validateId, getStreaks);
router.get('/:id/frequency',   validateId, getFrequency);

module.exports = router;
