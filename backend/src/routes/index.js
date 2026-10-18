const express = require('express');
const healthRoutes        = require('./healthRoutes');
const todoRoutes          = require('./todoRoutes');
const settingsRoutes      = require('./settingsRoutes');
const notificationRoutes  = require('./notificationRoutes');

const router = express.Router();

router.use('/health',        healthRoutes);
router.use('/todo',          todoRoutes);
router.use('/settings',      settingsRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;
