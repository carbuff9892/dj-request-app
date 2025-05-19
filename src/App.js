import React from 'react';
import RequestForm from './components/RequestForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>DJ Request App</h1>
        <p className="subtitle">Request your favorite songs and send messages to the DJ</p>
      </header>
      <main>
        <RequestForm />
      </main>
      <footer className="App-footer">
        <p>Made with ❤️ for music lovers</p>
      </footer>
    </div>
  );
}

export default App;
