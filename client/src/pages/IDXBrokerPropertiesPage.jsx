import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const IDXBrokerPropertiesPage = () => {
  useEffect(() => {
    // Check if script already exists anywhere in the document
    const existingScript = document.getElementById('idxwidgetsrc-112686');
    if (existingScript) {
      // Remove existing script first to prevent duplicates
      existingScript.remove();
    }

    // Clear the container first
    const widgetContainer = document.getElementById('idx-widget-container');
    if (widgetContainer) {
      widgetContainer.innerHTML = '<div class="text-center py-8 text-gray-500">Loading IDX Broker properties...</div>';
    }

    // Small delay to ensure cleanup is complete
    const timer = setTimeout(() => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.id = 'idxwidgetsrc-112686';
      script.src = '//calvintranre.idxbroker.com/idx/widgets/112686';

      script.onload = () => {
        // Remove loading text after script loads
        const container = document.getElementById('idx-widget-container');
        if (container) {
          const loadingText = container.querySelector('.text-center');
          if (loadingText) {
            loadingText.remove();
          }
        }
      };

      const container = document.getElementById('idx-widget-container');
      if (container) {
        container.appendChild(script);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      // Clean up on unmount
      const scriptToRemove = document.getElementById('idxwidgetsrc-112686');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
      const container = document.getElementById('idx-widget-container');
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

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
          <motion.p
            className="text-gray-500 text-sm"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Live MLS data powered by IDX Broker
          </motion.p>
        </div>
      </motion.section>

      {/* Search and Filters Section - matches PropertyListingPage */}
      <motion.section
        className="py-4 px-4 bg-white border-b border-gray-200"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-gray-600 text-sm md:text-base">
              Use the map and filters below to search for properties in your desired area
            </p>
          </div>
        </div>
      </motion.section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="py-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* IDX Broker Widget Container - Full width with proper spacing */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-lg">
            <div id="idx-widget-container" className="w-full">
              {/* IDX Broker widget will load here */}
              <div className="text-center py-12 text-gray-500">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
                  <p className="text-lg">Loading IDX Broker properties...</p>
                  <p className="text-sm text-gray-400 mt-2">Please wait while we load live MLS data</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Info Section */}
        <motion.div
          className="py-8 text-center border-t border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-light text-gray-900 mb-4">
              About Our Property Search
            </h2>
            <p className="text-gray-600 mb-6">
              Our IDX Broker integration provides you with real-time access to MLS listings,
              ensuring you see the most up-to-date property information available. Search by
              location, price range, property type, and more to find your perfect home.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Real-Time Data</h3>
                <p className="text-sm text-gray-600">Live MLS updates ensure accuracy</p>
              </div>
              <div className="p-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Advanced Search</h3>
                <p className="text-sm text-gray-600">Filter by your specific criteria</p>
              </div>
              <div className="p-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Professional Service</h3>
                <p className="text-sm text-gray-600">Expert guidance every step</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default IDXBrokerPropertiesPage;