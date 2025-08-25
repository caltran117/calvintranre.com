import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { propertyAPI } from '../utils/api';

const FeaturedListings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true);
        const response = await propertyAPI.getFeaturedProperties(6);
        const featuredProperties = response.data.data || response.data || [];
        setProperties(featuredProperties);
        setError(null);
      } catch (err) {
        setError('Failed to load featured properties');
        console.error('Error fetching featured properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  useEffect(() => {
    if (properties.length === 0) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(properties.length / 3));
    }, 6000);

    return () => clearInterval(interval);
  }, [properties.length]);

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    }
    return `$${price.toLocaleString()}`;
  };

  const handleDotClick = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handleNavigation = (newDirection) => {
    setDirection(newDirection);
    if (newDirection === 1) {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(properties.length / 3));
    } else {
      setCurrentIndex((prev) => (prev - 1 + Math.ceil(properties.length / 3)) % Math.ceil(properties.length / 3));
    }
  };

  const getVisibleProperties = () => {
    const propertiesPerPage = 3;
    const startIndex = currentIndex * propertiesPerPage;
    return properties.slice(startIndex, startIndex + propertiesPerPage);
  };

  const totalPages = Math.ceil(properties.length / 3);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light mb-4">FEATURED PROPERTIES</h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Explore our curated selection of exceptional luxury properties in the most prestigious neighborhoods.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-gray-200 mb-4"></div>
                <div className="p-6 bg-white border border-gray-100">
                  <div className="h-6 bg-gray-200 mb-2"></div>
                  <div className="h-4 bg-gray-200 mb-2"></div>
                  <div className="h-6 bg-gray-200 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 w-16"></div>
                    <div className="h-4 bg-gray-200 w-16"></div>
                    <div className="h-4 bg-gray-200 w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || properties.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-light mb-4">FEATURED PROPERTIES</h2>
            <p className="text-gray-600 mb-8">
              {error || 'No featured properties available at the moment.'}
            </p>
            <Link 
              to="/properties" 
              className="inline-block border border-gray-900 text-gray-900 px-6 py-3 font-medium hover:bg-gray-900 hover:text-white transition-colors duration-300"
            >
              VIEW ALL PROPERTIES
            </Link>
          </div>
        </div>
      </section>
    );
  }

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
            Explore our curated selection of exceptional luxury properties in the most prestigious neighborhoods.
          </p>
        </motion.div>

        <div className="relative">
          {properties.length > 3 && (
            <>
              <button
                onClick={() => handleNavigation(-1)}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg p-3 hover:bg-gray-50 transition-colors duration-200"
                style={{ marginLeft: '-20px' }}
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => handleNavigation(1)}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg p-3 hover:bg-gray-50 transition-colors duration-200"
                style={{ marginRight: '-20px' }}
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div className="overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {getVisibleProperties().map((property, index) => {
                  const primaryImage = property.images?.find(img => img.isPrimary) || property.images?.[0];
                  const imageUrl = primaryImage?.url || '/images/placeholder-property.jpg';
                  
                  const price = property.status === 'For Rent' 
                    ? property.pricing?.rentPrice?.monthly
                    : property.pricing?.salesPrice;

                  return (
                    <motion.div 
                      key={property._id}
                      variants={itemVariants}
                      className="group"
                    >
                      <Link to={`/properties/${property._id}`} className="block">
                        <div className="relative overflow-hidden">
                          {property.listing?.featured && (
                            <div className="absolute top-4 left-4 z-10 bg-white px-3 py-1 text-xs font-medium text-gray-900">
                              FEATURED
                            </div>
                          )}
                          <div className="absolute top-4 right-4 z-10 bg-white bg-opacity-90 px-3 py-1 text-xs font-light">
                            {property.status}
                          </div>
                          <img 
                            src={imageUrl}
                            alt={property.title}
                            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="p-6 bg-white border border-gray-100">
                          <h3 className="text-xl font-light mb-2 group-hover:text-gray-700 transition-colors line-clamp-2">
                            {property.title}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            {property.location?.address?.city}, {property.location?.address?.state}
                          </p>
                          <p className="text-gray-900 font-light text-xl mb-4">
                            {price ? formatPrice(price) : 'Price on Request'}
                            {property.status === 'For Rent' && <span className="text-sm text-gray-500">/month</span>}
                          </p>
                          <div className="flex justify-between text-gray-600 text-sm">
                            {property.basicInfo?.beds && <span>{property.basicInfo.beds} Beds</span>}
                            {property.basicInfo?.baths && <span>{property.basicInfo.baths} Baths</span>}
                            {property.basicInfo?.sqft && <span>{property.basicInfo.sqft.toLocaleString()} Sq Ft</span>}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`h-2 w-2 rounded-full transition-colors duration-200 ${
                    currentIndex === index ? 'bg-gray-900' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to property group ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

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