import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/auth');
    };

    const navItems = [
        { to: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
        { to: '/admin/services', icon: 'travel_explore', label: 'Servicios' },
        { to: '/admin/clients', icon: 'group', label: 'Clientes' },
        { to: '/admin/reservations', icon: 'confirmation_number', label: 'Reservas' },
    ];

    return (
        <div className="bg-background text-on-surface font-body-md h-screen overflow-hidden flex">
            {/* SideNavBar */}
            <aside className="fixed flex flex-col h-full border-r border-outline-variant bg-surface-container-low h-screen w-64 left-0 top-0 z-20">
                <div className="p-6 border-b border-outline-variant">
                    <h1 className="font-headline-sm text-headline-sm text-primary">Admin Panel</h1>
                    <p className="font-label-md text-label-md text-on-surface-variant mt-1">DMGOTRAVEL Management</p>
                </div>
                <div className="p-4 border-b border-outline-variant flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm">
                        {user?.name?.charAt(0) || 'A'}
                    </div>
                    <div>
                        <span className="block font-label-md text-label-md text-on-surface">{user?.name || 'Admin User'}</span>
                        <span className="inline-block px-2 py-0.5 bg-primary-container text-on-primary-container text-[10px] rounded uppercase font-bold tracking-wider mt-0.5">Admin</span>
                    </div>
                </div>
                <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                isActive
                                    ? 'bg-secondary-container text-on-secondary-container rounded-lg mx-2 my-1 flex items-center gap-3 p-3 font-label-md text-label-md transition-transform'
                                    : 'text-on-surface-variant hover:bg-surface-variant rounded-lg mx-2 my-1 flex items-center gap-3 p-3 font-label-md text-label-md transition-all'
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                                    {item.label}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
                <div className="border-t border-outline-variant p-2">
                    <button
                        onClick={handleLogout}
                        className="w-full text-error hover:bg-surface-variant rounded-lg mx-2 my-1 flex items-center gap-3 p-3 font-label-md text-label-md transition-all"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 h-screen overflow-y-auto bg-background p-gutter">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
