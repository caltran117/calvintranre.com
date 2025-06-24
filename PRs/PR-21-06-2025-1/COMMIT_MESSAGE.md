feat: implement complete authentication system with user management

- Add User model with email, role, isActive, and favProperty fields
- Implement JWT-based authentication with cookie support
- Create comprehensive auth controller with sign-in, profile management, and admin features
- Add Zod validation schemas for all auth endpoints
- Implement role-based authorization (user/admin)
- Add admin credential validation using config values
- Create complete auth API routes with middleware protection
- Fix validateRequest middleware to handle query parameter validation
- Add comprehensive API testing suite for authentication endpoints
- Remove property population temporarily until Property model is implemented

Changes include:
- User Mongoose model with proper validation and indexes
- Auth controller with 9 endpoints (signIn, profile CRUD, favorites, admin management)
- Zod schemas with proper validation rules and error handling
- Router configuration with authentication and authorization middleware
- HTTP test files for comprehensive API testing
- Response message constants integration for consistent error handling

