// BuyPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import ProcessSection from '../components/ProcessSection';
import TestimonialsSection from '../components/TestimonialsSection';
import ContactSection from '../components/ContactSection';
import FeaturedListings from '../components/FeaturedListings';

const BuyPage = () => {
  return (
    <div className="min-h-screen">
      <motion.section
        className="py-24 px-4 bg-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-light mb-6"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            FIND YOUR DREAM HOME
          </motion.h1>
          <motion.p
            className="max-w-2xl mx-auto text-gray-600"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Whether you're looking for a modern condo or a luxurious estate, our curated selection of properties and personalized service will help you make the right move.
          </motion.p>
        </div>
      </motion.section>

      <FeaturedListings />

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
            A SEAMLESS BUYING EXPERIENCE
          </motion.h2>
          <motion.p
            className="max-w-2xl mx-auto text-gray-600"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Our team will guide you every step of the way—from browsing listings to closing the deal—ensuring a stress-free buying journey.
          </motion.p>
        </div>
      </motion.section>

      <ProcessSection />
      <TestimonialsSection />
      <ContactSection />
    </div>
  );
};

export default BuyPage;
