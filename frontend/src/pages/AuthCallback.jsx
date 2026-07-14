import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { loginWithGoogleToken } = useAuth();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token');

        if (token) {
            loginWithGoogleToken(token)
                .then((user) => {
                    if (user.roles && user.roles.some(r => r.name === 'admin')) {
                        navigate('/admin');
                    } else {
                        navigate('/client/reservations');
                    }
                })
                .catch((err) => {
                    setError('Error al iniciar sesión con Google.');
                    setTimeout(() => navigate('/auth'), 3000);
                });
        } else {
            setError('No se recibió ningún token.');
            setTimeout(() => navigate('/auth'), 3000);
        }
    }, [location, loginWithGoogleToken, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface-container-low">
            <div className="bg-surface-container-lowest p-8 rounded-lg shadow-md text-center max-w-sm w-full">
                {error ? (
                    <>
                        <span className="material-symbols-outlined text-error text-5xl mb-4">error</span>
                        <h2 className="text-xl font-bold text-error mb-2">Error</h2>
                        <p className="text-on-surface-variant">{error}</p>
                    </>
                ) : (
                    <>
                        <span className="material-symbols-outlined text-primary text-5xl mb-4 animate-spin">refresh</span>
                        <h2 className="text-xl font-bold text-primary mb-2">Iniciando Sesión...</h2>
                        <p className="text-on-surface-variant">Por favor espera un momento.</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthCallback;
