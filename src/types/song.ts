export interface Song {
  id: string;
  title: string;
  artist: string;
  requestedBy: string;
  timestamp: number;
  rating: number;
  status: 'pending' | 'played' | 'blacklisted' | 'whitelisted';
  imageUrl: string;
}

export interface SongSearchResult {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
}

export interface SongRating {
  songId: string;
  rating: number;
  timestamp: number;
}

export interface SongSearchProps {
  onSongSelect: (song: SongSearchResult) => Promise<void>;
}

export interface RecentlyRequestedProps {
  songs: Song[];
  onRateSong: (songId: string, rating: number) => Promise<void>;
}

export interface SongListManagerProps {
  blacklistedSongs: Song[];
  whitelistedSongs: Song[];
  onRemoveFromBlacklist: (songId: string) => Promise<void>;
  onRemoveFromWhitelist: (songId: string) => Promise<void>;
}
