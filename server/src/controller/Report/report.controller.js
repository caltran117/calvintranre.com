import userModel from "../../models/user.model.js";
import responseMessage from '../../constant/responseMessage.js';
import httpError from '../../util/httpError.js';
import httpResponse from '../../util/httpResponse.js';
import propertyModel from "../../models/property.model.js";
import newsletterModel from "../../models/newsletter.model.js";
import locationStatModel from "../../models/location.stat.model.js";

export default {
  self: (req, res, next) => {
    try {
      httpResponse(req, res, 200, responseMessage.SERVICE('Report'));
    } catch (err) {
      httpError(next, err, req, 500);
    }
  },

  overview: async (req, res, next) => {
    try {
      const [
        totalProperties,
        activeProperties,
        totalUsers,
        activeUsers,
        totalSubscribers,
        activeSubscribers,
        totalLocations,
        propertiesForSale,
        propertiesForRent,
        adminUsers
      ] = await Promise.all([
        propertyModel.countDocuments(),
        propertyModel.countDocuments({ 'listing.isActive': true }),
        userModel.countDocuments(),
        userModel.countDocuments({ isActive: true }),
        newsletterModel.countDocuments(),
        newsletterModel.countDocuments({ isSubscribed: true, consent: true }),
        locationStatModel.countDocuments(),
        propertyModel.countDocuments({ 'listing.status': 'For Sale' }),
        propertyModel.countDocuments({ 'listing.status': 'For Rent' }),
        userModel.countDocuments({ role: 'admin' })
      ]);

      const report = {
        properties: {
          total: totalProperties,
          active: activeProperties,
          forSale: propertiesForSale,
          forRent: propertiesForRent
        },
        users: {
          total: totalUsers,
          active: activeUsers,
          admins: adminUsers
        },
        newsletter: {
          totalSubscribers,
          activeSubscribers,
          unsubscribed: totalSubscribers - activeSubscribers
        },
        locations: {
          total: totalLocations
        }
      };

      httpResponse(req, res, 200, responseMessage.ADMIN.REPORT_GENERATED, report);
    } catch (err) {
      httpError(next, err, req, 500);
    }
  },

  propertyStats: async (req, res, next) => {
    try {
      const { startDate, endDate, status, propertyType, city } = req.query;
      
      let matchQuery = {};
      
      if (startDate && endDate) {
        matchQuery.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }
      
      if (status) matchQuery['listing.status'] = status;
      if (propertyType) matchQuery['property.type'] = propertyType;
      if (city) matchQuery['location.address.city'] = new RegExp(city, 'i');

      const [
        statusDistribution,
        typeDistribution,
        cityDistribution,
        priceStats,
        recentListings,
        featuredCount
      ] = await Promise.all([
        propertyModel.aggregate([
          { $match: matchQuery },
          { $group: { _id: '$listing.status', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        
        propertyModel.aggregate([
          { $match: matchQuery },
          { $group: { _id: '$property.type', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        
        propertyModel.aggregate([
          { $match: matchQuery },
          { $group: { _id: '$location.address.city', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]),
        
        propertyModel.aggregate([
          { $match: matchQuery },
          {
            $group: {
              _id: null,
              avgPrice: { $avg: '$pricing.salePrice' },
              maxPrice: { $max: '$pricing.salePrice' },
              minPrice: { $min: '$pricing.salePrice' },
              avgRent: { $avg: '$pricing.rentPrice' }
            }
          }
        ]),
        
        propertyModel.find(matchQuery)
          .sort({ createdAt: -1 })
          .limit(5)
          .select('location.address listing.status pricing createdAt'),
          
        propertyModel.countDocuments({ ...matchQuery, 'listing.featured': true })
      ]);

      const report = {
        overview: {
          total: await propertyModel.countDocuments(matchQuery),
          featured: featuredCount
        },
        distribution: {
          byStatus: statusDistribution,
          byType: typeDistribution,
          byCity: cityDistribution
        },
        pricing: priceStats[0] || { avgPrice: 0, maxPrice: 0, minPrice: 0, avgRent: 0 },
        recentListings
      };

      httpResponse(req, res, 200, responseMessage.ADMIN.STATISTICS_GENERATED, report);
    } catch (err) {
      httpError(next, err, req, 500);
    }
  },

  userAnalytics: async (req, res, next) => {
    try {
      const { startDate, endDate, role } = req.query;
      
      let matchQuery = {};
      
      if (startDate && endDate) {
        matchQuery.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }
      
      if (role) matchQuery.role = role;

      const [
        roleDistribution,
        activeUsersCount,
        recentRegistrations,
        loginActivity,
        favoriteStats
      ] = await Promise.all([
        userModel.aggregate([
          { $match: matchQuery },
          { $group: { _id: '$role', count: { $sum: 1 } } }
        ]),
        
        userModel.countDocuments({ ...matchQuery, isActive: true }),
        
        userModel.find(matchQuery)
          .sort({ createdAt: -1 })
          .limit(10)
          .select('email role createdAt isActive'),
          
        userModel.aggregate([
          { $match: { ...matchQuery, lastLogin: { $exists: true } } },
          {
            $group: {
              _id: {
                year: { $year: '$lastLogin' },
                month: { $month: '$lastLogin' },
                day: { $dayOfMonth: '$lastLogin' }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } },
          { $limit: 30 }
        ]),
        
        userModel.aggregate([
          { $match: matchQuery },
          {
            $project: {
              email: 1,
              favoriteCount: { $size: { $ifNull: ['$favorites', []] } }
            }
          },
          {
            $group: {
              _id: null,
              avgFavorites: { $avg: '$favoriteCount' },
              maxFavorites: { $max: '$favoriteCount' },
              totalFavorites: { $sum: '$favoriteCount' }
            }
          }
        ])
      ]);

      const report = {
        overview: {
          total: await userModel.countDocuments(matchQuery),
          active: activeUsersCount,
          inactive: await userModel.countDocuments({ ...matchQuery, isActive: false })
        },
        distribution: {
          byRole: roleDistribution
        },
        activity: {
          recentRegistrations,
          loginActivity
        },
        favorites: favoriteStats[0] || { avgFavorites: 0, maxFavorites: 0, totalFavorites: 0 }
      };

      httpResponse(req, res, 200, responseMessage.ADMIN.STATISTICS_GENERATED, report);
    } catch (err) {
      httpError(next, err, req, 500);
    }
  },

  newsletterMetrics: async (req, res, next) => {
    try {
      const { startDate, endDate } = req.query;
      
      let matchQuery = {};
      
      if (startDate && endDate) {
        matchQuery.subscribedAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const [
        subscriptionStats,
        growthTrend,
        emailStats,
        consentStats,
        recentSubscribers,
        unsubscribeRate
      ] = await Promise.all([
        newsletterModel.aggregate([
          { $match: matchQuery },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              subscribed: { $sum: { $cond: ['$isSubscribed', 1, 0] } },
              consented: { $sum: { $cond: ['$consent', 1, 0] } },
              active: { $sum: { $cond: [{ $and: ['$isSubscribed', '$consent'] }, 1, 0] } }
            }
          }
        ]),
        
        newsletterModel.aggregate([
          { $match: matchQuery },
          {
            $group: {
              _id: {
                year: { $year: '$subscribedAt' },
                month: { $month: '$subscribedAt' },
                day: { $dayOfMonth: '$subscribedAt' }
              },
              subscriptions: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]),
        
        newsletterModel.aggregate([
          { $match: matchQuery },
          {
            $group: {
              _id: null,
              totalEmails: { $sum: '$numberOfEmails' },
              avgEmails: { $avg: '$numberOfEmails' },
              maxEmails: { $max: '$numberOfEmails' }
            }
          }
        ]),
        
        newsletterModel.aggregate([
          {
            $group: {
              _id: '$consent',
              count: { $sum: 1 }
            }
          }
        ]),
        
        newsletterModel.find(matchQuery)
          .sort({ subscribedAt: -1 })
          .limit(10)
          .select('email isSubscribed consent subscribedAt numberOfEmails'),
          
        newsletterModel.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              unsubscribed: { $sum: { $cond: [{ $eq: ['$isSubscribed', false] }, 1, 0] } }
            }
          },
          {
            $project: {
              unsubscribeRate: {
                $multiply: [
                  { $divide: ['$unsubscribed', '$total'] },
                  100
                ]
              }
            }
          }
        ])
      ]);

      const report = {
        overview: subscriptionStats[0] || { total: 0, subscribed: 0, consented: 0, active: 0 },
        growth: growthTrend,
        emails: emailStats[0] || { totalEmails: 0, avgEmails: 0, maxEmails: 0 },
        consent: consentStats,
        metrics: {
          unsubscribeRate: unsubscribeRate[0]?.unsubscribeRate || 0
        },
        recent: recentSubscribers
      };

      httpResponse(req, res, 200, responseMessage.ADMIN.STATISTICS_GENERATED, report);
    } catch (err) {
      httpError(next, err, req, 500);
    }
  },

  locationAnalytics: async (req, res, next) => {
    try {
      const { startDate, endDate } = req.query;
      
      let matchQuery = {};
      
      if (startDate && endDate) {
        matchQuery.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const [
        totalLocations,
        locationDistribution,
        recentLocations,
        geographicSpread
      ] = await Promise.all([
        locationStatModel.countDocuments(matchQuery),
        
        locationStatModel.aggregate([
          { $match: matchQuery },
          {
            $group: {
              _id: {
                latRange: {
                  $concat: [
                    { $toString: { $floor: { $divide: ['$lat', 10] } } },
                    '0-',
                    { $toString: { $add: [{ $floor: { $divide: ['$lat', 10] } }, 1] } },
                    '0'
                  ]
                }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } }
        ]),
        
        locationStatModel.find(matchQuery)
          .sort({ createdAt: -1 })
          .limit(10),
          
        locationStatModel.aggregate([
          { $match: matchQuery },
          {
            $group: {
              _id: null,
              minLat: { $min: '$lat' },
              maxLat: { $max: '$lat' },
              minLon: { $min: '$lon' },
              maxLon: { $max: '$lon' },
              avgLat: { $avg: '$lat' },
              avgLon: { $avg: '$lon' }
            }
          }
        ])
      ]);

      const report = {
        overview: {
          total: totalLocations
        },
        distribution: locationDistribution,
        geographic: geographicSpread[0] || {
          minLat: 0, maxLat: 0, minLon: 0, maxLon: 0, avgLat: 0, avgLon: 0
        },
        recent: recentLocations
      };

      httpResponse(req, res, 200, responseMessage.ADMIN.STATISTICS_GENERATED, report);
    } catch (err) {
      httpError(next, err, req, 500);
    }
  },

  customReport: async (req, res, next) => {
    try {
      const { models, metrics, startDate, endDate, filters } = req.body;
      
      const report = {};
      const dateFilter = {};
      
      if (startDate && endDate) {
        dateFilter.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      if (models.includes('properties')) {
        const propertyQuery = { ...dateFilter, ...filters.properties };
        const propertyData = {};
        
        if (metrics.includes('count')) {
          propertyData.count = await propertyModel.countDocuments(propertyQuery);
        }
        
        if (metrics.includes('distribution')) {
          propertyData.statusDistribution = await propertyModel.aggregate([
            { $match: propertyQuery },
            { $group: { _id: '$listing.status', count: { $sum: 1 } } }
          ]);
        }
        
        if (metrics.includes('pricing')) {
          propertyData.pricing = await propertyModel.aggregate([
            { $match: propertyQuery },
            {
              $group: {
                _id: null,
                avgSalePrice: { $avg: '$pricing.salePrice' },
                avgRentPrice: { $avg: '$pricing.rentPrice' }
              }
            }
          ]);
        }
        
        report.properties = propertyData;
      }

      if (models.includes('users')) {
        const userQuery = { ...dateFilter, ...filters.users };
        const userData = {};
        
        if (metrics.includes('count')) {
          userData.count = await userModel.countDocuments(userQuery);
        }
        
        if (metrics.includes('distribution')) {
          userData.roleDistribution = await userModel.aggregate([
            { $match: userQuery },
            { $group: { _id: '$role', count: { $sum: 1 } } }
          ]);
        }
        
        report.users = userData;
      }

      if (models.includes('newsletter')) {
        const newsletterQuery = { ...dateFilter, ...filters.newsletter };
        const newsletterData = {};
        
        if (metrics.includes('count')) {
          newsletterData.count = await newsletterModel.countDocuments(newsletterQuery);
        }
        
        if (metrics.includes('distribution')) {
          newsletterData.subscriptionStatus = await newsletterModel.aggregate([
            { $match: newsletterQuery },
            { $group: { _id: '$isSubscribed', count: { $sum: 1 } } }
          ]);
        }
        
        report.newsletter = newsletterData;
      }

      if (models.includes('locations')) {
        const locationQuery = { ...dateFilter, ...filters.locations };
        const locationData = {};
        
        if (metrics.includes('count')) {
          locationData.count = await locationStatModel.countDocuments(locationQuery);
        }
        
        report.locations = locationData;
      }

      httpResponse(req, res, 200, responseMessage.ADMIN.REPORT_GENERATED, report);
    } catch (err) {
      httpError(next, err, req, 500);
    }
  },

  exportData: async (req, res, next) => {
    try {
      const { model, format, startDate, endDate, filters } = req.query;
      
      let query = {};
      
      if (startDate && endDate) {
        query.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }
      
      if (filters) {
        query = { ...query, ...JSON.parse(filters) };
      }

      let data = [];
      
      switch (model) {
        case 'properties':
          data = await propertyModel.find(query).lean();
          break;
        case 'users':
          data = await userModel.find(query).select('-__v').lean();
          break;
        case 'newsletter':
          data = await newsletterModel.find(query).lean();
          break;
        case 'locations':
          data = await locationStatModel.find(query).lean();
          break;
        default:
          httpError(next, new Error('Invalid model specified'), req, 400);
          return;
      }

      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${model}-export.csv`);
        
        if (data.length > 0) {
          const headers = Object.keys(data[0]).join(',');
          const rows = data.map(item => Object.values(item).join(',')).join('\n');
          return res.send(`${headers}\n${rows}`);
        } else {
          return res.send('No data available');
        }
      }

      httpResponse(req, res, 200, responseMessage.SUCCESS, { 
        count: data.length,
        data: data.slice(0, 100)
      });
    } catch (err) {
      httpError(next, err, req, 500);
    }
  },

  // New endpoint for dashboard trends
  dashboardTrends: async (req, res, next) => {
    try {
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      // Get current month data
      const [
        currentProperties,
        currentUsers,
        currentSubscribers,
        currentLocations,
        currentActiveProperties,
        currentAdmins
      ] = await Promise.all([
        propertyModel.countDocuments({ createdAt: { $gte: thisMonth } }),
        userModel.countDocuments({ createdAt: { $gte: thisMonth } }),
        newsletterModel.countDocuments({ subscribedAt: { $gte: thisMonth } }),
        locationStatModel.countDocuments({ createdAt: { $gte: thisMonth } }),
        propertyModel.countDocuments({ 
          'listing.isActive': true,
          updatedAt: { $gte: thisMonth }
        }),
        userModel.countDocuments({ 
          role: 'admin',
          createdAt: { $gte: thisMonth }
        })
      ]);

      // Get last month data
      const [
        lastProperties,
        lastUsers,
        lastSubscribers,
        lastLocations,
        lastActiveProperties,
        lastAdmins
      ] = await Promise.all([
        propertyModel.countDocuments({ 
          createdAt: { $gte: lastMonth, $lte: endLastMonth }
        }),
        userModel.countDocuments({ 
          createdAt: { $gte: lastMonth, $lte: endLastMonth }
        }),
        newsletterModel.countDocuments({ 
          subscribedAt: { $gte: lastMonth, $lte: endLastMonth }
        }),
        locationStatModel.countDocuments({ 
          createdAt: { $gte: lastMonth, $lte: endLastMonth }
        }),
        propertyModel.countDocuments({ 
          'listing.isActive': true,
          updatedAt: { $gte: lastMonth, $lte: endLastMonth }
        }),
        userModel.countDocuments({ 
          role: 'admin',
          createdAt: { $gte: lastMonth, $lte: endLastMonth }
        })
      ]);

      // Calculate percentage changes
      const calculateChange = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous * 100);
      };

      const trends = {
        properties: {
          change: calculateChange(currentProperties, lastProperties),
          trend: currentProperties >= lastProperties ? 'up' : 'down'
        },
        users: {
          change: calculateChange(currentUsers, lastUsers),
          trend: currentUsers >= lastUsers ? 'up' : 'down'
        },
        newsletter: {
          change: calculateChange(currentSubscribers, lastSubscribers),
          trend: currentSubscribers >= lastSubscribers ? 'up' : 'down'
        },
        locations: {
          change: calculateChange(currentLocations, lastLocations),
          trend: currentLocations >= lastLocations ? 'up' : 'down'
        },
        activeProperties: {
          change: calculateChange(currentActiveProperties, lastActiveProperties),
          trend: currentActiveProperties >= lastActiveProperties ? 'up' : 'down'
        },
        admins: {
          change: calculateChange(currentAdmins, lastAdmins),
          trend: currentAdmins >= lastAdmins ? 'up' : 'down'
        }
      };

      httpResponse(req, res, 200, responseMessage.ADMIN.STATISTICS_GENERATED, trends);
    } catch (err) {
      httpError(next, err, req, 500);
    }
  },

  // New endpoint for location heatmap
  locationHeatmap: async (req, res, next) => {
    try {
      const { days = 7 } = req.query;
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(days));

      // Get location stats for the last N days grouped by day and hour
      const heatmapData = await locationStatModel.aggregate([
        {
          $match: {
            createdAt: { $gte: daysAgo }
          }
        },
        {
          $group: {
            _id: {
              dayOfWeek: { $dayOfWeek: '$createdAt' },
              hour: { $hour: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: '$_id.dayOfWeek',
            hourlyData: {
              $push: {
                hour: '$_id.hour',
                count: '$count'
              }
            }
          }
        },
        {
          $sort: { '_id': 1 }
        }
      ]);

      // Convert to format expected by ApexCharts heatmap
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const formattedData = [];

      // Initialize with zeros for all days
      for (let day = 1; day <= 7; day++) {
        const dayData = {
          name: dayNames[day - 1],
          data: new Array(24).fill(0)
        };
        
        const dayStats = heatmapData.find(item => item._id === day);
        if (dayStats) {
          dayStats.hourlyData.forEach(hourData => {
            if (hourData.hour >= 0 && hourData.hour < 24) {
              dayData.data[hourData.hour] = hourData.count;
            }
          });
        }
        
        formattedData.push(dayData);
      }

      httpResponse(req, res, 200, responseMessage.ADMIN.STATISTICS_GENERATED, formattedData);
    } catch (err) {
      httpError(next, err, req, 500);
    }
  },

  // New endpoint for performance analytics
  performanceAnalytics: async (req, res, next) => {
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Calculate various performance metrics
      const [
        totalProperties,
        activeProperties,
        totalUsers,
        activeUsers,
        totalSubscribers,
        activeSubscribers,
        totalLocations,
        recentProperties,
        recentUsers,
        recentSubscribers,
        avgPropertyPrice,
        propertyViews
      ] = await Promise.all([
        propertyModel.countDocuments(),
        propertyModel.countDocuments({ 'listing.isActive': true }),
        userModel.countDocuments(),
        userModel.countDocuments({ isActive: true, lastLogin: { $gte: thirtyDaysAgo } }),
        newsletterModel.countDocuments(),
        newsletterModel.countDocuments({ isSubscribed: true, consent: true }),
        locationStatModel.countDocuments(),
        propertyModel.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        userModel.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        newsletterModel.countDocuments({ subscribedAt: { $gte: thirtyDaysAgo } }),
        propertyModel.aggregate([
          { $group: { _id: null, avgPrice: { $avg: '$pricing.salePrice' } } }
        ]),
        propertyModel.aggregate([
          { $group: { _id: null, totalViews: { $sum: '$analytics.views' } } }
        ])
      ]);

      // Calculate performance scores (0-100)
      const propertyScore = Math.min((activeProperties / Math.max(totalProperties, 1)) * 100, 100);
      const userScore = Math.min((activeUsers / Math.max(totalUsers, 1)) * 100, 100);
      const newsletterScore = Math.min((activeSubscribers / Math.max(totalSubscribers, 1)) * 100, 100);
      const locationScore = Math.min((totalLocations / 100) * 100, 100); // Normalized to 100 locations
      const activityScore = Math.min(((recentProperties + recentUsers + recentSubscribers) / 30) * 100, 100);
      
      // Growth score based on recent activity
      const growthScore = Math.min(
        ((recentProperties * 2) + (recentUsers * 1.5) + (recentSubscribers * 1)) / 10 * 100, 
        100
      );

      const performanceData = [{
        name: 'Current Performance',
        data: [
          Math.round(propertyScore),
          Math.round(userScore),
          Math.round(newsletterScore),
          Math.round(locationScore),
          Math.round(activityScore),
          Math.round(growthScore)
        ]
      }];

      const metrics = {
        propertyScore,
        userScore,
        newsletterScore,
        locationScore,
        activityScore,
        growthScore,
        averagePrice: avgPropertyPrice[0]?.avgPrice || 0,
        totalViews: propertyViews[0]?.totalViews || 0,
        recentActivity: {
          properties: recentProperties,
          users: recentUsers,
          subscribers: recentSubscribers
        }
      };

      httpResponse(req, res, 200, responseMessage.ADMIN.STATISTICS_GENERATED, {
        performanceData,
        metrics
      });
    } catch (err) {
      httpError(next, err, req, 500);
    }
  }
};