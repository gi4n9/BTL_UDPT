import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Download } from 'lucide-react';
import axios from 'axios';

interface Song {
  id: number;
  title: string;
  artistId: number;
  fileUrl: string;
  cover?: string;
  artistName?: string;
}

interface MusicPlayerProps {
  songId?: number;
}

export function MusicPlayer({ songId }: MusicPlayerProps) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch chi tiết bài hát khi songId thay đổi
  useEffect(() => {
    const fetchSongById = async () => {
      if (songId) {
        try {
          const response = await axios.get(`http://localhost:3003/songs/${songId}`);
          setCurrentSong(response.data.song);
          setError(null);
          setIsPlaying(false); // Reset trạng thái phát khi đổi bài
          setCurrentTime(0); // Reset thời gian hiện tại
        } catch (error) {
          console.error('Lỗi khi lấy bài hát:', error);
          setError('Không thể tải bài hát');
          setCurrentSong(null);
        }
      } else {
        setCurrentSong(null);
        setError(null);
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };
    fetchSongById();
  }, [songId]);

  // Gán fileUrl vào audio và xử lý khi bài hát thay đổi
  useEffect(() => {
    if (audioRef.current && currentSong?.fileUrl) {
      audioRef.current.src = currentSong.fileUrl;
      audioRef.current.load(); // Tải lại nguồn audio
      audioRef.current
        .play()
        .then(() => {
          if (isPlaying) {
            setIsPlaying(true);
          }
        })
        .catch((err) => {
          console.error('Lỗi khi phát bài hát:', err);
          setError('Không thể phát bài hát');
          setIsPlaying(false);
        });
    }
  }, [currentSong]);

  // Handle audio events
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleError = () => {
    setError('Lỗi khi tải bài hát');
    setIsPlaying(false);
  };

  // Play or pause the song
  const togglePlayPause = () => {
    if (audioRef.current && currentSong?.fileUrl) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.error('Lỗi khi phát bài hát:', err);
            setError('Không thể phát bài hát');
          });
      }
      setIsPlaying(!isPlaying);
    } else {
      setError('Không có bài hát để phát');
    }
  };

  // Update progress bar
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = parseFloat(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Format time for display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Fallback song data
  const displaySong = currentSong || {
    title: 'Không có bài hát',
    artistName: 'Không xác định',
    fileUrl: '',
    cover: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&h=50&q=80',
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1C1F33] border-t border-gray-700 px-4 py-3 flex items-center z-50">
      {error ? (
        <div className="text-red-500 text-sm">{error}</div>
      ) : (
        <>
          <div className="flex items-center w-1/4">
            <img
              src={displaySong.cover}
              alt={displaySong.title}
              className="w-12 h-12 rounded-md mr-3"
            />
            <div>
              <h4 className="text-sm font-medium">{displaySong.title}</h4>
              <p className="text-xs text-gray-400">{displaySong.artistName || 'Không xác định'}</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-white" disabled>
                <SkipBack size={20} />
              </button>
              <button
                className="w-8 h-8 rounded-full bg-[#3AA5D1] flex items-center justify-center"
                onClick={togglePlayPause}
                disabled={!currentSong}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button className="text-gray-400 hover:text-white" disabled>
                <SkipForward size={20} />
              </button>
            </div>
            <div className="w-full max-w-md flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleProgressChange}
                className="flex-1 h-1 bg-gray-700 rounded-full"
                disabled={!currentSong}
              />
              <span className="text-xs text-gray-400">{formatTime(duration)}</span>
            </div>
          </div>
          <div className="w-1/4 flex items-center justify-end gap-4">
            <button className="text-gray-400 hover:text-white" disabled>
              <Volume2 size={20} />
            </button>
            <button className="text-gray-400 hover:text-white" disabled>
              <Heart size={20} />
            </button>
            <button className="text-gray-400 hover:text-white" disabled>
              <Download size={20} />
            </button>
          </div>
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onError={handleError}
          />
        </>
      )}
    </div>
  );
}