import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Auth = () => {
    const [isRegister, setIsRegister] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();
    
    // Login State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // Register State
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirm, setRegConfirm] = useState('');
    const [regError, setRegError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        try {
            const user = await login(loginEmail, loginPassword);
            if (user.roles && user.roles.includes('admin')) {
                navigate('/admin/dashboard');
            } else {
                navigate('/client/dashboard');
            }
        } catch (error) {
            setLoginError('Credenciales incorrectas o problema de red.');
        }
    };

    const handleAdminDemo = async () => {
        setLoginEmail('admin@dmgotravel.com');
        setLoginPassword('admin_password');
        setLoginError('');
        try {
            const user = await login('admin@dmgotravel.com', 'admin_password');
            if (user.roles && user.roles.includes('admin')) {
                navigate('/admin/dashboard');
            } else {
                navigate('/client/dashboard');
            }
        } catch (error) {
            setLoginError('Credenciales incorrectas o problema de red.');
        }
    };

    const handleClientDemo = async () => {
        setLoginEmail('client@test.com');
        setLoginPassword('client_password');
        setLoginError('');
        try {
            const user = await login('client@test.com', 'client_password');
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
        <div className="bg-background text-on-background min-h-screen flex items-center justify-center font-body-md text-body-md overflow-x-hidden">
            <div className="w-full max-w-container-max mx-auto px-gutter min-h-screen md:min-h-[819px] flex items-center justify-center py-section-padding-mobile md:py-section-padding-desktop">
                <div className="w-full bg-surface-container-lowest rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-surface-variant relative">
                    
                    {/* Left Side: Image / Brand */}
                    <div className="w-full md:w-1/2 relative bg-primary-container overflow-hidden hidden md:block">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAdF1t7a6Yd9aSzWMTTv9nWRMhW-56cBodM8WTM5DR-QWWkwKiU4bvULJcqIz9-wGUhSLfQFJcWci7GR12znUysrWHVNKndoMbPzn25G_8frSj8R0EZAwayp-M2RxFMtnI5I_3r-VL0n5pO2qKp5I8R54Xb0cIxucgZonEpBGenc6fpzwu_ZbL5iMenEzJuz6I9dbS7XRJUzlJCja4GGLMlFU_IwAp_RWNsyDnaM8I66LMzEHjYPscrphNjsfm2KMoRmiJcB0gxgmg')" }}></div>
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
                                            <input className="w-full rounded border border-outline-variant bg-surface-container-lowest text-on-surface px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" id="login-password" placeholder="••••••••" required type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <input className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" id="remember" type="checkbox" />
                                                <label className="ml-2 font-body-md text-body-md text-on-surface-variant" htmlFor="remember">Recordarme</label>
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
                                        <button className="w-full border border-primary text-primary font-label-md text-label-md py-3 rounded-lg hover:bg-primary hover:text-on-primary transition-colors bg-transparent" onClick={() => setIsRegister(true)}>
                                            Crear Cuenta Nueva
                                        </button>
                                    </div>
                                    <div className="mt-6 flex justify-center gap-2">
                                        <button type="button" onClick={handleAdminDemo} className="bg-surface-variant text-on-surface-variant text-xs font-semibold px-2 py-1 rounded hover:bg-outline-variant transition-colors">Entrar como Admin</button>
                                        <button type="button" onClick={handleClientDemo} className="bg-surface-variant text-on-surface-variant text-xs font-semibold px-2 py-1 rounded hover:bg-outline-variant transition-colors">Entrar como Cliente</button>
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
                                                <input className="w-full rounded border border-outline-variant bg-surface-container-lowest text-on-surface px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" id="reg-password" required type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} />
                                            </div>
                                            <div>
                                                <label className="block font-label-md text-label-md text-on-surface mb-1" htmlFor="reg-confirm">Confirmar</label>
                                                <input className="w-full rounded border border-outline-variant bg-surface-container-lowest text-on-surface px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" id="reg-confirm" required type="password" value={regConfirm} onChange={e => setRegConfirm(e.target.value)} />
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
        </div>
    );
};

export default Auth;
