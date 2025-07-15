# Admin API Documentation

## Overview

The Admin API provides comprehensive reporting and analytics capabilities for administrators to monitor and analyze all aspects of the real estate platform. This includes property statistics, user analytics, newsletter metrics, location data, and custom reporting features.

## Authentication

All admin endpoints require:
- Valid JWT token in Authorization header: `Bearer {token}`
- Admin role permissions

## Report Endpoints

### Service Health

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/report/self` | Check report service status | No |

### Overview Reports

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/report/overview` | Get platform overview statistics | Admin |

**Query Parameters:**
- `startDate` (optional): Filter from date (YYYY-MM-DD)
- `endDate` (optional): Filter to date (YYYY-MM-DD)

**Response:**
```json
{
  "properties": {
    "total": 150,
    "active": 120,
    "forSale": 80,
    "forRent": 40
  },
  "users": {
    "total": 500,
    "active": 450,
    "admins": 5
  },
  "newsletter": {
    "totalSubscribers": 300,
    "activeSubscribers": 280,
    "unsubscribed": 20
  },
  "locations": {
    "total": 45
  }
}
```

### Property Statistics

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/report/property-stats` | Get detailed property analytics | Admin |

**Query Parameters:**
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date
- `status` (optional): Property status filter
  - Values: `For Sale`, `For Rent`, `Sold`, `Rented`, `Under Contract`, `Off Market`, `Coming Soon`
- `propertyType` (optional): Property type filter
  - Values: `Residential`, `Commercial`, `Land`, `Multi-Family`, `Condo`, `Townhouse`
- `city` (optional): City name filter

**Response:**
```json
{
  "overview": {
    "total": 150,
    "featured": 25
  },
  "distribution": {
    "byStatus": [
      { "_id": "For Sale", "count": 80 },
      { "_id": "For Rent", "count": 40 }
    ],
    "byType": [
      { "_id": "Residential", "count": 100 },
      { "_id": "Condo", "count": 30 }
    ],
    "byCity": [
      { "_id": "Houston", "count": 60 },
      { "_id": "Dallas", "count": 40 }
    ]
  },
  "pricing": {
    "avgPrice": 450000,
    "maxPrice": 1200000,
    "minPrice": 150000,
    "avgRent": 2200
  },
  "recentListings": []
}
```

### User Analytics

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/report/user-analytics` | Get user behavior analytics | Admin |

**Query Parameters:**
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date
- `role` (optional): User role filter (`admin`, `user`)

**Response:**
```json
{
  "overview": {
    "total": 500,
    "active": 450,
    "inactive": 50
  },
  "distribution": {
    "byRole": [
      { "_id": "user", "count": 495 },
      { "_id": "admin", "count": 5 }
    ]
  },
  "activity": {
    "recentRegistrations": [],
    "loginActivity": []
  },
  "favorites": {
    "avgFavorites": 3.5,
    "maxFavorites": 15,
    "totalFavorites": 1750
  }
}
```

### Newsletter Metrics

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/report/newsletter-metrics` | Get newsletter performance metrics | Admin |

**Query Parameters:**
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date

**Response:**
```json
{
  "overview": {
    "total": 300,
    "subscribed": 280,
    "consented": 275,
    "active": 270
  },
  "growth": [],
  "emails": {
    "totalEmails": 850,
    "avgEmails": 2.8,
    "maxEmails": 12
  },
  "consent": [
    { "_id": true, "count": 275 },
    { "_id": false, "count": 25 }
  ],
  "metrics": {
    "unsubscribeRate": 6.7
  },
  "recent": []
}
```

### Location Analytics

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/report/location-analytics` | Get location tracking analytics | Admin |

**Query Parameters:**
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date

**Response:**
```json
{
  "overview": {
    "total": 45
  },
  "distribution": [],
  "geographic": {
    "minLat": 25.7617,
    "maxLat": 47.6062,
    "minLon": -122.4194,
    "maxLon": -74.0060,
    "avgLat": 36.8,
    "avgLon": -98.2
  },
  "recent": []
}
```

### Custom Reports

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/report/custom` | Generate custom analytics report | Admin |

**Request Body:**
```json
{
  "models": ["properties", "users", "newsletter", "locations"],
  "metrics": ["count", "distribution", "pricing", "growth", "activity"],
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "filters": {
    "properties": {
      "listing.status": "For Sale"
    },
    "users": {
      "role": "admin"
    },
    "newsletter": {
      "consent": true
    },
    "locations": {}
  }
}
```

**Models:**
- `properties`: Property data
- `users`: User data
- `newsletter`: Newsletter subscription data
- `locations`: Location statistics data

**Metrics:**
- `count`: Total count of records
- `distribution`: Breakdown by categories
- `pricing`: Price analytics (properties only)
- `growth`: Growth trends over time
- `activity`: Activity patterns

### Data Export

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/report/export` | Export data in various formats | Admin |

**Query Parameters:**
- `model` (required): Data model to export
  - Values: `properties`, `users`, `newsletter`, `locations`
- `format` (optional): Export format (default: `json`)
  - Values: `json`, `csv`
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date
- `filters` (optional): JSON string of additional filters

**Response:**
- JSON format: Returns data object with count and data array
- CSV format: Returns CSV file for download

## Error Responses

All endpoints follow consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `500`: Internal Server Error

## Security Features

### Authentication
- JWT token validation required for all admin endpoints
- Token must be valid and not expired

### Authorization
- Admin role verification on all endpoints
- Regular users cannot access any report endpoints

### Input Validation
- All query parameters and request bodies validated using Zod schemas
- Date format validation (YYYY-MM-DD)
- Enum validation for status, type, and role fields
- Required field validation for custom reports

### Rate Limiting
- Standard rate limiting applies to all endpoints
- Export endpoints may have additional restrictions for large datasets

## Data Models

### Property Model Features
- Comprehensive real estate data with pricing, location, and features
- Geospatial indexing for location-based queries
- Support for both sale and rental properties
- Extensive filtering and search capabilities

### User Model Features
- Role-based access control (admin/user)
- Activity tracking with last login timestamps
- Favorite properties management
- Account status management

### Newsletter Model Features
- GDPR-compliant consent tracking
- Subscription status management
- Email activity monitoring
- Bulk email capabilities

### Location Model Features
- GPS coordinate tracking
- Geographic distribution analysis
- Location-based statistics
- Coordinate validation and indexing

## Usage Examples

### Get Monthly Property Report
```
GET /report/property-stats?startDate=2024-01-01&endDate=2024-01-31&status=For Sale
```

### Export Active Users
```
GET /report/export?model=users&format=csv&filters={"isActive":true}
```

### Custom Newsletter Growth Analysis
```
POST /report/custom
{
  "models": ["newsletter"],
  "metrics": ["count", "growth"],
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}
```

## New Advanced Analytics Endpoints

### Dashboard Trends

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/report/dashboard-trends` | Get month-over-month percentage changes for all metrics | Admin |

**Query Parameters:**
- `period` (optional): Comparison period (`month`, `week`, `day`) - default: `month`

**Response:**
```json
{
  "properties": {
    "change": 5.2,
    "trend": "up"
  },
  "users": {
    "change": 12.3,
    "trend": "up"
  },
  "newsletter": {
    "change": 8.7,
    "trend": "up"
  },
  "locations": {
    "change": 15.4,
    "trend": "up"
  },
  "activeProperties": {
    "change": 3.2,
    "trend": "up"
  },
  "admins": {
    "change": 0,
    "trend": "stable"
  }
}
```

### Location Heatmap

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/report/location-heatmap` | Get location activity heatmap data by day and hour | Admin |

**Query Parameters:**
- `days` (optional): Number of days to analyze (default: 7)

**Response:**
```json
[
  {
    "name": "Mon",
    "data": [10, 15, 8, 12, 20, 18, 14, 16, 22, 25, 18, 12, 8, 10, 15, 20, 18, 14, 12, 8, 6, 4, 2, 1]
  },
  {
    "name": "Tue", 
    "data": [12, 18, 10, 14, 22, 16, 12, 18, 24, 28, 20, 14, 10, 12, 18, 22, 20, 16, 14, 10, 8, 6, 4, 2]
  }
]
```

### Performance Analytics

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/report/performance-analytics` | Get comprehensive performance metrics and radar chart data | Admin |

**Query Parameters:**
- `period` (optional): Analysis period in days (`30`, `60`, `90`) - default: `30`

**Response:**
```json
{
  "performanceData": [
    {
      "name": "Current Performance",
      "data": [85, 72, 68, 45, 88, 76]
    }
  ],
  "metrics": {
    "propertyScore": 85.5,
    "userScore": 72.3,
    "newsletterScore": 68.1,
    "locationScore": 45.2,
    "activityScore": 88.7,
    "growthScore": 76.4,
    "averagePrice": 450000,
    "totalViews": 12850,
    "recentActivity": {
      "properties": 15,
      "users": 48,
      "subscribers": 23
    }
  }
}
```

## Updated Usage Examples

### Get Real-time Dashboard Trends
```
GET /report/dashboard-trends
```

### Get Weekly Location Heatmap
```
GET /report/location-heatmap?days=7
```

### Get 60-day Performance Analysis
```
GET /report/performance-analytics?period=60
```

### Complete Dashboard Data Fetch (Frontend)
```javascript
// Fetch all dashboard data in parallel
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
  reportAPI.getPerformanceAnalytics()
]);
```

## Real Data Features

### Trend Calculations
- **Month-over-month comparison**: Compares current month data with previous month
- **Automatic trend detection**: Determines if metrics are trending up, down, or stable
- **Percentage change calculation**: Provides exact percentage change values
- **Zero handling**: Graceful handling of zero previous values

### Location Intelligence
- **Hourly activity tracking**: 24-hour breakdown of location visits
- **Weekly patterns**: Day-of-week analysis for user activity
- **Geographic distribution**: Real coordinate-based location analytics
- **Time-based filtering**: Configurable day range for analysis

### Performance Scoring
- **Multi-dimensional analysis**: 6 key performance indicators
- **Normalized scoring**: All metrics scaled to 0-100 for consistency
- **Activity weighting**: Recent activity given higher importance
- **Growth calculation**: Compound growth metrics based on multiple factors