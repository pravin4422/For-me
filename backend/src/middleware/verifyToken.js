const { getAuth, initFirebase } = require('../config/firebase');
const { getApps } = require('firebase-admin/app');
const AppError = require('../utils/AppError');

const ALLOWED_ORIGIN = process.env.FRONTEND_ORIGIN;

const verifyToken = async (req, res, next) => {
  if (!getApps().length) {
    req.user = { uid: 'local-dev-user', email: 'dev@local' };
    return next();
  }

  const origin = req.headers.origin || req.headers.referer;
  if (ALLOWED_ORIGIN && origin && !origin.startsWith(ALLOWED_ORIGIN)) {
    return next(new AppError('Forbidden', 403));
  }

  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return next(new AppError('Unauthorized', 401));

  try {
    const decoded = await getAuth().verifyIdToken(auth.split(' ')[1]);
    req.user = decoded;
    next();
  } catch {
    next(new AppError('Unauthorized', 401));
  }
};

module.exports = verifyToken;
