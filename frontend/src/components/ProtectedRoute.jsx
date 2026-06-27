import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !user.roles?.some(role => allowedRoles.includes(role))) {
        // Redirigir al dashboard correcto según su rol si no tiene permiso para esta ruta
        return <Navigate to={user.roles?.includes('admin') ? '/admin/dashboard' : '/client/dashboard'} />;
    }

    return children;
};

export default ProtectedRoute;
