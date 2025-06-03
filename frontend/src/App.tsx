import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import ProfilePage from './pages/ProfilePage';
import UpgradePage from './pages/UpgradePage';
import AdminPage from './pages/AdminPage';
import UserManagementPage from './pages/UserManagementPage';

export function App() {
  const [selectedSongId, setSelectedSongId] = useState<number | undefined>(undefined);

  const handleSongSelect = (songId: number) => {
    setSelectedSongId(songId);
  };

  return (
    <Router>
      <div className="flex w-full min-h-screen bg-[#171A2C] text-white relative">
        <Sidebar />
        <div className="flex-1 flex flex-col pl-14">
          <Header />
          <Routes>
            <Route
              path="/"
              element={
                <main className="flex-1 overflow-y-auto px-6 pb-24">
                  <HeroSection />
                  <NewReleases onSongSelect={handleSongSelect} />
                  <RecentlyPlayed />
                  <WeeklyTop />
                  <FeaturedAlbums />
                  <TopGenres />
                  <Footer />
                </main>
              }
            />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/upgrade" element={<UpgradePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
          </Routes>
          <MusicPlayer songId={selectedSongId} />
        </div>
      </div>
    </Router>
  );
}