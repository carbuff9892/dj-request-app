import React, { useState, useEffect, useRef } from 'react';
import { ref, push, onValue, update } from 'firebase/database';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { db, onDJStatusChange, onDJMessageChange } from '../firebase';
import './RequestForm.css';
import venmoLogo from '../assets/venmo-logo.svg';
import cashappLogo from '../assets/cashapp-logo.svg';
import debounce from 'lodash/debounce';

// Update the constants at the top of the file
const VENMO_USERNAME = 'Andrew-Ruiz-6';
const CASHAPP_USERNAME = 'aruizproductions';

// Add Spotify API configuration
const SPOTIFY_CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

const StyledContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StyledForm = styled(motion.form)`
  background: var(--surface);
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, var(--primary), var(--secondary));
  }
`;

const FormHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 40px;
`;

const FormTitle = styled(motion.h2)`
  font-size: 32px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 12px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const FormSubtitle = styled(motion.p)`
  color: var(--text-light);
  font-size: 16px;
  line-height: 1.6;
`;

const StyledInput = styled(motion.input)`
  width: 100%;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s;
  background: white;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    transform: translateY(-1px);
  }

  &:disabled {
    background: #f8fafc;
    cursor: not-allowed;
  }
`;

const TipContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px;
  margin: 24px 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const TipOptions = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 16px;
`;

const TipButton = styled(motion.button)`
  padding: 16px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text);
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(5px);

  &:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(255, 51, 102, 0.2);
  }

  &.selected {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
    box-shadow: 0 0 20px rgba(255, 51, 102, 0.3);
  }
`;

const PaymentOptions = styled(motion.div)`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const PaymentButton = styled(motion.button)`
  width: 100%;
  padding: 16px;
  margin: 8px 0;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text);
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(255, 51, 102, 0.2);
  }

  &.venmo {
    background: #008CFF;
    color: white;
  }

  &.cashapp {
    background: #00D632;
    color: white;
  }

  &.zelle {
    background: #6D1ED4;
    color: white;
  }
`;

const StyledButton = styled(motion.button)`
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);

    &::before {
      left: 100%;
    }
  }

  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    transform: none;
  }
`;

const RequestQueue = styled(motion.div)`
  background: var(--surface);
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
`;

const RequestItem = styled(motion.li)`
  padding: 20px;
  background: white;
  border-radius: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
  }
`;

const PaymentModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
`;

const PaymentContent = styled(motion.div)`
  background: var(--surface);
  padding: 40px;
  border-radius: 24px;
  width: 90%;
  max-width: 500px;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 50px rgba(255, 51, 102, 0.3);
`;

// Add new styled components for search
const SearchContainer = styled(motion.div)`
  position: relative;
  margin-bottom: 20px;
`;

const SearchInput = styled(StyledInput)`
  padding-right: 40px;
`;

const SearchResults = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #232336;
  border: 2px solid #00fff7;
  border-radius: 12px;
  margin-top: 8px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
`;

const SearchResult = styled(motion.div)`
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255,255,255,0.1);
  }
`;

const AlbumArt = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
`;

const SongInfo = styled.div`
  flex: 1;
`;

const SongTitle = styled.div`
  color: #f3f3f3;
  font-weight: 600;
  margin-bottom: 4px;
`;

const ArtistName = styled.div`
  color: #a0a0a0;
  font-size: 0.9rem;
`;

// Add new styled component for Spotify badge
const SpotifyBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  background: #1DB954;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 12px;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(29, 185, 84, 0.3);
`;

// Add new styled components for footer
const Footer = styled(motion.div)`
  text-align: center;
  margin-top: 48px;
  padding: 24px;
  color: #f3f3f3;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const RequestCounter = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  padding: 12px 24px;
  border-radius: 12px;
  margin-top: 16px;
  display: inline-block;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
`;

// Toast Notification Component
function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      style={{
        position: 'fixed',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(90deg, #00fff7, #ff36f7)',
        color: '#181824',
        padding: '18px 32px',
        borderRadius: 16,
        fontWeight: 700,
        fontSize: 18,
        zIndex: 9999,
        boxShadow: '0 4px 24px rgba(0,0,0,0.25)'
      }}
    >
      {message}
    </motion.div>
  );
}

// Add Spotify search function
async function searchSpotify(query) {
  if (!query) return [];
  
  try {
    // Get access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET)
      },
      body: 'grant_type=client_credentials'
    });
    
    const { access_token } = await tokenResponse.json();
    
    // Search tracks
    const searchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
      {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      }
    );
    
    const data = await searchResponse.json();
    return data.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      albumArt: track.album.images[0]?.url,
      previewUrl: track.preview_url
    }));
  } catch (error) {
    console.error('Error searching Spotify:', error);
    return [];
  }
}

function RequestForm() {
  const [formData, setFormData] = useState({
    name: '',
    artist: '',
    songTitle: '',
    message: '',
    tipAmount: '0',
    paymentMethod: 'venmo',
    shoutout: '',
    spotifyTrackId: '',
    spotifyAlbumArt: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [showCustomTip, setShowCustomTip] = useState(false);
  const [spotifyQuery, setSpotifyQuery] = useState('');
  const [spotifyResults, setSpotifyResults] = useState([]);
  const [spotifyLoading, setSpotifyLoading] = useState(false);
  const [spotifyError, setSpotifyError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [toast, setToast] = useState(null);
  const [djStatus, setDJStatus] = useState('accepting requests');
  const [djMessage, setDJMessage] = useState('');
  const [theme, setTheme] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const searchTimeoutRef = useRef(null);
  const [requestCount, setRequestCount] = useState(0);

  const tipOptions = [5, 10, 20, 50, 100, 'Custom'];

  useEffect(() => {
    const requestsRef = ref(db, 'requests/');
    const unsubscribe = onValue(requestsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const requests = Object.entries(data).map(([id, request]) => ({
          id,
          ...request,
          timestamp: new Date(request.timestamp).toLocaleString()
        }));
        console.log('Received requests:', requests); // Debug log
        setRecentRequests(requests.slice(-5).reverse());
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubStatus = onDJStatusChange(setDJStatus);
    const unsubMsg = onDJMessageChange(setDJMessage);
    return () => { if (unsubStatus) unsubStatus(); if (unsubMsg) unsubMsg(); };
  }, []);

  useEffect(() => {
    const themeRef = ref(db, 'theme');
    const unsub = onValue(themeRef, snap => {
      const t = snap.val() || 'default';
      setTheme(t);
      document.body.classList.remove('theme-club', 'theme-wedding', 'theme-birthday', 'theme-default');
      document.body.classList.add(`theme-${t}`);
    });
    return () => {
      unsub();
      document.body.classList.remove('theme-club', 'theme-wedding', 'theme-birthday', 'theme-default');
    };
  }, []);

  useEffect(() => {
    const requestsRef = ref(db, 'requests/');
    const unsubscribe = onValue(requestsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const now = new Date();
        const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);
        
        const count = Object.values(data).filter(request => {
          const requestTime = new Date(request.timestamp);
          return requestTime >= twentyFourHoursAgo;
        }).length;
        
        setRequestCount(count);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTipClick = (amount) => {
    if (amount === 'Custom') {
      setShowCustomTip(true);
      setFormData(prev => ({ ...prev, tipAmount: '' }));
    } else {
      setShowCustomTip(false);
      setFormData(prev => ({ ...prev, tipAmount: amount }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Show vinyl record animation
    const vinylRecord = document.createElement('div');
    vinylRecord.className = 'vinyl-record';
    document.body.appendChild(vinylRecord);
    setTimeout(() => vinylRecord.classList.add('show'), 100);

    try {
      // Push to Firebase instead of API endpoint
      const requestsRef = ref(db, 'requests');
      const newRequest = {
        name: formData.name,
        artist: formData.artist,
        song: formData.songTitle,
        songTitle: formData.songTitle,
        message: formData.message || '',
        tipAmount: formData.tipAmount || '0',
        paymentMethod: formData.paymentMethod || 'venmo',
        timestamp: new Date().toISOString(),
        votes: { up: 0, down: 0 },
        shoutout: formData.shoutout || '',
        tipMessage: formData.tipMessage || '',
        spotifyTrackId: formData.spotifyTrackId || '',
        spotifyAlbumArt: formData.spotifyAlbumArt || ''
      };
      
      console.log('Submitting request:', newRequest); // Debug log
      await push(requestsRef, newRequest);

      setSubmitStatus({
        type: 'success',
        message: 'Request submitted successfully!'
      });
      
      // Reset form
      setFormData({
        name: '',
        artist: '',
        songTitle: '',
        message: '',
        tipAmount: '0',
        paymentMethod: 'venmo',
        shoutout: '',
        spotifyTrackId: '',
        spotifyAlbumArt: ''
      });

      // Hide vinyl record after 2 seconds
      setTimeout(() => {
        vinylRecord.classList.remove('show');
        setTimeout(() => vinylRecord.remove(), 500);
      }, 2000);

      setToast('Request submitted successfully!');
    } catch (error) {
      console.error('Error submitting request:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Error submitting request. Please try again.'
      });
      setToast('Error submitting request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Voting handler
  const handleVote = async (requestId, type) => {
    const requestRef = ref(db, `requests/${requestId}/votes`);
    // Read current votes
    let up = 0, down = 0;
    const snapshot = await new Promise(resolve => onValue(requestRef, resolve, { onlyOnce: true }));
    if (snapshot.exists()) {
      const data = snapshot.val();
      up = data.up || 0;
      down = data.down || 0;
    }
    if (type === 'up') up++;
    if (type === 'down') down++;
    await update(requestRef, { up, down });
  };

  // Award badges for user actions
  function getBadges(request) {
    const badges = [];
    if (request.name) {
      // First request badge
      if (recentRequests.filter(r => r.name === request.name).length === 1) badges.push('🌟 First Request');
      // Top voter badge
      if ((request.votes?.up || 0) >= 5) badges.push('👍 Top Voter');
      // Big tipper badge
      if (Number(request.tipAmount) >= 20) badges.push('💸 Big Tipper');
    }
    return badges;
  }

  // Add debounced search function
  const debouncedSearch = debounce(async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    const results = await searchSpotify(query);
    setSearchResults(results);
    setIsSearching(false);
  }, 300);

  // Add search handler
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Add track selection handler
  const handleTrackSelect = (track) => {
    setSelectedTrack(track);
    setFormData(prev => ({
      ...prev,
      artist: track.artist,
      songTitle: track.name,
      spotifyTrackId: track.id,
      spotifyAlbumArt: track.albumArt
    }));
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <StyledContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StyledForm
        onSubmit={handleSubmit}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <FormHeader>
          <FormTitle>Request a Song</FormTitle>
          <FormSubtitle>
            Share your favorite music with the DJ and make your request stand out!
          </FormSubtitle>
        </FormHeader>

        {submitStatus && (
          <div className={`submit-status ${submitStatus.type}`}>
            {submitStatus.message}
          </div>
        )}

        <motion.div
          className="form-group"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <label htmlFor="name">Your Name</label>
          <StyledInput
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
          />
        </motion.div>

        <motion.div
          className="form-group"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '1.2rem', fontWeight: 600 }}>Find Your Song</label>
            <SpotifyBadge
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Powered by Spotify
            </SpotifyBadge>
          </div>
          <SearchContainer>
            <SearchInput
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search for a song..."
            />
            {isSearching && <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>🔍</div>}
            {searchResults.length > 0 && (
              <SearchResults
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {searchResults.map((track) => (
                  <SearchResult
                    key={track.id}
                    onClick={() => handleTrackSelect(track)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <AlbumArt src={track.albumArt} alt={track.name} />
                    <SongInfo>
                      <SongTitle>{track.name}</SongTitle>
                      <ArtistName>{track.artist}</ArtistName>
                    </SongInfo>
                  </SearchResult>
                ))}
              </SearchResults>
            )}
          </SearchContainer>
        </motion.div>

        <motion.div
          className="form-group"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          style={{ position: 'relative' }}
        >
          <label htmlFor="artist">Artist</label>
          <StyledInput
            id="artist"
            type="text"
            name="artist"
            value={formData.artist}
            onChange={handleChange}
            required
            placeholder="Enter artist name"
          />
        </motion.div>

        <motion.div
          className="form-group"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <label htmlFor="songTitle">Song Title</label>
          <StyledInput
            id="songTitle"
            type="text"
            name="songTitle"
            value={formData.songTitle}
            onChange={handleChange}
            required
            placeholder="Enter song title"
            autoComplete="off"
          />
        </motion.div>

        <motion.div
          className="form-group"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <label htmlFor="shoutout">Shoutout (optional)</label>
          <StyledInput
            id="shoutout"
            type="text"
            name="shoutout"
            value={formData.shoutout}
            onChange={handleChange}
            placeholder="Give a shoutout to your friends or the DJ!"
          />
        </motion.div>

        <TipContainer>
          <label>Tip the DJ (optional)</label>
          <TipOptions>
            {tipOptions.map((amount) => (
              <TipButton
                key={amount}
                type="button"
                className={formData.tipAmount === amount ? 'selected' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleTipClick(amount);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {amount === 'Custom' ? '$Custom' : `$${amount}`}
              </TipButton>
            ))}
          </TipOptions>

          {showCustomTip && (
            <div style={{ marginTop: 16 }}>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="Enter custom amount"
                value={formData.tipAmount}
                onChange={e => setFormData(prev => ({ ...prev, tipAmount: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '1rem',
                  marginBottom: '8px',
                }}
              />
            </div>
          )}

          {formData.tipAmount && formData.tipAmount !== '0' && (
            <PaymentOptions>
              <h4>Select Payment Method</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <PaymentButton
                  type="button"
                  className="venmo"
                  onClick={(e) => {
                    e.preventDefault();
                    setFormData(prev => ({ ...prev, paymentMethod: 'venmo' }));
                    const amount = formData.tipAmount || '0';
                    window.open(`https://venmo.com/u/Andrew-Ruiz-6`, '_blank');
                  }}
                  style={{ 
                    background: formData.paymentMethod === 'venmo' ? '#008CFF' : 'rgba(255, 255, 255, 0.05)',
                    color: formData.paymentMethod === 'venmo' ? 'white' : 'var(--text)'
                  }}
                >
                  <img src={venmoLogo} alt="Venmo" style={{ width: 24, height: 24, marginRight: 8, verticalAlign: 'middle' }} />
                  Venmo
                </PaymentButton>
                <PaymentButton
                  type="button"
                  className="cashapp"
                  onClick={(e) => {
                    e.preventDefault();
                    setFormData(prev => ({ ...prev, paymentMethod: 'cashapp' }));
                    const amount = formData.tipAmount || '0';
                    window.open(`https://cash.app/$aruizproductions/${amount}`, '_blank');
                  }}
                  style={{ 
                    background: formData.paymentMethod === 'cashapp' ? '#00D632' : 'rgba(255, 255, 255, 0.05)',
                    color: formData.paymentMethod === 'cashapp' ? 'white' : 'var(--text)'
                  }}
                >
                  <img src={cashappLogo} alt="Cash App" style={{ width: 24, height: 24, marginRight: 8, verticalAlign: 'middle' }} />
                  Cash App
                </PaymentButton>
              </div>
            </PaymentOptions>
          )}
        </TipContainer>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <StyledButton
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </StyledButton>
        </motion.div>
      </StyledForm>

      <RequestQueue
        style={{
          background: '#181824',
          color: '#f3f3f3',
          border: '4px solid #00fff7',
          borderRadius: 28,
          boxShadow: '0 0 32px 4px #181824, 0 2px 32px 0 rgba(0,0,0,0.9)',
          padding: '48px 36px 36px 36px',
          marginBottom: 32,
          position: 'relative',
          overflow: 'hidden',
          transition: 'box-shadow 0.3s, border 0.3s',
        }}
      >
        <motion.h2 style={{
          color: '#f3f3f3', 
          fontWeight: 800, 
          fontSize: '2.5rem',
          marginBottom: '1.5rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #00fff7, #ff36f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Request Queue
        </motion.h2>
        <AnimatePresence>
          {recentRequests.length > 0 ? (
            <motion.ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {recentRequests
                .filter(request => !request.status || request.status === 'queued')
                .map((request, index) => (
                  <RequestItem
                    key={request.id}
                    style={{
                      background: '#232336',
                      color: '#f3f3f3',
                      border: '3px solid #00fff7',
                      borderRadius: 22,
                      marginBottom: 28,
                      boxShadow: '0 0 24px 2px #181824, 0 2px 12px 0 rgba(0,0,0,0.7)',
                      padding: '0 0 24px 0',
                      fontFamily: 'Inter, Arial, sans-serif',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="request-header" style={{background: '#232336', color: '#f3f3f3', fontWeight: 700, padding: '18px 28px 12px 28px', borderTopLeftRadius: 22, borderTopRightRadius: 22, minHeight: 48}}>
                      {request.artist} - {(request.songTitle || request.song || 'Unknown Song')}
                    </div>
                    <div className="request-details" style={{padding: '18px 28px 0 28px', color: '#f3f3f3'}}>
                      <span className="request-message" style={{color: '#f3f3f3', fontWeight: 600}}>
                        Requested by: <span style={{ fontWeight: 700, color: '#00fff7' }}>{request.name}</span>
                        {getBadges(request).map(badge => (
                          <span key={badge} style={{ marginLeft: 6, fontSize: 15 }}>{badge}</span>
                        ))}
                        {request.tipAmount && request.tipAmount !== '0' && ` • Tipped $${request.tipAmount}`}
                      </span>
                      {request.shoutout && (
                        <div style={{ color: '#ff36f7', fontWeight: 600, marginTop: 8 }}>
                          Shoutout: "{request.shoutout}"
                        </div>
                      )}
                      <div className="vote-row" style={{marginTop: 14}}>
                        <button
                          aria-label="Thumbs Up"
                          className="vote-btn"
                          style={{color: '#f3f3f3', background: '#181824', border: '2px solid #00fff7', fontWeight: 700, borderRadius: '50%', width: 44, height: 44, marginRight: 18}}
                          onClick={() => handleVote(request.id, 'up')}
                        >
                          👍 {request.votes?.up || 0}
                        </button>
                        <button
                          aria-label="Thumbs Down"
                          className="vote-btn"
                          style={{color: '#f3f3f3', background: '#181824', border: '2px solid #ff36f7', fontWeight: 700, borderRadius: '50%', width: 44, height: 44}}
                          onClick={() => handleVote(request.id, 'down')}
                        >
                          👎 {request.votes?.down || 0}
                        </button>
                      </div>
                    </div>
                  </RequestItem>
                ))}
            </motion.ul>
          ) : (
            <motion.p>No requests in queue</motion.p>
          )}
        </AnimatePresence>
      </RequestQueue>

      <div style={{ 
        textAlign: 'center', 
        marginTop: 32,
        gridColumn: '1 / -1',  // Make the button span full width
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        <RequestCounter
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          🎵 {requestCount} requests in the last 24 hours
        </RequestCounter>

        <a
          href="mailto:djl3g1t@gmail.com"
          className="book-dj-btn"
          style={{
            display: 'inline-block',
            padding: '20px 48px',
            background: 'linear-gradient(135deg, #ff36f7, #00fff7)',
            color: '#181824',
            textDecoration: 'none',
            borderRadius: '16px',
            fontWeight: 800,
            fontSize: '1.5rem',
            transition: 'transform 0.3s, box-shadow 0.3s',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
          }}
        >
          BOOK THIS DJ
        </a>
      </div>

      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </StyledContainer>
  );
}

export default RequestForm;
