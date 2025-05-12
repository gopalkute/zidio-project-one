/**
 * @module Routes
 * @description Application route configuration
 */

import { createBrowserRouter, Navigate } from "react-router";

import { PATHS } from "@/utils";
import { DashboardLayout, LandingLayout } from "@/layout";
import { About, Contact, Features, FileUpload, Forbidden, NotFound, PrivacyPolicy, Signin, Signup, TermsOfServices, UploadHistory, Welcome } from "@/pages";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";


/**
 * Main application router configuration
 * @constant {Array<Object>}
 */
const Router = createBrowserRouter(
    [
        {
            path: '/',
            element: <LandingLayout />,
            children: [
                { index: true, element: <Navigate to={PATHS.WELCOME} replace /> },
                { path: PATHS.WELCOME, element: <Welcome /> },
                {
                    path: PATHS.SIGNIN,
                    element: <PublicRoute restricted><Signin /></PublicRoute>
                }, {
                    path: PATHS.SIGNUP,
                    element: <PublicRoute restricted><Signup /></PublicRoute>
                },
                { path: PATHS.ABOUT, element: <About /> },
                { path: PATHS.CONTACT, element: <Contact /> },
                { path: PATHS.FEATURES, element: <Features /> },
                { path: PATHS.TERMS_OF_SERVICES, element: <TermsOfServices /> },
                { path: PATHS.PRIVACY_POLICY, element: <PrivacyPolicy /> },
            ]
        }, {
            path: PATHS.DASHBOARD,
            element: <ProtectedRoute ><DashboardLayout /></ProtectedRoute>,
            children: [
                { index: true, element: <FileUpload /> },
                { path: PATHS.UPLOADS_HISTORY, element: <UploadHistory /> }
            ]
        },
        { path: PATHS.FORBIDDEN, element: <Forbidden /> },
        { path: PATHS.NOT_FOUND, element: <NotFound /> }
    ]
);

export default Router;