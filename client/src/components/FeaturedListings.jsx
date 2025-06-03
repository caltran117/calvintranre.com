// FeaturedListings.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FeaturedListings = () => {
  // Sample featured listings data
  const listings = [
    {
      id: 1,
      title: "Modern Hillside Estate",
      address: "Beverly Hills, CA",
      price: "$24,900,000",
      beds: 7,
      baths: 9,
      sqft: "12,500",
      image: "/images/listing-1.jpg",
      featured: true
    },
    {
      id: 2,
      title: "Contemporary Beachfront Villa",
      address: "Malibu, CA",
      price: "$17,500,000",
      beds: 5,
      baths: 7,
      sqft: "8,200",
      image: "/images/listing-2.jpg",
      featured: true
    },
    {
      id: 3,
      title: "Architectural Masterpiece",
      address: "Hollywood Hills, CA",
      price: "$12,750,000",
      beds: 6,
      baths: 8,
      sqft: "9,800",
      image: "/images/listing-3.jpg",
      featured: false
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-light mb-4">FEATURED PROPERTIES</h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            Explore our curated selection of exceptional luxury properties in the most prestigious neighborhoods of Los Angeles.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {listings.map((listing) => (
            <motion.div 
              key={listing.id}
              variants={itemVariants}
              className="group"
            >
              <Link to={`/properties/${listing.id}`} className="block">
                <div className="relative overflow-hidden">
                  {listing.featured && (
                    <div className="absolute top-4 left-4 z-10 bg-white px-3 py-1 text-xs font-medium text-gray-900">
                      FEATURED
                    </div>
                  )}
                  <img 
                    src={listing.image} 
                    alt={listing.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  </div>
                </div>
                <div className="p-6 bg-white border border-gray-100">
                  <h3 className="text-xl font-medium mb-2">{listing.title}</h3>
                  <p className="text-gray-600 mb-2">{listing.address}</p>
                  <p className="text-gray-900 font-medium mb-4">{listing.price}</p>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>{listing.beds} Beds</span>
                    <span>{listing.baths} Baths</span>
                    <span>{listing.sqft} Sq Ft</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link 
            to="/properties" 
            className="inline-block border border-gray-900 text-gray-900 px-6 py-3 font-medium hover:bg-gray-900 hover:text-white transition-colors duration-300"
          >
            VIEW ALL PROPERTIES
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedListings;