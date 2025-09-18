import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';

const SimilarProperties = ({ properties }) => {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    }
    return `$${price.toLocaleString()}`;
  };

  const handleToggleFavorite = async (e, property) => {
    e.stopPropagation(); // Prevent card click navigation
    
    if (!isAuthenticated) {
      alert('Please sign in to add favorites');
      return;
    }

    try {
      const propertyId = property._id;
      const propertyType = 'database';
      const propertyData = {
        _id: property._id,
        title: property.title,
        pricing: property.pricing,
        location: property.location,
        basicInfo: property.basicInfo,
        images: property.images,
        status: property.status,
        listing: property.listing,
        areaAndLot: property.areaAndLot
      };

      await toggleFavorite(propertyId, propertyType, propertyData);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorite. Please try again.');
    }
  };

  if (!properties || properties.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-light mb-8 text-gray-900">Similar Properties</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {properties.map((property, index) => {
          const primaryImage = property.images?.find(img => img.isPrimary) || property.images?.[0];
          const imageUrl = primaryImage?.url || '/images/placeholder-property.jpg';
          
          const price = property.status === 'For Rent' 
            ? property.pricing?.rentPrice?.monthly
            : property.pricing?.salesPrice;

          return (
            <motion.div
              key={property._id}
              className="bg-white shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
              whileHover={{ y: -5 }}
              onClick={() => navigate(`/properties/${property._id}`)}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={imageUrl}
                  alt={property.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {property.listing?.featured && (
                  <div className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-light">
                    FEATURED
                  </div>
                )}
                
                <div className="absolute top-3 right-3 flex items-center space-x-1">
                  <button
                    onClick={(e) => handleToggleFavorite(e, property)}
                    className={`p-1.5 rounded-full transition-all duration-200 ${
                      isFavorite(property._id, 'database')
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-white bg-opacity-90 text-gray-600 hover:bg-white hover:text-red-500'
                    }`}
                  >
                    <Heart size={12} className={isFavorite(property._id, 'database') ? 'fill-current' : ''} />
                  </button>
                  <div className="bg-white bg-opacity-90 px-2 py-1 text-xs font-light">
                    {property.status}
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="mb-3">
                  <h3 className="text-lg font-light mb-1 group-hover:text-gray-700 transition-colors line-clamp-2">
                    {property.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-1">
                    {property.location?.address?.city}, {property.location?.address?.state}
                  </p>
                </div>

                <div className="mb-3">
                  <div className="text-xl font-light">
                    {price ? formatPrice(price) : 'Price on Request'}
                    {property.status === 'For Rent' && <span className="text-sm text-gray-500">/mo</span>}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-3">
                  <div className="flex items-center space-x-3">
                    {property.basicInfo?.beds && (
                      <span>{property.basicInfo.beds} Beds</span>
                    )}
                    {property.basicInfo?.baths && (
                      <span>{property.basicInfo.baths} Baths</span>
                    )}
                  </div>
                  {property.basicInfo?.sqft && (
                    <span>{property.basicInfo.sqft.toLocaleString()} Sqft</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SimilarProperties;