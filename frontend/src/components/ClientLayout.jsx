import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const ClientLayout = () => {
    const { user, logout, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Dropdown state
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    // Modals state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Edit Profile form state
    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    
    // Delete Account state
    const [isDeleting, setIsDeleting] = useState(false);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Initialize edit form when opening modal
    useEffect(() => {
        if (isEditModalOpen && user) {
            setEditName(user.name || '');
            setEditPhone(user.phone || '');
        }
    }, [isEditModalOpen, user]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateProfile({ name: editName, phone: editPhone });
            setIsEditModalOpen(false);
        } catch (error) {
            console.error(error);
            alert('Error al guardar el perfil');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            await api.delete('/api/client/profile');
            await logout();
            navigate('/login');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error al eliminar la cuenta');
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased relative">
            {/* TopNavBar */}
            <header className="bg-surface-container-lowest border-b border-outline-variant w-full top-0 sticky z-40">
                <div className="container mx-auto flex justify-between items-center h-20 px-gutter max-w-[1320px]">
                    <NavLink to="/" className="font-display-lg md:text-display-lg text-display-lg-mobile text-primary tracking-tight">
                        DMGOTRAVEL
                    </NavLink>
                    <nav className="hidden md:flex items-center gap-8">
                        <NavLink to="/client/catalog"
                            className={({ isActive }) =>
                                `block pb-1 font-body-md text-body-md transition-colors border-b-2 ${
                                    isActive ? 'text-primary font-bold border-secondary' : 'text-on-surface-variant border-transparent hover:text-secondary hover:border-secondary'
                                }`
                            }>
                            Destinos
                        </NavLink>
                        <NavLink to="/client/tourist-packages"
                            className={({ isActive }) =>
                                `block pb-1 font-body-md text-body-md transition-colors border-b-2 ${
                                    isActive ? 'text-primary font-bold border-secondary' : 'text-on-surface-variant border-transparent hover:text-secondary hover:border-secondary'
                                }`
                            }>
                            Paquetes Turísticos
                        </NavLink>
                        <NavLink to="/client/dashboard"
                            className={({ isActive }) =>
                                `block pb-1 font-body-md text-body-md transition-colors border-b-2 ${
                                    isActive ? 'text-primary font-bold border-secondary' : 'text-on-surface-variant border-transparent hover:text-secondary hover:border-secondary'
                                }`
                            }>
                            Mis Reservas
                        </NavLink>
                    </nav>
                    <div className="flex items-center gap-4">
                        
                        {/* Profile Dropdown */}
                        <div className="relative hidden md:block" ref={dropdownRef}>
                            <button 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={`flex items-center gap-2 text-on-surface-variant hover:text-primary hover:bg-surface-variant px-3 py-2 rounded-lg transition-all duration-300 ${isDropdownOpen ? 'bg-surface-variant text-primary ring-2 ring-primary/20' : ''}`}
                            >
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="w-7 h-7 rounded-full object-cover ring-2 ring-surface-variant" />
                                ) : (
                                    <span className="material-symbols-outlined text-[28px]">account_circle</span>
                                )}
                                <span className="font-label-md text-label-md max-w-[150px] truncate">{user?.name || 'Perfil'}</span>
                                <span className={`material-symbols-outlined text-sm transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                                    <div className="px-4 py-3 border-b border-outline-variant/30 mb-2">
                                        <p className="text-sm font-bold text-on-surface truncate">{user?.name}</p>
                                        <p className="text-xs text-on-surface-variant truncate">{user?.email}</p>
                                    </div>
                                    
                                    <button 
                                        onClick={() => { setIsEditModalOpen(true); setIsDropdownOpen(false); }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-on-surface hover:bg-surface-variant hover:text-primary transition-colors flex items-center gap-3"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
                                        Editar Perfil
                                    </button>
                                    
                                    <button 
                                        className="w-full text-left px-4 py-2.5 text-sm text-on-surface hover:bg-surface-variant hover:text-primary transition-colors flex items-center gap-3"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">settings</span>
                                        Preferencias (Pronto)
                                    </button>

                                    <div className="h-px bg-outline-variant/30 my-2 mx-4"></div>
                                    
                                    <button 
                                        onClick={() => { setIsDeleteModalOpen(true); setIsDropdownOpen(false); }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-error hover:bg-error-container hover:text-on-error-container transition-colors flex items-center gap-3"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">delete_forever</span>
                                        Eliminar Cuenta
                                    </button>
                                    
                                    <button 
                                        onClick={handleLogout} 
                                        className="w-full text-left px-4 py-2.5 text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-variant transition-colors flex items-center gap-3 mt-1"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">logout</span>
                                        Cerrar Sesión
                                    </button>
                                </div>
                            )}
                        </div>

                        <button className="md:hidden text-primary" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                        </button>
                    </div>
                </div>
                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-surface-container-lowest border-t border-outline-variant py-4 px-gutter shadow-lg absolute w-full z-50">
                        <nav className="flex flex-col gap-4">
                            <NavLink to="/client/catalog" onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `block pb-2 font-body-md text-body-md transition-colors border-b border-outline-variant/50 ${
                                        isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-secondary'
                                    }`
                                }>
                                Destinos
                            </NavLink>
                            <NavLink to="/client/tourist-packages" onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `block pb-2 font-body-md text-body-md transition-colors border-b border-outline-variant/50 ${
                                        isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-secondary'
                                    }`
                                }>
                                Paquetes Turísticos
                            </NavLink>
                            <NavLink to="/client/dashboard" onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `block pb-2 font-body-md text-body-md transition-colors border-b border-outline-variant/50 ${
                                        isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-secondary'
                                    }`
                                }>
                                Mis Reservas
                            </NavLink>
                            
                            <div className="h-px bg-outline-variant/50 my-2"></div>
                            
                            <div className="flex items-center gap-3 mb-2 px-2">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                                ) : (
                                    <span className="material-symbols-outlined text-on-surface-variant text-[32px]">account_circle</span>
                                )}
                                <div>
                                    <p className="font-bold text-on-surface text-sm">{user?.name}</p>
                                    <p className="text-xs text-on-surface-variant">{user?.email}</p>
                                </div>
                            </div>
                            
                            <button onClick={() => { setIsEditModalOpen(true); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 text-on-surface hover:text-primary p-2">
                                <span className="material-symbols-outlined">manage_accounts</span>
                                Editar Perfil
                            </button>
                            
                            <button onClick={() => { setIsDeleteModalOpen(true); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 text-error p-2">
                                <span className="material-symbols-outlined">delete_forever</span>
                                Eliminar Cuenta
                            </button>
                            
                            <button onClick={handleLogout} className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface p-2 mt-2">
                                <span className="material-symbols-outlined">logout</span>
                                Cerrar Sesión
                            </button>
                        </nav>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-grow z-10">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-primary w-full py-stack-lg px-gutter flex flex-col items-center gap-stack-md mt-auto z-10 relative">
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

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}>
                    <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 border border-outline-variant/30" onClick={e => e.stopPropagation()}>
                        <div className="relative h-24 bg-gradient-to-r from-primary to-secondary-container">
                            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-white hover:bg-white/20 p-1.5 rounded-full transition-colors flex items-center justify-center backdrop-blur-md">
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </div>
                        
                        <div className="px-8 pb-8 relative">
                            <div className="absolute -top-12 left-8 border-4 border-surface rounded-full bg-surface">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover shadow-sm" />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-surface-variant flex items-center justify-center shadow-sm">
                                        <span className="material-symbols-outlined text-4xl text-on-surface-variant">person</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="pt-12 mb-6">
                                <h3 className="font-display-sm text-display-sm text-on-surface">Mi Perfil</h3>
                                <p className="text-on-surface-variant text-sm">Actualiza tu información personal</p>
                            </div>
                            
                            <form onSubmit={handleSaveProfile} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 ml-1">Correo Electrónico (No editable)</label>
                                    <div className="flex items-center bg-surface-container-low px-4 py-3 rounded-xl border border-outline-variant/50 opacity-70">
                                        <span className="material-symbols-outlined text-on-surface-variant mr-3 text-sm">lock</span>
                                        <span className="text-on-surface-variant">{user?.email}</span>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 ml-1" htmlFor="edit-name">Nombre Completo</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">badge</span>
                                        </div>
                                        <input 
                                            id="edit-name" type="text" required
                                            value={editName} onChange={(e) => setEditName(e.target.value)}
                                            className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl pl-11 pr-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                            placeholder="Tu nombre"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 ml-1" htmlFor="edit-phone">Teléfono / WhatsApp</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">call</span>
                                        </div>
                                        <input 
                                            id="edit-phone" type="tel"
                                            value={editPhone} onChange={(e) => setEditPhone(e.target.value)}
                                            className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl pl-11 pr-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                            placeholder="+51 999 999 999"
                                        />
                                    </div>
                                </div>
                                
                                <div className="pt-4 flex gap-3">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="flex-1 px-4 py-3 border border-outline-variant text-on-surface font-bold rounded-xl hover:bg-surface-variant transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        type="submit" disabled={isSaving}
                                        className="flex-1 px-4 py-3 bg-primary text-on-primary font-bold rounded-xl hover:bg-on-primary-fixed-variant transition-all hover:shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
                                    >
                                        {isSaving ? (
                                            <><span className="material-symbols-outlined animate-spin text-sm">sync</span> Guardando...</>
                                        ) : (
                                            <><span className="material-symbols-outlined text-sm">save</span> Guardar</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Account Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" onClick={() => !isDeleting && setIsDeleteModalOpen(false)}>
                    <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-error/20" onClick={e => e.stopPropagation()}>
                        <div className="p-6 flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-error-container text-on-error-container flex items-center justify-center mb-4 ring-4 ring-error/10">
                                <span className="material-symbols-outlined text-3xl">warning</span>
                            </div>
                            <h3 className="font-display-sm text-display-sm text-on-surface mb-2">¿Eliminar tu cuenta?</h3>
                            <p className="text-on-surface-variant text-sm mb-6">
                                Esta acción es <strong>permanente e irreversible</strong>. Perderás el acceso a todas tus reservas, historial y perfil de inmediato.
                            </p>
                            
                            <div className="w-full space-y-3">
                                <button 
                                    onClick={handleDeleteAccount} disabled={isDeleting}
                                    className="w-full px-4 py-3 bg-error text-on-error font-bold rounded-xl hover:bg-[#ba1a1a] transition-all hover:shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
                                >
                                    {isDeleting ? (
                                        <><span className="material-symbols-outlined animate-spin text-sm">sync</span> Eliminando...</>
                                    ) : (
                                        <><span className="material-symbols-outlined text-sm">delete_forever</span> Sí, eliminar para siempre</>
                                    )}
                                </button>
                                <button 
                                    onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}
                                    className="w-full px-4 py-3 bg-surface-variant text-on-surface font-bold rounded-xl hover:bg-surface-container-high transition-colors disabled:opacity-50"
                                >
                                    Cancelar y volver
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientLayout;
