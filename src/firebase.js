import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyD-_CColzyihNeqiPGSacdBaRuIheYKEcg",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "dj-requests-app.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://dj-requests-app-default-rtdb.firebaseio.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "dj-requests-app",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "dj-requests-app.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "154223856069",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:154223856069:web:82fc7c3b3f21acc9eda3ac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export function setDJStatus(status) {
  const statusRef = ref(db, 'djStatus');
  return set(statusRef, status);
}

export function onDJStatusChange(callback) {
  const statusRef = ref(db, 'djStatus');
  return onValue(statusRef, (snapshot) => callback(snapshot.val()));
}

export function setDJMessage(message) {
  const msgRef = ref(db, 'djMessage');
  return set(msgRef, message);
}

export function onDJMessageChange(callback) {
  const msgRef = ref(db, 'djMessage');
  return onValue(msgRef, (snapshot) => callback(snapshot.val()));
}

export { db, auth, googleProvider }; 