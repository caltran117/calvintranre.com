import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Home, Bed, Bath, Square, Search, Filter, Grid, List, Heart, Share2, Eye, Calendar, ChevronDown, Loader2 } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

const PropertyListingsPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('price-low');
  
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
    status: 'Active'
  });

  // API Configuration
  const API_BASE_URL = 'https://api.simplyrets.com';
  const API_USERNAME = 'simplyrets';
  const API_PASSWORD = 'simplyrets';

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      let queryParams = `limit=2&status=${filters.status}`;
      
      if (filters.minPrice) queryParams += `&minprice=${filters.minPrice}`;
      if (filters.maxPrice) queryParams += `&maxprice=${filters.maxPrice}`;
      if (filters.bedrooms) queryParams += `&minbeds=${filters.bedrooms}`;
      if (filters.bathrooms) queryParams += `&minbaths=${filters.bathrooms}`;
      if (filters.propertyType) queryParams += `&type=${filters.propertyType}`;

      const response = await fetch(`${API_BASE_URL}/properties?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${API_USERNAME}:${API_PASSWORD}`)}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setProperties(data);
      if (data.length > 0) {
        setSelectedProperty(data[0]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'Price not available';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatAddress = (address) => {
    if (!address) return 'Address not available';
    const { streetNumber, streetName, city, state, postalCode } = address;
    return `${streetNumber || ''} ${streetName || ''}, ${city || ''}, ${state || ''} ${postalCode || ''}`.trim();
  };

  // Initialize Leaflet Map
  const initializeMap = () => {
    if (!window.L || !mapRef.current || properties.length === 0) return;

    // Clear existing map
    if (mapInstance.current) {
      mapInstance.current.remove();
    }

    // Clear existing markers
    markersRef.current = [];

    // Create map with light theme
    mapInstance.current = window.L.map(mapRef.current, {
      center: [29.7604, -95.3698], // Default to Houston
      zoom: 10,
      zoomControl: true,
    });

    // Add light tile layer
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(mapInstance.current);

    // Add markers for properties with coordinates
    const validProperties = properties.filter(p => p.geo?.lat && p.geo?.lng);
    
    if (validProperties.length === 0) return;

    const group = new window.L.featureGroup();

    validProperties.forEach((property, index) => {
      const lat = parseFloat(property.geo.lat);
      const lng = parseFloat(property.geo.lng);
      
      if (isNaN(lat) || isNaN(lng)) return;

      // Blue dot marker for light theme
      const customIcon = window.L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background: #3b82f6;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            transform: translate(-50%, -50%);
          "></div>
        `,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });

      const marker = window.L.marker([lat, lng], { icon: customIcon }).addTo(mapInstance.current);
      
      marker.on('click', () => {
        setSelectedProperty(property);
      });

      // Store marker reference with property id for highlighting
      markersRef.current.push({
        marker: marker,
        propertyId: property.mlsId || index
      });

      group.addLayer(marker);
    });

    // Fit map to show all markers
    if (group.getLayers().length > 0) {
      mapInstance.current.fitBounds(group.getBounds(), { padding: [20, 20] });
    }

    setMapLoaded(true);
  };

  // Function to highlight marker when property is selected
  const highlightMarker = (propertyId) => {
    markersRef.current.forEach(({ marker, propertyId: markerId }) => {
      const isSelected = markerId === propertyId;
      
      // Update marker style based on selection
      const iconHtml = `
        <div style="
          background: ${isSelected ? '#ef4444' : '#3b82f6'};
          width: ${isSelected ? '16px' : '12px'};
          height: ${isSelected ? '16px' : '12px'};
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transform: translate(-50%, -50%);
          transition: all 0.2s ease;
        "></div>
      `;
      
      marker.setIcon(window.L.divIcon({
        className: 'custom-marker',
        html: iconHtml,
        iconSize: [isSelected ? 16 : 12, isSelected ? 16 : 12],
        iconAnchor: [isSelected ? 8 : 6, isSelected ? 8 : 6]
      }));
    });
  };

  // Update marker highlighting when selected property changes
  useEffect(() => {
    if (selectedProperty && markersRef.current.length > 0) {
      highlightMarker(selectedProperty.mlsId || properties.findIndex(p => p === selectedProperty));
    }
  }, [selectedProperty]);

  // Load Leaflet
  useEffect(() => {
    if (!window.L) {
      // Load Leaflet CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      // Load Leaflet JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        setTimeout(initializeMap, 100);
      };
      document.head.appendChild(script);
    } else {
      setTimeout(initializeMap, 100);
    }
  }, [properties]);

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const handleToggleFavorite = async (property) => {
    if (!isAuthenticated) {
      alert('Please sign in to add favorites');
      return;
    }

    try {
      const propertyId = String(property.mlsId || property.id);
      const propertyType = 'simplyrets';
      const propertyData = {
        mlsId: property.mlsId,
        listPrice: property.listPrice,
        address: property.address,
        photos: property.photos,
        property: property.property,
        listDate: property.listDate,
        geo: property.geo
      };

      await toggleFavorite(propertyId, propertyType, propertyData);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorite. Please try again.');
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      propertyType: '',
      status: 'Active'
    });
    setSearchTerm('');
  };

  const filteredProperties = properties
    .filter(property => {
      if (!searchTerm) return true;
      const address = formatAddress(property.address).toLowerCase();
      return address.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.listPrice || 0) - (b.listPrice || 0);
        case 'price-high':
          return (b.listPrice || 0) - (a.listPrice || 0);
        case 'newest':
          return new Date(b.listDate || 0) - new Date(a.listDate || 0);
        case 'size':
          return (b.property?.area || 0) - (a.property?.area || 0);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen mb-12 bg-white">
      {/* Hero Section */}
      <motion.section
        className="py-12 px-4 bg-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto mt-4 text-center">
          <motion.h1
            className="text-3xl md:text-4xl font-light mb-4 text-gray-900"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            LUXURY PROPERTIES
          </motion.h1>
          <motion.p
            className="max-w-2xl mx-auto text-gray-600 mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Discover exceptional properties in prime locations. Browse our curated collection of luxury homes.
          </motion.p>
          {!loading && !error && (
            <motion.p
              className="text-gray-500 text-sm"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {filteredProperties.length} properties available
            </motion.p>
          )}
        </div>
      </motion.section>

      {/* Search and Filters */}
      <motion.section
        className="py-4 px-4 bg-white border-b border-gray-200"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-4 mb-4 md:mb-6">
            {/* Search Bar */}
            <div className="flex-1 md:min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all text-sm md:text-base"
                />
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              {/* Sort Dropdown */}
              <div className="relative flex-1 md:flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-3 md:px-4 py-2 md:py-3 pr-8 text-gray-700 focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm md:text-base w-full md:w-auto"
                >
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="size">Largest First</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* View Mode Toggle - Hidden on mobile */}
              <div className="hidden md:flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <List size={16} />
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg px-3 md:px-4 py-2 md:py-3 transition-colors text-sm md:text-base"
              >
                <Filter size={16} />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4 md:mb-6 p-4 md:p-6 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                    <input
                      type="number"
                      placeholder="$100,000"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                    <input
                      type="number"
                      placeholder="$1,000,000"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                    <select
                      value={filters.bedrooms}
                      onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                    <select
                      value={filters.bathrooms}
                      onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                    <select
                      value={filters.propertyType}
                      onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm"
                    >
                      <option value="">All Types</option>
                      <option value="Residential">Residential</option>
                      <option value="Condo">Condo</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Multi-Family">Multi-Family</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-4"
          >
            <div className="max-w-7xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="text-red-700">
                  <strong>Error:</strong> {error}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="lg:flex lg:h-[calc(100vh-200px)] max-w-7xl mx-auto">
        {/* Properties List/Grid */}
        <div className="lg:w-1/2 overflow-hidden flex flex-col lg:border-r border-gray-200">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center h-64 lg:h-full">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Loading luxury properties...</p>
              </div>
            </div>
          )}

          {/* Properties Display */}
          {!loading && !error && (
            <div className="lg:overflow-y-auto lg:flex-1 p-4 lg:p-6">
              {filteredProperties.length === 0 ? (
                <div className="text-center py-12">
                  <Home size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 text-lg mb-4">No properties found matching your criteria.</p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  {filteredProperties.map((property, index) => (
                    <motion.div
                      key={property.mlsId || index}
                      onClick={() => setSelectedProperty(property)}
                      className={`bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        selectedProperty?.mlsId === property.mlsId
                          ? 'ring-2 ring-blue-500 shadow-lg'
                          : 'hover:border-gray-300'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      whileHover={{ y: -2 }}
                    >
                      {/* Property Image */}
                      <div className="relative bg-gray-200 overflow-hidden h-32 sm:h-36 lg:h-40">
                        {property.photos && property.photos.length > 0 ? (
                          <img
                            src={property.photos[0]}
                            alt="Property"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                          <Home size={20} />
                        </div>

                        {/* Price Badge */}
                        {property.listPrice && (
                          <div className="absolute top-2 left-2 bg-white text-gray-900 px-2 py-1 rounded text-xs font-semibold shadow">
                            {formatPrice(property.listPrice)}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(property);
                            }}
                            className={`p-1.5 rounded transition-colors ${
                              isFavorite(String(property.mlsId || property.id), 'simplyrets')
                                ? 'bg-red-500 text-white'
                                : 'bg-white/80 text-gray-600 hover:bg-white'
                            }`}
                          >
                            <Heart size={12} className={isFavorite(String(property.mlsId || property.id), 'simplyrets') ? 'fill-current' : ''} />
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 bg-white/80 hover:bg-white text-gray-600 rounded transition-colors"
                          >
                            <Share2 size={12} />
                          </button>
                        </div>

                        {/* Property Type Badge */}
                        {property.property?.type && (
                          <div className="absolute bottom-2 left-2 bg-gray-900/80 text-white px-2 py-0.5 rounded text-xs">
                            {property.property.type}
                          </div>
                        )}
                      </div>

                      {/* Property Details */}
                      <div className="p-2 sm:p-3">
                        <div className="mb-2">
                          <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1 line-clamp-2">
                            {formatAddress(property.address)}
                          </h3>
                          <div className="flex items-center text-gray-500 text-xs">
                            <MapPin size={10} className="mr-1" />
                            <span>{property.address?.city}, {property.address?.state}</span>
                          </div>
                        </div>

                        {/* Property Stats */}
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                          <div className="flex items-center">
                            <Bed size={10} className="mr-1" />
                            <span>{property.property?.bedrooms || 'N/A'}</span>
                          </div>
                          <div className="flex items-center">
                            <Bath size={10} className="mr-1" />
                            <span>{property.property?.bathsTotal || 'N/A'}</span>
                          </div>
                          <div className="flex items-center">
                            <Square size={10} className="mr-1" />
                            <span>{property.property?.area || 'N/A'}</span>
                          </div>
                        </div>

                        {/* Additional Info */}
                        {property.listDate && (
                          <div className="flex items-center text-xs text-gray-400 mb-2">
                            <Calendar size={8} className="mr-1" />
                            <span className="text-xs">Listed {new Date(property.listDate).toLocaleDateString()}</span>
                          </div>
                        )}

                        {/* View Details Button */}
                        {/* <button
                          onClick={(e) => e.stopPropagation()}
                          className="w-full bg-gray-900 hover:bg-gray-800 text-white py-1.5 px-2 rounded text-xs transition-colors flex items-center justify-center"
                        >
                          <Eye size={10} className="mr-1" />
                          <span className="text-xs">View Details</span>
                        </button> */}
                      </div>

                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Map Container */}
        <div className="lg:w-1/2 relative h-64 lg:h-auto">
          <div ref={mapRef} className="w-full h-full bg-gray-100">
            {!window.L && !loading && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Loading map...</p>
                </div>
              </div>
            )}
          </div>

          {/* Selected Property Overlay */}
          <AnimatePresence>
            {selectedProperty && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-2 left-2 right-2 lg:bottom-4 lg:left-4 lg:right-4 bg-white rounded-lg p-3 lg:p-4 border border-gray-200 shadow-lg"
              >
                <div className="flex items-start space-x-3 lg:space-x-4">
                  <div className="w-16 h-12 lg:w-20 lg:h-14 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {selectedProperty.photos && selectedProperty.photos.length > 0 ? (
                      <img
                        src={selectedProperty.photos[0]}
                        alt="Property"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Home size={12} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1 lg:mb-2">
                      <h3 className="font-semibold text-gray-900 text-xs lg:text-sm truncate pr-2">
                        {formatAddress(selectedProperty.address)}
                      </h3>
                      <span className="text-gray-900 font-bold text-xs lg:text-sm whitespace-nowrap">
                        {formatPrice(selectedProperty.listPrice)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 lg:space-x-3 text-xs text-gray-600">
                      <div className="flex items-center">
                        <Bed size={10} className="mr-1" />
                        <span>{selectedProperty.property?.bedrooms || 'N/A'}</span>
                      </div>
                      <div className="flex items-center">
                        <Bath size={10} className="mr-1" />
                        <span>{selectedProperty.property?.bathsTotal || 'N/A'}</span>
                      </div>
                      <div className="flex items-center">
                        <Square size={10} className="mr-1" />
                        <span>{selectedProperty.property?.area || 'N/A'} sqft</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PropertyListingsPage;