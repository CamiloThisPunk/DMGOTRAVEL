import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ClientLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased">
            {/* TopNavBar */}
            <header className="bg-surface-container-lowest border-b border-outline-variant w-full top-0 sticky z-50">
                <div className="container mx-auto flex justify-between items-center h-20 px-gutter max-w-[1320px]">
                    <NavLink to="/" className="font-display-lg md:text-display-lg text-display-lg-mobile text-primary tracking-tight">
                        DMGOTRAVEL
                    </NavLink>
                    <nav className="hidden md:flex gap-6 h-full">
                        <NavLink to="/" className="flex items-center h-full px-2 text-on-surface-variant hover:text-secondary transition-colors font-body-md text-body-md">
                            Inicio
                        </NavLink>
                        <NavLink to="/client/catalog"
                            className={({ isActive }) =>
                                `flex items-center h-full px-2 font-body-md text-body-md transition-colors ${
                                    isActive ? 'text-primary font-bold border-b-2 border-secondary' : 'text-on-surface-variant hover:text-secondary'
                                }`
                            }>
                            Destinos
                        </NavLink>
                        <NavLink to="/client/tourist-packages"
                            className={({ isActive }) =>
                                `flex items-center h-full px-2 font-body-md text-body-md transition-colors ${
                                    isActive ? 'text-primary font-bold border-b-2 border-secondary' : 'text-on-surface-variant hover:text-secondary'
                                }`
                            }>
                            Paquetes Turísticos
                        </NavLink>
                        <NavLink to="/client/dashboard"
                            className={({ isActive }) =>
                                `flex items-center h-full px-2 font-body-md text-body-md transition-colors ${
                                    isActive ? 'text-primary font-bold border-b-2 border-secondary' : 'text-on-surface-variant hover:text-secondary'
                                }`
                            }>
                            Mis Reservas
                        </NavLink>
                    </nav>
                    <div className="flex items-center gap-4">
                        <span className="hidden md:flex items-center gap-2 text-on-surface-variant">
                            <span className="material-symbols-outlined">account_circle</span>
                            <span className="font-label-md text-label-md">{user?.name || 'Perfil'}</span>
                        </span>
                        <button onClick={handleLogout} className="text-on-surface-variant hover:text-error transition-colors">
                            <span className="material-symbols-outlined">logout</span>
                        </button>
                        <button className="md:hidden text-primary">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-primary w-full py-stack-lg px-gutter flex flex-col items-center gap-stack-md mt-auto">
                <div className="font-headline-sm text-headline-sm text-on-primary mb-4">
                    DMGOTRAVEL
                </div>
                <div className="flex flex-wrap justify-center gap-6 mb-4">
                    <a className="text-on-primary-container hover:text-secondary-fixed-dim transition-colors opacity-80 hover:opacity-100 font-body-md text-body-md" href="#">Facebook</a>
                    <a className="text-on-primary-container hover:text-secondary-fixed-dim transition-colors opacity-80 hover:opacity-100 font-body-md text-body-md" href="#">Instagram</a>
                    <a className="text-on-primary-container hover:text-secondary-fixed-dim transition-colors opacity-80 hover:opacity-100 font-body-md text-body-md" href="#">WhatsApp</a>
                    <a className="text-on-primary-container hover:text-secondary-fixed-dim transition-colors opacity-80 hover:opacity-100 font-body-md text-body-md" href="#">Términos y Condiciones</a>
                </div>
                <div className="font-body-md text-body-md text-on-primary opacity-60 text-center">
                    &copy; {new Date().getFullYear()} DMGOTRAVEL. Explorando el corazón de los Andes.
                </div>
            </footer>
        </div>
    );
};

export default ClientLayout;
