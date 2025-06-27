
import React, { useState, useContext } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function Signin({ onClose, onSwitchToSignup }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
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
    return true;
  };
const GOOGLE_LOGIN_API = import.meta.env.VITE_GOOGLE_LOGIN_API;
const API_URL_LOGIN = import.meta.env.VITE_JOB_API_URL_LOGIN;
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!validateForm()) return;

    try {
      const response = await axios.post(API_URL_LOGIN, {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.user) {
        login(response.data.user);
        onClose(); // Close the modal
        navigate('/profile');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      console.log('Google login response:', credentialResponse); // Debug log

      // Decode the Google OAuth token
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('Decoded token:', decoded); // Debug log

      const userData = {
        email: decoded.email,
        name: decoded.name,
        googleId: decoded.sub,
        picture: decoded.picture,
      };

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('User data stored in localStorage:', userData); // Debug log

      // Optionally, send user data to your backend for verification or storage
      try {
        const response = await axios.post(GOOGLE_LOGIN_API, {
          email: userData.email,
          googleId: userData.googleId,
          name: userData.name,
          picture: userData.picture,
        });
        console.log('Backend response:', response.data); // Debug log

        if (response.data.user) {
          login(response.data.user); // Update UserContext with user data
        }
      } catch (backendError) {
        console.error('Backend request failed:', backendError); // Debug log
        // If backend fails, proceed with client-side data anyway
      }

      // Close the modal and navigate to dashboard
      onClose();
      navigate('/dashboard');
    } catch (err) {
      console.error('Google login error:', err);
      setError('Google login failed. Please try again.');
    }
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
          <h1 className="text-2xl font-bold text-[#1f8268] mb-2">Login</h1>
          <button
            onClick={onSwitchToSignup}
            className="text-[#1f8268] hover:text-blue-700 -mt-1 text-xl font-bold transition-colors"
          >
            Sign Up
          </button>
        </div>
        {error && (
          <div className="mt-4 mx-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-6 px-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email ID</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your active Email ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
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
          <button
            type="submit"
            className="w-full bg-[#1f8268] hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Login
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
        <div className="px-6 pb-6">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              console.error('Google login onError triggered'); // Debug log
              setError('Google login failed. Please try again.');
            }}
            theme="filled_blue"
            shape="rectangular"
            width="100%"
            text="signin_with"
            // Removed useOneTap to avoid conflicts
          />
        </div>
      </div>
    </div>
  );
}

export default Signin;