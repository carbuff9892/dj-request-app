import React, { useState, useEffect } from 'react';
import { db, ref, onValue } from '../firebase';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const QueueContainer = styled(motion.div)`
  background: var(--surface);
  padding: 2rem;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
`;

const QueueHeader = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--glass-border);
`;

const QueueTitle = styled(motion.h3)`
  font-size: 2rem;
  font-weight: 700;
  color: var(--text);
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`;

const QueueItem = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 1.25rem;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  width: 100%;
  border: 1px solid transparent;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--glass-border);
  }
`;

const QueueSongInfo = styled(motion.div)`
  display: flex;
  flex-direction: column;
  margin-right: 1rem;
  flex: 1;
  min-width: 300px;
`;

const QueueSongTitle = styled(motion.h4)`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
  margin: 0;
  margin-bottom: 0.5rem;
`;

const QueueArtist = styled(motion.p)`
  font-size: 1rem;
  color: var(--text-light);
  margin: 0;
  line-height: 1.4;
`;

const QueueUser = styled(motion.p)`
  font-size: 0.875rem;
  color: var(--text-light);
  margin: 0;
  font-style: italic;
`;

const QueueVotes = styled(motion.div)`
  display: flex;
  align-items: center;
  margin-left: 24px;
  font-size: 20px;
  color: var(--text-light);
  min-width: 120px;
`;

const QueueEmpty = styled(motion.div)`
  color: var(--text-light);
  text-align: center;
  padding: 2rem;
  font-size: 1.125rem;
`;

const Queue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [djStatus, setDJStatus] = useState('offline');
  const [djMessage, setDJMessage] = useState('');

  useEffect(() => {
    const queueRef = ref(db, 'queue');
    const statusRef = ref(db, 'djStatus');
    const messageRef = ref(db, 'djMessage');

    // Listen for queue changes
    const queueListener = onValue(queueRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const sortedQueue = Object.entries(data)
          .sort(([, a], [, b]) => b.timestamp - a.timestamp)
          .map(([id, item]) => ({ id, ...item }));
        setQueue(sortedQueue);
      } else {
        setQueue([]);
      }
      setLoading(false);
    });

    // Listen for DJ status changes
    const statusListener = onValue(statusRef, snapshot => {
      setDJStatus(snapshot.val() || 'offline');
    });

    // Listen for DJ message changes
    const messageListener = onValue(messageRef, snapshot => {
      setDJMessage(snapshot.val() || '');
    });

    return () => {
      queueListener();
      statusListener();
      messageListener();
    };
  }, []);

  return (
    <QueueContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <QueueHeader>
        <QueueTitle>Current Queue</QueueTitle>
        <div style={{ color: djStatus === 'online' ? 'var(--success)' : 'var(--error)' }}>
          DJ is {djStatus}
        </div>
      </QueueHeader>

      {loading ? (
        <QueueEmpty>Loading...</QueueEmpty>
      ) : queue.length === 0 ? (
        <QueueEmpty>No songs in queue. Request a song to get started!</QueueEmpty>
      ) : (
        <div style={{ width: '100%' }}>
          {queue.map(item => (
            <QueueItem key={item.id} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <QueueSongInfo>
                <QueueSongTitle>{item.songTitle || item.song}</QueueSongTitle>
                <QueueArtist>{item.artist}</QueueArtist>
                <QueueUser>Requested by {item.nickname || item.name}</QueueUser>
              </QueueSongInfo>
              <QueueVotes>
                <motion.span whileHover={{ scale: 1.2 }} transition={{ duration: 0.2 }}>
                  {item.votes?.up || 0} votes
                </motion.span>
              </QueueVotes>
            </QueueItem>
          ))}
        </div>
      )}

      {djMessage && (
        <motion.div
          className="dj-message"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <div
            style={{
              color: 'var(--primary)',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center',
              padding: '1rem',
              borderRadius: '0.75rem',
              margin: '1rem 0',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            }}
          >
            {djMessage}
          </div>
        </motion.div>
      )}
    </QueueContainer>
  );
};

export default Queue;
