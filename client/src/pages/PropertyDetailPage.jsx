import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { propertyAPI } from '../utils/api';
import ImageGallery from '../components/PropertyDetail/ImageGallery';
import PropertyInfo from '../components/PropertyDetail/PropertyInfo';
import PropertyFeatures from '../components/PropertyDetail/PropertyFeatures';
import ContactAgent from '../components/PropertyDetail/ContactAgent';
import SimilarProperties from '../components/PropertyDetail/SimilarProperties';
import LoadingSpinner from '../components/Property/LoadingSpinner';

const PropertyDetailPage = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const [propertyResponse, similarResponse] = await Promise.all([
          propertyAPI.getPropertyById(propertyId),
          propertyAPI.getSimilarProperties(propertyId, 4)
        ]);

        setProperty(propertyResponse.data.data);
        setSimilarProperties(similarResponse.data.data?.properties || []);
        setError(null);
      } catch (err) {
        setError('Failed to load property details');
        console.error('Error fetching property:', err);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchPropertyDetails();
    }
  }, [propertyId]);

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(2)}M`;
    }
    return `$${price.toLocaleString()}`;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light mb-4 text-gray-800">Property Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/properties')}
            className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const price = property.status === 'For Rent' 
    ? property.pricing?.rentPrice?.monthly
    : property.pricing?.salesPrice;

  return (
    <div className="min-h-screen mb-12 bg-white">
      <motion.div
        className="pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <button
              onClick={() => navigate('/properties')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Properties
            </button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <ImageGallery images={property.images} title={property.title} />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-light mb-2 text-gray-900">
                        {property.title}
                      </h1>
                      <p className="text-gray-600">
                        {property.location?.address?.street}, {property.location?.address?.city}, {property.location?.address?.state} {property.location?.address?.zipCode}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl md:text-3xl font-light text-gray-900">
                        {price ? formatPrice(price) : 'Price on Request'}
                        {property.status === 'For Rent' && <span className="text-lg text-gray-500">/month</span>}
                      </div>
                      {property.pricing?.pricePerSqft && (
                        <div className="text-sm text-gray-500 mt-1">
                          ${property.pricing.pricePerSqft}/sqft
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-gray-600">
                    {property.basicInfo?.beds && (
                      <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        </svg>
                        {property.basicInfo.beds} Bedrooms
                      </span>
                    )}
                    {property.basicInfo?.baths && (
                      <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11" />
                        </svg>
                        {property.basicInfo.baths} Bathrooms
                      </span>
                    )}
                    {property.basicInfo?.sqft && (
                      <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        {property.basicInfo.sqft.toLocaleString()} Sqft
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <PropertyInfo property={property} />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <PropertyFeatures property={property} />
              </motion.div>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                className="sticky top-24"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <ContactAgent property={property} />
              </motion.div>
            </div>
          </div>

          {similarProperties.length > 0 && (
            <motion.div
              className="mt-16 pb-16"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <SimilarProperties properties={similarProperties} />
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PropertyDetailPage;