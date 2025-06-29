import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PropertyFilters = ({ filters, onFilterChange, totalProperties }) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    onFilterChange({
      status: '',
      propertyType: '',
      beds: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'pricing.salesPrice',
      sortOrder: 'desc'
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== 'pricing.salesPrice' && value !== 'desc'
  );

  return (
    <div className="border-b border-gray-200 pb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {totalProperties} Properties
          </span>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm text-gray-900 hover:text-gray-700 transition-colors border-b border-gray-900 pb-1"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Sort by:</label>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              handleFilterChange('sortBy', sortBy);
              handleFilterChange('sortOrder', sortOrder);
            }}
            className="border-0 bg-transparent text-sm text-gray-900 focus:ring-0 cursor-pointer"
          >
            <option value="pricing.salesPrice-desc">Price: High to Low</option>
            <option value="pricing.salesPrice-asc">Price: Low to High</option>
            <option value="basicInfo.sqft-desc">Size: Largest First</option>
            <option value="basicInfo.sqft-asc">Size: Smallest First</option>
          </select>
        </div>
      </div>

      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
            >
              <option value="">All</option>
              <option value="For Sale">For Sale</option>
              <option value="For Rent">For Rent</option>
              <option value="Sold">Sold</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">Property Type</label>
            <select
              value={filters.propertyType}
              onChange={(e) => handleFilterChange('propertyType', e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
            >
              <option value="">All</option>
              <option value="Residential">Residential</option>
              <option value="Condo">Condo</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">Bedrooms</label>
            <select
              value={filters.beds}
              onChange={(e) => handleFilterChange('beds', e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              placeholder="Enter city"
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">Min Price</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              placeholder="Minimum price"
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">Max Price</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              placeholder="Maximum price"
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PropertyFilters;