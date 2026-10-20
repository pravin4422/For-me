const express    = require('express');
const ctrl       = require('../controllers/budgetPlanController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();
router.use(verifyToken);

router.get('/all', ctrl.getAllPlans);
router.get('/',    ctrl.getPlan);
router.post('/',   ctrl.savePlan);

module.exports = router;
