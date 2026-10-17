const express = require('express');
const healthRoutes   = require('./healthRoutes');
const todoRoutes     = require('./todoRoutes');
const settingsRoutes = require('./settingsRoutes');

const router = express.Router();

router.use('/health',        healthRoutes);
router.use('/todo',          todoRoutes);
router.use('/settings',      settingsRoutes);
router.use('/notifications', (req, res) => res.json({ items: [], unreadCount: 0, hasMore: false }));

module.exports = router;
