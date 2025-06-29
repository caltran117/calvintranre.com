/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, Building, AlertCircle } from 'lucide-react';
import { authAPI } from '../../utils/api';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authAPI.signin({
        email: formData.email,
        password: formData.password
      });

      const { accessToken, user } = response.data.data;
      
      if (!accessToken) {
        throw new Error('No access token received');
      }

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      onLogin(user);
      
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.response?.status === 403) {
        setError('Access denied. Admin role required.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-50" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: [0.05, 0.1, 0.05], 
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-20 w-32 h-32 bg-black rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: [0.03, 0.08, 0.03], 
          scale: [1, 1.2, 1],
          rotate: [360, 180, 0]
        }}
        transition={{
          duration: 25,
          delay: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-20 right-20 w-40 h-40 bg-gray-400 rounded-full blur-3xl"
      />

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div
            variants={itemVariants}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.2,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-lg shadow-lg mb-6"
            >
              <Building className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-light mb-2 text-gray-900">
              ADMIN PORTAL
            </h1>
            <p className="text-gray-600 font-light">
              Luxury Real Estate Management
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white border border-gray-100 rounded-lg shadow-xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 transition-colors duration-200 ${
                      focusedField === 'email' ? 'text-black' : 'text-gray-400'
                    }`} />
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 transition-colors duration-200 ${
                      focusedField === 'password' ? 'text-black' : 'text-gray-400'
                    }`} />
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none"
                    placeholder="Enter your password"
                    required
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </motion.button>
                </div>
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded border border-red-100"
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div variants={itemVariants}>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white py-3 px-4 rounded font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center space-x-2"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-opacity-30 border-t-white rounded-full"
                        />
                        <span>Signing in...</span>
                      </motion.div>
                    ) : (
                      <motion.span
                        key="signin"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Sign In
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            </form>

            <motion.div
              variants={itemVariants}
              className="mt-6 text-center"
            >
              <p className="text-xs text-gray-500 font-light">
                © 2025 Luxury Real Estate Admin Portal
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-center"
          >
            <p className="text-gray-700 text-sm mb-2 font-medium">Demo Credentials:</p>
            <p className="text-gray-600 text-xs font-light">
              Email: admin@gmail.com | Password: admin123
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;