import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import { songService, Song } from '../service/songService';

export function NewReleases() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { playSong } = useMusicPlayer();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const songsData = await songService.getAllSongs();
        setSongs(songsData);
        setError(null);
      } catch (error) {
        console.error('Error fetching songs:', error);
        setError('Could not load songs');
      }
    };
    fetchSongs();
  }, []);

  return (
    <section id="new-releases" className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#3AA5D1]">New Releases</h2>
        <button className="text-sm text-gray-300">View More</button>
      </div>
      {error ? (
        <div className="text-red-500 text-sm">{error}</div>
      ) : (
        <div className="relative">
          <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/30 p-1 rounded-full z-10">
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-4 overflow-x-auto">
            {songs.length > 0 ? (
              songs.map((song) => (
                <div
                  key={song._id}
                  className="flex items-center space-x-3 bg-[#1C1F33] p-2 rounded-lg min-w-[300px] cursor-pointer hover:bg-[#2A2E4A]"
                  onClick={() => playSong(song)}
                >
                  <div className="w-12 h-12 rounded-md bg-gray-800 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{song.title}</h3>
                    <p className="text-xs text-gray-400">Artist ID: {song.artistId}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-sm">No songs available</div>
            )}
          </div>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/30 p-1 rounded-full z-10">
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </section>
  );
}