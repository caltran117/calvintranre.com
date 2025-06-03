// Logo.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/">
      <motion.div 
        className="flex items-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="h-12 w-12 bg-red-600 flex items-center justify-center mr-2">
          <svg 
            className="h-6 w-6 text-white" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          </svg>
        </div>
        <div className="text-gray-800">
          <div className="text-xs">THE</div>
          <div className="text-sm font-bold -mt-1">UMANSKY</div>
          <div className="text-sm font-bold -mt-1">TEAM</div>
        </div>
      </motion.div>
    </Link>
  );
};

export default Logo;