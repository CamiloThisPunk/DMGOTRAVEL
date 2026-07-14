import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ClientWelcome = () => {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setPhone(user.phone || '');
        }
    }, [user]);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await updateProfile({ name, phone });
            navigate('/client/dashboard');
        } catch (err) {
            setError('Error al guardar el perfil. Intenta de nuevo.');
            setLoading(false);
        }
    };

    const handleSkip = () => {
        navigate('/client/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface-container-low p-4">
            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-outline-variant">
                {user?.avatar && (
                    <img 
                        src={user.avatar} 
                        alt="Avatar" 
                        className="w-24 h-24 rounded-full mx-auto mb-6 shadow-sm object-cover"
                    />
                )}
                
                <h2 className="text-display-sm font-display-sm text-primary mb-2">¡Bienvenido a DMGOTRAVEL!</h2>
                <p className="text-body-md text-on-surface-variant mb-6">
                    Nos alegra tenerte aquí. Por favor, confirma o completa tus datos para brindarte una mejor experiencia al reservar tus viajes.
                </p>

                {error && <div className="text-error text-sm mb-4">{error}</div>}

                <form onSubmit={handleSave} className="flex flex-col gap-4 text-left">
                    <div>
                        <label className="block text-label-md text-on-surface mb-1">Nombre Completo</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-lg border border-outline bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-label-md text-on-surface mb-1">Celular / WhatsApp (Opcional)</label>
                        <input 
                            type="tel" 
                            className="w-full px-4 py-3 rounded-lg border border-outline bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+51 987654321"
                        />
                    </div>

                    <div className="flex flex-col gap-3 mt-4">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-primary text-on-primary py-3 rounded-full font-label-lg hover:bg-secondary transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Guardando...' : 'Guardar y Continuar'}
                        </button>
                        <button 
                            type="button" 
                            onClick={handleSkip}
                            className="w-full text-primary py-3 rounded-full font-label-lg hover:bg-surface-container transition-colors"
                        >
                            Saltar por ahora
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClientWelcome;
