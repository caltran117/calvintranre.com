/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Upload, DollarSign, Home, MapPin } from 'lucide-react';
import { propertyAPI } from '../../utils/api';

const PropertyModal = ({ show, mode, property, onClose, onPropertyUpdate, onPropertyAdd }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'For Sale',
    basicInfo: {
      beds: '',
      baths: '',
      sqft: ''
    },
    pricing: {
      salesPrice: '',
      rentPrice: {
        monthly: ''
      }
    },
    location: {
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA'
      }
    },
    images: [{ url: '', caption: '', isPrimary: true, order: 1 }],
    areaAndLot: {
      propertyType: 'Residential',
      yearBuilt: ''
    },
    listing: {
      featured: false,
      isActive: true
    }
  });

  useEffect(() => {
    if (property && (mode === 'edit' || mode === 'view')) {
      setFormData({
        title: property.title || '',
        description: property.description || '',
        status: property.status || 'For Sale',
        basicInfo: {
          beds: property.basicInfo?.beds || '',
          baths: property.basicInfo?.baths || '',
          sqft: property.basicInfo?.sqft || ''
        },
        pricing: {
          salesPrice: property.pricing?.salesPrice || '',
          rentPrice: {
            monthly: property.pricing?.rentPrice?.monthly || ''
          }
        },
        location: {
          address: {
            street: property.location?.address?.street || '',
            city: property.location?.address?.city || '',
            state: property.location?.address?.state || '',
            zipCode: property.location?.address?.zipCode || '',
            country: property.location?.address?.country || 'USA'
          }
        },
        images: property.images?.length > 0 ? property.images : [{ url: '', caption: '', isPrimary: true, order: 1 }],
        areaAndLot: {
          propertyType: property.areaAndLot?.propertyType || 'Residential',
          yearBuilt: property.areaAndLot?.yearBuilt || ''
        },
        listing: {
          featured: property.listing?.featured || false,
          isActive: property.listing?.isActive !== undefined ? property.listing.isActive : true
        }
      });
    } else if (mode === 'add') {
      setFormData({
        title: '',
        description: '',
        status: 'For Sale',
        basicInfo: {
          beds: '',
          baths: '',
          sqft: ''
        },
        pricing: {
          salesPrice: '',
          rentPrice: {
            monthly: ''
          }
        },
        location: {
          address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA'
          }
        },
        images: [{ url: '', caption: '', isPrimary: true, order: 1 }],
        areaAndLot: {
          propertyType: 'Residential',
          yearBuilt: ''
        },
        listing: {
          featured: false,
          isActive: true
        }
      });
    }
  }, [property, mode, show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        basicInfo: {
          ...formData.basicInfo,
          beds: parseInt(formData.basicInfo.beds) || 0,
          baths: parseInt(formData.basicInfo.baths) || 0,
          sqft: parseInt(formData.basicInfo.sqft) || 0
        },
        pricing: {
          ...formData.pricing,
          salesPrice: formData.pricing.salesPrice ? parseInt(formData.pricing.salesPrice) : undefined,
          rentPrice: formData.pricing.rentPrice.monthly ? {
            monthly: parseInt(formData.pricing.rentPrice.monthly)
          } : undefined
        },
        areaAndLot: {
          ...formData.areaAndLot,
          yearBuilt: formData.areaAndLot.yearBuilt ? parseInt(formData.areaAndLot.yearBuilt) : undefined
        }
      };

      if (mode === 'add') {
        const response = await propertyAPI.addProperty(submitData);
        const newProperty = response.data.data || response.data;
        onPropertyAdd(newProperty);
      } else if (mode === 'edit') {
        const response = await propertyAPI.updateProperty(property._id, submitData);
        const updatedProperty = response.data.data || response.data;
        onPropertyUpdate(updatedProperty);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving property:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (path, value) => {
    const pathArray = path.split('.');
    const newFormData = { ...formData };
    let current = newFormData;
    
    for (let i = 0; i < pathArray.length - 1; i++) {
      if (!current[pathArray[i]]) {
        current[pathArray[i]] = {};
      }
      current = current[pathArray[i]];
    }
    
    current[pathArray[pathArray.length - 1]] = value;
    setFormData(newFormData);
  };

  const addImageField = () => {
    const newImages = [...formData.images, { 
      url: '', 
      caption: '', 
      isPrimary: false, 
      order: formData.images.length + 1 
    }];
    setFormData({ ...formData, images: newImages });
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData({ ...formData, images: newImages });
    }
  };

  const updateImageField = (index, field, value) => {
    const newImages = [...formData.images];
    newImages[index] = { ...newImages[index], [field]: value };
    setFormData({ ...formData, images: newImages });
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Home },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'images', label: 'Images', icon: Upload }
  ];

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => updateFormData('title', e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none"
          required
          disabled={mode === 'view'}
          placeholder="Modern Hillside Estate"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none"
          rows={4}
          disabled={mode === 'view'}
          placeholder="Stunning modern estate with panoramic city views..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select
            value={formData.status}
            onChange={(e) => updateFormData('status', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none"
            disabled={mode === 'view'}
          >
            <option value="For Sale">For Sale</option>
            <option value="For Rent">For Rent</option>
            <option value="Sold">Sold</option>
            <option value="Rented">Rented</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Type *
          </label>
          <select
            value={formData.areaAndLot.propertyType}
            onChange={(e) => updateFormData('areaAndLot.propertyType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none"
            disabled={mode === 'view'}
          >
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Condo">Condo</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Villa">Villa</option>
            <option value="Apartment">Apartment</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bedrooms *
          </label>
          <input
            type="number"
            value={formData.basicInfo.beds}
            onChange={(e) => updateFormData('basicInfo.beds', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none"
            required
            disabled={mode === 'view'}
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bathrooms *
          </label>
          <input
            type="number"
            value={formData.basicInfo.baths}
            onChange={(e) => updateFormData('basicInfo.baths', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none"
            required
            disabled={mode === 'view'}
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Square Feet *
          </label>
          <input
            type="number"
            value={formData.basicInfo.sqft}
            onChange={(e) => updateFormData('basicInfo.sqft', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none"
            required
            disabled={mode === 'view'}
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year Built
          </label>
          <input
            type="number"
            value={formData.areaAndLot.yearBuilt}
            onChange={(e) => updateFormData('areaAndLot.yearBuilt', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none"
            disabled={mode === 'view'}
            min="1800"
            max={new Date().getFullYear()}
          />
        </div>
      </div>

      {mode !== 'view' && (
        <div className="flex items-center space-x-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.listing.featured}
              onChange={(e) => updateFormData('listing.featured', e.target.checked)}
              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
            />
            <span className="text-sm font-medium text-gray-700">Featured Property</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.listing.isActive}
              onChange={(e) => updateFormData('listing.isActive', e.target.checked)}
              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
            />
            <span className="text-sm font-medium text-gray-700">Active Listing</span>
          </label>
        </div>
      )}
    </div>
  );

  const renderLocation = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Street Address *
        </label>
        <input
          type="text"
          value={formData.location.address.street}
          onChange={(e) => updateFormData('location.address.street', e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none"
          required
          disabled={mode === 'view'}
          placeholder="1234 Hillside Drive"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            value={formData.location.address.city}
            onChange={(e) => updateFormData('location.address.city', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none"
            required
            disabled={mode === 'view'}
            placeholder="Beverly Hills"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <input
            type="text"
            value={formData.location.address.state}
            onChange={(e) => updateFormData('location.address.state', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none"
            required
            disabled={mode === 'view'}
            placeholder="CA"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ZIP Code *
          </label>
          <input
            type="text"
            value={formData.location.address.zipCode}
            onChange={(e) => updateFormData('location.address.zipCode', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none"
            required
            disabled={mode === 'view'}
            placeholder="90210"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country *
          </label>
          <input
            type="text"
            value={formData.location.address.country}
            onChange={(e) => updateFormData('location.address.country', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none"
            required
            disabled={mode === 'view'}
            placeholder="USA"
          />
        </div>
      </div>
    </div>
  );

  const renderPricing = () => (
    <div className="space-y-6">
      {(formData.status === 'For Sale' || formData.status === 'Sold') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sales Price *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              value={formData.pricing.salesPrice}
              onChange={(e) => updateFormData('pricing.salesPrice', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none"
              required={formData.status === 'For Sale' || formData.status === 'Sold'}
              disabled={mode === 'view'}
              placeholder="24900000"
            />
          </div>
        </div>
      )}

      {(formData.status === 'For Rent' || formData.status === 'Rented') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Rent *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              value={formData.pricing.rentPrice.monthly}
              onChange={(e) => updateFormData('pricing.rentPrice.monthly', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none"
              required={formData.status === 'For Rent' || formData.status === 'Rented'}
              disabled={mode === 'view'}
              placeholder="4500"
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderImages = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Property Images</h3>
        {mode !== 'view' && (
          <button
            type="button"
            onClick={addImageField}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors text-sm"
          >
            Add Image
          </button>
        )}
      </div>

      {formData.images.map((image, index) => (
        <div key={index} className="border border-gray-200 rounded p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">
              Image {index + 1} {image.isPrimary && '(Primary)'}
            </span>
            {mode !== 'view' && formData.images.length > 1 && (
              <button
                type="button"
                onClick={() => removeImageField(index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL *
              </label>
              <input
                type="url"
                value={image.url}
                onChange={(e) => updateImageField(index, 'url', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none"
                required
                disabled={mode === 'view'}
                placeholder="/images/listing-1.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caption
              </label>
              <input
                type="text"
                value={image.caption}
                onChange={(e) => updateImageField(index, 'caption', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none"
                disabled={mode === 'view'}
                placeholder="Front exterior view"
              />
            </div>
          </div>

          {mode !== 'view' && (
            <div className="mt-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={image.isPrimary}
                  onChange={(e) => {
                    if (e.target.checked) {
                      const newImages = formData.images.map((img, i) => ({
                        ...img,
                        isPrimary: i === index
                      }));
                      setFormData({ ...formData, images: newImages });
                    }
                  }}
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <span className="text-sm font-medium text-gray-700">Primary Image</span>
              </label>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return renderBasicInfo();
      case 'location':
        return renderLocation();
      case 'pricing':
        return renderPricing();
      case 'images':
        return renderImages();
      default:
        return renderBasicInfo();
    }
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-light text-gray-900">
              {mode === 'add' ? 'Add New Property' : 
               mode === 'edit' ? 'Edit Property' : 'Property Details'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-1 min-h-0">
            <div className="w-1/4 border-r border-gray-200 p-6 overflow-y-auto">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-black text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              <form onSubmit={handleSubmit} className="h-full flex flex-col">
                <div className="flex-1 p-6 overflow-y-auto">
                  {renderTabContent()}
                </div>

                <div className="flex-shrink-0 flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {mode === 'view' ? 'Close' : 'Cancel'}
                  </button>
                  {mode !== 'view' && (
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition-colors flex items-center space-x-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-opacity-30 border-t-white rounded-full"
                          />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>{mode === 'add' ? 'Add Property' : 'Save Changes'}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PropertyModal;