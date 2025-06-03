import React, { createContext, useContext, useState, useEffect } from 'react';
import { Song, songService } from '../service/songService';

interface MusicPlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  playlist: Song[];
  currentIndex: number;
  playSong: (song: Song) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  addToPlaylist: (song: Song) => void;
  removeFromPlaylist: (songId: string) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    // Load initial playlist
    const loadInitialPlaylist = async () => {
      try {
        const songs = await songService.getAllSongs();
        setPlaylist(songs);
      } catch (error) {
        console.error('Error loading initial playlist:', error);
      }
    };
    loadInitialPlaylist();
  }, []);

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    const index = playlist.findIndex(s => s._id === song._id);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (playlist.length === 0) return;
    
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    setCurrentSong(playlist[nextIndex]);
    setIsPlaying(true);
  };

  const playPrevious = () => {
    if (playlist.length === 0) return;
    
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentIndex(prevIndex);
    setCurrentSong(playlist[prevIndex]);
    setIsPlaying(true);
  };

  const addToPlaylist = (song: Song) => {
    if (!playlist.some(s => s._id === song._id)) {
      setPlaylist([...playlist, song]);
    }
  };

  const removeFromPlaylist = (songId: string) => {
    setPlaylist(playlist.filter(song => song._id !== songId));
    if (currentSong?._id === songId) {
      setCurrentSong(null);
      setIsPlaying(false);
    }
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        playlist,
        currentIndex,
        playSong,
        togglePlayPause,
        playNext,
        playPrevious,
        addToPlaylist,
        removeFromPlaylist,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
}; 