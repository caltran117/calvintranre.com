feat: implement comprehensive property management system for sales and rentals

- Add Property model with comprehensive fields for sale and rental properties
- Implement property controller with advanced CRUD operations and search functionality
- Create Zod validation schemas for all property endpoints with enum validation
- Add role-based property administration with admin-only create/update/delete operations
- Implement geolocation-based search with radius filtering and text search
- Create property filtering system with price ranges, beds/baths, and location filters
- Add featured properties and similar properties recommendation engine
- Setup property API routes with public viewing and admin management
- Add comprehensive API testing suite with sale and rental property examples
- Implement automatic image management and days-on-market calculation
- Remove addFavoriteProperty and removeFavoriteProperty from user system for dual API support

Property features include:
- Dual property support for both internal listings and external SimplyRETS API
- Comprehensive property data structure covering interior, exterior, and financial details
- Advanced search capabilities with text search across multiple fields
- Geolocation-based property search with customizable radius filtering
- Flexible pricing structure supporting both sale and rental properties
- Rental-specific features including lease terms, pet policy, and utilities management
- Property status tracking with sold/rented date management
- Featured properties system with priority display
- Similar properties algorithm based on type, price, and bedroom count
- Database optimization with geospatial indexing and efficient querying
- Constants-based enum management for data consistency
- Comprehensive error handling and validation with detailed response messages