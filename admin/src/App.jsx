/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './pages/Home/Home';
import Properties from './pages/Properties/Properties';
import Newsletter from './pages/Newsletter/Newsletter';
import LocationStats from './pages/LocationStats/LocationStats';
import ApiStatus from './pages/ApiStatus/ApiStatus';
import Sidebar from './components/Sidebar/Sidebar';
import Login from './pages/Auth/Login';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        setIsAuthenticated(true);
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };

    setTimeout(checkAuth, 1000);
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl font-light text-gray-900 mb-2">Luxury Real Estate</h2>
          <p className="text-gray-600">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Sidebar user={user} onLogout={handleLogout} />
        <main className="lg:ml-64"> 
          <div className="pt-16 lg:pt-0 min-h-screen">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/newsletter" element={<Newsletter />} />
                <Route path="/location-stats" element={<LocationStats />} />
                <Route path="/api-status" element={<ApiStatus />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;