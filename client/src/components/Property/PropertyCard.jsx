import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/properties/${property._id}`);
  };
  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    }
    return `$${price.toLocaleString()}`;
  };

  const primaryImage = property.images?.find(img => img.isPrimary) || property.images?.[0];
  const imageUrl = primaryImage?.url || '/images/placeholder-property.jpg';

  const price = property.status === 'For Rent' 
    ? property.pricing?.rentPrice?.monthly
    : property.pricing?.salesPrice;

  return (
    <motion.div
      className="bg-white shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
      whileHover={{ y: -5 }}
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={property.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {property.listing?.featured && (
          <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-sm font-light">
            FEATURED
          </div>
        )}
        
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 text-sm font-light">
          {property.status}
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-light mb-2 group-hover:text-gray-700 transition-colors">
            {property.title}
          </h3>
          <p className="text-gray-600 text-sm">
            {property.location?.address?.street}, {property.location?.address?.city}, {property.location?.address?.state}
          </p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-light">
            {price ? formatPrice(price) : 'Price on Request'}
            {property.status === 'For Rent' && <span className="text-sm text-gray-500">/month</span>}
          </div>
          {property.pricing?.pricePerSqft && (
            <div className="text-sm text-gray-500">
              ${property.pricing.pricePerSqft}/sqft
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-4">
          <div className="flex items-center space-x-4">
            {property.basicInfo?.beds && (
              <span>{property.basicInfo.beds} Beds</span>
            )}
            {property.basicInfo?.baths && (
              <span>{property.basicInfo.baths} Baths</span>
            )}
            {property.basicInfo?.sqft && (
              <span>{property.basicInfo.sqft.toLocaleString()} Sqft</span>
            )}
          </div>
        </div>

        {property.areaAndLot?.propertyType && (
          <div className="mt-2 text-xs text-gray-500 uppercase tracking-wide">
            {property.areaAndLot.propertyType}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PropertyCard;