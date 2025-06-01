import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
const releases = [{
  title: 'Dark Alley Acoustic',
  artist: 'Ann Cornell',
  price: '$10',
  cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80'
}, {
  title: 'Midnight Dreams',
  artist: 'Sarah Johnson',
  price: '$12',
  cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80'
}, {
  title: 'Summer Vibes',
  artist: 'The Beach Band',
  price: '$8',
  cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80'
}, {
  title: 'Electric Dreams',
  artist: 'Neon Knights',
  price: '$15',
  cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80'
}];
export function NewReleases() {
  return <section id="new-releases" className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#3AA5D1]">New Releases</h2>
        <button className="text-sm text-gray-300">View More</button>
      </div>
      <div className="relative">
        <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/30 p-1 rounded-full z-10">
          <ChevronLeft size={24} />
        </button>
        <div className="flex gap-4 overflow-x-auto">
          {releases.map((release, index) => <div key={index} className="flex items-center space-x-3 bg-[#1C1F33] p-2 rounded-lg min-w-[300px]">
              <img src={release.cover} alt={release.title} className="w-12 h-12 rounded-md" />
              <div className="flex-1">
                <h3 className="text-sm font-medium">{release.title}</h3>
                <p className="text-xs text-gray-400">{release.artist}</p>
              </div>
              <span className="text-sm text-[#3AA5D1]">{release.price}</span>
            </div>)}
        </div>
        <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/30 p-1 rounded-full z-10">
          <ChevronRight size={24} />
        </button>
      </div>
    </section>;
}