import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { newsletterAPI } from '../utils/api';
import { Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const NewsletterPage = () => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [unsubscribeEmail, setUnsubscribeEmail] = useState('');
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email || !consent) {
      setMessage('Please enter your email and accept the terms.');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      await newsletterAPI.subscribe(email, consent);
      setMessage('Successfully subscribed to our newsletter!');
      setMessageType('success');
      setEmail('');
      setConsent(false);
    } catch (error) {
      if (error.response?.status === 409) {
        setMessage('You are already subscribed to our newsletter!');
        setMessageType('warning');
      } else {
        setMessage(error.response?.data?.message || 'Failed to subscribe. Please try again.');
        setMessageType('error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async (e) => {
    e.preventDefault();
    
    if (!unsubscribeEmail) {
      setMessage('Please enter your email to unsubscribe.');
      setMessageType('error');
      return;
    }

    setIsUnsubscribing(true);
    setMessage('');

    try {
      await newsletterAPI.unsubscribe(unsubscribeEmail);
      setMessage('Successfully unsubscribed from our newsletter.');
      setMessageType('success');
      setUnsubscribeEmail('');
    } catch (error) {
      if (error.response?.status === 404) {
        setMessage('Email not found in our newsletter list.');
        setMessageType('warning');
      } else {
        setMessage(error.response?.data?.message || 'Failed to unsubscribe. Please try again.');
        setMessageType('error');
      }
    } finally {
      setIsUnsubscribing(false);
    }
  };

  return (
    <div className="min-h-screen">
      <motion.section
        className="py-24 px-4 bg-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-light mb-6"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            STAY INFORMED
          </motion.h1>
          <motion.p
            className="max-w-2xl mx-auto text-gray-600"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Get exclusive access to luxury property listings, market insights, and expert real estate advice delivered directly to your inbox.
          </motion.p>
        </div>
      </motion.section>

      <motion.section
        className="py-16 px-4 max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Mail className="w-8 h-8 text-gray-600" />
            </motion.div>
            <motion.h2
              className="text-3xl md:text-4xl font-light mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              NEWSLETTER SUBSCRIPTION
            </motion.h2>
            <motion.p
              className="text-gray-600 max-w-lg mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              Join thousands of subscribers who receive weekly updates on the latest luxury real estate opportunities and market trends.
            </motion.p>
          </div>

          {message && (
            <motion.div
              className={`mb-6 p-4 rounded-lg flex items-center ${
                messageType === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : messageType === 'warning'
                  ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {messageType === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : messageType === 'warning' ? (
                <Mail className="w-5 h-5 mr-2" />
              ) : (
                <XCircle className="w-5 h-5 mr-2" />
              )}
              {message}
            </motion.div>
          )}

          <motion.form
            onSubmit={handleSubscribe}
            className="space-y-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-4 w-4 text-gray-600 focus:ring-gray-400 border-gray-300 rounded"
                required
              />
              <label htmlFor="consent" className="ml-3 text-sm text-gray-600">
                I agree to receive marketing communications and understand that I can unsubscribe at any time. 
                By subscribing, I consent to the processing of my personal data in accordance with the Privacy Policy.
              </label>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Subscribing...
                </>
              ) : (
                'Subscribe to Newsletter'
              )}
            </motion.button>
          </motion.form>
        </div>
      </motion.section>

      <motion.section
        className="py-8 px-4 max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">What You'll Receive:</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Weekly Market Updates</h4>
              <p>Latest trends and insights from the luxury real estate market.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Exclusive Listings</h4>
              <p>Early access to premium properties before they hit the market.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Expert Advice</h4>
              <p>Tips and guidance from our experienced real estate professionals.</p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="py-4 px-4 max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="text-center">
          <details className="inline-block text-left">
            <summary className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer underline">
              Unsubscribe
            </summary>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <form onSubmit={handleUnsubscribe} className="space-y-3">
                <div>
                  <label htmlFor="unsubscribe-email" className="block text-xs font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="unsubscribe-email"
                    value={unsubscribeEmail}
                    onChange={(e) => setUnsubscribeEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-transparent"
                    placeholder="Enter email to unsubscribe"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isUnsubscribing}
                  className="text-xs bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  {isUnsubscribing ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Unsubscribing...
                    </>
                  ) : (
                    'Unsubscribe'
                  )}
                </button>
              </form>
            </div>
          </details>
        </div>
      </motion.section>
    </div>
  );
};

export default NewsletterPage;