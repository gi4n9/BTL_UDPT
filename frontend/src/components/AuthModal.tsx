import React from 'react';
import { X } from 'lucide-react';
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
}
export function AuthModal({
  isOpen,
  onClose,
  mode
}: AuthModalProps) {
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1C1F33] rounded-lg p-8 w-[500px] relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-white">
          <X size={20} />
        </button>
        <div className="flex items-center gap-6 mb-6">
          <div className="w-32 h-32">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="40" fill="#3AA5D1" />
              <path d="M65 50a15 15 0 11-30 0 15 15 0 0130 0z" fill="#FFB4B4" />
              <rect x="45" y="35" width="10" height="30" rx="5" fill="#FFB4B4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">
            {mode === 'login' ? 'Login / Sign In' : 'Register / Sign Up'}
          </h2>
        </div>
        <form className="space-y-4">
          {mode === 'register' && <input type="text" placeholder="Enter Your Name" className="w-full bg-[#171A2C] rounded-md px-4 py-2 text-sm text-white" />}
          <input type="email" placeholder="Enter Your Email" className="w-full bg-[#171A2C] rounded-md px-4 py-2 text-sm text-white" />
          <input type="password" placeholder="Enter Password" className="w-full bg-[#171A2C] rounded-md px-4 py-2 text-sm text-white" />
          {mode === 'register' && <input type="password" placeholder="Confirm Password" className="w-full bg-[#171A2C] rounded-md px-4 py-2 text-sm text-white" />}
          {mode === 'login' && <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400">
                <input type="checkbox" className="rounded" />
                Keep Me Signed In
              </label>
              <button type="button" className="text-[#3AA5D1]">
                Forgot Password?
              </button>
            </div>}
          <button type="submit" className="w-full bg-[#3AA5D1] text-white py-2 px-4 rounded-md text-sm hover:bg-[#2b8bb1]">
            {mode === 'login' ? 'Sign In' : 'Register Now'}
          </button>
          <div className="text-center text-sm text-gray-400">
            {mode === 'login' ? <p>Don't Have An Account? Register Here</p> : <p>Already Have An Account? Login Here</p>}
          </div>
        </form>
      </div>
    </div>;
}