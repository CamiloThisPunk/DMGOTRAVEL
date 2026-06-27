import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ClientLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <div className="bg-background text-on-background font-body-md text-body-md antialiased flex">
            {/* SideNavBar */}
            <nav className="hidden md:flex fixed flex-col border-r border-outline-variant bg-surface-container-low dark:bg-surface-dim h-screen w-64 left-0 top-0 z-40">
                <div className="p-gutter border-b border-outline-variant">
                    <h1 className="font-headline-sm text-headline-sm text-primary dark:text-primary-fixed">DMGOTRAVEL</h1>
                </div>
                
                <div className="flex-1 overflow-y-auto py-stack-md flex flex-col gap-1 px-2">
                    <div className="px-3 pb-4 mb-4 border-b border-outline-variant flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden">
                            <span className="material-symbols-outlined text-4xl text-on-surface-variant translate-y-1">account_circle</span>
                        </div>
                        <div>
                            <p className="font-label-md text-label-md text-on-surface">Hola, {user?.name?.split(' ')[0]}</p>
                            <span className="inline-block bg-primary text-on-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm mt-1 tracking-wider">Cliente</span>
                        </div>
                    </div>
                    
                    <Link to="/client/profile" className={`rounded-lg mx-2 my-1 flex items-center gap-3 p-3 transition-all font-label-md text-label-md ${location.pathname === '/client/profile' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-variant'}`}>
                        <span className={`material-symbols-outlined ${location.pathname === '/client/profile' ? 'icon-fill' : ''}`}>person</span>
                        Mi Perfil
                    </Link>
                    
                    <Link to="/client/dashboard" className={`rounded-lg mx-2 my-1 flex items-center gap-3 p-3 transition-all font-label-md text-label-md ${location.pathname === '/client/dashboard' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-variant'}`}>
                        <span className={`material-symbols-outlined ${location.pathname === '/client/dashboard' ? 'icon-fill' : ''}`}>confirmation_number</span>
                        Mis Reservas
                    </Link>
                    
                    <Link to="/client/catalog" className={`rounded-lg mx-2 my-1 flex items-center gap-3 p-3 transition-all font-label-md text-label-md ${location.pathname === '/client/catalog' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-variant'}`}>
                        <span className={`material-symbols-outlined ${location.pathname === '/client/catalog' ? 'icon-fill' : ''}`}>explore</span>
                        Catálogo de Tours
                    </Link>
                </div>
                
                <div className="p-4 border-t border-outline-variant mt-auto">
                    <button onClick={logout} className="text-on-surface-variant hover:bg-surface-variant rounded-lg flex items-center gap-3 p-3 transition-all font-label-md text-label-md w-full">
                        <span className="material-symbols-outlined">logout</span>
                        Cerrar Sesión
                    </button>
                </div>
            </nav>

            {/* Mobile TopBar */}
            <header className="md:hidden fixed top-0 w-full bg-surface-container-lowest border-b border-outline-variant z-40 h-16 flex items-center justify-between px-gutter">
                <h1 className="font-headline-sm text-headline-sm text-primary">DMGOTRAVEL</h1>
                <button className="text-on-surface-variant">
                    <span className="material-symbols-outlined">menu</span>
                </button>
            </header>

            {/* Main Content Canvas */}
            <main className="flex-1 md:ml-64 pt-20 md:pt-0 min-h-screen">
                <Outlet />
            </main>
        </div>
    );
};

export default ClientLayout;
