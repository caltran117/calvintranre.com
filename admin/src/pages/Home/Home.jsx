/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
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
} from "lucide-react";
import { dashboardData } from "./dashboard.config";



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
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const KPICard = ({
  title,
  value,
  change,
  trend,
  period,
  currency,
  suffix,
  icon: Icon,
  index,
}) => (
  <motion.div
    variants={itemVariants}
    whileHover={{
      scale: 1.02,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    }}
    whileTap={{ scale: 0.98 }}
    className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 hover:border-blue-200 transition-all duration-300"
  >
    <div className="flex items-center justify-between mb-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: index * 0.1 + 0.3,
          type: "spring",
          stiffness: 200,
        }}
        className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl"
      >
        <Icon className="w-6 h-6 text-blue-600" />
      </motion.div>
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.4 }}
        className={`flex items-center text-sm font-medium ${
          trend === "up" ? "text-green-600" : "text-red-600"
        }`}
      >
        <motion.div
          animate={{ rotate: trend === "up" ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <TrendingUp className="w-4 h-4 mr-1" />
        </motion.div>
        {change > 0 ? "+" : ""}
        {change}%
      </motion.div>
    </div>
    <div className="space-y-1">
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      <motion.p
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.5 }}
        className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
      >
        {currency ? formatCurrency(value) : formatNumber(value)}
        {suffix || ""}
      </motion.p>
      <p className="text-xs text-gray-500">{period}</p>
    </div>
  </motion.div>
);

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <motion.div
            animate={{
              background: [
                "linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 50%, #e5e7eb 100%)",
                "linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)",
              ],
            }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="h-8 rounded w-64"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen space-y-6"
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
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
          >
            Luxury Real Estate Dashboard
          </motion.h1>
          <motion.p
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-gray-600 mt-2 text-lg"
          >
            Premium property portfolio performance
          </motion.p>
        </div>
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 md:mt-0"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(37, 99, 235, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg font-medium"
          >
            Generate Report
          </motion.button>
        </motion.div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      >
        <KPICard
          title="Total Properties"
          value={dashboardData.kpis.totalProperties.value}
          change={dashboardData.kpis.totalProperties.change}
          trend={dashboardData.kpis.totalProperties.trend}
          period={dashboardData.kpis.totalProperties.period}
          icon={HomeIcon}
          index={0}
        />
        <KPICard
          title="Total Earnings"
          value={dashboardData.kpis.totalEarnings.value}
          change={dashboardData.kpis.totalEarnings.change}
          trend={dashboardData.kpis.totalEarnings.trend}
          period={dashboardData.kpis.totalEarnings.period}
          currency={true}
          icon={DollarSign}
          index={1}
        />
        <KPICard
          title="Active Listings"
          value={dashboardData.kpis.activeListing.value}
          change={dashboardData.kpis.activeListing.change}
          trend={dashboardData.kpis.activeListing.trend}
          period={dashboardData.kpis.activeListing.period}
          icon={Activity}
          index={2}
        />
        <KPICard
          title="Total Views"
          value={dashboardData.kpis.totalViews.value}
          change={dashboardData.kpis.totalViews.change}
          trend={dashboardData.kpis.totalViews.trend}
          period={dashboardData.kpis.totalViews.period}
          icon={Eye}
          index={3}
        />
        <KPICard
          title="Conversion Rate"
          value={dashboardData.kpis.conversionRate.value}
          change={dashboardData.kpis.conversionRate.change}
          trend={dashboardData.kpis.conversionRate.trend}
          period={dashboardData.kpis.conversionRate.period}
          suffix="%"
          icon={TrendingUp}
          index={4}
        />
        <KPICard
          title="Average Price"
          value={dashboardData.kpis.averagePrice.value}
          change={dashboardData.kpis.averagePrice.change}
          trend={dashboardData.kpis.averagePrice.trend}
          period={dashboardData.kpis.averagePrice.period}
          currency={true}
          icon={DollarSign}
          index={5}
        />
      </motion.div>

      {/* Charts Row */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Earnings Chart */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all duration-300"
        >
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-semibold text-gray-900 mb-6"
          >
            Monthly Earnings & Properties
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dashboardData.earningsData}>
                <defs>
                  <linearGradient
                    id="colorEarnings"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                  }}
                  formatter={(value, name) => [
                    name === "earnings"
                      ? formatCurrency(value)
                      : formatNumber(value),
                    name === "earnings" ? "Earnings" : "Properties",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#2563eb"
                  fill="url(#colorEarnings)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        {/* Property Categories */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all duration-300"
        >
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-semibold text-gray-900 mb-6"
          >
            Property Categories
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.propertyCategories}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {dashboardData.propertyCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                  }}
                  formatter={(value) => formatNumber(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Location Performance & Top Properties */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Location Performance */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all duration-300"
        >
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-semibold text-gray-900 mb-6"
          >
            Location Performance
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.locationPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="location" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                  }}
                  formatter={(value, name) => [
                    name === "avgPrice"
                      ? formatCurrency(value)
                      : formatNumber(value),
                    name === "avgPrice"
                      ? "Avg Price"
                      : name === "properties"
                      ? "Properties"
                      : "Total Views",
                  ]}
                />
                <Bar
                  dataKey="properties"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all duration-300"
        >
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-semibold text-gray-900 mb-6"
          >
            Top Performing Properties
          </motion.h3>
          <motion.div variants={containerVariants} className="space-y-4">
            {dashboardData.topProperties.map((property, index) => (
              <motion.div
                key={property.id}
                variants={itemVariants}
                whileHover={{
                  scale: 1.02,
                  backgroundColor: "#f8fafc",
                }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-300 cursor-pointer border border-blue-100"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {property.title}
                  </h4>
                  <p className="text-gray-600 text-xs flex items-center mt-1">
                    <MapPin className="w-3 h-3 mr-1 text-blue-600" />
                    {property.location}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-blue-700 font-bold text-sm">
                      {formatCurrency(property.price)}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {formatNumber(property.views)} views
                    </span>
                    <span className="text-gray-500 text-xs">
                      {property.inquiries} inquiries
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 mt-2 text-xs text-gray-600">
                    <span>{property.beds} beds</span>
                    <span>{property.baths} baths</span>
                    <span>{formatNumber(property.sqft)} sqft</span>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    property.status === "Available"
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : property.status === "Under Contract"
                      ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                      : "bg-blue-100 text-blue-800 border border-blue-200"
                  }`}
                >
                  {property.status}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Recent Activities */}
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.005 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all duration-300"
      >
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-semibold text-gray-900 mb-6"
        >
          Recent Activities
        </motion.h3>
        <motion.div variants={containerVariants} className="space-y-4">
          {dashboardData.recentActivities.map((activity, index) => {
            const IconComponent =
              activity.icon === "TrendingUp"
                ? TrendingUp
                : activity.icon === "MessageSquare"
                ? MessageSquare
                : activity.icon === "Plus"
                ? Plus
                : Activity;

            return (
              <motion.div
                key={activity.id}
                variants={itemVariants}
                whileHover={{
                  scale: 1.02,
                  backgroundColor: "#f8fafc",
                }}
                className="flex items-center space-x-4 p-4 border border-blue-100 rounded-lg hover:bg-blue-50 transition-all duration-300 cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100"
                >
                  <IconComponent className="w-5 h-5 text-blue-600" />
                </motion.div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {activity.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {activity.description}
                  </p>
                </div>
                <span className="text-gray-500 text-xs font-medium bg-gray-100 px-2 py-1 rounded-full">
                  {activity.time}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Home;
