import React from 'react';
const genres = [{
  name: 'Romantic',
  image: 'https://images.unsplash.com/photo-1518911710364-17ec553bde5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=200&q=80'
}, {
  name: 'Classical',
  image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=200&q=80'
}, {
  name: 'Pop Hits',
  image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=200&q=80'
}, {
  name: 'Dancing',
  image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=200&q=80'
}, {
  name: 'EDM',
  image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=200&q=80'
}];
export function TopGenres() {
  return <section id="top-genres" className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#3AA5D1]">Top Genres</h2>
        <button className="text-sm text-gray-300">View More</button>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {genres.map((genre, index) => <div key={index} className="relative rounded-lg overflow-hidden aspect-[2/1]">
            <img src={genre.image} alt={genre.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-end p-4">
              <h3 className="text-lg font-semibold">{genre.name}</h3>
            </div>
          </div>)}
      </div>
    </section>;
}