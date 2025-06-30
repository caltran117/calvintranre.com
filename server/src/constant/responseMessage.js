export default {
    SUCCESS: 'The operation has been successful',
    CREATED: 'The resource has been created successfully',
    UPDATED: 'The resource has been updated successfully',
    DELETED: 'The resource has been deleted successfully',

    SERVICE: (service) => `${service} service is running.`,

    ERROR: {
        SOMETHING_WENT_WRONG: 'Something went wrong!',
        INTERNAL_SERVER_ERROR: 'Internal server error',
        NOT_FOUND: (entity) => `${entity} not found`,
        ALREADY_EXISTS: (entity) => `${entity} already exists`,
        TOO_MANY_REQUESTS: 'Too many requests! Please try again after some time',
        BAD_REQUEST: 'Bad request',
        DATABASE_ERROR: 'A database error occurred',
        SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
    },

    COMMON: {
        INVALID_PARAMETERS: (param) => param ? `Invalid parameter: ${param}` : 'Invalid parameters provided',
        ACTION_NOT_ALLOWED: 'This action is not allowed',
        OPERATION_FAILED: (operation) => `${operation} operation failed`,
        OPERATION_SUCCESS: (operation) => `${operation} operation succeeded`,
        FAILED_TO_SAVE: (entity) => `Failed to save ${entity}`,
        INVALID_ID: 'Invalid ID format provided',
        FAILED_TO_UPDATE: (entity) => `Failed to update ${entity}`, 
        
    },

    AUTH: {
        LOGIN_SUCCESS: 'Login successful',
        LOGIN_FAILED: 'Invalid email or password',
        UNAUTHORIZED: 'You are not authorized to access this resource',
        FORBIDDEN: 'You do not have permission to perform this action',
        TOKEN_EXPIRED: 'Authentication token has expired',
        TOKEN_INVALID: 'Authentication token is invalid',
        ALREADY_EXIST: (entity, value) => `${entity} with value ${value} already exists`,
        INVALID_PHONE_NUMBER: 'Invalid phone number provided',
        ACCOUNT_ALREADY_CONFIRMED: 'Account already confirmed',
        ACCOUNT_NOT_CONFIRMED: 'Account not confirmed',
        PASSWORD_NOT_MATCH: 'Password does not match',
    },

    PROPERTY: {
        LISTING_CREATED: 'Property listing created successfully',
        LISTING_UPDATED: 'Property listing updated successfully',
        LISTING_DELETED: 'Property listing deleted successfully',
        LISTING_NOT_FOUND: 'Property listing not found',
        INVALID_PRICE_RANGE: 'Invalid price range provided',
        INVALID_LOCATION: 'Invalid location coordinates provided',
        NO_PROPERTIES_FOUND: 'No properties found matching your criteria',
        SIMILAR_PROPERTIES_FOUND: 'Similar properties retrieved successfully',
        FEATURED_PROPERTIES_FOUND: 'Featured properties retrieved successfully',
        PROPERTY_STATUS_UPDATED: 'Property status updated successfully',
        INVALID_PROPERTY_TYPE: 'Invalid property type provided',
        IMAGES_REQUIRED: 'At least one image is required for the property',
        INVALID_SQUARE_FOOTAGE: 'Invalid square footage provided',
        RENTAL_INFO_REQUIRED: 'Rental information is required for rental properties',
        SALE_INFO_REQUIRED: 'Sale information is required for sale properties',
        PROPERTY_NOT_AVAILABLE: 'This property is not available',
        LOCATION_SEARCH_FAILED: 'Failed to search properties by location',
        PROPERTY_SEARCH_SUCCESS: 'Property search completed successfully',
        FILTER_APPLIED: 'Filters applied successfully',
        SORT_APPLIED: 'Sorting applied successfully',
        PAGINATION_APPLIED: 'Pagination applied successfully'
    },

    LOCATION: {
        COORDINATES_REQUIRED: 'Latitude and longitude coordinates are required',
        INVALID_COORDINATES: 'Invalid coordinates provided',
        LOCATION_SAVED: 'Location saved successfully',
        LOCATION_UPDATED: 'Location updated successfully',
        LOCATION_DELETED: 'Location deleted successfully',
        LOCATION_NOT_FOUND: 'Location not found',
        RADIUS_SEARCH_SUCCESS: 'Properties found within specified radius',
        ADDRESS_VALIDATION_FAILED: 'Failed to validate the provided address'
    },

    SEARCH: {
        SEARCH_COMPLETED: 'Search completed successfully',
        NO_RESULTS: 'No results found for your search query',
        SEARCH_QUERY_REQUIRED: 'Search query is required',
        INVALID_SEARCH_PARAMETERS: 'Invalid search parameters provided',
        SEARCH_RADIUS_INVALID: 'Invalid search radius provided',
        GEOLOCATION_SEARCH_SUCCESS: 'Location-based search completed successfully'
    },

    VALIDATION: {
        REQUIRED_FIELD: (field) => `${field} is required`,
        INVALID_FORMAT: (field) => `Invalid ${field} format`,
        MIN_LENGTH: (field, length) => `${field} must be at least ${length} characters long`,
        MAX_LENGTH: (field, length) => `${field} cannot exceed ${length} characters`,
        INVALID_EMAIL: 'Invalid email format',
        INVALID_PHONE: 'Invalid phone number format',
        INVALID_URL: 'Invalid URL format',
        INVALID_DATE: 'Invalid date format',
        INVALID_NUMBER: 'Invalid number format',
        MIN_VALUE: (field, value) => `${field} must be at least ${value}`,
        MAX_VALUE: (field, value) => `${field} cannot exceed ${value}`,
        INVALID_ENUM: (field, values) => `${field} must be one of: ${values.join(', ')}`
    },

    RENTAL: {
        LEASE_TERMS_REQUIRED: 'Lease terms are required for rental properties',
        DEPOSIT_INFO_REQUIRED: 'Deposit information is required',
        AVAILABILITY_DATE_REQUIRED: 'Availability date is required',
        INVALID_LEASE_DURATION: 'Invalid lease duration provided',
        PET_POLICY_UPDATED: 'Pet policy updated successfully',
        UTILITIES_INFO_UPDATED: 'Utilities information updated successfully',
        PARKING_INFO_UPDATED: 'Parking information updated successfully',
        FURNISHED_STATUS_UPDATED: 'Furnished status updated successfully'
    },

    ADMIN: {
        ADMIN_ACCESS_REQUIRED: 'Administrator access required for this operation',
        PROPERTY_APPROVED: 'Property listing approved successfully',
        PROPERTY_REJECTED: 'Property listing rejected',
        BULK_UPDATE_SUCCESS: 'Bulk update completed successfully',
        BULK_DELETE_SUCCESS: 'Bulk delete completed successfully',
        STATISTICS_GENERATED: 'Statistics generated successfully',
        REPORT_GENERATED: 'Report generated successfully'
    },

    customMessage: (message) => message,
};