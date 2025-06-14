// src/pages/TeamPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import TeamSection from '../components/TeamSection';
import TestimonialsSection from '../components/TestimonialsSection';
import ContactSection from '../components/ContactSection';

const TeamPage = () => {
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
            MEET THE UMANSKY TEAM
          </motion.h1>
          <motion.p
            className="max-w-2xl mx-auto text-gray-600"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Our award-winning agents are experts in LA’s luxury market and committed to delivering top-tier service, local insight, and extraordinary results.
          </motion.p>
        </div>
      </motion.section>

      <TeamSection />
      <TestimonialsSection />
      <ContactSection />
    </div>
  );
};

export default TeamPage;
