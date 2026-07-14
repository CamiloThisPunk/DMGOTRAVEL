import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Auth = () => {
    const [isRegister, setIsRegister] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();
    
    // Login State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // Register State
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirm, setRegConfirm] = useState('');
    const [regError, setRegError] = useState('');
    const [showRegPassword, setShowRegPassword] = useState(false);

    const handleGoogleLogin = async () => {
        try {
            const response = await api.get('/api/auth/google/redirect');
            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.error("Error connecting to Google:", error);
            alert("No se pudo conectar con Google. Intenta de nuevo.");
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        try {
            const user = await login(loginEmail, loginPassword, rememberMe);
            if (user.roles && user.roles.includes('admin')) {
                navigate('/admin/dashboard');
            } else {
                navigate('/client/dashboard');
            }
        } catch (error) {
            setLoginError('Credenciales incorrectas o problema de red.');
        }
    };


    const handleRegister = async (e) => {
        e.preventDefault();
        setRegError('');
        if (regPassword !== regConfirm) {
            setRegError('Las contraseñas no coinciden.');
            return;
        }
        try {
            const user = await register(regName, regEmail, regPhone, regPassword, regConfirm);
            if (user.roles && user.roles.includes('admin')) {
                navigate('/admin/dashboard');
            } else {
                navigate('/client/dashboard');
            }
        } catch (error) {
            setRegError('Error al crear cuenta. Verifica los datos.');
        }
    };

    return (
        <div className="bg-background text-on-background min-h-screen font-body-md text-body-md overflow-x-hidden flex">
            <div className="w-full bg-surface-container-lowest flex flex-col md:flex-row min-h-screen relative">
                
                <button 
                    onClick={() => navigate('/')} 
                    className="absolute top-6 right-6 z-50 flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors bg-surface-container-lowest md:bg-transparent p-2 md:p-0 rounded-full md:rounded-none shadow-sm md:shadow-none"
                    title="Volver al inicio"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    <span className="hidden md:inline font-label-md">Volver al inicio</span>
                </button>
                    {/* Left Side: Image / Brand */}
                    <div className="w-full md:w-1/2 relative bg-primary-container overflow-hidden hidden md:block">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-auth.jpg')" }}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-10 z-10">
                            <h2 className="font-display-lg text-display-lg text-on-primary mb-4">Descubre Ayacucho</h2>
                            <p className="font-body-lg text-body-lg text-on-primary-container max-w-md">Conectando patrimonio histórico con aventuras modernas. Únete a DMGOTRAVEL y comienza tu viaje hoy.</p>
                        </div>
                    </div>

                    {/* Right Side: Forms Container */}
                    <div className={`w-full md:w-1/2 flex flex-col justify-center bg-surface-container-lowest auth-container py-10 transition-all duration-500 overflow-hidden ${isRegister ? 'show-register' : ''}`}>
                        <div className="text-center mb-8 px-8 md:hidden">
                            <h1 className="font-headline-md text-headline-md text-primary font-bold">DMGOTRAVEL</h1>
                        </div>
                        
                        <div className="flex w-[200%] transition-transform duration-500 ease-in-out" style={{ transform: isRegister ? 'translateX(-50%)' : 'translateX(0)' }}>
                            
                            {/* Login Form */}
                            <div className="w-1/2 px-6">
                                <div className="max-w-md mx-auto">
                                    <div className="mb-8">
                                        <h2 className="font-headline-md text-headline-md text-primary font-bold mb-2">Bienvenido de vuelta</h2>
                                        <p className="text-on-surface-variant">Ingresa tus credenciales para acceder a tu cuenta.</p>
                                    </div>
                                    {loginError && <p className="text-error mb-4">{loginError}</p>}
                                    <form className="space-y-4" onSubmit={handleLogin}>
                                        <div>
                                            <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="login-email">Correo Electrónico</label>
                                            <input className="w-full rounded border border-outline-variant bg-surface-container-lowest text-on-surface px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" id="login-email" placeholder="tu@correo.com" required type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="login-password">Contraseña</label>
                                            <div className="relative">
                                                <input className="w-full rounded border border-outline-variant bg-surface-container-lowest text-on-surface px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary pr-10" id="login-password" placeholder="••••••••" required type={showLoginPassword ? "text" : "password"} value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                                                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center" onClick={() => setShowLoginPassword(!showLoginPassword)}>
                                                    <span className="material-symbols-outlined text-[20px]">{showLoginPassword ? 'visibility_off' : 'visibility'}</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <input className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" id="remember" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                                                <label className="ml-2 font-body-md text-body-md text-on-surface-variant cursor-pointer" htmlFor="remember">Recordarme</label>
                                            </div>
                                            <a className="font-label-md text-label-md text-primary hover:text-secondary transition-colors" href="#">¿Olvidaste tu contraseña?</a>
                                        </div>
                                        <button className="w-full bg-primary text-on-primary font-label-md text-label-md py-3 rounded-lg hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2 mt-6" type="submit">
                                            <span className="material-symbols-outlined">login</span>
                                            Ingresar
                                        </button>
                                    </form>
                                    <div className="mt-8 text-center border-t border-outline-variant pt-6">
                                        <p className="text-on-surface-variant mb-4">¿No tienes una cuenta?</p>
                                        <button className="w-full border border-primary text-primary font-label-md text-label-md py-3 rounded-lg hover:bg-primary hover:text-on-primary transition-colors bg-transparent mb-4" onClick={() => setIsRegister(true)}>
                                            Crear Cuenta Nueva
                                        </button>
                                        <button type="button" onClick={handleGoogleLogin} className="w-full border border-outline-variant text-on-surface font-label-md text-label-md py-3 rounded-lg hover:bg-surface-variant transition-colors bg-transparent flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                            Continuar con Google
                                        </button>
                                    </div>

                                </div>
                            </div>

                            {/* Registration Form */}
                            <div className="w-1/2 px-6">
                                <div className="max-w-md mx-auto">
                                    <div className="mb-6 flex items-center gap-3">
                                        <button type="button" className="text-outline hover:text-primary transition-colors flex items-center justify-center p-2 rounded-full hover:bg-surface-variant" onClick={() => setIsRegister(false)}>
                                            <span className="material-symbols-outlined">arrow_back</span>
                                        </button>
                                        <div>
                                            <h2 className="font-headline-md text-headline-md text-primary font-bold">Crear Cuenta</h2>
                                            <p className="text-on-surface-variant text-sm">Únete a nuestra comunidad viajera.</p>
                                        </div>
                                    </div>
                                    {regError && <p className="text-error mb-4">{regError}</p>}
                                    <form className="space-y-4" onSubmit={handleRegister}>
                                        <div>
                                            <label className="block font-label-md text-label-md text-on-surface mb-1" htmlFor="reg-name">Nombre Completo</label>
                                            <input className="w-full rounded border border-outline-variant bg-surface-container-lowest text-on-surface px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" id="reg-name" placeholder="Juan Pérez" required type="text" value={regName} onChange={e => setRegName(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block font-label-md text-label-md text-on-surface mb-1" htmlFor="reg-email">Correo Electrónico</label>
                                            <input className="w-full rounded border border-outline-variant bg-surface-container-lowest text-on-surface px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" id="reg-email" placeholder="tu@correo.com" required type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block font-label-md text-label-md text-on-surface mb-1" htmlFor="reg-phone">Teléfono</label>
                                            <input className="w-full rounded border border-outline-variant bg-surface-container-lowest text-on-surface px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" id="reg-phone" placeholder="+51 999 999 999" required type="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)} />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block font-label-md text-label-md text-on-surface mb-1" htmlFor="reg-password">Contraseña</label>
                                                <div className="relative">
                                                    <input className="w-full rounded border border-outline-variant bg-surface-container-lowest text-on-surface px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary pr-10" id="reg-password" required type={showRegPassword ? "text" : "password"} value={regPassword} onChange={e => setRegPassword(e.target.value)} />
                                                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center" onClick={() => setShowRegPassword(!showRegPassword)}>
                                                        <span className="material-symbols-outlined text-[18px]">{showRegPassword ? 'visibility_off' : 'visibility'}</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block font-label-md text-label-md text-on-surface mb-1" htmlFor="reg-confirm">Confirmar</label>
                                                <div className="relative">
                                                    <input className="w-full rounded border border-outline-variant bg-surface-container-lowest text-on-surface px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary pr-10" id="reg-confirm" required type={showRegPassword ? "text" : "password"} value={regConfirm} onChange={e => setRegConfirm(e.target.value)} />
                                                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center" onClick={() => setShowRegPassword(!showRegPassword)}>
                                                        <span className="material-symbols-outlined text-[18px]">{showRegPassword ? 'visibility_off' : 'visibility'}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <button className="w-full bg-secondary-container text-on-secondary-container font-label-md text-label-md py-3 rounded-lg hover:bg-secondary hover:text-on-secondary transition-colors flex items-center justify-center gap-2" type="submit">
                                                <span className="material-symbols-outlined">person_add</span>
                                                Crear Cuenta
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    );
};

export default Auth;
