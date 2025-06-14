// src/components/ProcessSection.jsx
import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    title: 'Consultation',
    description: 'We begin by understanding your needs, budget, and preferences.',
  },
  {
    title: 'Home Search',
    description: 'We curate and show you listings that match your criteria.',
  },
  {
    title: 'Make an Offer',
    description: 'Once you’ve found the right property, we help you make a competitive offer.',
  },
  {
    title: 'Close the Deal',
    description: 'We guide you through inspections, paperwork, and final closing.',
  },
];

const ProcessSection = () => {
  return (
    <section className="py-16 px-4 bg-white max-w-7xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-light text-center mb-12">
        Our Buying Process
      </h2>
      <div className="grid md:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="bg-gray-100 rounded-2xl p-6 text-center shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProcessSection;
