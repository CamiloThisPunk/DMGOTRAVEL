import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';

// Client Imports
import ClientLayout from './components/ClientLayout';
import ClientDashboard from './pages/ClientDashboard';
import TourCatalog from './pages/TourCatalog';

// Admin Imports
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminServices from './pages/admin/AdminServices';
import AdminReservations from './pages/admin/AdminReservations';
import AdminClients from './pages/admin/AdminClients';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />

        {/* Client Routes */}
        <Route path="/client" element={<ProtectedRoute allowedRoles={['client']}><ClientLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="catalog" element={<TourCatalog />} />
            <Route path="profile" element={<div className="p-12">Perfil en construcción</div>} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="reservations" element={<AdminReservations />} />
            <Route path="clients" element={<AdminClients />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App;
