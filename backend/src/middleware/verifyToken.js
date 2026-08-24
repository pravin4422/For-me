const { admin } = require('../config/firebase');
const AppError = require('../utils/AppError');

const verifyToken = async (req, res, next) => {
  // Skip auth if Firebase not initialized (local dev)
  if (!admin.apps || !admin.apps.length) {
    req.user = { uid: 'local-dev-user' };
    return next();
  }

  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return next(new AppError('Unauthorized', 401));

  try {
    const decoded = await admin.auth().verifyIdToken(auth.split(' ')[1]);
    req.user = decoded;
    next();
  } catch {
    next(new AppError('Unauthorized', 401));
  }
};

module.exports = verifyToken;
