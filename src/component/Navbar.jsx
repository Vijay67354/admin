
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isJobsDropdownOpen, setIsJobsDropdownOpen] = useState(false);
  const [isResumeDropdownOpen, setIsResumeDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(null);
  const signinRef = useRef(null);
  const loginButtonRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Load user from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Save user to local storage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    }
  }, [user]);

  // Handle outside click and Escape key for modals and profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (signinRef.current && !signinRef.current.contains(event.target)) {
        setShowLogin(false);
        setShowSignup(false);
        loginButtonRef.current?.focus();
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setShowLogin(false);
        setShowSignup(false);
        setIsProfileDropdownOpen(false);
        loginButtonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    if (userData.token) {
      localStorage.setItem('authToken', userData.token);
    }
    setShowLogin(false);
    loginButtonRef.current?.focus();
    navigate('/dashboard', { replace: true }); // Ensure navigation in parent
  };

  const handleSignupSuccess = (userData) => {
    setUser(userData);
    if (userData.token) {
      localStorage.setItem('authToken', userData.token);
    }
    setShowSignup(false);
    loginButtonRef.current?.focus();
    navigate('/dashboard', { replace: true }); // Ensure navigation in parent
  };

  const handleLogout = () => {
    setUser(null);
    setShowLogin(false);
    setShowSignup(false);
    setIsProfileDropdownOpen(false);
    closeMobileMenu();
    navigate('/', { replace: true });
  };

  return (
    <nav className="border-b border-gray-200 py-6 relative z-50">
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/">
            <div className="flex-shrink-0 flex items-center">
              <img src="/images/logo.png" className="w-92 h-92 -ml-16" alt="Logo" />
              <div className="ml-1 w-8 h-1 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-baseline space-x-4">
         
          </div>
       <div>
  <Link
    to="/candidatelogin"
    className="text-[#1f8268] lg:block none ml-[500px] text-lg font-medium hover:underline active:text-green-600 active:font-bold"
  >
    Employer Login
  </Link>
</div>

          {/* Profile and Login - Desktop */}
          <div className="hidden md:flex items-center space-x-4 relative">
            {user ? (
              <div ref={profileDropdownRef} className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center space-x-2 focus:outline-none"
                  aria-expanded={isProfileDropdownOpen}
                  aria-label="Toggle profile dropdown"
                >
                  <img
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500 cursor-pointer"
                    src={
                      user.avatar
                        ? user.avatar
                        : 'https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D'
                    }
                    alt="Profile"
                  />
                  <span className="text-gray-800 text-lg font-medium">{user.name}</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                    >
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          View Profile
                        </Link>
                        <Link
                          to="/resume"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          Upload Resume
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
     
                <button
                  ref={loginButtonRef}
                  onClick={() => setShowLogin(true)}
                  className="bg-[#1f8268] text-white font-medium lg:py-2 py-1 lg:px-6 px-10 rounded-lg hover:bg-teal-700 transition-colors duration-200"
                >
                  Candidate Login
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-50 border-t border-gray-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {user ? (
                <div className="flex items-center px-3 py-3 border-b border-gray-200">
                  <img
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500"
                    src={user.avatar}
                    alt="Profile"
                    onError={(e) => (e.target.src = '/default-avatar.png')}
                  />
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-auto bg-red-600 text-white font-medium py-1 px-3 rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center px-3 py-3 border-b border-gray-200 space-x-2">
                  <button
                    onClick={() => {
                      setShowLogin(true);
                      closeMobileMenu();
                    }}
                    className="bg-teal-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-teal-700 transition-colors duration-200"
                  >
                    Candidate Login
                  </button>
                  <Link
                      to="/candidatelogin"
                    className="text-teal-600  font-medium py-2 px-6 hover:underline"
                    onClick={closeMobileMenu}
                  >
                    Employer Login
                  </Link>
                </div>
              )}
           
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for Dropdowns */}
      {(isJobsDropdownOpen || isResumeDropdownOpen || isProfileDropdownOpen) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setIsJobsDropdownOpen(false);
            setIsResumeDropdownOpen(false);
            setIsProfileDropdownOpen(false);
          }}
        />
      )}

      {/* Sign-in/Sign-up Modal */}
      <AnimatePresence>
        {(showLogin || showSignup) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
            <motion.div
              ref={signinRef}
              className="bg-white w-full max-w-md h-full shadow-2xl"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'tween', duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {showLogin && (
                <Signin
                  onClose={() => setShowLogin(false)}
                  onLoginSuccess={handleLoginSuccess}
                  onSwitchToSignup={() => {
                    setShowLogin(false);
                    setShowSignup(true);
                  }}
                />
              )}
              {showSignup && (
                <Signup
                  onClose={() => setShowSignup(false)}
                  onSignupSuccess={handleSignupSuccess}
                  onSwitchToLogin={() => {
                    setShowSignup(false);
                    setShowLogin(true);
                  }}
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
