import React, { useState, useEffect } from 'react';
import { ref, onValue, update, remove, set } from 'firebase/database';
import { db } from '../firebase';
import styled from '@emotion/styled';

const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  backdrop-filter: blur(10px);

  h3 {
    margin: 0;
    font-size: 2rem;
    background: linear-gradient(135deg, #00fff7, #ff36f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    margin: 10px 0 0;
    opacity: 0.8;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
`;

const Button = styled.button`
  background: ${props => props.variant === 'primary' ? 'linear-gradient(135deg, #00fff7, #ff36f7)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.variant === 'primary' ? '#181824' : 'white'};
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const RequestsTable = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  backdrop-filter: blur(10px);
`;

const RequestRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const RequestActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ThemeSelector = styled.select`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;

  option {
    background: #181824;
    color: white;
  }
`;

const StatusToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AdminDashboard = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    totalTips: 0
  });
  const [djStatus, setDJStatus] = useState('accepting requests');
  const [theme, setTheme] = useState('default');
  const [djMessage, setDJMessage] = useState('');

  useEffect(() => {
    // Listen for requests
    const requestsRef = ref(db, 'requests/');
    const unsubRequests = onValue(requestsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const requestsArray = Object.entries(data).map(([id, request]) => ({
          id,
          ...request,
          timestamp: new Date(request.timestamp).toLocaleString()
        }));
        
        setRequests(requestsArray.reverse());
        
        // Update stats
        setStats({
          totalRequests: requestsArray.length,
          pendingRequests: requestsArray.filter(r => !r.status || r.status === 'pending').length,
          totalTips: requestsArray.reduce((sum, r) => sum + (parseInt(r.tipAmount) || 0), 0)
        });
      } else {
        setRequests([]);
        setStats({ totalRequests: 0, pendingRequests: 0, totalTips: 0 });
      }
    });

    // Listen for DJ status
    const statusRef = ref(db, 'djStatus');
    const unsubStatus = onValue(statusRef, (snapshot) => {
      setDJStatus(snapshot.val() || 'accepting requests');
    });

    // Listen for theme
    const themeRef = ref(db, 'theme');
    const unsubTheme = onValue(themeRef, (snapshot) => {
      setTheme(snapshot.val() || 'default');
    });

    // Listen for DJ message
    const messageRef = ref(db, 'djMessage');
    const unsubMessage = onValue(messageRef, (snapshot) => {
      setDJMessage(snapshot.val() || '');
    });

    return () => {
      unsubRequests();
      unsubStatus();
      unsubTheme();
      unsubMessage();
    };
  }, []);

  const handleStatusToggle = () => {
    const newStatus = djStatus === 'accepting requests' ? 'not accepting requests' : 'accepting requests';
    set(ref(db, 'djStatus'), newStatus);
  };

  const handleThemeChange = (e) => {
    set(ref(db, 'theme'), e.target.value);
  };

  const handleMessageChange = (e) => {
    set(ref(db, 'djMessage'), e.target.value);
  };

  const handleRequestAction = async (requestId, action) => {
    const requestRef = ref(db, `requests/${requestId}`);
    
    if (action === 'approve') {
      await update(requestRef, { status: 'approved' });
    } else if (action === 'reject') {
      await update(requestRef, { status: 'rejected' });
    } else if (action === 'delete') {
      await remove(requestRef);
    }
  };

  return (
    <DashboardContainer>
      <Header>
        <h1>DJ Dashboard</h1>
        <div>
          <p>Welcome, {user.displayName || user.email}!</p>
        </div>
      </Header>

      <Stats>
        <StatCard>
          <h3>{stats.totalRequests}</h3>
          <p>Total Requests</p>
        </StatCard>
        <StatCard>
          <h3>{stats.pendingRequests}</h3>
          <p>Pending Requests</p>
        </StatCard>
        <StatCard>
          <h3>${stats.totalTips}</h3>
          <p>Total Tips</p>
        </StatCard>
      </Stats>

      <Controls>
        <StatusToggle>
          <Button
            variant={djStatus === 'accepting requests' ? 'primary' : undefined}
            onClick={handleStatusToggle}
          >
            {djStatus === 'accepting requests' ? 'Currently Accepting Requests' : 'Not Accepting Requests'}
          </Button>
        </StatusToggle>

        <ThemeSelector value={theme} onChange={handleThemeChange}>
          <option value="default">Default Theme</option>
          <option value="club">Club Theme</option>
          <option value="wedding">Wedding Theme</option>
          <option value="birthday">Birthday Theme</option>
        </ThemeSelector>

        <input
          type="text"
          value={djMessage}
          onChange={handleMessageChange}
          placeholder="Set DJ Message..."
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            color: 'white',
            width: '300px'
          }}
        />
      </Controls>

      <RequestsTable>
        <RequestRow style={{ fontWeight: 'bold' }}>
          <div>Song</div>
          <div>Requested By</div>
          <div>Time</div>
          <div>Actions</div>
        </RequestRow>
        {requests.map(request => (
          <RequestRow key={request.id}>
            <div>
              {request.songTitle} - {request.artist}
              {request.tipAmount > 0 && (
                <span style={{ marginLeft: '10px', color: '#00fff7' }}>
                  (Tipped ${request.tipAmount})
                </span>
              )}
            </div>
            <div>{request.name}</div>
            <div>{request.timestamp}</div>
            <RequestActions>
              <Button
                onClick={() => handleRequestAction(request.id, 'approve')}
                variant={request.status === 'approved' ? 'primary' : undefined}
              >
                ✓
              </Button>
              <Button
                onClick={() => handleRequestAction(request.id, 'reject')}
                variant={request.status === 'rejected' ? 'primary' : undefined}
              >
                ✕
              </Button>
              <Button
                onClick={() => handleRequestAction(request.id, 'delete')}
                style={{ background: 'rgba(255, 0, 0, 0.2)' }}
              >
                🗑
              </Button>
            </RequestActions>
          </RequestRow>
        ))}
      </RequestsTable>
    </DashboardContainer>
  );
};

export default AdminDashboard; 