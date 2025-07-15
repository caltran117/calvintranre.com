/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Chart from "react-apexcharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Home as HomeIcon,
  Eye,
  Users,
  MessageSquare,
  Plus,
  FileText,
  MapPin,
  Activity,
  Mail,
  UserCheck,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Target,
  Globe,
  Clock,
  Star,
  Filter,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { reportAPI } from "../../utils/api";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (number) => {
  return new Intl.NumberFormat("en-US").format(number);
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const MetricCard = ({ title, value, change, trend, period, currency, suffix, icon: Icon, color = "blue", index }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-300 relative overflow-hidden"
  >
    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${color}-400 to-${color}-600`}></div>
    
    <div className="flex items-center justify-between mb-4">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          delay: index * 0.1 + 0.3,
          type: "spring",
          stiffness: 200,
        }}
        className={`p-3 bg-gradient-to-br from-${color}-50 to-${color}-100 rounded-lg`}
      >
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </motion.div>
      
      <motion.div
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.4 }}
        className={`flex items-center text-sm font-semibold px-2 py-1 rounded-full ${
          trend === "up" 
            ? "text-green-700 bg-green-100" 
            : trend === "down"
            ? "text-red-700 bg-red-100"
            : "text-gray-700 bg-gray-100"
        }`}
      >
        {trend === "up" ? (
          <ArrowUp className="w-3 h-3 mr-1" />
        ) : trend === "down" ? (
          <ArrowDown className="w-3 h-3 mr-1" />
        ) : (
          <Activity className="w-3 h-3 mr-1" />
        )}
        {change > 0 ? "+" : ""}{change}%
      </motion.div>
    </div>
    
    <div className="space-y-2">
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      <motion.p
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.5 }}
        className="text-3xl font-bold text-gray-900"
      >
        {currency ? formatCurrency(value) : formatNumber(value)}
        {suffix || ""}
      </motion.p>
      <p className="text-xs text-gray-500">{period}</p>
    </div>
  </motion.div>
);

const ChartCard = ({ title, children, icon: Icon, fullWidth = false }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.005 }}
    className={`bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-300 ${
      fullWidth ? "col-span-full" : ""
    }`}
  >
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon className="w-5 h-5 text-gray-700" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="flex space-x-2">
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
          <Filter className="w-4 h-4" />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
    {children}
  </motion.div>
);

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [overviewData, setOverviewData] = useState(null);
  const [propertyStats, setPropertyStats] = useState(null);
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [newsletterMetrics, setNewsletterMetrics] = useState(null);
  const [locationAnalytics, setLocationAnalytics] = useState(null);
  const [dashboardTrends, setDashboardTrends] = useState(null);
  const [locationHeatmap, setLocationHeatmap] = useState(null);
  const [performanceAnalytics, setPerformanceAnalytics] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [
        overview, 
        properties, 
        users, 
        newsletter, 
        locations, 
        trends, 
        heatmap, 
        performance
      ] = await Promise.all([
        reportAPI.getOverview(),
        reportAPI.getPropertyStats(),
        reportAPI.getUserAnalytics(),
        reportAPI.getNewsletterMetrics(),
        reportAPI.getLocationAnalytics(),
        reportAPI.getDashboardTrends(),
        reportAPI.getLocationHeatmap({ days: 7 }),
        reportAPI.getPerformanceAnalytics(),
      ]);

      setOverviewData(overview.data.data);
      setPropertyStats(properties.data.data);
      setUserAnalytics(users.data.data);
      setNewsletterMetrics(newsletter.data.data);
      setLocationAnalytics(locations.data.data);
      setDashboardTrends(trends.data.data);
      setLocationHeatmap(heatmap.data.data);
      setPerformanceAnalytics(performance.data.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAllData();
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="h-32 bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow border border-red-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
            <p className="text-gray-600 mb-4">Unable to load dashboard data. Please try again.</p>
            <button 
              onClick={handleRefresh}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Chart configurations
  const propertyStatusChartOptions = {
    chart: {
      type: 'donut',
      height: 350,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 350 }
      }
    },
    labels: propertyStats?.distribution?.byStatus?.map(item => item._id || 'Unknown') || [],
    colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
    legend: {
      position: 'bottom',
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Properties',
              fontSize: '16px',
              fontWeight: 600,
              color: '#374151'
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return Math.round(val) + "%";
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " properties";
        }
      }
    }
  };

  const userRoleChartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: { enabled: true, delay: 150 }
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 8,
        dataLabels: { position: 'top' }
      }
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: { fontSize: '12px', colors: ["#304758"] }
    },
    xaxis: {
      categories: userAnalytics?.distribution?.byRole?.map(item => item._id || 'Unknown') || [],
      labels: { style: { fontSize: '12px', fontFamily: 'Inter, sans-serif' } }
    },
    yaxis: {
      labels: { style: { fontSize: '12px', fontFamily: 'Inter, sans-serif' } }
    },
    colors: ['#3b82f6'],
    grid: { borderColor: '#f1f5f9' },
    tooltip: {
      y: { formatter: function (val) { return val + " users"; } }
    }
  };

  const newsletterGrowthChartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: { enabled: true, delay: 150 }
      }
    },
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    colors: ['#10b981'],
    xaxis: {
      categories: newsletterMetrics?.growth?.map(item => `${item._id.month}/${item._id.day}`)?.slice(-7) || [],
      labels: { style: { fontSize: '12px', fontFamily: 'Inter, sans-serif' } }
    },
    yaxis: {
      labels: { style: { fontSize: '12px', fontFamily: 'Inter, sans-serif' } }
    },
    grid: { borderColor: '#f1f5f9' },
    tooltip: {
      y: { formatter: function (val) { return val + " new subscribers"; } }
    }
  };

  const propertyTypeChartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: { enabled: true, delay: 150 }
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 8,
        dataLabels: { position: 'top' }
      }
    },
    dataLabels: {
      enabled: true,
      style: { fontSize: '12px', colors: ["#fff"] }
    },
    xaxis: {
      labels: { style: { fontSize: '12px', fontFamily: 'Inter, sans-serif' } }
    },
    yaxis: {
      categories: propertyStats?.distribution?.byType?.map(item => item._id || 'Unknown') || [],
      labels: { style: { fontSize: '12px', fontFamily: 'Inter, sans-serif' } }
    },
    colors: ['#8b5cf6'],
    grid: { borderColor: '#f1f5f9' },
    tooltip: {
      y: { formatter: function (val) { return val + " properties"; } }
    }
  };

  const locationHeatmapOptions = {
    chart: {
      type: 'heatmap',
      height: 350,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: ['#3b82f6'],
    dataLabels: { enabled: false },
    xaxis: {
      labels: { style: { fontSize: '12px', fontFamily: 'Inter, sans-serif' } }
    },
    yaxis: {
      labels: { style: { fontSize: '12px', fontFamily: 'Inter, sans-serif' } }
    },
    grid: { borderColor: '#f1f5f9' },
    tooltip: {
      y: { formatter: function (val) { return val + " visits"; } }
    }
  };

  const performanceRadarOptions = {
    chart: {
      type: 'radar',
      height: 350,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    xaxis: {
      categories: ['Properties', 'Users', 'Newsletter', 'Locations', 'Activity', 'Growth']
    },
    colors: ['#3b82f6', '#10b981'],
    markers: { size: 6 },
    stroke: { width: 2 },
    fill: { opacity: 0.2 }
  };

  // Chart data
  const propertyStatusData = propertyStats?.distribution?.byStatus?.map(item => item.count) || [];
  const userRoleData = [{
    name: 'Users by Role',
    data: userAnalytics?.distribution?.byRole?.map(item => item.count) || []
  }];
  const newsletterGrowthData = [{
    name: 'New Subscribers',
    data: newsletterMetrics?.growth?.map(item => item.subscriptions)?.slice(-7) || []
  }];
  const propertyTypeData = [{
    name: 'Properties',
    data: propertyStats?.distribution?.byType?.map(item => item.count) || []
  }];

  // Use real location heatmap data from API
  const locationHeatmapData = locationHeatmap || [
    { name: 'Mon', data: [0, 0, 0, 0, 0, 0, 0] },
    { name: 'Tue', data: [0, 0, 0, 0, 0, 0, 0] },
    { name: 'Wed', data: [0, 0, 0, 0, 0, 0, 0] },
    { name: 'Thu', data: [0, 0, 0, 0, 0, 0, 0] },
    { name: 'Fri', data: [0, 0, 0, 0, 0, 0, 0] },
    { name: 'Sat', data: [0, 0, 0, 0, 0, 0, 0] },
    { name: 'Sun', data: [0, 0, 0, 0, 0, 0, 0] }
  ];

  // Use real performance data from API
  const performanceRadarData = performanceAnalytics?.performanceData || [{
    name: 'Current Performance',
    data: [0, 0, 0, 0, 0, 0]
  }];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 bg-gray-50 min-h-screen space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <motion.h1
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl font-bold text-gray-900 flex items-center"
          >
            <BarChart3 className="w-8 h-8 mr-3 text-blue-600" />
            Analytics Dashboard
          </motion.h1>
          <motion.p
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-gray-600 mt-2 flex items-center"
          >
            <Clock className="w-4 h-4 mr-2" />
            Last updated: {new Date().toLocaleString()}
          </motion.p>
        </div>
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 md:mt-0 flex space-x-3"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors shadow-sm border border-gray-200 flex items-center"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </motion.button>
        </motion.div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
      >
        <MetricCard
          title="Total Properties"
          value={overviewData?.properties?.total || 0}
          change={dashboardTrends?.properties?.change ? dashboardTrends.properties.change.toFixed(1) : 0}
          trend={dashboardTrends?.properties?.trend || "stable"}
          period="This month"
          icon={HomeIcon}
          color="blue"
          index={0}
        />
        <MetricCard
          title="Total Users"
          value={overviewData?.users?.total || 0}
          change={dashboardTrends?.users?.change ? dashboardTrends.users.change.toFixed(1) : 0}
          trend={dashboardTrends?.users?.trend || "stable"}
          period="This month"
          icon={Users}
          color="green"
          index={1}
        />
        <MetricCard
          title="Newsletter Subscribers"
          value={overviewData?.newsletter?.totalSubscribers || 0}
          change={dashboardTrends?.newsletter?.change ? dashboardTrends.newsletter.change.toFixed(1) : 0}
          trend={dashboardTrends?.newsletter?.trend || "stable"}
          period="This month"
          icon={MessageSquare}
          color="purple"
          index={2}
        />
        <MetricCard
          title="Location Visits"
          value={overviewData?.locations?.total || 0}
          change={dashboardTrends?.locations?.change ? dashboardTrends.locations.change.toFixed(1) : 0}
          trend={dashboardTrends?.locations?.trend || "stable"}
          period="This month"
          icon={MapPin}
          color="orange"
          index={3}
        />
        <MetricCard
          title="Active Properties"
          value={overviewData?.properties?.active || 0}
          change={dashboardTrends?.activeProperties?.change ? dashboardTrends.activeProperties.change.toFixed(1) : 0}
          trend={dashboardTrends?.activeProperties?.trend || "stable"}
          period="This month"
          icon={Activity}
          color="red"
          index={4}
        />
        <MetricCard
          title="Admin Users"
          value={overviewData?.users?.admins || 0}
          change={dashboardTrends?.admins?.change ? dashboardTrends.admins.change.toFixed(1) : 0}
          trend={dashboardTrends?.admins?.trend || "stable"}
          period="This month"
          icon={UserCheck}
          color="indigo"
          index={5}
        />
      </motion.div>

      {/* Charts Row 1 - Main Analytics */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <ChartCard title="Property Status Distribution" icon={PieChartIcon}>
          {propertyStatusData.length > 0 ? (
            <Chart
              options={propertyStatusChartOptions}
              series={propertyStatusData}
              type="donut"
              height={350}
            />
          ) : (
            <div className="flex items-center justify-center h-80 text-gray-400">
              <div className="text-center">
                <PieChartIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No property status data available</p>
              </div>
            </div>
          )}
        </ChartCard>

        <ChartCard title="User Distribution by Role" icon={Users}>
          {userRoleData[0].data.length > 0 ? (
            <Chart
              options={userRoleChartOptions}
              series={userRoleData}
              type="bar"
              height={350}
            />
          ) : (
            <div className="flex items-center justify-center h-80 text-gray-400">
              <div className="text-center">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No user role data available</p>
              </div>
            </div>
          )}
        </ChartCard>
      </motion.div>

      {/* Charts Row 2 - Growth & Types */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <ChartCard title="Newsletter Growth Trend (7 Days)" icon={Mail}>
          {newsletterGrowthData[0].data.length > 0 ? (
            <Chart
              options={newsletterGrowthChartOptions}
              series={newsletterGrowthData}
              type="area"
              height={350}
            />
          ) : (
            <div className="flex items-center justify-center h-80 text-gray-400">
              <div className="text-center">
                <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No newsletter growth data available</p>
              </div>
            </div>
          )}
        </ChartCard>

        <ChartCard title="Property Types Distribution" icon={HomeIcon}>
          {propertyTypeData[0].data.length > 0 ? (
            <Chart
              options={propertyTypeChartOptions}
              series={propertyTypeData}
              type="bar"
              height={350}
            />
          ) : (
            <div className="flex items-center justify-center h-80 text-gray-400">
              <div className="text-center">
                <HomeIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No property type data available</p>
              </div>
            </div>
          )}
        </ChartCard>
      </motion.div>

      {/* Charts Row 3 - Advanced Analytics */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <ChartCard title="Location Activity Heatmap" icon={Globe}>
          <Chart
            options={locationHeatmapOptions}
            series={locationHeatmapData}
            type="heatmap"
            height={350}
          />
        </ChartCard>

        <ChartCard title="Performance Overview" icon={Target}>
          <Chart
            options={performanceRadarOptions}
            series={performanceRadarData}
            type="radar"
            height={350}
          />
        </ChartCard>
      </motion.div>

      {/* Detailed Stats Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Detailed Analytics Summary
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-900 mb-1">
              {propertyStats?.pricing?.avgPrice ? formatCurrency(propertyStats.pricing.avgPrice) : 'N/A'}
            </div>
            <div className="text-sm text-blue-700 font-medium">Average Property Price</div>
            <div className="text-xs text-blue-600 mt-1">
              Max: {propertyStats?.pricing?.maxPrice ? formatCurrency(propertyStats.pricing.maxPrice) : 'N/A'}
            </div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-900 mb-1">
              {newsletterMetrics?.metrics?.unsubscribeRate ? `${newsletterMetrics.metrics.unsubscribeRate.toFixed(1)}%` : 'N/A'}
            </div>
            <div className="text-sm text-green-700 font-medium">Unsubscribe Rate</div>
            <div className="text-xs text-green-600 mt-1">
              Active: {overviewData?.newsletter?.activeSubscribers || 0}
            </div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-900 mb-1">
              {userAnalytics?.favorites?.avgFavorites ? userAnalytics.favorites.avgFavorites.toFixed(1) : 'N/A'}
            </div>
            <div className="text-sm text-purple-700 font-medium">Avg Favorites per User</div>
            <div className="text-xs text-purple-600 mt-1">
              Total: {userAnalytics?.favorites?.totalFavorites || 0}
            </div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-900 mb-1">
              {((overviewData?.properties?.active || 0) / (overviewData?.properties?.total || 1) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-orange-700 font-medium">Property Activity Rate</div>
            <div className="text-xs text-orange-600 mt-1">
              {overviewData?.properties?.active || 0} of {overviewData?.properties?.total || 0} active
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity & Quick Actions */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Recent Property Listings
            </h3>
            <div className="space-y-3">
              {propertyStats?.recentListings?.slice(0, 5).map((property, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{property.location?.address?.city || 'Unknown Location'}</p>
                    <p className="text-sm text-gray-600">{property.listing?.status || 'Unknown Status'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {property.pricing?.salePrice ? formatCurrency(property.pricing.salePrice) : 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-400">
                  <HomeIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No recent listings available</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200">
              <div className="flex items-center">
                <Plus className="w-4 h-4 mr-3 text-blue-600" />
                <span className="font-medium text-blue-900">Add New Property</span>
              </div>
            </button>
            <button className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-green-600" />
                <span className="font-medium text-green-900">Send Newsletter</span>
              </div>
            </button>
            <button className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200">
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-3 text-purple-600" />
                <span className="font-medium text-purple-900">Generate Report</span>
              </div>
            </button>
            <button className="w-full p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-3 text-orange-600" />
                <span className="font-medium text-orange-900">Manage Users</span>
              </div>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Home;