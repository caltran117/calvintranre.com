# Newsletter API Documentation

## Overview
The Newsletter API manages email subscriptions, consent tracking, and bulk email functionality. It provides complete newsletter management with GDPR compliance features and comprehensive analytics.

## Available Endpoints

### Public Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/newsletter/self` | Check if Newsletter service is running | ❌ |
| POST | `/newsletter/subscribe` | Subscribe to newsletter with consent | ❌ |
| POST | `/newsletter/unsubscribe` | Unsubscribe from newsletter | ❌ |
| GET | `/newsletter/status/:email` | Get subscription status for email | ❌ |
| PUT | `/newsletter/preferences/:email` | Update subscription preferences | ❌ |

### Admin Only Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/newsletter/admin/subscribers` | Get paginated list of all subscribers | ✅ Admin |
| GET | `/newsletter/admin/subscribers/:id` | Get specific subscriber by ID | ✅ Admin |
| PUT | `/newsletter/admin/subscribers/:id` | Update subscriber (admin privileges) | ✅ Admin |
| DELETE | `/newsletter/admin/subscribers/:id` | Delete subscriber | ✅ Admin |
| POST | `/newsletter/admin/send-bulk` | Send bulk email to subscribers | ✅ Admin |
| GET | `/newsletter/admin/stats` | Get newsletter statistics and analytics | ✅ Admin |


## Features

### Subscription Management
- **Auto-resubscribe**: Existing unsubscribed users can resubscribe
- **Consent Tracking**: Full GDPR compliance with explicit consent
- **Preference Updates**: Users can modify their subscription preferences
- **Unsubscribe**: Simple one-click unsubscribe process

### Admin Features
- **Subscriber Management**: Full CRUD operations on subscribers
- **Bulk Email**: Send emails to filtered subscriber lists
- **Analytics**: Comprehensive statistics and trend analysis
- **Filtering**: Advanced filtering by subscription status, consent, etc.

### Tracking & Analytics
- **Email Count**: Track number of emails sent to each subscriber
- **Timestamps**: Track subscription, unsubscription, and last email dates
- **Statistics**: Real-time analytics on subscriber base
- **Trends**: 30-day subscription/unsubscription trends

### Security Features
- **Admin Protection**: All admin endpoints require authentication
- **Input Validation**: Comprehensive Zod schema validation
- **Data Sanitization**: Email normalization and validation
- **Role-based Access**: Admin-only operations properly secured



