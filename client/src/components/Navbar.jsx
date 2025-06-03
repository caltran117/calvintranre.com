// Navbar.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HamburgerMenu from './HamburgerMenu';
import Logo from './Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
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
              <Link to="/press" className="text-gray-800 hover:text-gray-600 px-3 py-2 text-sm font-medium">
                PRESS
              </Link>
              <Link to="/contact" className="text-gray-800 hover:text-gray-600 px-3 py-2 text-sm font-medium">
                CONTACT
              </Link>
              <Link to="/subscribe" className="border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white px-4 py-2 text-sm font-medium transition-colors duration-300">
                SUBSCRIBE
              </Link>
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
    </motion.nav>
  );
};

export default Navbar;