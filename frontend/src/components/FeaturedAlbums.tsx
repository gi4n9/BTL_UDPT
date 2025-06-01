import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
const albums = [{
  title: 'Bloodlust',
  artist: 'Ann Cornell & Brian Hill',
  cover: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80'
}, {
  title: 'Neon Dreams',
  artist: 'Electric Soul',
  cover: 'https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80'
}, {
  title: 'Acoustic Sessions',
  artist: 'The Harmony Group',
  cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80'
}, {
  title: 'Urban Beats',
  artist: 'City Lights',
  cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80'
}, {
  title: 'Night Drive',
  artist: 'Midnight Riders',
  cover: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80'
}, {
  title: 'Summer Waves',
  artist: 'Beach Vibes',
  cover: 'https://images.unsplash.com/photo-1483412468200-72182dbbc544?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80'
}];
export function FeaturedAlbums() {
  return <section id="featured-albums" className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#3AA5D1]">Featured Albums</h2>
        <button className="text-sm text-gray-300">View More</button>
      </div>
      <div className="relative">
        <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/30 p-1 rounded-full z-10">
          <ChevronLeft size={24} />
        </button>
        <div className="grid grid-cols-6 gap-4 overflow-hidden">
          {albums.map((album, index) => <div key={index} className="flex flex-col">
              <img src={album.cover} alt={album.title} className="w-full aspect-square object-cover rounded-lg mb-2" />
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