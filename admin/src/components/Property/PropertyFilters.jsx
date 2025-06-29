import React from 'react';
import { Filter } from 'lucide-react';

const PropertyFilters = ({ filters, onFilterChange }) => {
  const statusOptions = ['For Sale', 'For Rent', 'Sold', 'Rented'];
  const propertyTypes = ['Residential', 'Commercial', 'Condo', 'Townhouse', 'Villa', 'Apartment'];
  const featuredOptions = [
    { value: '', label: 'All' },
    { value: 'true', label: 'Featured Only' },
    { value: 'false', label: 'Non-Featured' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="pl-10 pr-8 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none bg-white text-sm"
        >
          <option value="">All Status</option>
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="relative">
        <select
          value={filters.propertyType}
          onChange={(e) => handleFilterChange('propertyType', e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none bg-white text-sm"
        >
          <option value="">All Types</option>
          {propertyTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="relative">
        <select
          value={filters.featured}
          onChange={(e) => handleFilterChange('featured', e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none bg-white text-sm"
        >
          {featuredOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <input
        type="text"
        placeholder="City"
        value={filters.city}
        onChange={(e) => handleFilterChange('city', e.target.value)}
        className="px-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none text-sm"
      />
    </div>
  );
};

export default PropertyFilters;