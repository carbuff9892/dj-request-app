import React, { useState } from 'react';
import AdminDashboard from './components/AdminDashboard';

const ADMIN_PASSWORD = "Hyundai3"; // Password for admin access

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (input === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  if (!authenticated) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 80 }}>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Enter admin password"
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginBottom: "10px",
              fontSize: "1rem"
            }}
          />
          <br />
          <button
            type="submit"
            style={{
              background: "#1DB954",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 24px",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Login
          </button>
        </form>
        {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
      </div>
    );
  }

  // Provide a fake user object for compatibility
  const user = { displayName: 'Admin' };
  return <AdminDashboard user={user} />;
} 