// Navbar.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HamburgerMenu from './HamburgerMenu';
import Logo from './Logo';
import SigninModal from './SigninModal';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigninModalOpen, setIsSigninModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, isAuthenticated, signin, signout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSigninSuccess = (userData) => {
    signin(userData);
  };

  const handleSignout = () => {
    signout();
    setIsProfileDropdownOpen(false);
  };

  return (
    <motion.nav 
      className="fixed w-full z-50 bg-white bg-opacity-95"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <Logo />
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-gray-800 hover:text-gray-600 px-3 py-2 text-sm font-medium">
                HOME
              </Link>
              <Link to="/buy" className="text-gray-800 hover:text-gray-600 px-3 py-2 text-sm font-medium">
                BUY
              </Link>
              <Link to="/sell" className="text-gray-800 hover:text-gray-600 px-3 py-2 text-sm font-medium">
                SELL
              </Link>
              <Link to="/team" className="text-gray-800 hover:text-gray-600 px-3 py-2 text-sm font-medium">
                TEAM
              </Link>
              {/* <Link to="/press" className="text-gray-800 hover:text-gray-600 px-3 py-2 text-sm font-medium">
                PRESS
              </Link> */}
              <Link to="/contact" className="text-gray-800 hover:text-gray-600 px-3 py-2 text-sm font-medium">
                CONTACT
              </Link>
              <Link to="/newsletter" className="border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white px-4 py-2 text-sm font-medium transition-colors duration-300">
                SUBSCRIBE
              </Link>
              
              {/* Authentication Section */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-3 text-gray-800 hover:text-gray-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md">
                      {user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-800">{user?.email?.split('@')[0]}</p>
                      <p className="text-xs text-gray-500 uppercase">{user?.role}</p>
                    </div>
                    <svg className="h-4 w-4 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ transform: isProfileDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Enhanced Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 overflow-hidden">
                      {/* User Info Header */}
                      <div className="px-4 py-4 border-b border-gray-100 bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center text-white font-medium">
                            {user?.email?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{user?.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                user?.role === 'admin' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {user?.role?.toUpperCase()}
                              </span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                user?.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {user?.isActive ? 'ACTIVE' : 'INACTIVE'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Quick Stats */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <p className="text-lg font-semibold text-gray-900">{user?.favProperty?.length || 0}</p>
                            <p className="text-xs text-gray-500">FAVORITES</p>
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-gray-900">
                              {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                            </p>
                            <p className="text-xs text-gray-500">LAST LOGIN</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <svg className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          View Full Profile
                        </Link>
                        
                        <button
                          onClick={handleSignout}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <svg className="h-5 w-5 mr-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsSigninModalOpen(true)}
                  className="border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white px-4 py-2 text-sm font-medium transition-colors duration-300"
                >
                  SIGN IN
                </button>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-gray-600 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && (
        <HamburgerMenu isOpen={isOpen} toggleMenu={toggleMenu} />
      )}
      
      {/* Signin Modal */}
      <SigninModal
        isOpen={isSigninModalOpen}
        onClose={() => setIsSigninModalOpen(false)}
        onSigninSuccess={handleSigninSuccess}
      />
    </motion.nav>
  );
};

export default Navbar;