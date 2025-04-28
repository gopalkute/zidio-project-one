/**
 * @module Signup
 * @description Register user details on server
 */

// Tell VS Code where to find the typedefs
/// <reference path="../../utils/typedefs.js" />
import { API_ENDPOINTS } from "@/utils";
import { handleApiError } from "../apiError";
import apiClient from "../apiClient";

/**
 * Requests for user registration
 * @async
 * @function signup
 * @param {Object} userData - user data 
 * @param {string} userData.email - email address of user
 * @param {string} userData.username - username of user
 * @param {string} userData.password - password of user
 * @returns {Promise<ApiResponse>} The response object
 */
const signup = async (userData) => {
    try {
        const { data } = await apiClient.post(API_ENDPOINTS.AUTH.SIGNUP, userData);
        return { success: true, data };
    } catch (error) {
        console.log(error)
        const { fieldErrors, genericErrors } = handleApiError(error, ['email', 'password', 'username']);
        return { success: false, fieldErrors, genericErrors };
    }
}
export default signup;
