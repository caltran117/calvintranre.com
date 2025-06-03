// HamburgerMenu.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HamburgerMenu = ({ isOpen, toggleMenu }) => {
  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "tween",
        duration: 0.5,
        when: "afterChildren",
        staggerChildren: 0.1,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "tween",
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
        staggerDirection: 1
      }
    }
  };

  const linkVariants = {
    closed: { opacity: 0, x: 50 },
    open: { opacity: 1, x: 0 }
  };

  // Menu structure based on the hamburger menu in Image 2
  const menuStructure = [
    {
      title: "PROPERTIES",
      links: [
        { name: "EXCLUSIVE LISTINGS", path: "/properties/exclusive" },
        { name: "NOTABLE TRANSACTIONS", path: "/properties/transactions" },
        { name: "RENTAL LISTINGS", path: "/properties/rentals" }
      ]
    },
    {
      title: "BUYERS",
      links: [
        { name: "SEARCH ALL HOMES", path: "/buyers/search" },
        { name: "NEIGHBORHOODS", path: "/buyers/neighborhoods" },
        { name: "PROPERTY PORTAL", path: "/buyers/portal" }
      ]
    },
    {
      title: "SELLERS",
      links: [
        { name: "LIST WITH US", path: "/sellers/list" },
        { name: "SALES RECORDS", path: "/sellers/records" }
      ]
    },
    {
      title: "ABOUT US",
      links: [
        { name: "MAURICIO UMANSKY", path: "/about/mauricio" },
        { name: "OUR TEAM", path: "/about/team" },
        { name: "OUR AGENTS", path: "/about/agents" }
      ]
    },
    {
      title: "MARKET TRENDS",
      links: [
        { name: "MARKET REPORTS", path: "/market/reports" }
      ]
    },
    {
      title: "PRESS",
      links: [
        { name: "FEATURED PRESS", path: "/press/featured" },
        { name: "PRESS INQUIRIES", path: "/press/inquiries" }
      ]
    },
    {
      title: "NEWSLETTER",
      links: []
    },
    {
      title: "THE AGENCY",
      links: []
    },
    {
      title: "CONTACT US",
      links: [],
      contact: {
        phone: "424.230.3701",
        email: "EA@THEAGENCYRE.COM",
        address: "331 FOOTHILL RD SUITE 100, BEVERLY HILLS, CA 90210"
      }
    }
  ];

  return (
    <motion.div
      className="fixed inset-0 bg-white z-50 overflow-y-auto"
      variants={menuVariants}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
    >
      <div className="p-6 h-full">
        <div className="flex justify-end mb-6">
          <button
            onClick={toggleMenu}
            className="text-gray-800 hover:text-gray-600 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {menuStructure.map((section, index) => (
            <motion.div 
              key={index}
              variants={linkVariants}
              className="mb-8"
            >
              <motion.h3 
                variants={linkVariants}
                className="text-lg font-medium text-gray-900 mb-4"
              >
                {section.title}
              </motion.h3>
              
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <motion.li key={linkIndex} variants={linkVariants}>
                    <Link 
                      to={link.path}
                      className="text-gray-700 hover:text-black block py-1"
                      onClick={toggleMenu}
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              {section.contact && (
                <motion.div 
                  variants={linkVariants}
                  className="mt-4 text-gray-700"
                >
                  <p>{section.contact.phone}</p>
                  <p>{section.contact.email}</p>
                  <p>{section.contact.address}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default HamburgerMenu;