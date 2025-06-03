import React, { useState, useRef, useEffect } from 'react';
import { Song } from '../service/songService';

interface MusicPlayerProps {
  currentSong: Song | null;
  onNext?: () => void;
  onPrevious?: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ currentSong, onNext, onPrevious }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.fileUrl;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSong]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (currentSong?.fileUrl) {
      window.open(currentSong.fileUrl, '_blank');
    }
  };

  const handleFavorite = () => {
    // Placeholder for favorite functionality
    console.log('Toggled favorite for:', currentSong?.title);
  };

  const handlePlaylist = () => {
    // Placeholder for playlist functionality
    console.log('Add to playlist:', currentSong?.title);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-lg z-40">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
      <div className="max-w-5xl mx-auto flex items-center justify-between space-x-6">
        {/* Left Section: Song Info */}
        <div className="flex items-center space-x-4 min-w-[200px]">
          <div className="w-12 h-12 rounded bg-gray-800 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 -3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-sm">{currentSong?.title || 'No song selected'}</h3>
            <p className="text-xs text-gray-400">Artist ID: {currentSong?.artistId}</p>
          </div>
        </div>

        {/* Center Section: Playback Controls and Progress Bar */}
        <div className="flex-1 flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-4">
            <button
              onClick={onPrevious}
              className="p-2 hover:bg-gray-800 rounded-full transition"
              aria-label="Previous song"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={togglePlayPause}
              className="p-3 bg-white text-gray-900 rounded-full hover:bg-gray-200 transition"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
            <button
              onClick={onNext}
              className="p-2 hover:bg-gray-800 rounded-full transition"
              aria-label="Next song"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="flex items-center space-x-3 w-full max-w-md">
            <span className="text-xs">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right Section: Additional Controls */}
        <div className="flex items-center space-x-4 min-w-[120px] justify-end">
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-gray-800 rounded-full transition"
            aria-label="Download song"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          <button
            onClick={handleFavorite}
            className="p-2 hover:bg-gray-800 rounded-full transition"
            aria-label="Toggle favorite"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button
            onClick={handlePlaylist}
            className="p-2 hover:bg-gray-800 rounded-full transition"
            aria-label="Add to playlist"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;