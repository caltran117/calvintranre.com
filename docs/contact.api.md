# Contact API Documentation

## Overview
The Contact API manages contact form submissions and customer inquiries. It provides complete contact management with user authentication integration and comprehensive admin functionality.

## Available Endpoints

### Public Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/contact/self` | Check if Contact service is running | ❌ |

### User Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/contact` | Submit contact form | ✅ User |
| GET | `/contact/user` | Get user's own contacts | ✅ User |

### Admin Only Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/contact/admin/all` | Get paginated list of all contacts | ✅ Admin |
| GET | `/contact/admin/stats` | Get contact statistics and analytics | ✅ Admin |
| GET | `/contact/admin/:id` | Get specific contact by ID | ✅ Admin |
| PUT | `/contact/admin/:id` | Update contact status and add admin notes | ✅ Admin |
| DELETE | `/contact/admin/:id` | Delete contact | ✅ Admin |


## Features

### Contact Management
- **User Submissions**: Authenticated users can submit contact forms
- **Auto Newsletter**: Optional newsletter subscription during contact submission
- **Status Tracking**: Contact status progression (new, read, replied, closed)
- **Interest Categories**: Categorize inquiries by interest type

### Admin Features
- **Contact Management**: Full CRUD operations on contacts
- **Status Updates**: Update contact status with admin notes
- **Search & Filter**: Advanced filtering by status, interest, and search terms
- **Analytics**: Comprehensive statistics and metrics tracking

### Tracking & Analytics
- **Status Breakdown**: Track contacts by status (new, read, replied, closed)
- **Interest Analytics**: Analytics by customer interest type
- **Recent Contacts**: 30-day contact tracking
- **User Association**: Link contacts to authenticated users

### Security Features
- **Authentication Required**: All contact submissions require user authentication
- **Admin Protection**: All admin endpoints require admin role
- **Input Validation**: Comprehensive Zod schema validation
- **Role-based Access**: User can only see their own contacts


