import React from 'react';
import { CreditCard, LogOut } from 'lucide-react';
import { logout } from '../../service/auth-service';
import { useNavigate } from 'react-router-dom';

const UpgradePage = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    console.log('Attempting to sign out...');
    try {
      await logout();
      console.log('Logout successful');
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      console.log('Navigating to home page...');
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#171A2C] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Nâng cấp tài khoản</h1>
          <div className="flex items-center text-gray-400">
            <CreditCard size={16} />
            <span className="ml-2">Upgrade Plan</span>
          </div>
        </header>
        <div className="grid gap-6">
          {/* Plan Options (Placeholder) */}
          <section className="bg-[#1C1F33] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Choose Your Plan</h2>
            <div className="flex items-center justify-between p-4 bg-[#232842] rounded-lg">
              <div>
                <h3 className="font-semibold mb-1">Premium Plan</h3>
                <p className="text-sm text-gray-400">
                  Individual plan · $9.99/month
                </p>
              </div>
              <button className="bg-[#3AA5D1] text-white px-4 py-2 rounded-full text-sm hover:bg-[#2b8bb1]">
                Select Plan
              </button>
            </div>
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

export default UpgradePage;