/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Home, 
  Bath, 
  Square, 
  Star,
  Eye,
  Edit3,
  Trash2,
  MoreVertical,
  ToggleLeft,
  ToggleRight,
  Building
} from 'lucide-react';

const PropertyCard = ({ 
  property, 
  index, 
  onView, 
  onEdit, 
  onDelete, 
  onToggleFeatured, 
  onToggleActive 
}) => {
  const formatPrice = (pricing) => {
    if (pricing?.salesPrice) {
      return `$${(pricing.salesPrice / 1000000).toFixed(1)}M`;
    }
    if (pricing?.rentPrice?.monthly) {
      return `$${pricing.rentPrice.monthly.toLocaleString()}/month`;
    }
    return 'Price on request';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'For Sale':
        return 'bg-green-100 text-green-800';
      case 'For Rent':
        return 'bg-blue-100 text-blue-800';
      case 'Sold':
        return 'bg-gray-100 text-gray-800';
      case 'Rented':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className={`bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg ${
        property.listing?.isActive ? '' : 'opacity-75'
      }`}
    >
      <div className="relative h-48 bg-gray-100">
        {property.images && property.images.length > 0 ? (
          <img 
            src={property.images[0].url} 
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Building className="w-16 h-16 text-gray-300" />
          </div>
        )}
        
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
            {property.status}
          </span>
          {property.listing?.featured && (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </span>
          )}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            property.listing?.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {property.listing?.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <div className="relative group">
            <button className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-2 hover:bg-opacity-100 transition-all">
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
            <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <button
                onClick={onView}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-gray-700"
              >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </button>
              <button
                onClick={onEdit}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-gray-700"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={onDelete}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-red-600"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
          {property.title}
        </h3>
        
        <p className="text-gray-600 text-sm flex items-center mb-3">
          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
          {property.location?.address ? 
            `${property.location.address.city}, ${property.location.address.state}` :
            'Location not specified'
          }
        </p>
        
        <div className="text-2xl font-light text-black mb-4">
          {formatPrice(property.pricing)}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-1">
            <Home className="w-4 h-4" />
            <span>{property.basicInfo?.beds || 0} beds</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bath className="w-4 h-4" />
            <span>{property.basicInfo?.baths || 0} baths</span>
          </div>
          <div className="flex items-center space-x-1">
            <Square className="w-4 h-4" />
            <span>{property.basicInfo?.sqft?.toLocaleString() || 0} sqft</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Featured:</span>
            <button
              onClick={onToggleFeatured}
              className="focus:outline-none"
            >
              {property.listing?.featured ? (
                <ToggleRight className="w-6 h-6 text-black" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-gray-400" />
              )}
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Active:</span>
            <button
              onClick={onToggleActive}
              className="focus:outline-none"
            >
              {property.listing?.isActive ? (
                <ToggleRight className="w-6 h-6 text-green-600" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;