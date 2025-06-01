import React from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HeroSection } from './components/HeroSection';
import { RecentlyPlayed } from './components/RecentlyPlayed';
import { WeeklyTop } from './components/WeeklyTop';
import { NewReleases } from './components/NewReleases';
import { FeaturedAlbums } from './components/FeaturedAlbums';
import { TopGenres } from './components/TopGenres';
import { Footer } from './components/Footer';
import { MusicPlayer } from './components/MusicPlayer';
export function App() {
  return <div className="flex w-full min-h-screen bg-[#171A2C] text-white relative">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto px-6 pb-24">
          <HeroSection />
          <NewReleases />
          <RecentlyPlayed />
          <WeeklyTop />
          <FeaturedAlbums />
          <TopGenres />
          <Footer />
        </main>
        <MusicPlayer />
      </div>
    </div>;
}