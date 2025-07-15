import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { newsletterAPI } from '../utils/api';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await newsletterAPI.subscribe(email, true);
      setSubmitStatus('success');
      setEmail('');
    } catch (error) {
      setSubmitStatus('error');
      console.error('Newsletter subscription failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-light mb-4">STAY INFORMED</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Get exclusive access to new listings, market insights, and luxury real estate trends. 
            Join our newsletter and never miss an opportunity.
          </p>

          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-900 border border-green-700 rounded text-green-100"
            >
              <p>Thank you for subscribing! You'll receive our latest updates soon.</p>
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-900 border border-red-700 rounded text-red-100"
            >
              <p>Sorry, there was an error. Please try again.</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 bg-white text-black rounded focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-white text-black font-medium rounded hover:bg-gray-100 disabled:bg-gray-400 transition-colors duration-300"
            >
              {isSubmitting ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
            </motion.button>
          </form>

          <p className="text-gray-400 text-sm mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;