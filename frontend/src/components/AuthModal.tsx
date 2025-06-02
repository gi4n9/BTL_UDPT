import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { register, login } from '../../service/auth-service.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onToggleMode: () => void;
  onLoginSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, mode, onToggleMode, onLoginSuccess }: AuthModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    console.log('Submitting form, mode:', mode);
    console.log('Data sent:', { firstName, lastName, email, password, confirmPassword });
    if (mode === 'register') {
      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        setError('All fields are required');
        return;
      }
    } else if (mode === 'login') {
      if (!email || !password) {
        setError('Email and password are required');
        return;
      }
    }
    try {
      if (mode === 'register') {
        const data = await register(firstName, lastName, email, password, confirmPassword);
        console.log('Register success:', data);
        setSuccessMessage('Đăng ký thành công!');
        const timeout = setTimeout(() => {
          console.log('Running setTimeout, toggling mode');
          onToggleMode();
          setSuccessMessage('');
          setFirstName('');
          setLastName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
        }, 2000);
        return () => clearTimeout(timeout);
      } else {
        const data = await login(email, password);
        localStorage.setItem('token', data.token);
        console.log('Login success:', data);
        onClose();
        if (onLoginSuccess) onLoginSuccess(); // Gọi callback sau khi đăng nhập
      }
    } catch (error) {
      console.log('Error occurred:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Đã xảy ra lỗi không xác định');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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
        {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <input
                type="text"
                placeholder="Enter Your First Name"
                className="w-full bg-[#171A2C] rounded-md px-4 py-2 text-sm text-white"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value.trim())}
              />
              <input
                type="text"
                placeholder="Enter Your Last Name"
                className="w-full bg-[#171A2C] rounded-md px-4 py-2 text-sm text-white"
                value={lastName}
                onChange={(e) => setLastName(e.target.value.trim())}
              />
            </>
          )}
          <input
            type="email"
            placeholder="Enter Your Email"
            className="w-full bg-[#171A2C] rounded-md px-4 py-2 text-sm text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Password"
              className="w-full bg-[#171A2C] rounded-md px-4 py-2 text-sm text-white pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {mode === 'register' && (
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                className="w-full bg-[#171A2C] rounded-md px-4 py-2 text-sm text-white pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value.trim())}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          )}
          {mode === 'login' && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400">
                <input type="checkbox" className="rounded" />
                Keep Me Signed In
              </label>
              <button type="button" className="text-[#3AA5D1]">
                Forgot Password?
              </button>
            </div>
          )}
          <button type="submit" className="w-full bg-[#3AA5D1] text-white py-2 px-4 rounded-md text-sm hover:bg-[#2b8bb1]">
            {mode === 'login' ? 'Sign In' : 'Register Now'}
          </button>
          <div className="text-center text-sm text-gray-400">
            {mode === 'login' ? (
              <p>
                Don't Have An Account?{' '}
                <button type="button" onClick={onToggleMode} className="text-[#3AA5D1]">
                  Register Here
                </button>
              </p>
            ) : (
              <p>
                Already Have An Account?{' '}
                <button type="button" onClick={onToggleMode} className="text-[#3AA5D1]">
                  Login Here
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}