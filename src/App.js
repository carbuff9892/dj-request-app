import React from 'react';
import RequestForm from './components/RequestForm';
import './App.css';
import { motion } from 'framer-motion';

function App() {
  return (
    <motion.div className="App"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <div className="animated-bg">
        <video
          className="background-video"
          autoPlay
          muted
          loop
          playsInline
          poster="https://i.ytimg.com/vi/v0zU448OgrQ/maxresdefault.jpg"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-lights-in-dark-space-3164-large.mp4" type="video/mp4" />
        </video>
        <div className="strobe"></div>
        <div className="strobe"></div>
        <div className="strobe"></div>
      </div>

      <header className="App-header">
        <h1>Request A Song</h1>
        <p className="subtitle">Make your request stand out with a tip!</p>
      </header>

      <main style={{ flex: 1, width: '100%', padding: 0, margin: 0 }}>
        <RequestForm />
      </main>

      <footer className="App-footer">
        <p>© 2025 aruizproductions all rights reserved.</p>
      </footer>
    </motion.div>
  );
}

export default App;
