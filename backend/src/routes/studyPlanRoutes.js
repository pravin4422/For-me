const express    = require('express');
const verifyToken = require('../middleware/verifyToken');
const {
  getPlans, createPlan, deletePlan,
  getItems, createItem, deleteItem, toggleItem, incrementItem,
} = require('../controllers/studyPlanController');

const router = express.Router();
router.use(verifyToken);

router.get('/',                                getPlans);
router.post('/',                               createPlan);
router.delete('/:id',                          deletePlan);
router.get('/:id/items',                       getItems);
router.post('/:id/items',                      createItem);
router.delete('/:id/items/:itemId',            deleteItem);
router.patch('/:id/items/:itemId/toggle',      toggleItem);
router.patch('/:id/items/:itemId/increment',   incrementItem);

module.exports = router;
