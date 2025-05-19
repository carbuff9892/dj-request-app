import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import './RequestForm.css';

const firebaseConfig = {
  apiKey: "AIzaSyD-_CColzyihNeqiPGSacdBaRuIheYKEcg",
  authDomain: "dj-requests-app.firebaseapp.com",
  databaseURL: "https://dj-requests-app-default-rtdb.firebaseio.com",
  projectId: "dj-requests-app",
  storageBucket: "dj-requests-app.appspot.com",
  messagingSenderId: "154223856069",
  appId: "1:154223856069:web:82fc7c3b3f21acc9eda3ac"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function RequestForm() {
  const [song, setSong] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    const requestsRef = ref(db, 'requests/');
    const unsubscribe = onValue(requestsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const requests = Object.entries(data).map(([id, request]) => ({
          id,
          ...request,
          timestamp: new Date().toLocaleString()
        }));
        setRecentRequests(requests.slice(-5).reverse());
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await push(ref(db, 'requests/'), {
        song,
        message,
        timestamp: new Date().toISOString()
      });
      setSong('');
      setMessage('');
      setSuccess('Request submitted successfully!');
    } catch (err) {
      setError('Failed to submit request. Please try again.');
      console.error('Error submitting request:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="request-container">
      <div className="form-section">
        <h2>Request a Song</h2>
        <p className="instructions">
          Enter the name of the song you'd like to request. You can also add a message for the DJ!
        </p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="song">Song Name *</label>
            <input
              id="song"
              type="text"
              placeholder="Enter song name"
              value={song}
              onChange={(e) => setSong(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Message to DJ (optional)</label>
            <input
              id="message"
              type="text"
              placeholder="Add a message for the DJ"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={isSubmitting ? 'submitting' : ''}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>

      <div className="recent-requests">
        <h3>Recent Requests</h3>
        {recentRequests.length > 0 ? (
          <ul>
            {recentRequests.map((request) => (
              <li key={request.id}>
                <strong>{request.song}</strong>
                {request.message && <p className="request-message">{request.message}</p>}
                <small>{request.timestamp}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent requests</p>
        )}
      </div>
    </div>
  );
}

export default RequestForm;
