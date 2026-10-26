const express = require('express');
const { getLogs, toggle } = require('../controllers/timeLogController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();
router.use(verifyToken);
router.get('/',        getLogs);
router.post('/toggle', toggle);

module.exports = router;
