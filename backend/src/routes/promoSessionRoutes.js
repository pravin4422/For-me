const express = require('express');
const { getAll, create, remove, saveProgress } = require('../controllers/promoSessionController');
const verifyToken = require('../middleware/verifyToken');
const AppError = require('../utils/AppError');

const router = express.Router();

const MONGO_ID_RE = /^[a-f\d]{24}$/i;
const validateId = (req, res, next) => {
  if (req.params.id && !MONGO_ID_RE.test(req.params.id))
    return next(new AppError('Invalid id', 400));
  next();
};

router.use(verifyToken);
router.get('/',          getAll);
router.post('/progress', saveProgress);
router.post('/',         create);
router.delete('/:id',    validateId, remove);

module.exports = router;
