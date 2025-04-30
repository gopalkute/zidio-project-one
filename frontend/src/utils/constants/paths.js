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
    WELCOME: "/welcome",
    SIGNUP: "/sign-up",
    SIGNIN: "/sign-in",
    ABOUT: "/about",
    FEATURES: "/features",
    CONTACT: "/contact-us",
    PRIVACY_POLICY: "/privacy-policy",
    TERMS_OF_SERVICES: "/terms-of-services",

    DASHBOARD: "/dashboard",

    NOT_FOUND: "*",
};

export default PATHS;