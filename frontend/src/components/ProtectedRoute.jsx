import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-container-low">
                <div className="text-center">
                    <span className="material-symbols-outlined text-primary text-5xl mb-4 animate-spin block">sync</span>
                    <p className="text-on-surface-variant">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If user has no roles at all, let them through rather than creating a redirect loop
    const userRoles = user.roles || [];
    if (userRoles.length === 0) {
        // No roles loaded - allow access rather than infinite redirect
        return children;
    }

    if (allowedRoles && !allowedRoles.some(role => userRoles.includes(role))) {
        // User has roles but they don't match - redirect appropriately
        if (userRoles.includes('admin')) {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/client/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
