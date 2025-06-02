import React, { useEffect, useState } from 'react';
import {
  User,
  CreditCard,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Edit,
} from 'lucide-react';
import { getUserProfile, logout } from '../../service/auth-service';
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

const ProfilePage = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        navigate('/'); // Điều hướng về trang chủ nếu lỗi
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleSignOut = async () => {
    console.log('Attempting to sign out...');
    try {
      await logout();
      console.log('Logout successful');
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      console.log('Navigating to home page...');
      navigate('/', { replace: true }); // Sử dụng replace để thay thế lịch sử
    }
  };

  return (
    <div className="min-h-screen bg-[#171A2C] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Account Overview</h1>
          <div className="flex items-center text-gray-400">
            <User size={16} />
            <span className="ml-2">Profile</span>
          </div>
        </header>
        <div className="grid gap-6">
          {/* Profile Section */}
          <section className="bg-[#1C1F33] rounded-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold">Profile</h2>
              <button className="text-[#3AA5D1] hover:text-[#2b8bb1] flex items-center">
                <Edit size={16} className="mr-1" />
                Edit profile
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Email
                </label>
                <p className="text-white">{user?.email || 'Loading...'}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Date of birth
                </label>
                <p className="text-white">Not set</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Country or region
                </label>
                <p className="text-white">Not set</p>
              </div>
            </div>
          </section>
          {/* Plan Section */}
          <section className="bg-[#1C1F33] rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your plan</h2>
              <button className="bg-[#3AA5D1] text-white px-4 py-2 rounded-full text-sm hover:bg-[#2b8bb1]">
                Change plan
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#232842] rounded-lg">
              <div>
                <h3 className="font-semibold mb-1">Free Plan</h3>
                <p className="text-sm text-gray-400">
                  Individual plan · $0/month
                </p>
              </div>
              <CreditCard className="text-[#3AA5D1]" size={24} />
            </div>
          </section>
          {/* Settings Navigation */}
          <section className="bg-[#1C1F33] rounded-lg divide-y divide-gray-700">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Settings</h2>
            </div>
            <a
              href="#notifications"
              className="flex items-center justify-between p-6 hover:bg-[#232842] transition-colors"
            >
              <div className="flex items-center">
                <Bell size={20} className="text-gray-400" />
                <span className="ml-4">Notifications settings</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </a>
            <a
              href="#privacy"
              className="flex items-center justify-between p-6 hover:bg-[#232842] transition-colors"
            >
              <div className="flex items-center">
                <Shield size={20} className="text-gray-400" />
                <span className="ml-4">Privacy settings</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </a>
            <a
              href="#recover"
              className="flex items-center justify-between p-6 hover:bg-[#232842] transition-colors"
            >
              <div className="flex items-center">
                <CreditCard size={20} className="text-gray-400" />
                <span className="ml-4">Recover playlists</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </a>
          </section>
          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 text-gray-400 hover:text-white mt-4"
          >
            <LogOut size={20} />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;