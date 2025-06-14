// src/components/BuyListings.jsx
import React from 'react';
import { motion } from 'framer-motion';

const listings = [
  {
    id: 1,
    title: 'Modern Beverly Hills Estate',
    image: '/images/listing1.jpg',
    price: '$6,500,000',
  },
  {
    id: 2,
    title: 'Chic Downtown LA Condo',
    image: '/images/listing2.jpg',
    price: '$1,200,000',
  },
  {
    id: 3,
    title: 'Santa Monica Beach House',
    image: '/images/listing3.jpg',
    price: '$3,800,000',
  },
];

const BuyListings = () => {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-light text-center mb-12">
        Featured Homes for Sale
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {listings.map((listing, index) => (
          <motion.div
            key={listing.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
          >
            <img
              src={listing.image}
              alt={listing.title}
              className="w-full h-60 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{listing.title}</h3>
              <p className="text-gray-500">{listing.price}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BuyListings;
