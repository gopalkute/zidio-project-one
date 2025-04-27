/**
 * @module interceptors
 * @description Axios interceptors configuration for API requests/responses
 */

import axios from "axios";
import { createApiError } from "./apiError";

/**
 * Configures request and response interceptors for an Axios instance
 * @function setupInterceptors
 * @param {AxiosInstance} [apiClient=axios.create()] - Axios instance to configure
 * @returns {void} 
 * @description
 * Request Interceptor:
 * - Logs outgoing requests
 * - Enables credentials for all requests
 * 
 * Response Interceptor:
 * - Success: Passes through successful responses
 * - Error: Converts Axios errors to standardized ApiError format
 */
export const setupInterceptors = (apiClient = axios.create()) => {
    apiClient.interceptors.request.use(
        (config) => {
            config.withCredentials = true;
            return config;
        },
    )

    apiClient.interceptors.response.use(
        (response) => response,
        async (error) => {
            throw createApiError(error);
        }
    )
}