/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  Navigation,
  Globe,
  Target,
  Calendar,
  Map
} from 'lucide-react';

import { locationStatAPI } from '../../utils/api';

const LocationStats = () => {
  const [locationStats, setLocationStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [formData, setFormData] = useState({
    lat: '',
    lon: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'map'
  
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  const fetchLocationStats = async () => {
    try {
      setLoading(true);
      const response = await locationStatAPI.getAllLocationStats();
      const responseData = response.data.data || response.data;
      
      setLocationStats(Array.isArray(responseData) ? responseData : []);
    } catch (error) {
      console.error('Error fetching location stats:', error);
      setLocationStats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationStats();
  }, []);

  const openModal = (mode, location = null) => {
    setModalMode(mode);
    setSelectedLocation(location);
    if (mode === 'edit' && location) {
      setFormData({
        lat: location.lat.toString(),
        lon: location.lon.toString()
      });
    } else {
      setFormData({
        lat: '',
        lon: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLocation(null);
    setFormData({ lat: '', lon: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
      lat: parseFloat(formData.lat),
      lon: parseFloat(formData.lon)
    };

    if (isNaN(data.lat) || isNaN(data.lon)) {
      alert('Please enter valid latitude and longitude values');
      return;
    }

    if (data.lat < -90 || data.lat > 90) {
      alert('Latitude must be between -90 and 90');
      return;
    }

    if (data.lon < -180 || data.lon > 180) {
      alert('Longitude must be between -180 and 180');
      return;
    }

    try {
      if (modalMode === 'add') {
        await locationStatAPI.addLocationStat(data);
      } else {
        await locationStatAPI.updateLocationStat(selectedLocation._id, data);
      }
      
      await fetchLocationStats();
      closeModal();
    } catch (error) {
      console.error('Error saving location stat:', error);
      alert('Error saving location stat');
    }
  };

  const handleDelete = (location) => {
    setLocationToDelete(location);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await locationStatAPI.deleteLocationStat(locationToDelete._id);
      setLocationStats(locationStats.filter(l => l._id !== locationToDelete._id));
      setShowDeleteConfirm(false);
      setLocationToDelete(null);
      setSelectedLocation(null);
    } catch (error) {
      console.error('Error deleting location stat:', error);
      alert('Error deleting location stat');
    }
  };

  // Initialize Leaflet Map
  const initializeMap = () => {
    if (!window.L || !mapRef.current) return;

    // Clear existing map
    if (mapInstance.current) {
      mapInstance.current.remove();
    }

    // Clear existing markers
    markersRef.current = [];

    // Create map with light theme
    mapInstance.current = window.L.map(mapRef.current, {
      center: [39.8283, -98.5795], // Default to center of US
      zoom: 4,
      zoomControl: true,
    });

    // Add light tile layer
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(mapInstance.current);

    // Add markers for locations if any exist
    addMarkersToMap();
  };

  // Add markers to existing map
  const addMarkersToMap = () => {
    if (!mapInstance.current || !window.L) return;

    // Clear existing markers
    markersRef.current.forEach(({ marker }) => {
      mapInstance.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Add markers for locations
    const validLocations = locationStats.filter(l => l.lat && l.lon);
    
    if (validLocations.length === 0) return;

    const group = new window.L.featureGroup();

    validLocations.forEach((location) => {
      const lat = parseFloat(location.lat);
      const lng = parseFloat(location.lon);
      
      if (isNaN(lat) || isNaN(lng)) return;

      // Custom marker for location stats
      const customIcon = window.L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background: ${selectedLocation?._id === location._id ? '#ef4444' : '#10b981'};
            width: ${selectedLocation?._id === location._id ? '16px' : '12px'};
            height: ${selectedLocation?._id === location._id ? '16px' : '12px'};
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            transform: translate(-50%, -50%);
          "></div>
        `,
        iconSize: [selectedLocation?._id === location._id ? 16 : 12, selectedLocation?._id === location._id ? 16 : 12],
        iconAnchor: [selectedLocation?._id === location._id ? 8 : 6, selectedLocation?._id === location._id ? 8 : 6]
      });

      const marker = window.L.marker([lat, lng], { icon: customIcon }).addTo(mapInstance.current);
      
      // Add popup with location info
      const popupContent = `
        <div style="font-family: system-ui, sans-serif;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">${getLocationName(lat, lng)}</h3>
          <p style="margin: 0; font-size: 12px; color: #666;">Lat: ${lat.toFixed(6)}</p>
          <p style="margin: 0; font-size: 12px; color: #666;">Lon: ${lng.toFixed(6)}</p>
          ${location.createdAt ? `<p style="margin: 4px 0 0 0; font-size: 11px; color: #999;">Added: ${formatDate(location.createdAt)}</p>` : ''}
        </div>
      `;
      marker.bindPopup(popupContent);
      
      marker.on('click', () => {
        setSelectedLocation(location);
      });

      // Store marker reference
      markersRef.current.push({
        marker: marker,
        locationId: location._id
      });

      group.addLayer(marker);
    });

    // Fit map to show all markers
    if (group.getLayers().length > 0) {
      mapInstance.current.fitBounds(group.getBounds(), { padding: [20, 20] });
    }
  };

  // Function to highlight marker when location is selected
  const highlightMarker = (locationId) => {
    markersRef.current.forEach(({ marker, locationId: markerId }) => {
      const isSelected = markerId === locationId;
      
      // Update marker style based on selection
      const iconHtml = `
        <div style="
          background: ${isSelected ? '#ef4444' : '#10b981'};
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

  // Update marker highlighting when selected location changes
  useEffect(() => {
    if (selectedLocation && markersRef.current.length > 0) {
      highlightMarker(selectedLocation._id);
    }
  }, [selectedLocation]);

  // Load Leaflet and initialize map
  useEffect(() => {
    if (viewMode !== 'map') return;

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
  }, [viewMode]);

  // Update markers when locations change
  useEffect(() => {
    if (viewMode === 'map' && window.L && mapInstance.current) {
      addMarkersToMap();
    }
  }, [locationStats, viewMode]);

  const getLocationName = (lat, lon) => {
    const cities = {
      '40.7128,-74.0060': 'New York City',
      '37.7749,-122.4194': 'San Francisco',
      '34.0522,-118.2437': 'Los Angeles',
      '41.8781,-87.6298': 'Chicago',
      '29.7604,-95.3698': 'Houston',
      '33.4484,-112.0740': 'Phoenix',
      '39.7392,-104.9903': 'Denver',
      '47.6062,-122.3321': 'Seattle',
      '25.7617,-80.1918': 'Miami',
      '32.7767,-96.7970': 'Dallas'
    };
    
    const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
    return cities[key] || `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredLocations = locationStats.filter(location => {
    const locationName = getLocationName(location.lat, location.lon);
    return locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           location.lat.toString().includes(searchTerm) ||
           location.lon.toString().includes(searchTerm);
  });

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
            LOCATION STATISTICS
          </h1>
          <p className="text-gray-600 font-light">
            Manage location tracking and statistics
          </p>
          <div className="flex items-center space-x-6 mt-3">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Globe className="w-4 h-4" />
              <span>Total Locations: {locationStats.length}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Target className="w-4 h-4" />
              <span>Active Tracking: {locationStats.length}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-2 rounded text-sm ${viewMode === 'cards' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700'}`}
              title="Card View"
            >
              <Globe className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setViewMode('map');
                // Trigger map initialization after view change
                setTimeout(() => {
                  if (mapRef.current && !mapInstance.current) {
                    initializeMap();
                  }
                }, 100);
              }}
              className={`px-3 py-2 rounded text-sm ${viewMode === 'map' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700'}`}
              title="Map View"
            >
              <Map className="w-4 h-4" />
            </button>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openModal('add')}
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors font-medium flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Location</span>
          </motion.button>
        </div>
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
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none"
            />
          </div>
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
      ) : viewMode === 'map' ? (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative h-[600px] bg-white border border-gray-200 rounded overflow-hidden"
        >
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

          {/* Selected Location Overlay */}
          <AnimatePresence>
            {selectedLocation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-4 left-4 right-4 bg-white rounded-lg p-4 border border-gray-200 shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">
                      {getLocationName(selectedLocation.lat, selectedLocation.lon)}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Navigation className="w-4 h-4 text-gray-400" />
                        <span>Lat: {selectedLocation.lat.toFixed(6)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Navigation className="w-4 h-4 text-gray-400" />
                        <span>Lon: {selectedLocation.lon.toFixed(6)}</span>
                      </div>
                      {selectedLocation.createdAt && (
                        <div className="flex items-center space-x-2 col-span-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>Added: {formatDate(selectedLocation.createdAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => openModal('edit', selectedLocation)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(selectedLocation)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredLocations.map((location, index) => (
              <motion.div
                key={location._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelectedLocation(location)}
                className={`bg-white border border-gray-200 rounded p-6 hover:shadow-md transition-all cursor-pointer ${
                  selectedLocation?._id === location._id ? 'ring-2 ring-blue-500 shadow-md' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {getLocationName(location.lat, location.lon)}
                      </h3>
                      <p className="text-sm text-gray-500">Location #{index + 1}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal('edit', location);
                      }}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(location);
                      }}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Navigation className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Lat: {location.lat.toFixed(6)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Navigation className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Lon: {location.lon.toFixed(6)}
                    </span>
                  </div>
                  {location.createdAt && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Added: {formatDate(location.createdAt)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Active</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const url = `https://www.google.com/maps?q=${location.lat},${location.lon}`;
                        window.open(url, '_blank');
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      View on Map
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {filteredLocations.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-light text-gray-800 mb-2">
            {searchTerm ? 'No locations found' : 'No locations tracked yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first location'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => openModal('add')}
              className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors"
            >
              Add Location
            </button>
          )}
        </motion.div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {modalMode === 'add' ? 'Add New Location' : 'Edit Location'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-black focus:border-black outline-none"
                    placeholder="e.g., 40.7128"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Range: -90 to 90</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.lon}
                    onChange={(e) => setFormData({ ...formData, lon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-black focus:border-black outline-none"
                    placeholder="e.g., -74.0060"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Range: -180 to 180</p>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 text-white bg-black rounded hover:bg-gray-800 transition-colors"
                  >
                    {modalMode === 'add' ? 'Add Location' : 'Update Location'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Location</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this location ({locationToDelete?.lat.toFixed(4)}, {locationToDelete?.lon.toFixed(4)})? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LocationStats;