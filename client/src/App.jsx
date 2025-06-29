import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Footer from './components/Footer';
import BuyPage from './pages/BuyPage';
import SellPage from './pages/SellPage';
import TeamPage from './pages/TeamPage';
import ContactPage from './pages/ContactPage';
import useLocation from './hooks/userLocation';
import NewsletterPage from './pages/NewsletterPage';
import PropertyListingsPage from './pages/propertyListingPage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';

const App = () => {
  const {
    locationData,
    isLoading,
    error,
    permissionStatus,
    isLocationSaved
  } = useLocation();

  React.useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('Location Hook Status:', {
        isLocationSaved,
        permissionStatus,
        hasLocationData: !!locationData,
        isLoading,
        error
      });
    }
  }, [isLocationSaved, permissionStatus, locationData, isLoading, error]);

  return (
    <Router>
      <Navbar />
      
      {import.meta.env.DEV && (
        <div className="bg-blue-100 p-2 text-xs text-center">
          Location Status: {isLocationSaved ? 'Saved' : 'Not Saved'} | 
          Permission: {permissionStatus} | 
          {isLoading && 'Loading...'} |
          {error && `Error: ${error}`}
        </div>
      )}

      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/buy" element={<BuyPage />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/newsletter" element={<NewsletterPage />} />
          <Route path="/properties/exclusive" element={<PropertyListingsPage />} />
          <Route path="/properties/:propertyId" element={<PropertyDetailPage />} />
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              Page Not Found
            </div>
          } />
        </Routes>
      </AnimatePresence>
      
      <Footer />
    </Router>
  );
};

export default App;