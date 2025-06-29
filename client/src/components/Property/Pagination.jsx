import React from 'react';
import { motion } from 'framer-motion';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageNumbers = totalPages > 1 ? getPageNumbers() : [];

  if (totalPages <= 1) return null;

  return (
    <motion.div
      className="flex items-center justify-center space-x-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm text-gray-600 border border-gray-300 hover:border-gray-500 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>

      {pageNumbers.map((number, index) => (
        <React.Fragment key={index}>
          {number === '...' ? (
            <span className="px-2 py-2 text-gray-400">...</span>
          ) : (
            <button
              onClick={() => onPageChange(number)}
              className={`px-4 py-2 text-sm border transition-colors ${
                currentPage === number
                  ? 'bg-black text-white border-black'
                  : 'text-gray-600 border-gray-300 hover:border-gray-500 hover:text-gray-900'
              }`}
            >
              {number}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-sm text-gray-600 border border-gray-300 hover:border-gray-500 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </motion.div>
  );
};

export default Pagination;