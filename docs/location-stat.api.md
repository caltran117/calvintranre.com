# Location Stat API Documentation

## Overview
The Location Stat API manages geographical location data with latitude and longitude coordinates. It provides full CRUD operations for storing and retrieving location statistics with proper validation for coordinate ranges.

## Available Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/location-stat/self` | Check if LocationStat service is running and responsive | ❌ |
| GET | `/location-stat` | Retrieve all location statistics (sorted by newest first) | ❌ |
| POST | `/location-stat` | Create new location statistic with lat/lon coordinates | ❌ |
| GET | `/location-stat/:id` | Get specific location statistic by MongoDB ObjectId | ❌ |
| PUT | `/location-stat/:id` | Update existing location statistic coordinates | ❌ |
| DELETE | `/location-stat/:id` | Remove location statistic from database | ❌ |

## Data Validation
- **Latitude**: Must be between -90 and 90 degrees
- **Longitude**: Must be between -180 and 180 degrees
- Coordinates are validated using Zod schema

## Notes
- All endpoints return JSON responses
- No authentication required
- Automatic timestamps (createdAt, updatedAt) managed by Mongoose
- MongoDB ObjectId format required for ID parameters