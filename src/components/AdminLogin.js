import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const AdminLogin = ({ onLogin }) => {
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (onLogin) onLogin(result.user);
    } catch (error) {
      alert('Google sign-in failed.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 80 }}>
      <h2>Admin Login</h2>
      <button
        onClick={handleGoogleSignIn}
        style={{
          background: '#1DB954',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          padding: '14px 32px',
          fontSize: '1.1rem',
          fontWeight: 700,
          cursor: 'pointer',
          marginTop: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.242 3.648-5.617 3.648-3.383 0-6.148-2.805-6.148-6.273s2.765-6.273 6.148-6.273c1.93 0 3.227.82 3.969 1.523l2.719-2.648c-1.711-1.57-3.93-2.547-6.688-2.547-5.523 0-10 4.477-10 10s4.477 10 10 10c5.742 0 9.547-4.023 9.547-9.695 0-.648-.07-1.141-.156-1.432z" fill="#fff"/></svg>
        Sign in with Google
      </button>
    </div>
  );
};

export default AdminLogin; 