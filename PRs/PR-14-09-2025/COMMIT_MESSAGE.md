feat: implement comprehensive contact api and admin management system

- Add complete contact form backend API with authentication and CRUD operations
- Implement contact form frontend integration with loading states and user feedback
- Create admin contact management interface with filtering and status tracking
- Add contact service to API status monitoring dashboard with health checks
- Setup contact model with status tracking and user association
- Implement contact controller with proper authentication and admin authorization
- Add contact API routes with validation and middleware integration
- Create contact management page with search, filter, and detailed view modals
- Add contact service health monitoring to admin API status dashboard
- Implement contact statistics and analytics for admin dashboard

Backend features include:
- Contact model with firstName, lastName, email, phone, interest, message, subscribeNewsletter fields
- Status tracking system (new, read, replied, closed) with admin notes capability
- User association linking contacts to authenticated users for personalized management
- Comprehensive Zod validation schemas for all contact endpoints
- Newsletter auto-subscription integration when user opts in during contact submission
- Admin-only endpoints with proper role-based authorization for management operations
- Contact statistics API providing breakdown by status and recent activity metrics

Frontend features include:
- Authentication-required contact form with professional loading states and error handling
- React state management for form data with proper validation and submission flow
- Admin contact management page with advanced filtering by status, interest, and search
- Contact details modal with complete information display and status update functionality
- Statistics dashboard showing total, new, replied, and recent contact metrics
- Professional UI matching existing admin portal design with responsive layout

API monitoring includes:
- Contact service health check integration with 8 endpoint documentation
- Real-time monitoring with response time tracking and service status indicators
- Complete endpoint coverage including user and admin operations