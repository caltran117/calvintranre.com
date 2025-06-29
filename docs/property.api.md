# Property API Documentation

## Overview
The Property API manages real estate listings for both sale and rental properties. It provides comprehensive CRUD operations, advanced search capabilities, filtering, pagination, and geolocation-based searches. The API supports detailed property information including pricing, location, amenities, and rental-specific features.

## Available Endpoints

### Public Endpoints (No Authentication Required)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/property/self` | Check if Property service is running and responsive | ❌ |
| GET | `/property` | Retrieve all properties with filtering and pagination | ❌ |
| GET | `/property/search` | Search properties by text and location with radius | ❌ |
| GET | `/property/featured` | Get featured properties (limited results) | ❌ |
| GET | `/property/:id` | Get specific property by MongoDB ObjectId | ❌ |
| GET | `/property/:id/similar` | Get similar properties based on type, price, and beds | ❌ |

### Admin Endpoints (Authentication Required)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/property/admin/add` | Create new property listing | ✅ Admin |
| PUT | `/property/admin/:id` | Update existing property listing | ✅ Admin |
| DELETE | `/property/admin/:id` | Remove property listing from database | ✅ Admin |

## Query Parameters

### GET /property
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (enum): Property status - For Sale, For Rent, Sold, Rented, Under Contract, Off Market, Coming Soon
- `propertyType` (enum): Property type - Residential, Commercial, Land, Multi-Family, Condo, Townhouse
- `minPrice` (number): Minimum sales price filter
- `maxPrice` (number): Maximum sales price filter
- `minRent` (number): Minimum monthly rent filter
- `maxRent` (number): Maximum monthly rent filter
- `beds` (number): Minimum number of bedrooms
- `baths` (number): Minimum number of bathrooms
- `minSqft` (number): Minimum square footage
- `maxSqft` (number): Maximum square footage
- `featured` (boolean): Filter featured properties
- `isActive` (boolean): Filter active listings
- `city` (string): Filter by city name
- `state` (string): Filter by state name
- `furnished` (enum): Furnished status - Furnished, Unfurnished, Partially Furnished
- `petAllowed` (boolean): Filter properties that allow pets
- `sortBy` (string): Sort field (default: createdAt)
- `sortOrder` (enum): Sort direction - asc, desc (default: desc)

### GET /property/search
- `query` (string): Text search across title, description, address, school district
- `page` (number): Page number for pagination
- `limit` (number): Items per page
- `status` (enum): Property status filter
- `propertyType` (enum): Property type filter
- `featured` (boolean): Featured properties filter
- `isActive` (boolean): Active listings filter
- `lat` (number): Latitude for geolocation search
- `lon` (number): Longitude for geolocation search
- `radius` (number): Search radius in kilometers (default: 10)

### GET /property/featured
- `limit` (number): Maximum number of featured properties to return (default: 6)

### GET /property/:id/similar
- `limit` (number): Maximum number of similar properties to return (default: 4)

## Data Structure

### Core Property Fields
- **title** (string, required): Property title
- **description** (string, required): Property description
- **status** (enum, required): Current property status
- **basicInfo** (object, required):
  - beds (number): Number of bedrooms
  - baths (number): Number of bathrooms
  - sqft (number): Square footage
- **images** (array, required): Property images with URL, caption, primary flag, and order

### Pricing Information
- **pricing** (object):
  - salesPrice (number): Sale price for purchase
  - offerPrice (number): Current offer price
  - rentPrice (object): Monthly, weekly, daily rental rates
  - pricePerSqft (number): Price per square foot
  - deposit (object): Security, pet, cleaning deposits
  - hoa (object): HOA fees and frequency

### Location Data
- **location** (object):
  - address (object): Street, city, state, zipCode, country
  - coordinates (object): Latitude and longitude
  - mapLink (string): Link to map service

### Detailed Information
- **interior** (object): Bedrooms, bathrooms, laundry, fireplace, appliances, flooring
- **areaAndLot** (object): Living area, lot size, MLS ID, property type, year built, views, school district
- **exterior** (object): Stories, garage, water source, pool, roof, parking, heating, AC, sewer, security
- **financial** (object): Taxes, insurance, utilities information
- **listing** (object): Listed date, agent information, featured status, days on market
- **amenities** (object): Community, nearby, and transportation amenities

### Rental-Specific Features
- **rental** (object):
  - leaseTerms (object): Minimum/maximum lease duration
  - availableDate (date): When property becomes available
  - petPolicy (object): Pet allowance, types, restrictions, fees
  - utilities (object): Included/excluded utilities and estimated costs
  - furnished (enum): Furnished status
  - parking (object): Parking information and costs


## Notes
- All endpoints return JSON responses
- Automatic timestamps (createdAt, updatedAt) managed by Mongoose
- MongoDB ObjectId format required for ID parameters
- Geospatial indexing enabled for location-based searches
- Images automatically set primary flag if none specified
- Days on market automatically calculated for active listings
- Properties support both sale and rental information simultaneously