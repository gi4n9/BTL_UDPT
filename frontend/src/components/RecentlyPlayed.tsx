import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
const albums = [{
  title: 'Dream Your Moments (Duet)',
  artist: 'Ann Cornell & Brian Hill',
  cover: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80'
}, {
  title: 'Until I Met You',
  artist: 'Ann Cornell & Brian Hill',
  cover: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80'
}, {
  title: 'Gimme Some Courage',
  artist: 'Ann Cornell & Brian Hill',
  cover: 'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80'
}, {
  title: 'Dark Alley Acoustic',
  artist: 'Ann Cornell & Brian Hill',
  cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80'
}, {
  title: 'Walking Promises',
  artist: 'Ann Cornell & Brian Hill',
  cover: 'https://images.unsplash.com/photo-1512646605205-78422b7c7896?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80'
}, {
  title: 'Desired Games',
  artist: 'Ann Cornell & Brian Hill',
  cover: 'https://images.unsplash.com/photo-1553267751-1c148a7280a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80'
}];
export function RecentlyPlayed() {
  return <section id="recently-played" className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#3AA5D1]">Recently Played</h2>
        <button className="text-sm text-gray-300">View More</button>
      </div>
      <div className="relative">
        <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/30 p-1 rounded-full z-10">
          <ChevronLeft size={24} />
        </button>
        <div className="grid grid-cols-6 gap-4 overflow-hidden">
          {albums.map((album, index) => <div key={index} className="flex flex-col">
              <img src={album.cover} alt={album.title} className="w-full aspect-square object-cover rounded-md mb-2" />
              <h3 className="text-sm font-semibold">{album.title}</h3>
              <p className="text-xs text-gray-400">{album.artist}</p>
            </div>)}
        </div>
        <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/30 p-1 rounded-full z-10">
          <ChevronRight size={24} />
        </button>
      </div>
    </section>;
}