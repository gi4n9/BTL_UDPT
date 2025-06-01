import React from 'react';
import { Play, SkipBack, SkipForward, Volume2, Heart, Download } from 'lucide-react';
export function MusicPlayer() {
  return <div className="fixed bottom-0 left-0 right-0 bg-[#1C1F33] border-t border-gray-700 px-4 py-3 flex items-center z-50">
      <div className="flex items-center w-1/4">
        <img src="https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&h=50&q=80" alt="Album cover" className="w-12 h-12 rounded-md mr-3" />
        <div>
          <h4 className="text-sm font-medium">Cry Magnum Man</h4>
          <p className="text-xs text-gray-400">Mushroom Records</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center">
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white">
            <SkipBack size={20} />
          </button>
          <button className="w-8 h-8 rounded-full bg-[#3AA5D1] flex items-center justify-center">
            <Play size={18} />
          </button>
          <button className="text-gray-400 hover:text-white">
            <SkipForward size={20} />
          </button>
        </div>
        <div className="w-full max-w-md flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-400">1:55</span>
          <div className="flex-1 h-1 bg-gray-700 rounded-full">
            <div className="w-1/3 h-full bg-[#3AA5D1] rounded-full"></div>
          </div>
          <span className="text-xs text-gray-400">4:00</span>
        </div>
      </div>
      <div className="w-1/4 flex items-center justify-end gap-4">
        <button className="text-gray-400 hover:text-white">
          <Volume2 size={20} />
        </button>
        <button className="text-gray-400 hover:text-white">
          <Heart size={20} />
        </button>
        <button className="text-gray-400 hover:text-white">
          <Download size={20} />
        </button>
      </div>
    </div>;
}