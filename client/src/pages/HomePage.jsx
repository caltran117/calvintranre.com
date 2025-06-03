// HomePage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import FeaturedListings from '../components/FeaturedListings';
import TeamSection from '../components/TeamSection';
import TestimonialsSection from '../components/TestimonialsSection';
import ContactSection from '../components/ContactSection';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      
      <motion.section
        className="py-16 px-4 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-light mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            LUXURY REAL ESTATE EXPERTS
          </motion.h2>
          <motion.p 
            className="max-w-2xl mx-auto text-gray-600"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            The Umansky Team is known as one of LA's leading real estate teams and one of the most successful in the country. With unparalleled expertise in luxury properties, we provide exceptional service and results for our clients.
          </motion.p>
        </div>
      </motion.section>
      
      <FeaturedListings />
      <TeamSection />
      <TestimonialsSection />
      <ContactSection />
    </div>
  );
};

export default HomePage;