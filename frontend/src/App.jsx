import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import AuthCallback from './pages/AuthCallback';
import ProtectedRoute from './components/ProtectedRoute';

// Client Imports
import ClientLayout from './components/ClientLayout';
import ClientDashboard from './pages/ClientDashboard';
import TourCatalog from './pages/TourCatalog';
import ClientTouristPackages from './pages/client/ClientTouristPackages';
import ClientTouristPackageDetail from './pages/client/ClientTouristPackageDetail';
import ClientTouristPackageCheckout from './pages/client/ClientTouristPackageCheckout';

// Admin Imports
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminServices from './pages/admin/AdminServices';
import AdminTouristPackages from './pages/admin/AdminTouristPackages';
import AdminEditTouristPackage from './pages/admin/AdminEditTouristPackage';
import AdminReservations from './pages/admin/AdminReservations';
import AdminClients from './pages/admin/AdminClients';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Client Routes */}
        <Route path="/client" element={<ProtectedRoute allowedRoles={['client']}><ClientLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="catalog" element={<TourCatalog />} />
            <Route path="catalog/:id/checkout" element={<ClientTouristPackageCheckout />} />
            <Route path="tourist-packages" element={<ClientTouristPackages />} />
            <Route path="tourist-packages/:id" element={<ClientTouristPackageDetail />} />
            <Route path="tourist-packages/:id/checkout" element={<ClientTouristPackageCheckout />} />
            <Route path="profile" element={<div className="p-12 text-center text-on-surface-variant">Perfil en construcción</div>} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="tourist-packages" element={<AdminTouristPackages />} />
            <Route path="tourist-packages/create" element={<AdminEditTouristPackage />} />
            <Route path="tourist-packages/:id/edit" element={<AdminEditTouristPackage />} />
            <Route path="reservations" element={<AdminReservations />} />
            <Route path="clients" element={<AdminClients />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App;
