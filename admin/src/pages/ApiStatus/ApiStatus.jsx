/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Database, 
  Globe, 
  Activity, 
  Server,
  Shield,
  Building,
  Mail,
  MapPin,
  Home,
  RefreshCw
} from 'lucide-react';
import { healthAPI } from '../../utils/api';

const ApiStatus = () => {
  const [serviceStatus, setServiceStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const services = [
    {
      id: 'health',
      name: 'Health Service',
      description: 'Core health monitoring and system status',
      icon: Activity,
      endpoint: healthAPI.checkHealth,
      color: 'from-green-500 to-green-600',
      endpoints: [
        'GET /self - Service Self-Check',
        'GET /health - General Health Status'
      ]
    },
    {
      id: 'auth',
      name: 'Authentication Service',
      description: 'User authentication and authorization',
      icon: Shield,
      endpoint: healthAPI.checkAuthSelf,
      color: 'from-blue-500 to-blue-600',
      endpoints: [
        'GET /auth/self - Service Self-Check',
        'POST /auth/signin - User Sign In',
        'GET /auth/profile - Get User Profile',
        'PUT /auth/profile - Update User Profile',
        'GET /auth/admin/users - Get All Users (Admin)',
        'GET /auth/admin/users/:id - Get User By ID (Admin)',
        'PUT /auth/admin/users/:id - Update User (Admin)',
        'DELETE /auth/admin/users/:id - Delete User (Admin)'
      ]
    },
    {
      id: 'property',
      name: 'Property Service',
      description: 'Real estate property management',
      icon: Building,
      endpoint: healthAPI.checkPropertySelf,
      color: 'from-purple-500 to-purple-600',
      endpoints: [
        'GET /property/self - Service Self-Check',
        'GET /property - Get All Properties',
        'GET /property/search - Search Properties',
        'GET /property/featured - Get Featured Properties',
        'GET /property/:id - Get Property By ID',
        'GET /property/:id/similar - Get Similar Properties',
        'POST /property/admin/add - Add Property (Admin)',
        'PUT /property/admin/:id - Update Property (Admin)',
        'DELETE /property/admin/:id - Delete Property (Admin)'
      ]
    },
    {
      id: 'location',
      name: 'Location Service',
      description: 'Geographic location and mapping statistics',
      icon: MapPin,
      endpoint: healthAPI.checkLocationStatSelf,
      color: 'from-orange-500 to-orange-600',
      endpoints: [
        'GET /location-stat/self - Service Self-Check',
        'GET /location-stat - Get Location Stats',
        'POST /location-stat - Add Location Stat',
        'GET /location-stat/:id - Get Stat By ID',
        'PUT /location-stat/:id - Update Location Stat',
        'DELETE /location-stat/:id - Delete Location Stat'
      ]
    },
    {
      id: 'newsletter',
      name: 'Newsletter Service',
      description: 'Email newsletter and notifications',
      icon: Mail,
      endpoint: healthAPI.checkNewsletterSelf,
      color: 'from-red-500 to-red-600',
      endpoints: [
        'GET /newsletter/self - Service Self-Check',
        'POST /newsletter/subscribe - Subscribe to Newsletter',
        'POST /newsletter/unsubscribe - Unsubscribe from Newsletter',
        'GET /newsletter/status/:email - Get Subscription Status',
        'PUT /newsletter/preferences/:email - Update Preferences',
        'GET /newsletter/admin/subscribers - Get All Subscribers (Admin)',
        'GET /newsletter/admin/subscribers/:id - Get Subscriber (Admin)',
        'PUT /newsletter/admin/subscribers/:id - Update Subscriber (Admin)',
        'DELETE /newsletter/admin/subscribers/:id - Delete Subscriber (Admin)',
        'POST /newsletter/admin/send-bulk - Send Bulk Email (Admin)',
        'GET /newsletter/admin/stats - Get Newsletter Stats (Admin)'
      ]
    }
  ];

  const checkServiceHealth = async (service) => {
    const startTime = Date.now();
    try {
      const response = await service.endpoint();
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      return {
        status: 'online',
        data: response.data,
        responseTime,
        lastChecked: new Date().toISOString()
      };
    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      return {
        status: 'offline',
        error: error.message,
        responseTime,
        lastChecked: new Date().toISOString()
      };
    }
  };

  const checkAllServices = async () => {
    setLoading(true);
    const statuses = {};

    for (const service of services) {
      const result = await checkServiceHealth(service);
      statuses[service.id] = result;
    }

    setServiceStatus(statuses);
    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => {
    checkAllServices();
    const interval = setInterval(checkAllServices, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getOverallStatus = () => {
    if (loading) return 'checking';
    
    const statuses = Object.values(serviceStatus);
    const onlineServices = statuses.filter(s => s.status === 'online').length;
    const totalServices = statuses.length;

    if (onlineServices === totalServices) return 'all-operational';
    if (onlineServices > totalServices / 2) return 'partial-outage';
    return 'major-outage';
  };

  const getStatusMessage = () => {
    const overall = getOverallStatus();
    switch (overall) {
      case 'checking':
        return 'Checking Services...';
      case 'all-operational':
        return 'All Systems Operational';
      case 'partial-outage':
        return 'Partial Service Disruption';
      case 'major-outage':
        return 'Major Service Outage';
      default:
        return 'Status Unknown';
    }
  };

  const getStatusColor = () => {
    const overall = getOverallStatus();
    switch (overall) {
      case 'checking':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'all-operational':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'partial-outage':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'major-outage':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const StatusIndicator = ({ status, compact = false }) => {
    if (loading) {
      return (
        <div className={`flex items-center ${compact ? 'text-sm' : ''}`}>
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
          <span className="font-medium text-gray-600">Checking...</span>
        </div>
      );
    }

    if (status === 'online') {
      return (
        <div className={`flex items-center ${compact ? 'text-sm' : ''}`}>
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="font-medium text-green-600">Operational</span>
        </div>
      );
    }

    return (
      <div className={`flex items-center ${compact ? 'text-sm' : ''}`}>
        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
        <span className="font-medium text-red-600">Offline</span>
      </div>
    );
  };

  const formatUptime = (uptime) => {
    if (!uptime) return 'N/A';
    if (typeof uptime === 'string') return uptime;
    
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
  };

  const formatMemory = (bytes) => {
    if (!bytes) return 'N/A';
    if (typeof bytes === 'string' && bytes.includes('MB')) return bytes;
    
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
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
            API STATUS
          </h1>
          <p className="text-gray-600 font-light">
            Real-time monitoring of system services
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={checkAllServices}
          disabled={loading}
          className="mt-4 md:mt-0 bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Status</span>
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <div className={`inline-flex items-center px-8 py-4 rounded border-2 ${getStatusColor()}`}>
          <div className="flex items-center space-x-3">
            {loading ? (
              <Clock className="w-6 h-6 animate-spin" />
            ) : getOverallStatus() === 'all-operational' ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <XCircle className="w-6 h-6" />
            )}
            <span className="text-xl font-medium">{getStatusMessage()}</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gray-50 border border-gray-200 rounded p-8 mb-8"
      >
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div className="bg-white border border-gray-200 rounded p-6">
            <Database className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <div className="text-3xl font-light text-gray-900 mb-2">{services.length}</div>
            <div className="text-gray-600 font-medium">Total Services</div>
          </div>
          <div className="bg-white border border-gray-200 rounded p-6">
            <CheckCircle className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <div className="text-3xl font-light text-gray-900 mb-2">
              {Object.values(serviceStatus).filter(s => s?.status === 'online').length}
            </div>
            <div className="text-gray-600 font-medium">Services Online</div>
          </div>
          <div className="bg-white border border-gray-200 rounded p-6">
            <Activity className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <div className="text-3xl font-light text-gray-900 mb-2">
              {lastUpdated ? lastUpdated.toLocaleTimeString() : '--:--'}
            </div>
            <div className="text-gray-600 font-medium">Last Updated</div>
          </div>
          <div className="bg-white border border-gray-200 rounded p-6">
            <Globe className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <div className="text-3xl font-light text-gray-900 mb-2">
              {lastUpdated ? lastUpdated.toLocaleTimeString() : '--:--'}
            </div>
            <div className="text-gray-600 font-medium">Last Updated</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid lg:grid-cols-2 gap-6"
      >
        {services.map((service, index) => {
          const Icon = service.icon;
          const status = serviceStatus[service.id];

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-4 rounded-lg bg-gradient-to-r ${service.color} text-white`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-gray-900 mb-2">{service.name}</h3>
                      <p className="text-gray-600 mb-3">{service.description}</p>
                      <div className="flex items-center space-x-4">
                        <StatusIndicator status={status?.status} compact />
                        <span className="text-sm text-gray-500">{service.endpoints.length} endpoints</span>
                        {status?.responseTime && (
                          <span className="text-sm text-gray-500">{status.responseTime}ms</span>
                        )}
                        {status?.lastChecked && (
                          <span className="text-sm text-gray-500">
                            {new Date(status.lastChecked).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {status?.data && (
                <div className="p-6 border-b border-gray-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Service Details</h4>
                  
                  {status.data.data && (
                    <div className="space-y-3">
                      {status.data.data.application?.environment && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Environment:</span>
                          <span className="text-gray-900 font-medium capitalize">
                            {status.data.data.application.environment}
                          </span>
                        </div>
                      )}
                      
                      {status.data.data.application?.uptime && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Uptime:</span>
                          <span className="text-gray-900 font-medium">
                            {formatUptime(status.data.data.application.uptime)}
                          </span>
                        </div>
                      )}
                      
                      {status.data.data.application?.memoryUsage?.heapUsed && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Memory Used:</span>
                          <span className="text-gray-900 font-medium">
                            {formatMemory(status.data.data.application.memoryUsage.heapUsed)}
                          </span>
                        </div>
                      )}
                      
                      {status.data.data.system?.freeMemory && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Free Memory:</span>
                          <span className="text-gray-900 font-medium">
                            {formatMemory(status.data.data.system.freeMemory)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {status.data.message && (
                    <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded">
                      <span className="text-sm text-gray-600">{status.data.message}</span>
                    </div>
                  )}

                  {status.error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                      <span className="text-sm text-red-600">Error: {status.error}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Available Endpoints</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {service.endpoints.map((endpoint, endpointIndex) => (
                    <div
                      key={endpointIndex}
                      className="flex items-start space-x-3 p-3 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0 mt-2"></div>
                      <span className="text-sm text-gray-700 font-mono leading-relaxed">{endpoint}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 bg-gray-50 border border-gray-200 rounded p-6 text-center"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">Monitoring Information</h3>
        <div className="grid md:grid-cols-3 gap-6 text-gray-600">
          <div>
            <div className="font-medium mb-2 text-gray-900">Auto Refresh</div>
            <p className="text-sm">Status updates every 30 seconds</p>
          </div>
          <div>
            <div className="font-medium mb-2 text-gray-900">Coverage</div>
            <p className="text-sm">All critical system components</p>
          </div>
          <div>
            <div className="font-medium mb-2 text-gray-900">Response Time</div>
            <p className="text-sm">Real-time latency monitoring</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ApiStatus;