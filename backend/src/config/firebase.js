const admin = require('firebase-admin');

const initFirebase = () => {
  try {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) return;
    const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    if (!parsed.private_key) return;
    if (admin.apps.length) return;
    admin.initializeApp({ credential: admin.credential.cert(parsed) });
  } catch (e) {
    console.warn('Firebase init skipped:', e.message);
  }
};

module.exports = { admin, initFirebase };
