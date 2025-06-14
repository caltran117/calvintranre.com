// src/components/SellFormSection.jsx
import React from 'react';
import { motion } from 'framer-motion';

const SellFormSection = () => {
  return (
    <section className="py-16 px-4 max-w-3xl mx-auto">
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Request a Free Home Valuation</h2>
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
            placeholder="Property Address"
            className="border border-gray-300 p-3 rounded-lg"
          />
          <textarea
            placeholder="Additional Details"
            className="border border-gray-300 p-3 rounded-lg h-28"
          ></textarea>
          <button
            type="submit"
            className="bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Submit Request
          </button>
        </form>
      </motion.div>
    </section>
  );
};

export default SellFormSection;
