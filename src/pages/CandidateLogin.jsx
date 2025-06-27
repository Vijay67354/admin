

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CandidateLogin = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(import.meta.env.VITE_LOGIN_API_URL_ONE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setError(data.message || 'Invalid email or password');
        } else {
          setError('Server returned an unexpected response');
        }
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      console.log('Login response:', data);

      // Generate dynamic token with timestamp
      const dynamicToken = `${data.token}.${Date.now()}`;

      localStorage.setItem('userData', JSON.stringify({
        _id: data._id,
        name: data.name || email.split('@')[0],
        email: data.email,
        token: dynamicToken,
      }));

      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess({
          _id: data._id,
          name: data.name || email.split('@')[0],
          email: data.email,
          token: dynamicToken,
        });
      }

      console.log('Redirecting to /dashboard');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (typeof onClose === 'function') {
      onClose();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col w-full max-w-2xl bg-white p-6 sm:p-8 rounded-lg shadow-lg">
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close login modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center flex-grow"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Candidate Login</h2>
          
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-10"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                  disabled={isLoading}
                >
                  {showPassword ? <X className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-600 text-sm">
                {error}
              </motion.p>
            )}
            
            <button
              type="submit"
              className={`w-full bg-[#1f8268] text-white font-medium py-2 px-6 rounded-lg hover:bg-teal-700 transition-colors duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-4 w-92 tracking-wider text-center p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
            <strong>Admin Login Credential:</strong><br />
            Email: admin@example.com<br />
            Password: Demo@12345
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CandidateLogin;