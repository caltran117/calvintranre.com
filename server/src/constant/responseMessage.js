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

    customMessage: (message) => message,
};