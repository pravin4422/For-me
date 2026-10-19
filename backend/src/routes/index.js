const express = require('express');
const healthRoutes        = require('./healthRoutes');
const todoRoutes          = require('./todoRoutes');
const settingsRoutes      = require('./settingsRoutes');
const notificationRoutes  = require('./notificationRoutes');
const studyPlanRoutes     = require('./studyPlanRoutes');
const incomeRoutes        = require('./incomeRoutes');
const expenseRoutes       = require('./expenseRoutes');
const investmentRoutes    = require('./investmentRoutes');
const savingRoutes        = require('./savingRoutes');

const router = express.Router();

router.use('/health',        healthRoutes);
router.use('/todo',          todoRoutes);
router.use('/settings',      settingsRoutes);
router.use('/notifications', notificationRoutes);
router.use('/study-plans',   studyPlanRoutes);
router.use('/income',        incomeRoutes);
router.use('/expenses',      expenseRoutes);
router.use('/investments',   investmentRoutes);
router.use('/savings',       savingRoutes);

module.exports = router;
