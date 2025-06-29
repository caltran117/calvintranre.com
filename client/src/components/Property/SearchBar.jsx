import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by location, property type, or features..."
            className="w-full px-6 py-4 pr-24 text-gray-900 bg-white border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors"
          />
          
          <div className="absolute right-2 flex items-center space-x-2">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors text-sm"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {['Beverly Hills', 'Manhattan Beach', 'Malibu', 'Hollywood Hills', 'Santa Monica'].map((location) => (
          <button
            key={location}
            onClick={() => {
              setQuery(location);
              onSearch(location);
            }}
            className="px-3 py-1 text-sm text-gray-600 border border-gray-300 hover:border-gray-500 hover:text-gray-900 transition-colors"
          >
            {location}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default SearchBar;