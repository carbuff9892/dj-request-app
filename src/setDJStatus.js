import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyD-_CColzyihNeqiPGSacdBaRuIheYKEcg',
  authDomain: 'dj-requests-app.firebaseapp.com',
  databaseURL: 'https://dj-requests-app-default-rtdb.firebaseio.com',
  projectId: 'dj-requests-app',
  storageBucket: 'dj-requests-app.appspot.com',
  messagingSenderId: '154223856069',
  appId: '1:154223856069:web:82fc7c3b3f21acc9eda3ac'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Set DJ status to online
const statusRef = ref(db, 'djStatus');
set(statusRef, { status: 'online' })
  .then(() => {
    console.log('DJ status set to online successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error setting DJ status:', error);
    process.exit(1);
  }); 