import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

interface Song {
  id: number;
  title: string;
  artistId: number;
  cover?: string;
  artistName?: string;
}

interface NewReleasesProps {
  onSongSelect: (songId: number) => void;
}

export function NewReleases({ onSongSelect }: NewReleasesProps) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch danh sách bài hát và thông tin artist
  useEffect(() => {
    const fetchSongsAndArtists = async () => {
      try {
        // Lấy danh sách bài hát từ API /songs
        const songsResponse = await axios.get('http://localhost:3003/songs');
        const songsData = songsResponse.data;

        // Lấy thông tin artist cho mỗi bài hát
        const songsWithArtist = await Promise.all(
          songsData.map(async (song: Song) => {
            try {
              const artistResponse = await axios.get(
                `http://localhost:3004/artist/profile/${song.artistId}`
              );
              const artistData = artistResponse.data.data;
              const artistName = `${artistData.first_name} ${artistData.last_name}`;
              return { ...song, artistName };
            } catch (artistError) {
              console.error(`Lỗi khi lấy artist ${song.artistId}:`, artistError);
              return { ...song, artistName: 'Không xác định' };
            }
          })
        );

        setSongs(songsWithArtist);
        setError(null);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách bài hát:', error);
        setError('Không thể tải danh sách bài hát');
      }
    };
    fetchSongsAndArtists();
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
                  key={song.id}
                  className="flex items-center space-x-3 bg-[#1C1F33] p-2 rounded-lg min-w-[300px] cursor-pointer hover:bg-[#2A2E4A]"
                  onClick={() => onSongSelect(song.id)}
                >
                  <img
                    src={
                      song.cover ||
                      'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&h=50&q=80'
                    }
                    alt={song.title}
                    className="w-12 h-12 rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{song.title}</h3>
                    <p className="text-xs text-gray-400">{song.artistName || 'Không xác định'}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-sm">Không có bài hát nào</div>
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