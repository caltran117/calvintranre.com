// HomePage.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import FeaturedListings from '../components/FeaturedListings';
import TeamSection from '../components/TeamSection';
import TestimonialsSection from '../components/TestimonialsSection';
import NewsletterSection from '../components/NewsletterSection';
import ContactSection from '../components/ContactSection';
import { locationAPI, ipLocationAPI } from '../utils/api';

const HomePage = () => {
  useEffect(() => {
    // Track user location for analytics (with user permission)
    const trackLocation = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                await locationAPI.saveLocation(
                  position.coords.latitude,
                  position.coords.longitude
                );
              } catch (error) {
                console.warn('Location tracking failed:', error);
              }
            },
            async () => {
              // Fallback to IP-based location if geolocation is denied
              try {
                const response = await ipLocationAPI.getLocation();
                if (response.data.latitude && response.data.longitude) {
                  await locationAPI.saveLocation(
                    response.data.latitude,
                    response.data.longitude
                  );
                }
              } catch (error) {
                console.warn('IP location tracking failed:', error);
              }
            },
            { timeout: 10000 }
          );
        }
      } catch (error) {
        console.warn('Location tracking setup failed:', error);
      }
    };

    trackLocation();
  }, []);

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
      <NewsletterSection />
      <ContactSection />
    </div>
  );
};

export default HomePage;