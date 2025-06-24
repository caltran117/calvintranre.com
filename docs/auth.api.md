# Authentication API Documentation

## Overview
The Authentication API manages user accounts, authentication, and authorization. It provides email-based sign-in with automatic user creation, profile management, favorite properties, and admin user management capabilities.

## Available Endpoints

### Public Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/auth/self` | Check if Authentication service is running | ❌ |
| POST | `/auth/signin` | Sign in with email (creates user if doesn't exist) | ❌ |

### User Protected Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/auth/profile` | Get current user profile with favorite properties | ✅ |
| PUT | `/auth/profile` | Update current user profile | ✅ |
| POST | `/auth/favorite` | Add property to user's favorites | ✅ |
| DELETE | `/auth/favorite` | Remove property from user's favorites | ✅ |

### Admin Only Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/auth/admin/users` | Get paginated list of all users with filters | ✅ Admin |
| GET | `/auth/admin/users/:id` | Get specific user by ID | ✅ Admin |
| PUT | `/auth/admin/users/:id` | Update any user (admin privileges) | ✅ Admin |
| DELETE | `/auth/admin/users/:id` | Delete user account | ✅ Admin |

## Authentication Flow
1. **Sign In**: POST to `/auth/signin` with email
2. **Auto-Creation**: If user doesn't exist, creates new user with default role 'user'
3. **JWT Token**: Returns access token and sets httpOnly cookie
4. **Session**: Use cookie for subsequent authenticated requests

## Data Models

### User Schema
```javascript
{
  email: String (required, unique, validated),
  isActive: Boolean (default: true),
  role: Enum ['user', 'admin'] (default: 'user'),
  favProperty: [ObjectId] (references to Property model),
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Data Validation
- **Email**: Valid email format, lowercase, trimmed
- **Role**: Must be 'user' or 'admin'
- **PropertyId**: Valid MongoDB ObjectId format
- **Pagination**: Page > 0, Limit 1-100

## Security Features
- JWT token authentication with httpOnly cookies
- Role-based access control (RBAC)
- Admin-only routes protected
- Secure cookie settings (domain, sameSite, secure in production)

## Notes
- Authentication uses JWT tokens stored in httpOnly cookies
- Admin users can manage all users and override restrictions
- Regular users can only modify their own profiles (except role changes)
- Favorite properties use MongoDB $addToSet and $pull for array management
- All timestamps automatically managed by Mongoose