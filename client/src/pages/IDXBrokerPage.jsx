import React, { useEffect } from 'react';

const IDXBrokerPage = () => {
  useEffect(() => {
    // Check if script already exists
    const existingScript = document.getElementById('idxwidgetsrc-112686');
    if (existingScript) {
      return;
    }

    const script = document.createElement('script');
    script.charset = 'UTF-8';
    script.type = 'text/javascript';
    script.id = 'idxwidgetsrc-112686';
    script.src = '//calvintranre.idxbroker.com/idx/widgets/112686';
    
    const widgetContainer = document.getElementById('idx-widget-container');
    if (widgetContainer) {
      widgetContainer.appendChild(script);
    }

    return () => {
      const scriptToRemove = document.getElementById('idxwidgetsrc-112686');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
      // Clear the container content
      const container = document.getElementById('idx-widget-container');
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Property Search
          </h1>
          <p className="text-xl text-gray-600">
            Find your perfect home with our advanced property search
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div id="idx-widget-container" className="w-full">
            {/* IDX Broker widget will load here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDXBrokerPage;