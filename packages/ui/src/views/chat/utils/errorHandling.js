/**
 * Error handling utilities for chat functionality
 */

// Custom error types
export class ChatError extends Error {
    constructor(message, code, details = {}) {
        super(message);
        this.name = 'ChatError';
        this.code = code;
        this.details = details;
        this.timestamp = new Date().toISOString();
    }
}

export class NetworkError extends ChatError {
    constructor(message, details = {}) {
        super(message, 'NETWORK_ERROR', details);
        this.name = 'NetworkError';
    }
}

export class APIError extends ChatError {
    constructor(message, status, details = {}) {
        super(message, 'API_ERROR', { status, ...details });
        this.name = 'APIError';
        this.status = status;
    }
}

export class ValidationError extends ChatError {
    constructor(message, field, details = {}) {
        super(message, 'VALIDATION_ERROR', { field, ...details });
        this.name = 'ValidationError';
        this.field = field;
    }
}

// Error codes and messages
export const ErrorCodes = {
    NETWORK_ERROR: 'NETWORK_ERROR',
    API_ERROR: 'API_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    UPLOAD_ERROR: 'UPLOAD_ERROR',
    SESSION_ERROR: 'SESSION_ERROR',
    STREAM_ERROR: 'STREAM_ERROR'
};

export const ErrorMessages = {
    [ErrorCodes.NETWORK_ERROR]: 'Network connection error. Please check your internet connection.',
    [ErrorCodes.API_ERROR]: 'Server error. Please try again later.',
    [ErrorCodes.VALIDATION_ERROR]: 'Invalid input. Please check your data.',
    [ErrorCodes.UPLOAD_ERROR]: 'File upload failed. Please try again.',
    [ErrorCodes.SESSION_ERROR]: 'Session error. Please refresh the page.',
    [ErrorCodes.STREAM_ERROR]: 'Stream connection error. Please try again.'
};

/**
 * Format error for display
 * @param {Error} error - Error to format
 * @returns {Object} Formatted error
 */
export const formatError = (error) => {
    if (error instanceof ChatError) {
        return {
            message: error.message,
            code: error.code,
            details: error.details,
            timestamp: error.timestamp
        };
    }

    // Handle Axios errors
    if (error.isAxiosError) {
        const status = error.response?.status;
        const data = error.response?.data;
        
        return {
            message: data?.message || error.message,
            code: ErrorCodes.API_ERROR,
            details: {
                status,
                data,
                url: error.config?.url
            },
            timestamp: new Date().toISOString()
        };
    }

    // Handle other errors
    return {
        message: error.message || 'An unknown error occurred',
        code: 'UNKNOWN_ERROR',
        details: {},
        timestamp: new Date().toISOString()
    };
};

/**
 * Create error from API response
 * @param {Object} response - API response object
 * @returns {Error} Appropriate error instance
 */
export const createErrorFromResponse = (response) => {
    const status = response.status;
    const data = response.data || {};
    
    if (status === 0 || !status) {
        return new NetworkError('Network request failed');
    }
    
    if (status === 400) {
        return new ValidationError(
            data.message || 'Invalid request',
            data.field
        );
    }
    
    if (status === 401) {
        return new APIError(
            data.message || 'Unauthorized',
            status
        );
    }
    
    if (status === 403) {
        return new APIError(
            data.message || 'Forbidden',
            status
        );
    }
    
    if (status === 404) {
        return new APIError(
            data.message || 'Resource not found',
            status
        );
    }
    
    if (status === 429) {
        return new APIError(
            data.message || 'Too many requests',
            status
        );
    }
    
    if (status >= 500) {
        return new APIError(
            data.message || 'Server error',
            status
        );
    }
    
    return new APIError(
        data.message || 'Unknown error',
        status
    );
};

/**
 * Check if error should trigger a retry
 * @param {Error} error - Error to check
 * @returns {boolean} Whether to retry
 */
export const shouldRetry = (error) => {
    // Don't retry validation errors
    if (error instanceof ValidationError) {
        return false;
    }
    
    // Don't retry auth errors
    if (error instanceof APIError && [401, 403].includes(error.status)) {
        return false;
    }
    
    // Retry network errors
    if (error instanceof NetworkError) {
        return true;
    }
    
    // Retry server errors and rate limiting
    if (error instanceof APIError && (error.status >= 500 || error.status === 429)) {
        return true;
    }
    
    return false;
};

/**
 * Log error with consistent format
 * @param {Error} error - Error to log
 * @param {Object} context - Additional context
 */
export const logError = (error, context = {}) => {
    const errorData = {
        ...formatError(error),
        context
    };
    
    if (process.env.NODE_ENV === 'development') {
        console.error('[Chat Error]', errorData);
    }
    
    // Here you could add error reporting service integration
    // e.g., Sentry, LogRocket, etc.
};

export default {
    ChatError,
    NetworkError,
    APIError,
    ValidationError,
    ErrorCodes,
    ErrorMessages,
    formatError,
    createErrorFromResponse,
    shouldRetry,
    logError
};
