/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Building, 
  Menu, 
  X,
  LogOut,
  User,
  Activity
} from "lucide-react";

const Sidebar = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsOpen(false); 
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/",
      active: location.pathname === "/",
    },
    {
      icon: Building,
      label: "Properties",
      href: "/properties",
      active: location.pathname === "/properties",
    },
    {
      icon: Activity,
      label: "API Status",
      href: "/api-status",
      active: location.pathname === "/api-status",
    }
  ];

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleNavigation = (href) => {
    navigate(href);
    closeSidebar();
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
    closeSidebar();
  };

  if (isMobile) {
    return (
      <>
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between px-4 py-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h2 className="text-gray-900 text-lg font-light">ADMIN PORTAL</h2>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
            >
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-40 top-16"
                onClick={closeSidebar}
              />
              
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed top-16 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-xl"
              >
                <nav className="px-4 py-2 max-h-[calc(100vh-8rem)] overflow-y-auto">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                        ease: "easeOut",
                      }}
                    >
                      <motion.div
                        whileHover={{ backgroundColor: "#f9fafb" }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className={`flex items-center space-x-3 p-3 rounded cursor-pointer transition-all duration-200 ${
                          item.active 
                            ? "bg-black text-white" 
                            : "text-gray-600 hover:text-black"
                        }`}
                        onClick={() => handleNavigation(item.href)}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <item.icon size={20} />
                        </motion.div>
                        <span className="text-sm font-medium flex-1">{item.label}</span>

                        {item.active && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="w-2 h-2 bg-white rounded-full"
                          />
                        )}
                      </motion.div>
                    </motion.div>
                  ))}
                </nav>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="px-4 py-3 border-t border-gray-200"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 text-sm font-medium truncate">
                        {user?.email || 'admin@example.com'}
                      </p>
                      <p className="text-gray-600 text-xs truncate">
                        Administrator
                      </p>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ backgroundColor: "#dc2626" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </motion.button>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showLogoutConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
              onClick={() => setShowLogoutConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 max-w-sm w-full border border-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Logout</h3>
                <p className="text-gray-600 mb-4">Are you sure you want to logout?</p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-0 left-0 w-64 min-h-screen p-4 bg-white border-r border-gray-200 z-30"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 p-4"
        >
          <h2 className="text-gray-900 text-xl font-light">ADMIN PORTAL</h2>
          <p className="text-gray-600 text-sm font-light">Real Estate Management</p>
        </motion.div>

        <nav className="space-y-2 mb-8">
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            >
              <motion.div
                whileHover={{
                  scale: 1.01,
                  backgroundColor: item.active ? "#000000" : "#f9fafb",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                style={{
                  backgroundColor: item.active ? "#000000" : "transparent",
                }}
                className={`flex items-center space-x-3 p-3 rounded cursor-pointer transition-all duration-200 ${
                  item.active 
                    ? "text-white" 
                    : "text-gray-600 hover:text-black"
                }`}
                onClick={() => handleNavigation(item.href)}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <item.icon size={20} />
                </motion.div>
                <span className="text-sm font-medium">{item.label}</span>

                {item.active && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="ml-auto w-2 h-2 bg-white rounded-full"
                  />
                )}
              </motion.div>
            </motion.div>
          ))}
        </nav>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="absolute bottom-4 left-4 right-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            className="bg-gray-50 border border-gray-200 rounded p-3 mb-3"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 text-sm font-medium truncate">
                  {user?.email || 'admin@example.com'}
                </p>
                <p className="text-gray-600 text-xs truncate">
                  Administrator
                </p>
              </div>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.3 }}
            whileHover={{ scale: 1.01, backgroundColor: "#dc2626" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </motion.button>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-sm w-full border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                  <LogOut className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Confirm Logout</h3>
                  <p className="text-gray-600 text-sm">Are you sure you want to logout?</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                >
                  Logout
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;