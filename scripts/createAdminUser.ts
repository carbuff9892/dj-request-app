import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyCsTOIxsjoNG8lJRXXF2WZDEnD2RW1Uu_E',
  authDomain: 'dj-request-app-v2.firebaseapp.com',
  databaseURL: 'https://dj-request-app-v2-default-rtdb.firebaseio.com',
  projectId: 'dj-request-app-v2',
  storageBucket: 'dj-request-app-v2.firebasestorage.app',
  messagingSenderId: '343274625082',
  appId: '1:343274625082:web:8aea074294875b7a5cbd03',
  measurementId: 'G-KGV6G9TDK5'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const createAdminUser = async () => {
  const email = 'admin@djrequestapp.com';
  const password = 'Admin123!'; // You should change this password after first login

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Admin user created successfully:', userCredential.user.email);
  } catch (error: any) {
    console.error('Error creating admin user:', error.message);
  }
};

createAdminUser(); 