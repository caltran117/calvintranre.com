import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropertyCard from '../components/Property/PropertyCard';
import PropertyFilters from '../components/Property/PropertyFilters';
import SearchBar from '../components/Property/SearchBar';
import Pagination from '../components/Property/Pagination';
import LoadingSpinner from '../components/Property/LoadingSpinner';
import { propertyAPI } from '../utils/api';

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);
  const [filters, setFilters] = useState({
    status: '',
    propertyType: '',
    beds: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'pricing.salesPrice',
    sortOrder: 'desc'
  });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
        ...filters,
        ...(searchQuery && { query: searchQuery })
      };

      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      );

      const response = searchQuery 
        ? await propertyAPI.searchProperties(cleanParams)
        : await propertyAPI.getAllProperties(cleanParams);

      const responseData = response.data.data || response.data;
      setProperties(responseData.properties || []);
      setTotalPages(responseData.pagination?.totalPages || 1);
      setTotalProperties(responseData.pagination?.total || 0);
      setError(null);
    } catch (err) {
      setError('Failed to load properties');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [currentPage, filters, searchQuery]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light mb-4 text-gray-800">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchProperties}
            className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <motion.div
        className="pt-24 pb-16 px-4 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="text-center mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-light mb-4 text-gray-900">
            LUXURY PROPERTIES
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover exceptional properties in the most prestigious locations
          </p>
        </motion.div>

        <motion.div
          className="mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <SearchBar onSearch={handleSearch} />
        </motion.div>

        <motion.div
          className="mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <PropertyFilters 
            filters={filters} 
            onFilterChange={handleFilterChange}
            totalProperties={totalProperties}
          />
        </motion.div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {properties.map((property, index) => (
                <motion.div
                  key={property._id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </motion.div>

            {properties.length === 0 && !loading && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-2xl font-light mb-4 text-gray-800">No Properties Found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </motion.div>
            )}

            {totalPages > 1 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default PropertiesPage;