import { Navigate, useLocation } from "react-router";
import { LoadingOverlay } from "@/components";
import { useAuth } from "@/context";
import { PATHS } from "@/utils";

function ProtectedRoute({ children, requiredRoles = [] }) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <LoadingOverlay />
    }
    if (!isAuthenticated) {
        const currentPath = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`${PATHS.SIGNIN}?redirect=${currentPath}`} replace />;
    }
    if (requiredRoles.length > 0 && (!user?.roles || !requiredRoles.some(role => user.roles.includes(role)))) {
        return <Navigate to={PATHS.FORBIDDEN} replace />;
    }
    return children;
}

export default ProtectedRoute;