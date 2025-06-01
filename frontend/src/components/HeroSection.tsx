import React from 'react';
export function HeroSection() {
  return <div id="hero" className="flex w-full px-4 rounded-lg overflow-hidden">
      <div className="flex-1 flex items-center justify-center">
        <img src="/banner.png.png" alt="Singer with microphone" className="h-120 object-contain" />
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-3xl font-bold">This Month's</h2>
        <h1 className="text-4xl font-bold text-[#3AA5D1] mb-4">
          Record Breaking Albums!
        </h1>
        <p className="text-gray-300 mb-4">
          Dream your moments, Until I Met You, Gimme Some Courage, Dark Alley,
          One More Of A Stranger, Endless Things, The Heartbeat Stops, Walking
          Promises, Desired Games and many more...
        </p>
        <div className="flex gap-4">
          <button className="bg-[#3AA5D1] text-white py-2 px-6 rounded-full">
            Listen Now
          </button>
          <button className="border border-[#3AA5D1] text-[#3AA5D1] py-2 px-6 rounded-full">
            Add To Queue
          </button>
        </div>
      </div>
    </div>;
}