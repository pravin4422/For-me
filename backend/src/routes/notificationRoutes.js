const express = require('express');
const { getAll, create, markRead, markUnread, markAllRead, remove, clearAll, getSettings, updateSettings } = require('../controllers/notificationController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();
router.use(verifyToken);

router.get('/',                    getAll);
router.post('/',                   create);
router.patch('/read-all',          markAllRead);
router.get('/settings',            getSettings);
router.patch('/settings',          updateSettings);
router.patch('/:id/read',          markRead);
router.patch('/:id/unread',        markUnread);
router.delete('/:id',              remove);
router.delete('/',                 clearAll);

module.exports = router;
