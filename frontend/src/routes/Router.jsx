/**
 * @module Routes
 * @description Application route configuration
 */

import { LandingPage, Signin, Signup } from "@/pages";
import { PATHS } from "@/utils";
import { createBrowserRouter, Navigate } from "react-router";


/**
 * Main application router configuration
 * @constant {Array<Object>}
 */
const Router = createBrowserRouter([{
    path: '/',
    element: <Navigate to={PATHS.WELCOME} replace />
}, {
    path: PATHS.WELCOME,
    element: <LandingPage />
}, {
    path: PATHS.SIGNIN,
    element: <Signin />
}, {
    path: PATHS.SIGNUP,
    element: <Signup />
}
]);

export default Router;