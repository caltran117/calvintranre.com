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
        <img 
          src="/images/Asset 4@3x.png" 
          alt="Calvin Tran RE Logo" 
          className="h-18 w-auto object-contain" 
        />
      </motion.div>
    </Link>
  );
};

export default Logo;