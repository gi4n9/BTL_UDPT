import React, { useState, useEffect } from 'react';
import { Search, Globe, User, LogOut } from 'lucide-react';
import { AuthModal } from './AuthModal.tsx';
import { getUserProfile, logout } from '../../service/auth-service.ts';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: 'VERIFY' | 'ACTIVE' | 'BLOCKED';
  profile_image?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export function Header() {
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    mode: 'login' | 'register';
  }>({
    isOpen: false,
    mode: 'login'
  });
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMode = () => {
    setAuthModal({
      ...authModal,
      mode: authModal.mode === 'login' ? 'register' : 'login'
    });
  };

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = await getUserProfile();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
      }
    } else {
      setUser(null);
      navigate('/');
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [navigate]);

  const handleLogout = async () => {
    console.log('Attempting to sign out...');
    try {
      await logout();
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      console.log('Navigating to home page...');
      setUser(null);
      setIsDropdownOpen(false);
      navigate('/', { replace: true });
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleUpgradeClick = () => {
    navigate("/upgrade");
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
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center focus:outline-none"
              >
                {user.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#3AA5D1] flex items-center justify-center text-white">
                    {user.first_name.charAt(0)}
                  </div>
                )}
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1C1F33] rounded-md shadow-lg z-10">
                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#2b8bb1] hover:text-white flex items-center gap-2"
                  >
                    <User size={16} />
                    Thông tin cá nhân
                  </button>
                  <button
                    onClick={handleUpgradeClick}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#2b8bb1] hover:text-white flex items-center gap-2"
                  >
                    <User size={16} />
                    Nâng cấp tài khoản
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#2b8bb1] hover:text-white flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </header>
      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        onToggleMode={toggleMode}
        onLoginSuccess={fetchUserProfile}
      />
    </>
  );
}