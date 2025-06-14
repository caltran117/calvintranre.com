// App.jsx
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

const App = () => {
  return (
    <Router>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/buy" element={<BuyPage />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<div className="min-h-screen flex items-center justify-center">Page Not Found</div>} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </Router>
  );
};

export default App;