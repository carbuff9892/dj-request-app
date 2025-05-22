import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
  }

  if (!user) {
    return <AdminLogin onLogin={setUser} />;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 24 }}>
        <button
          onClick={() => signOut(auth)}
          style={{ background: '#ff36f7', color: 'white', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer' }}
        >
          Sign Out
        </button>
      </div>
      <AdminDashboard user={user} />
    </div>
  );
} 