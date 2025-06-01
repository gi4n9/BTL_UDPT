import React, { useState } from 'react';
import { Search, Globe } from 'lucide-react';
import { AuthModal } from './AuthModal';

export function Header() {
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    mode: 'login' | 'register';
  }>({
    isOpen: false,
    mode: 'login'
  });

  // Hàm để chuyển đổi mode giữa 'login' và 'register'
  const toggleMode = () => {
    setAuthModal({
      ...authModal,
      mode: authModal.mode === 'login' ? 'register' : 'login'
    });
  };

  return (
    <>
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-700">
        <div className="flex items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Music Here..."
              className="py-2 px-4 pr-10 rounded-md bg-white text-gray-800 text-sm w-48"
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#3AA5D1] p-1 rounded-md">
              <Search size={16} className="text-white" />
            </button>
          </div>
          <div className="ml-6 text-sm text-gray-300">
            <span className="mr-2">Trending Songs:</span>
            <span className="text-white">
              Dream your moments, Until I Met You, Gimme
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex items-center mr-4 text-sm">
            <span>Languages</span>
            <Globe size={16} className="ml-1" />
          </div>
          <button
            className="bg-[#3AA5D1] text-white py-1 px-5 rounded-full text-sm mx-1"
            onClick={() =>
              setAuthModal({
                isOpen: true,
                mode: 'register'
              })
            }
          >
            Register
          </button>
          <button
            className="bg-[#5BCEFA] text-white py-1 px-5 rounded-full text-sm mx-1"
            onClick={() =>
              setAuthModal({
                isOpen: true,
                mode: 'login'
              })
            }
          >
            Login
          </button>
        </div>
      </header>
      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={() =>
          setAuthModal({
            ...authModal,
            isOpen: false
          })
        }
        onToggleMode={toggleMode}
      />
    </>
  );
}