feat: complete backend infrastructure setup with Location Stat API

- Setup core Express server with MongoDB connection
- Implement security middleware (helmet, rate limiting, CORS)
- Add global error handling and structured logging
- Create utilities for HTTP responses, email service, and validation
- Implement Location Stat API with full CRUD operations
- Add Zod middleware for request validation and error handling
- Create comprehensive API documentation and testing files
- Setup environment configuration with dotenv support
- Add coordinate validation for geographical data (lat/lon)
- Implement structured project architecture with separation of concerns

Infrastructure includes:
- MongoDB integration with Mongoose ODM
- Rate limiting with rate-limiter-flexible
- Security headers with Helmet
- Global error middleware with detailed logging
- Email service with Nodemailer configuration
- HTTP response/error utility functions
- Request validation middleware with Zod schemas

Location Stat API features:
- Full CRUD operations for geographical coordinates
- Coordinate validation (latitude: -90 to 90, longitude: -180 to 180)
- Automatic timestamps and data sorting
- Comprehensive error handling and validation
- Complete API documentation and HTTP test suite
