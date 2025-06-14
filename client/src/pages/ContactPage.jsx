// src/pages/ContactPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import ContactSection from '../components/ContactSection';

const ContactPage = () => {
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
            GET IN TOUCH
          </motion.h1>
          <motion.p
            className="max-w-2xl mx-auto text-gray-600"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Whether you're buying, selling, or just have questions — we're here to help. Reach out anytime.
          </motion.p>
        </div>
      </motion.section>

      {/* <section className="py-16 px-4 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        
        <motion.div
          className="bg-white p-8 rounded-2xl shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Send Us a Message</h2>
          <form className="grid gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="border border-gray-300 p-3 rounded-lg"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="border border-gray-300 p-3 rounded-lg"
            />
            <input
              type="text"
              placeholder="Subject"
              className="border border-gray-300 p-3 rounded-lg"
            />
            <textarea
              placeholder="Your Message"
              className="border border-gray-300 p-3 rounded-lg h-32"
            ></textarea>
            <button
              type="submit"
              className="bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Submit
            </button>
          </form>
        </motion.div>
        <motion.div
          className="text-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h3 className="text-2xl font-semibold mb-6">Contact Details</h3>
          <p className="mb-4">
            <strong>Office Address:</strong><br />
            123 Luxury Blvd, Beverly Hills, CA 90210
          </p>
          <p className="mb-4">
            <strong>Phone:</strong><br />
            <a href="tel:+1234567890" className="text-blue-600 hover:underline">(123) 456-7890</a>
          </p>
          <p className="mb-4">
            <strong>Email:</strong><br />
            <a href="mailto:info@umanskyteam.com" className="text-blue-600 hover:underline">info@umanskyteam.com</a>
          </p>
          <p>
            <strong>Business Hours:</strong><br />
            Monday - Friday: 9 AM - 6 PM<br />
            Saturday: 10 AM - 4 PM
          </p>
        </motion.div>
      </section> */}

      <ContactSection />
    </div>
  );
};

export default ContactPage;
