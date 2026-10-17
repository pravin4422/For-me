const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const initFirebase = () => {
  try {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) return;
    const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    if (!parsed.private_key) return;
    if (getApps().length) return;
    initializeApp({ credential: cert(parsed) });
    console.log('Firebase Admin initialized');
  } catch (e) {
    console.warn('Firebase init skipped:', e.message);
  }
};

module.exports = { getAuth, initFirebase };
