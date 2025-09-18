import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const IDXFeaturedSection = () => {
  const [showcaseLoaded, setShowcaseLoaded] = useState(false);
  const [slideshowLoaded, setSlideshowLoaded] = useState(false);
  const [showcaseError, setShowcaseError] = useState(false);
  const [slideshowError, setSlideshowError] = useState(false);

  useEffect(() => {
    const loadIDXWidgets = () => {
      // Clean up any existing widgets
      const existingShowcase = document.getElementById('idxwidgetsrc-112683');
      const existingSlideshow = document.getElementById('idxwidgetsrc-112685');

      if (existingShowcase) existingShowcase.remove();
      if (existingSlideshow) existingSlideshow.remove();

      // Get containers
      const showcaseContainer = document.getElementById('idx-showcase-container');
      const slideshowContainer = document.getElementById('idx-slideshow-container');

      // Clear containers and add loading text
      if (slideshowContainer) {
        slideshowContainer.innerHTML = '<div class="text-center py-8 text-gray-500">Loading featured slideshow...</div>';
      }
      if (showcaseContainer) {
        showcaseContainer.innerHTML = '<div class="text-center py-8 text-gray-500">Loading properties showcase...</div>';
      }

      // Load Featured Slideshow Widget
      const slideshowScript = document.createElement('script');
      slideshowScript.id = 'idxwidgetsrc-112685';
      slideshowScript.type = 'text/javascript';
      slideshowScript.src = '//calvintranre.idxbroker.com/idx/widgets/112685';

      slideshowScript.onload = () => {
        setSlideshowLoaded(true);
        setSlideshowError(false);
        console.log('IDX Slideshow widget loaded');
        // Remove loading text
        if (slideshowContainer) {
          const loadingText = slideshowContainer.querySelector('.text-center');
          if (loadingText) loadingText.remove();
        }
      };

      slideshowScript.onerror = () => {
        setSlideshowError(true);
        setSlideshowLoaded(false);
        console.error('IDX Slideshow widget failed to load');
      };

      // Load Featured Showcase Widget
      const showcaseScript = document.createElement('script');
      showcaseScript.id = 'idxwidgetsrc-112683';
      showcaseScript.type = 'text/javascript';
      showcaseScript.src = '//calvintranre.idxbroker.com/idx/widgets/112683';

      showcaseScript.onload = () => {
        setShowcaseLoaded(true);
        setShowcaseError(false);
        console.log('IDX Showcase widget loaded');
        // Remove loading text
        if (showcaseContainer) {
          const loadingText = showcaseContainer.querySelector('.text-center');
          if (loadingText) loadingText.remove();
        }
      };

      showcaseScript.onerror = () => {
        setShowcaseError(true);
        setShowcaseLoaded(false);
        console.error('IDX Showcase widget failed to load');
      };

      // Append scripts directly to their containers (like the working implementation)
      if (slideshowContainer) {
        slideshowContainer.appendChild(slideshowScript);
      }

      if (showcaseContainer) {
        showcaseContainer.appendChild(showcaseScript);
      }
    };

    const timer = setTimeout(() => {
      loadIDXWidgets();
    }, 500);

    return () => {
      clearTimeout(timer);
      // Cleanup on unmount
      const showcaseScript = document.getElementById('idxwidgetsrc-112683');
      const slideshowScript = document.getElementById('idxwidgetsrc-112685');

      if (showcaseScript) showcaseScript.remove();
      if (slideshowScript) slideshowScript.remove();
    };
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
            EXCLUSIVE MLS PROPERTIES
          </h2>
          <div className="w-32 h-px bg-gray-900 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light">
            Discover the finest luxury properties directly from the Multiple Listing Service.
            Our curated selection features exclusive listings updated in real-time.
          </p>
        </motion.div>

        {/* Featured Slideshow Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="text-center mb-6">
            <h3 className="text-xl md:text-2xl font-light text-gray-900 mb-3">
              FEATURED LUXURY PORTFOLIO
            </h3>
            <div className="w-20 h-px bg-gray-400 mx-auto"></div>
          </div>

          <div className="relative overflow-hidden bg-gray-50 rounded-lg">
            {!slideshowLoaded && !slideshowError && (
              <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500 font-light">Loading properties...</p>
                </div>
              </div>
            )}

            {slideshowError && (
              <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
                <div className="text-center">
                  <p className="text-gray-500 mb-3">Properties temporarily unavailable</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-gray-900 hover:text-gray-700 underline font-light"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            )}

            <div
              id="idx-slideshow-container"
              className="w-full"
              style={{
                minHeight: '400px',
                filter: slideshowLoaded ? 'none' : 'blur(1px)',
                transition: 'filter 0.3s ease-in-out'
              }}
            >
              {/* IDX Slideshow widget will be injected here */}
            </div>
          </div>
        </motion.div>

        {/* Featured Showcase Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <div className="text-center mb-6">
            <h3 className="text-xl md:text-2xl font-light text-gray-900 mb-3">
              LUXURY PROPERTY COLLECTION
            </h3>
            <div className="w-20 h-px bg-gray-400 mx-auto"></div>
          </div>

          <div className="relative overflow-hidden bg-gray-50 rounded-lg">
            {!showcaseLoaded && !showcaseError && (
              <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500 font-light">Loading collection...</p>
                </div>
              </div>
            )}

            {showcaseError && (
              <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
                <div className="text-center">
                  <p className="text-gray-500 mb-3">Collection temporarily unavailable</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-gray-900 hover:text-gray-700 underline font-light"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            )}

            <div
              id="idx-showcase-container"
              className="w-full"
              style={{
                minHeight: '400px',
                filter: showcaseLoaded ? 'none' : 'blur(1px)',
                transition: 'filter 0.3s ease-in-out'
              }}
            >
              {/* IDX Showcase widget will be injected here */}
            </div>
          </div>
        </motion.div>

        {/* Compact CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-gray-50 py-10 px-8 rounded-lg">
            <h4 className="text-xl md:text-2xl font-light text-gray-900 mb-4">
              DISCOVER YOUR DREAM PROPERTY
            </h4>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto font-light">
              Ready to explore our complete portfolio? Our specialists are here to guide you.
            </p>
            <motion.a
              href="/properties/exclusive"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block bg-gray-900 text-white px-8 py-3 text-base font-light tracking-wide hover:bg-gray-800 transition-all duration-300"
            >
              EXPLORE FULL PORTFOLIO
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default IDXFeaturedSection;