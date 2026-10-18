const express = require('express');
const { getAll, create, update, remove, getDeleted, permanentDelete, toggleComplete, logComplete, getOverview, getScore, getHistory, getCalendar, getStreaks, getFrequency } = require('../controllers/todoController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.use(verifyToken);

router.get('/trash',      getDeleted);
router.delete('/trash/:id', permanentDelete);
router.get('/',           getAll);
router.post('/',          create);
router.put('/:id',        update);
router.delete('/:id',     remove);
router.patch('/:id/toggle', toggleComplete);
router.post('/:id/complete', logComplete);
router.get('/:id/overview', getOverview);
router.get('/:id/score',    getScore);
router.get('/:id/history',  getHistory);
router.get('/:id/calendar', getCalendar);
router.get('/:id/streaks',  getStreaks);
router.get('/:id/frequency', getFrequency);

module.exports = router;
