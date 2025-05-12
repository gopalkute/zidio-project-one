/**
 * @module api
 * @description API configuration constants
 */

/**
 * Base URL for all API requests
 * @constant {string}
 * @default 'http://localhost:8080/api'
 */
export const API_BASE_URL = 'http://localhost:5000/api'

/**
 * Collection of API endpoints organized by feature
 * @constant {Object}
 * @property {Object} AUTH - Authentication related endpoints
 * @property {string} AUTH.SIGNUP - User registration endpoint
 * @property {string} AUTH.SIGNIN - User login endpoint
 */
export const API_ENDPOINTS = {
    AUTH: {
        SIGNUP: '/user/auth/signup',
        SIGNIN: '/user/auth/signin',
        SIGNOUT: '/user/auth/signout',
        REFRESH: '/user/auth/refresh'
    },
    PROFILE: '/user/profile',
    UPLOAD_EXCEL: '/upload/excel'
}

/**
 * Collection of API error codes categorized by type
 * @constant {Object}
 * @property {string} NETWORK_ERROR - Network connectivity issue
 * @property {string} REQUEST_TIMEOUT - Request took too long
 * @property {string} REQUEST_CANCELLED - Request was cancelled
 * 
 * @property {string} BAD_REQUEST - 400: Invalid request data
 * @property {string} UNAUTHORIZED - 401: Authentication required
 * @property {string} FORBIDDEN - 403: Insufficient permissions
 * @property {string} NOT_FOUND - 404: Resource not found
 * @property {string} CONFLICT - 409: Resource conflict
 * @property {string} TOO_MANY_REQUESTS - 429: Rate limit exceeded
 * 
 * @property {string} SERVER_ERROR - 500: Internal server error
 * @property {string} BAD_GATEWAY - 502: Bad gateway
 * @property {string} SERVICE_UNAVAILABLE - 503: Service unavailable
 * @property {string} GATEWAY_TIMEOUT - 504: Gateway timeout
 * 
 * @property {string} CLIENT_ERROR - Generic client-side error
 * @property {string} UNKNOWN_ERROR - Unclassified error
 */
export const API_ERROR_CODES = {
    // Client-side errors
    NETWORK_ERROR: 'NETWORK_ERROR',
    REQUEST_TIMEOUT: 'REQUEST_TIMEOUT',
    REQUEST_CANCELLED: 'REQUEST_CANCELLED',

    // Server-side errors (specific status codes)
    BAD_REQUEST: 'BAD_REQUEST',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    CONFLICT: 'CONFLICT',
    TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',

    // Server errors
    SERVER_ERROR: 'SERVER_ERROR',
    BAD_GATEWAY: 'BAD_GATEWAY',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
    GATEWAY_TIMEOUT: 'GATEWAY_TIMEOUT',

    // Token-related
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    TOKEN_INVALID: 'TOKEN_INVALID',
    TOKEN_TAMPERED: 'TOKEN_TAMPERED',
    TOKEN_MISSING: 'TOKEN_MISSING',

    //other server errors
    WRONG_TYPE: 'WRONG_TYPE',

    // Generic fallbacks
    CLIENT_ERROR: 'CLIENT_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',

};