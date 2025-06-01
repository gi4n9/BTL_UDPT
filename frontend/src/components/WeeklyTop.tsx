import React from 'react';
import { MoreHorizontal } from 'lucide-react';
const topSongs = [{
  position: '01',
  title: 'Until I Met You',
  artist: 'Ann Cornell',
  price: '$10'
}, {
  position: '02',
  title: 'Walking Promises',
  artist: 'Ann Cornell',
  price: '$10'
}, {
  position: '03',
  title: 'Gimme Some Courage',
  artist: 'Ann Cornell',
  price: '$10'
}, {
  position: '04',
  title: 'Desired Games',
  artist: 'Ann Cornell',
  price: '$10'
}, {
  position: '05',
  title: 'Dark Alley Acoustic',
  artist: 'Ann Cornell',
  price: '$10'
}, {
  position: '06',
  title: 'Walking Promises',
  artist: 'Ann Cornell',
  price: '$10'
}, {
  position: '07',
  title: 'Endless Things',
  artist: 'Ann Cornell',
  price: '$10'
}, {
  position: '08',
  title: 'Dream Your Moments',
  artist: 'Ann Cornell',
  price: '$10'
}, {
  position: '09',
  title: 'Until I Met You',
  artist: 'Ann Cornell',
  price: '$10'
}, {
  position: '10',
  title: 'Gimme Some Courage',
  artist: 'Ann Cornell',
  price: '$10'
}, {
  position: '11',
  title: 'Dark Alley Acoustic',
  artist: 'Ann Cornell',
  price: '$10'
}, {
  position: '12',
  title: 'The Heartbeat Stops',
  artist: 'Ann Cornell',
  price: '$10'
}, {
  position: '13',
  title: 'One More Stranger',
  artist: 'Ann Cornell',
  price: '$10'
}, {
  position: '14',
  title: 'Walking Promises',
  artist: 'Ann Cornell',
  price: '$10'
}, {
  position: '15',
  title: 'Endless Things',
  artist: 'Ann Cornell',
  price: '$10'
}];
export function WeeklyTop() {
  return <section id="weekly-top" className="mt-12 mb-10">
      <h2 className="text-xl font-bold text-[#3AA5D1] mb-6">Weekly Top 15</h2>
      <div className="grid grid-cols-3 gap-4">
        {topSongs.map((song, index) => <div key={index} className="flex items-center bg-[#1C1F33] p-2 rounded-md">
            <div className="text-2xl font-bold text-gray-500 w-12 text-center">
              {song.position}
            </div>
            <div className="h-12 w-12 bg-gray-700 rounded-md mr-3"></div>
            <div className="flex-1">
              <h3 className="text-sm font-medium">{song.title}</h3>
              <p className="text-xs text-gray-400">{song.artist}</p>
            </div>
            <div className="text-sm text-gray-400 mr-2">{song.price}</div>
            <button className="text-gray-400">
              <MoreHorizontal size={16} />
            </button>
          </div>)}
      </div>
    </section>;
}