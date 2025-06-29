import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContactAgent = ({ property }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I'm interested in ${property.title} at ${property.location?.address?.street}, ${property.location?.address?.city}. Please contact me with more information.`
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }, 1000);
  };

  const agent = property.listing?.agent;

  return (
    <div className="bg-gray-50 p-6 space-y-6">
      {agent && (
        <div className="text-center border-b border-gray-200 pb-6">
          <h3 className="text-xl font-light mb-2 text-gray-900">Contact Agent</h3>
          <div className="space-y-2">
            <p className="font-medium text-gray-900">{agent.name}</p>
            {agent.company && (
              <p className="text-sm text-gray-600">{agent.company}</p>
            )}
            {agent.phone && (
              <a 
                href={`tel:${agent.phone}`}
                className="block text-sm text-gray-900 hover:text-gray-700 transition-colors"
              >
                {agent.phone}
              </a>
            )}
            {agent.email && (
              <a 
                href={`mailto:${agent.email}`}
                className="block text-sm text-gray-900 hover:text-gray-700 transition-colors"
              >
                {agent.email}
              </a>
            )}
          </div>
        </div>
      )}

      <div>
        <h4 className="font-medium text-gray-900 mb-4">Request Information</h4>
        
        {submitted ? (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-900 font-medium">Message Sent!</p>
            <p className="text-sm text-gray-600 mt-1">We'll get back to you soon.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors"
              />
            </div>
            
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors"
              />
            </div>
            
            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors"
              />
            </div>
            
            <div>
              <textarea
                name="message"
                placeholder="Message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors resize-none"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>

      <div className="border-t border-gray-200 pt-6 space-y-3">
        <button className="w-full border border-gray-300 text-gray-900 py-3 hover:bg-gray-100 transition-colors">
          Schedule a Tour
        </button>
        <button className="w-full border border-gray-300 text-gray-900 py-3 hover:bg-gray-100 transition-colors">
          Request Virtual Tour
        </button>
        <button className="w-full border border-gray-300 text-gray-900 py-3 hover:bg-gray-100 transition-colors">
          Save to Favorites
        </button>
      </div>

      {property.listing && (
        <div className="text-xs text-gray-500 space-y-1">
          {property.listing.listedDate && (
            <p>Listed: {new Date(property.listing.listedDate).toLocaleDateString()}</p>
          )}
          {property.listing.daysOnMarket && (
            <p>Days on Market: {property.listing.daysOnMarket}</p>
          )}
          {property.listing.featured && (
            <p className="text-black font-medium">Featured Property</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactAgent;