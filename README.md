# DJ Request App

A real-time web application for managing song requests during DJ sessions. Built with React, TypeScript, and Firebase.

## Features

- Real-time song request management
- DJ status and message broadcasting
- Song search with autocomplete
- Recently requested songs display
- Song rating system
- Blacklist and whitelist management
- Responsive design with modern UI

## Tech Stack

- React 18
- TypeScript
- Firebase Realtime Database
- Emotion (styled-components)
- Framer Motion
- Lodash

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dj-request-app.git
   cd dj-request-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=AIzaSyD-_CColzyihNeqiPGSacdBaRuIheYKEcg
   REACT_APP_FIREBASE_AUTH_DOMAIN=dj-requests-app.firebaseapp.com
   REACT_APP_FIREBASE_DATABASE_URL=https://dj-requests-app-default-rtdb.firebaseio.com
   REACT_APP_FIREBASE_PROJECT_ID=dj-requests-app
   REACT_APP_FIREBASE_STORAGE_BUCKET=dj-requests-app.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=154223856069
   REACT_APP_FIREBASE_APP_ID=1:154223856069:web:82fc7c3b3f21acc9eda3ac
   ```

4. Start the development server:
   ```bash
   
npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable the Realtime Database
3. Copy your Firebase configuration from the project settings
4. Update the `.env` file with your Firebase configuration
5. Deploy the Firebase security rules from `firebase.rules`

## Project Structure

```
src/
  ├── components/          # React components
  │   ├── SongSearch.tsx
  │   ├── RecentlyRequested.tsx
  │   ├── SongListManager.tsx
  │   └── SongRating.tsx
  ├── types/              # TypeScript type definitions
  │   └── song.ts
  ├── firebase.ts         # Firebase configuration and functions
  ├── App.tsx            # Main application component
  └── index.tsx          # Application entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Emotion](https://emotion.sh/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lodash](https://lodash.com/) # -git-clone-https-github.com-yourusername-dj-request-app
