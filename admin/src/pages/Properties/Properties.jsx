/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  MapPin, 
  Home, 
  Bath, 
  Square, 
  Star,
  Search,
  Filter,
  MoreVertical,
  ToggleLeft,
  ToggleRight,
  Building,
  DollarSign
} from 'lucide-react';

import PropertyCard from '../../components/Property/PropertyCard';
import PropertyFilters from '../../components/Property/PropertyFilters';
import DeleteConfirmModal from '../../components/Property/DeleteConfirmModal';
import { propertyAPI } from '../../utils/api';
import PropertyModal from '../../components/Property/PropertyModal';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    propertyType: '',
    city: '',
    featured: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
        ...filters,
        ...(searchTerm && { query: searchTerm })
      };

      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      );

      const response = searchTerm 
        ? await propertyAPI.searchProperties(cleanParams)
        : await propertyAPI.getAllProperties(cleanParams);

      const responseData = response.data.data || response.data;
      setProperties(responseData.properties || responseData.results || []);
      setTotalProperties(responseData.pagination?.total || responseData.length || 0);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [currentPage, filters, searchTerm]);

  const openModal = (mode, property = null) => {
    setModalMode(mode);
    setSelectedProperty(property);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProperty(null);
  };

  const handleDelete = (property) => {
    setPropertyToDelete(property);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await propertyAPI.deleteProperty(propertyToDelete._id);
      setProperties(properties.filter(p => p._id !== propertyToDelete._id));
      setShowDeleteConfirm(false);
      setPropertyToDelete(null);
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handlePropertyUpdate = (updatedProperty) => {
    setProperties(properties.map(p => 
      p._id === updatedProperty._id ? updatedProperty : p
    ));
    fetchProperties();
  };

  const handlePropertyAdd = (newProperty) => {
    setProperties([newProperty, ...properties]);
    fetchProperties();
  };

  const toggleFeatured = async (property) => {
    try {
      const updatedData = {
        listing: {
          ...property.listing,
          featured: !property.listing?.featured
        }
      };
      
      const response = await propertyAPI.updateProperty(property._id, updatedData);
      const updatedProperty = response.data.data || response.data;
      handlePropertyUpdate(updatedProperty);
    } catch (error) {
      console.error('Error updating featured status:', error);
    }
  };

  const toggleActive = async (property) => {
    try {
      const updatedData = {
        listing: {
          ...property.listing,
          isActive: !property.listing?.isActive
        }
      };
      
      const response = await propertyAPI.updateProperty(property._id, updatedData);
      const updatedProperty = response.data.data || response.data;
      handlePropertyUpdate(updatedProperty);
    } catch (error) {
      console.error('Error updating active status:', error);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
    setCurrentPage(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-white min-h-screen"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
      >
        <div>
          <h1 className="text-4xl font-light text-gray-900 mb-2">
            PROPERTY MANAGEMENT
          </h1>
          <p className="text-gray-600 font-light">
            Manage your luxury property portfolio
          </p>
          <div className="flex items-center space-x-6 mt-3">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Building className="w-4 h-4" />
              <span>Total: {totalProperties}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Star className="w-4 h-4" />
              <span>Featured: {properties.filter(p => p.listing?.featured).length}</span>
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openModal('add')}
          className="mt-4 md:mt-0 bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors font-medium flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Property</span>
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gray-50 border border-gray-200 rounded p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none"
            />
          </div>
          <PropertyFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full"
          />
        </div>
      ) : (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {properties.map((property, index) => (
              <PropertyCard
                key={property._id}
                property={property}
                index={index}
                onView={() => openModal('view', property)}
                onEdit={() => openModal('edit', property)}
                onDelete={() => handleDelete(property)}
                onToggleFeatured={() => toggleFeatured(property)}
                onToggleActive={() => toggleActive(property)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {properties.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-light text-gray-800 mb-2">No Properties Found</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first property</p>
          <button
            onClick={() => openModal('add')}
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors"
          >
            Add Property
          </button>
        </motion.div>
      )}

      <PropertyModal
        show={showModal}
        mode={modalMode}
        property={selectedProperty}
        onClose={closeModal}
        onPropertyUpdate={handlePropertyUpdate}
        onPropertyAdd={handlePropertyAdd}
      />

      <DeleteConfirmModal
        show={showDeleteConfirm}
        property={propertyToDelete}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </motion.div>
  );
};

export default Properties;