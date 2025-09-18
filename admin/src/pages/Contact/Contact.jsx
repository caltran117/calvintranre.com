/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  MessageSquare,
  User,
  Trash2,
  Eye,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  Check,
  X,
  Clock,
  MessageCircle,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

import { contactAPI } from '../../utils/api';

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    interest: '',
    isActive: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const [stats, setStats] = useState({});
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [contactToUpdate, setContactToUpdate] = useState(null);
  const [updateData, setUpdateData] = useState({
    status: '',
    adminNotes: ''
  });

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...filters
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      );

      const response = await contactAPI.getAllContacts(cleanParams);
      const responseData = response.data.data || response.data;

      setContacts(responseData.contacts || []);
      setTotalContacts(responseData.pagination?.total || 0);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await contactAPI.getContactStats();
      setStats(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, [currentPage, filters, searchTerm]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const handleDelete = (contact) => {
    setContactToDelete(contact);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await contactAPI.deleteContact(contactToDelete._id);
      setContacts(contacts.filter(c => c._id !== contactToDelete._id));
      setShowDeleteConfirm(false);
      setContactToDelete(null);
      fetchStats();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleUpdateStatus = (contact) => {
    setContactToUpdate(contact);
    setUpdateData({
      status: contact.status,
      adminNotes: contact.adminNotes || ''
    });
    setShowUpdateModal(true);
  };

  const updateContactStatus = async () => {
    try {
      const response = await contactAPI.updateContact(contactToUpdate._id, updateData);
      const updatedContact = response.data.data || response.data;

      setContacts(contacts.map(c =>
        c._id === contactToUpdate._id ? updatedContact : c
      ));
      setShowUpdateModal(false);
      setContactToUpdate(null);
      fetchStats();
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const viewContact = (contact) => {
    setSelectedContact(contact);
    setShowContactModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'read':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'replied':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'closed':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new':
        return <AlertCircle className="w-4 h-4" />;
      case 'read':
        return <Eye className="w-4 h-4" />;
      case 'replied':
        return <CheckCircle className="w-4 h-4" />;
      case 'closed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getInterestColor = (interest) => {
    switch (interest) {
      case 'buying':
        return 'text-green-600 bg-green-50';
      case 'selling':
        return 'text-blue-600 bg-blue-50';
      case 'renting':
        return 'text-purple-600 bg-purple-50';
      case 'investing':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
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
            CONTACT MANAGEMENT
          </h1>
          <p className="text-gray-600 font-light">
            Manage contact inquiries and customer communications
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <div className="bg-gray-50 border border-gray-200 rounded p-6">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-gray-600 text-sm">Total Contacts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalContacts || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-gray-600 text-sm">New Contacts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.statusBreakdown?.new || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded p-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-gray-600 text-sm">Replied</p>
              <p className="text-2xl font-bold text-gray-900">{stats.statusBreakdown?.replied || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded p-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-gray-600 text-sm">Recent (30 days)</p>
              <p className="text-2xl font-bold text-gray-900">{stats.recentContacts || 0}</p>
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
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={filters.interest}
            onChange={(e) => handleFilterChange('interest', e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 outline-none"
          >
            <option value="">All Interests</option>
            <option value="buying">Buying</option>
            <option value="selling">Selling</option>
            <option value="renting">Renting</option>
            <option value="investing">Investing</option>
            <option value="other">Other</option>
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
                  <th className="text-left p-4 font-medium text-gray-900">Contact</th>
                  <th className="text-left p-4 font-medium text-gray-900">Interest</th>
                  <th className="text-left p-4 font-medium text-gray-900">Status</th>
                  <th className="text-left p-4 font-medium text-gray-900">Created</th>
                  <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact, index) => (
                  <motion.tr
                    key={contact._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {contact.firstName} {contact.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{contact.email}</p>
                          {contact.phone && (
                            <p className="text-sm text-gray-500">{contact.phone}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {contact.interest && (
                        <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getInterestColor(contact.interest)}`}>
                          {contact.interest}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium border flex items-center space-x-1 ${getStatusColor(contact.status)}`}>
                          {getStatusIcon(contact.status)}
                          <span className="capitalize">{contact.status}</span>
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-600">
                        {formatDate(contact.createdAt)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => viewContact(contact)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(contact)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Update Status"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(contact)}
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

      {/* Contact Details Modal */}
      <AnimatePresence>
        {showContactModal && selectedContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium text-gray-900">Contact Details</h3>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Personal Information</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">Name:</span> {selectedContact.firstName} {selectedContact.lastName}</p>
                      <p><span className="font-medium">Email:</span> {selectedContact.email}</p>
                      {selectedContact.phone && <p><span className="font-medium">Phone:</span> {selectedContact.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contact Details</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">Interest:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs font-medium capitalize ${getInterestColor(selectedContact.interest)}`}>
                          {selectedContact.interest || 'Not specified'}
                        </span>
                      </p>
                      <p><span className="font-medium">Status:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs font-medium border flex items-center space-x-1 w-fit ${getStatusColor(selectedContact.status)}`}>
                          {getStatusIcon(selectedContact.status)}
                          <span className="capitalize">{selectedContact.status}</span>
                        </span>
                      </p>
                      <p><span className="font-medium">Newsletter:</span> {selectedContact.subscribeNewsletter ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Message</h4>
                  <div className="bg-gray-50 p-4 rounded border">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>

                {selectedContact.adminNotes && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Admin Notes</h4>
                    <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.adminNotes}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
                  <p><span className="font-medium">Created:</span> {formatDate(selectedContact.createdAt)}</p>
                  <p><span className="font-medium">Updated:</span> {formatDate(selectedContact.updatedAt)}</p>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowContactModal(false);
                    handleUpdateStatus(selectedContact);
                  }}
                  className="px-4 py-2 text-white bg-black rounded hover:bg-gray-800 transition-colors"
                >
                  Update Status
                </button>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Update Status Modal */}
      <AnimatePresence>
        {showUpdateModal && contactToUpdate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowUpdateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Update Contact Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={updateData.status}
                    onChange={(e) => setUpdateData({...updateData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-black focus:border-black outline-none"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                  <textarea
                    value={updateData.adminNotes}
                    onChange={(e) => setUpdateData({...updateData, adminNotes: e.target.value})}
                    rows={4}
                    placeholder="Add notes about this contact..."
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-black focus:border-black outline-none"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updateContactStatus}
                  className="flex-1 px-4 py-2 text-white bg-black rounded hover:bg-gray-800 transition-colors"
                >
                  Update
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && contactToDelete && (
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Contact</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete the contact from {contactToDelete.firstName} {contactToDelete.lastName}? This action cannot be undone.
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

export default Contact;