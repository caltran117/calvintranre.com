/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Users, 
  Send, 
  Trash2, 
  Edit3,
  Search,
  Filter,
  UserCheck,
  UserX,
  Calendar,
  TrendingUp,
  Eye,
  MoreVertical,
  Check,
  X
} from 'lucide-react';

import { newsletterAPI } from '../../utils/api';

const Newsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    isSubscribed: '',
    consent: '',
    sortBy: 'subscribedAt',
    sortOrder: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [stats, setStats] = useState({});
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkEmail, setBulkEmail] = useState({
    subject: '',
    content: '',
    onlySubscribed: true,
    onlyConsented: true
  });
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState(null);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...filters
      };

      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      );

      const response = await newsletterAPI.getAllSubscribers(cleanParams);
      const responseData = response.data.data || response.data;
      
      setSubscribers(responseData.subscribers || []);
      setTotalSubscribers(responseData.pagination?.total || 0);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await newsletterAPI.getStats();
      setStats(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchSubscribers();
    fetchStats();
  }, [currentPage, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const handleDelete = (subscriber) => {
    setSubscriberToDelete(subscriber);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await newsletterAPI.deleteSubscriber(subscriberToDelete._id);
      setSubscribers(subscribers.filter(s => s._id !== subscriberToDelete._id));
      setShowDeleteConfirm(false);
      setSubscriberToDelete(null);
      fetchStats();
    } catch (error) {
      console.error('Error deleting subscriber:', error);
    }
  };

  const updateSubscriber = async (subscriberId, data) => {
    try {
      const response = await newsletterAPI.updateSubscriber(subscriberId, data);
      const updatedSubscriber = response.data.data || response.data;
      
      setSubscribers(subscribers.map(s => 
        s._id === subscriberId ? updatedSubscriber : s
      ));
      fetchStats();
    } catch (error) {
      console.error('Error updating subscriber:', error);
    }
  };

  const handleBulkEmail = async () => {
    try {
      await newsletterAPI.sendBulkEmail(bulkEmail);
      setShowBulkModal(false);
      setBulkEmail({
        subject: '',
        content: '',
        onlySubscribed: true,
        onlyConsented: true
      });
      alert('Bulk email sent successfully!');
    } catch (error) {
      console.error('Error sending bulk email:', error);
      alert('Error sending bulk email');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (subscriber) => {
    if (subscriber.isSubscribed && subscriber.consent) return 'text-green-600 bg-green-50';
    if (!subscriber.consent) return 'text-red-600 bg-red-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  const getStatusText = (subscriber) => {
    if (subscriber.isSubscribed && subscriber.consent) return 'Active';
    if (!subscriber.consent) return 'No Consent';
    return 'Unsubscribed';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-white min-h-screen"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
      >
        <div>
          <h1 className="text-4xl font-light text-gray-900 mb-2">
            NEWSLETTER MANAGEMENT
          </h1>
          <p className="text-gray-600 font-light">
            Manage your newsletter subscribers and campaigns
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowBulkModal(true)}
          className="mt-4 md:mt-0 bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors font-medium flex items-center space-x-2"
        >
          <Send className="w-5 h-5" />
          <span>Send Bulk Email</span>
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <div className="bg-gray-50 border border-gray-200 rounded p-6">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-gray-600 text-sm">Total Subscribers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSubscribers || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded p-6">
          <div className="flex items-center space-x-3">
            <UserCheck className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-gray-600 text-sm">Active Subscribers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeSubscribers || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded p-6">
          <div className="flex items-center space-x-3">
            <UserX className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-gray-600 text-sm">Unsubscribed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.unsubscribedCount || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded p-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-gray-600 text-sm">Growth Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.growthRate || 0}%</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gray-50 border border-gray-200 rounded p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search subscribers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none"
            />
          </div>
          <select
            value={filters.isSubscribed}
            onChange={(e) => handleFilterChange('isSubscribed', e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none"
          >
            <option value="">All Status</option>
            <option value="true">Subscribed</option>
            <option value="false">Unsubscribed</option>
          </select>
          <select
            value={filters.consent}
            onChange={(e) => handleFilterChange('consent', e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none"
          >
            <option value="">All Consent</option>
            <option value="true">Consented</option>
            <option value="false">No Consent</option>
          </select>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none"
          >
            <option value="subscribedAt">Date Subscribed</option>
            <option value="email">Email</option>
            <option value="numberOfEmails">Emails Sent</option>
          </select>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full"
          />
        </div>
      ) : (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white border border-gray-200 rounded overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900">Email</th>
                  <th className="text-left p-4 font-medium text-gray-900">Status</th>
                  <th className="text-left p-4 font-medium text-gray-900">Consent</th>
                  <th className="text-left p-4 font-medium text-gray-900">Emails Sent</th>
                  <th className="text-left p-4 font-medium text-gray-900">Subscribed</th>
                  <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber, index) => (
                  <motion.tr
                    key={subscriber._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                          <Mail className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-gray-900">{subscriber.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(subscriber)}`}>
                        {getStatusText(subscriber)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {subscriber.consent ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-red-600" />
                        )}
                        <span className="text-sm text-gray-600">
                          {subscriber.consent ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-600">{subscriber.numberOfEmails || 0}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-600">
                        {formatDate(subscriber.subscribedAt)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateSubscriber(subscriber._id, {
                            isSubscribed: !subscriber.isSubscribed,
                            consent: subscriber.consent
                          })}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title={subscriber.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                        >
                          {subscriber.isSubscribed ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(subscriber)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Bulk Email Modal */}
      <AnimatePresence>
        {showBulkModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowBulkModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Send Bulk Email</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={bulkEmail.subject}
                    onChange={(e) => setBulkEmail({...bulkEmail, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-black focus:border-black outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    value={bulkEmail.content}
                    onChange={(e) => setBulkEmail({...bulkEmail, content: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-black focus:border-black outline-none"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={bulkEmail.onlySubscribed}
                      onChange={(e) => setBulkEmail({...bulkEmail, onlySubscribed: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Only subscribed users</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={bulkEmail.onlyConsented}
                      onChange={(e) => setBulkEmail({...bulkEmail, onlyConsented: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Only consented users</span>
                  </label>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowBulkModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkEmail}
                  className="flex-1 px-4 py-2 text-white bg-black rounded hover:bg-gray-800 transition-colors"
                >
                  Send Email
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Subscriber</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete {subscriberToDelete?.email}? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Newsletter;