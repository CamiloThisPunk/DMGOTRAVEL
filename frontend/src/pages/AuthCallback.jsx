import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback = () => {
    const [error, setError] = useState('');
    const [status, setStatus] = useState('Conectando con Google...');
    const navigate = useNavigate();
    const location = useLocation();
    const { loginWithGoogleToken } = useAuth();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token');
        const errorParam = urlParams.get('error');

        if (errorParam) {
            setError('No se pudo iniciar sesión con Google. Intenta de nuevo.');
            setTimeout(() => navigate('/auth'), 3000);
            return;
        }

        if (token) {
            setStatus('Iniciando sesión...');
            loginWithGoogleToken(token)
                .then((user) => {
                    setStatus('¡Listo! Redirigiendo...');
                    const isAdmin = user?.roles && user.roles.includes('admin');
                    if (isAdmin) {
                        navigate('/admin/dashboard', { replace: true });
                    } else {
                        navigate('/client/welcome', { replace: true });
                    }
                })
                .catch((err) => {
                    console.error('AuthCallback error:', err);
                    setError('Error al iniciar sesión. Intenta de nuevo.');
                    setTimeout(() => navigate('/auth'), 3000);
                });
        } else {
            setError('No se recibió ningún token.');
            setTimeout(() => navigate('/auth'), 3000);
        }
    }, []); // Run only once on mount

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface-container-low">
            <div className="bg-surface-container-lowest p-8 rounded-lg shadow-md text-center max-w-sm w-full">
                {error ? (
                    <>
                        <span className="material-symbols-outlined text-error text-5xl mb-4 block">error</span>
                        <h2 className="text-xl font-bold text-error mb-2">Error</h2>
                        <p className="text-on-surface-variant">{error}</p>
                        <p className="text-on-surface-variant text-sm mt-2">Redirigiendo al login...</p>
                    </>
                ) : (
                    <>
                        <span className="material-symbols-outlined text-primary text-5xl mb-4 animate-spin block">sync</span>
                        <h2 className="text-xl font-bold text-primary mb-2">{status}</h2>
                        <p className="text-on-surface-variant">Por favor espera un momento.</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthCallback;
