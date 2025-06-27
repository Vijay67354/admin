

  import React, { useState, useContext } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import axios from 'axios';
import { UserContext } from '../UserContext';

function Signup({ onClose, onSwitchToLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatar: '',
  });
  const [error, setError] = useState('');
  const { login } = useContext(UserContext);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.name) {
      setError('Email, password, and name are required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.name.trim().length === 0) {
      setError('Name cannot be empty');
      return false;
    }
    if (formData.avatar && !/^https?:\/\/.+\..+/.test(formData.avatar)) {
      setError('Avatar must be a valid URL');
      return false;
    }
    return true;
  };
const SIGNUP_URL = import.meta.env.VITE_JOB_API_URL_SIGNUP;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(SIGNUP_URL, {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        avatar: formData.avatar,
      });

      if (response.data.user) {
        login(response.data.user); // Log in the user immediately after signup
        onSwitchToLogin(); // Switch to login form (optional, can redirect to profile)
        onClose(); // Close the modal
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.error || 'Failed to sign up. Please try again.');
    }
  };

  const handleGoogleSignup = () => {
    console.log('Google signup clicked');
    // Implement Google OAuth logic here
  };

  return (
    <div className="h-full bg-white flex flex-col p-4">
      <div className="bg-white w-full max-w-md h-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
        <div className="pt-6 px-6 items-center flex gap-5">
          <h1 className="text-2xl font-bold text-[#1f8268] mb-2">Sign Up</h1>
          <button
            onClick={onSwitchToLogin}
            className="text-[#1f8268] hover:text-blue-700 -mt-1 text-xl font-bold transition-colors"
          >
            Login
          </button>
        </div>
        {error && (
          <div className="mt-4 mx-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-6 px-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email ID
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture URL (Optional)
            </label>
            <input
              type="text"
              name="avatar"
              value={formData.avatar}
              onChange={handleInputChange}
              placeholder="Enter a URL for your profile picture"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#1f8268] hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign Up
          </button>
        </form>
        <div className="relative my-6 px-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or</span>
          </div>
        </div>
        <div className="pt-1 text-center px-6">
          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.20-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </button>
        </div>
        <div className="pt-4 text-center px-6">
          <button
            onClick={onSwitchToLogin}
            className="text-[#1f8268] hover:text-blue-700 font-medium transition-colors"
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;