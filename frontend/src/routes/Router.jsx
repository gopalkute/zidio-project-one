/**
 * @module Routes
 * @description Application route configuration
 */

import { createBrowserRouter, Navigate } from "react-router";
import { PATHS } from "@/utils";
import { LandingLayout } from "@/layout";
import { About, Contact, Features, PrivacyPolicy, Signin, Signup, TermsOfServices, Welcome } from "@/pages";


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
        }, {
            path: PATHS.ABOUT,
            element: <About />
        }, {
            path: PATHS.CONTACT,
            element: <Contact />
        }, {
            path: PATHS.FEATURES,
            element: <Features />
        }, {
            path: PATHS.TERMS_OF_SERVICES,
            element: <TermsOfServices />
        }, {
            path: PATHS.PRIVACY_POLICY,
            element: <PrivacyPolicy />
        },
    ]
},
]);

export default Router;