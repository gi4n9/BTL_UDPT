import React, { useEffect, useState } from 'react';
import { Home, Grid, Music, Folder, Heart, Download, Clock, Settings, History } from 'lucide-react';
export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'new-releases', 'recently-played', 'weekly-top', 'featured-albums', 'top-genres'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };
  return <div className={`${isExpanded ? 'w-64' : 'w-14'} bg-[#1C1F33] flex flex-col py-4 transition duration-300 ease-in-out fixed top-0 h-screen z-50`} onMouseEnter={() => setIsExpanded(true)} onMouseLeave={() => setIsExpanded(false)}>
      <div className={`flex items-center px-4 mb-8 ${isExpanded ? 'justify-start' : 'justify-center'}`}>
        <div className="h-10 w-10 rounded-full bg-[#3AA5D1] flex items-center justify-center text-white font-bold shrink-0">
          M
        </div>
        {isExpanded && <span className="ml-3 text-white font-semibold">Muzik</span>}
      </div>
      <div className="flex flex-col flex-1 px-2">
        <button onClick={() => scrollToSection('hero')} className={`flex items-center p-2 rounded-md mb-2 transition-colors ${isExpanded ? 'px-4' : 'justify-center'} ${activeSection === 'hero' ? 'text-white bg-[#3AA5D1]' : 'text-gray-400 hover:text-white'}`}>
          <Home size={20} />
          {isExpanded && <span className="ml-3">Home</span>}
        </button>
        <button onClick={() => scrollToSection('new-releases')} className={`flex items-center p-2 rounded-md mb-2 transition-colors ${isExpanded ? 'px-4' : 'justify-center'} ${activeSection === 'new-releases' ? 'text-white bg-[#3AA5D1]' : 'text-gray-400 hover:text-white'}`}>
          <Music size={20} />
          {isExpanded && <span className="ml-3">New Releases</span>}
        </button>
        <button onClick={() => scrollToSection('recently-played')} className={`flex items-center p-2 rounded-md mb-2 transition-colors ${isExpanded ? 'px-4' : 'justify-center'} ${activeSection === 'recently-played' ? 'text-white bg-[#3AA5D1]' : 'text-gray-400 hover:text-white'}`}>
          <Clock size={20} />
          {isExpanded && <span className="ml-3">Recently Played</span>}
        </button>
        <button onClick={() => scrollToSection('weekly-top')} className={`flex items-center p-2 rounded-md mb-2 transition-colors ${isExpanded ? 'px-4' : 'justify-center'} ${activeSection === 'weekly-top' ? 'text-white bg-[#3AA5D1]' : 'text-gray-400 hover:text-white'}`}>
          <Grid size={20} />
          {isExpanded && <span className="ml-3">Weekly Top</span>}
        </button>
        <button onClick={() => scrollToSection('featured-albums')} className={`flex items-center p-2 rounded-md mb-2 transition-colors ${isExpanded ? 'px-4' : 'justify-center'} ${activeSection === 'featured-albums' ? 'text-white bg-[#3AA5D1]' : 'text-gray-400 hover:text-white'}`}>
          <Folder size={20} />
          {isExpanded && <span className="ml-3">Featured Albums</span>}
        </button>
        <button onClick={() => scrollToSection('top-genres')} className={`flex items-center p-2 rounded-md mb-2 transition-colors ${isExpanded ? 'px-4' : 'justify-center'} ${activeSection === 'top-genres' ? 'text-white bg-[#3AA5D1]' : 'text-gray-400 hover:text-white'}`}>
          <Heart size={20} />
          {isExpanded && <span className="ml-3">Top Genres</span>}
        </button>
        <div className="my-2 border-b border-gray-700" />
        <button className={`flex items-center p-2 rounded-md mb-2 transition-colors ${isExpanded ? 'px-4' : 'justify-center'} text-gray-400 hover:text-white`}>
          <Download size={20} />
          {isExpanded && <span className="ml-3">Downloads</span>}
        </button>
        <button className={`flex items-center p-2 rounded-md mb-2 transition-colors ${isExpanded ? 'px-4' : 'justify-center'} text-gray-400 hover:text-white`}>
          <Heart size={20} />
          {isExpanded && <span className="ml-3">Favorites</span>}
        </button>
        <button className={`flex items-center p-2 rounded-md mb-2 transition-colors ${isExpanded ? 'px-4' : 'justify-center'} text-gray-400 hover:text-white`}>
          <History size={20} />
          {isExpanded && <span className="ml-3">History</span>}
        </button>
      </div>
      <div className="px-2">
        <button className={`flex items-center p-2 text-gray-400 hover:text-white rounded-md mb-2 ${isExpanded ? 'px-4' : 'justify-center'}`}>
          <Settings size={20} />
          {isExpanded && <span className="ml-3">Settings</span>}
        </button>
      </div>
    </div>;
}