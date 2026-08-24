const express = require('express');
const healthRoutes = require('./healthRoutes');
const todoRoutes   = require('./todoRoutes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/todo',   todoRoutes);

module.exports = router;
