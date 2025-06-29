// HeroSection.jsx
import React, { use } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div className="relative h-screen">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: "url('/images/luxury-real-estate.jpg')",
          filter: "brightness(0.8)"
        }}
      ></div>
      
      {/* Content Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>
      
      {/* Text Content */}
      <div className="relative z-20 h-full flex flex-col justify-center items-start px-6 md:px-16 max-w-7xl mx-auto">
        <motion.h1 
          className="text-white text-4xl md:text-7xl font-light mb-6 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          REAL ESTATE WITH
          <br />
          REAL EXPERIENCE
        </motion.h1>
        
        <motion.p 
          className="text-white text-lg md:text-xl max-w-2xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          The Umansky Team is known as one of LA's leading real estate teams and one of the most successful in the country.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <button
          onClick={() => navigate('/properties')}
          className="bg-white text-gray-900 px-8 py-3 font-medium hover:bg-opacity-90 transition-all duration-300">
            EXPLORE PROPERTIES
          </button>
        </motion.div>
      </div>
      
      {/* Scroll Down Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="flex flex-col items-center">
          <span className="text-white text-sm mb-2">SCROLL DOWN</span>
          <svg 
            className="w-6 h-6 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            ></path>
          </svg>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;