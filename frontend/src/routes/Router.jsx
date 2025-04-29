/**
 * @module Routes
 * @description Application route configuration
 */

import { createBrowserRouter, Navigate } from "react-router";
import { PATHS } from "@/utils";
import { LandingLayout } from "@/layout";
import { Signin, Signup, Welcome } from "@/pages";


/**
 * Main application router configuration
 * @constant {Array<Object>}
 */
const Router = createBrowserRouter([{
    path: '/',
    element: <Navigate to={PATHS.WELCOME} replace />
}, {
    path: '/',
    element: <LandingLayout />,
    children: [
        {
            path: PATHS.WELCOME,
            element: <Welcome />
        }, {
            path: PATHS.SIGNIN,
            element: <Signin />
        }, {
            path: PATHS.SIGNUP,
            element: <Signup />
        },
    ]
},
]);

export default Router;