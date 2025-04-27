/**
 * @module Routes
 * @description Application route paths configuration
 */

/**
 * Main route paths used throughout the application
 * @constant {Object}
 * @property {string} SIGNIN - User authentication path
 * @property {string} SIGNUP - User registration path
 * @property {string} DASHBOARD - Main authenticated user area
 * @property {string} NOT_FOUND - Catch-all route for 404 pages
 */
const PATHS = {
    HOME: "/",
    SIGNIN: "/sign-in",
    SIGNUP: "/sign-up",
    DASHBOARD: "/dashboard",
    NOT_FOUND: "*",
};

export default PATHS;