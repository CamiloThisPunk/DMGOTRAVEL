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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setPhone(user.phone || '');
        }
        // Trigger entrance animation
        setTimeout(() => setMounted(true), 50);
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
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-secondary/5 blur-3xl"></div>
                <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-tertiary/3 blur-3xl"></div>
            </div>

            {/* Main card */}
            <div 
                className={`relative z-10 w-full max-w-lg transition-all duration-700 ease-out ${
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
                <div className="bg-surface-container-lowest rounded-3xl shadow-lg border border-outline-variant/50 overflow-hidden">
                    
                    {/* Top decorative gradient bar */}
                    <div className="h-2 bg-gradient-to-r from-primary via-secondary to-tertiary"></div>

                    {/* Header section */}
                    <div className="px-8 pt-10 pb-6 text-center">
                        {/* Avatar with glow effect */}
                        <div className="relative inline-block mb-6">
                            {user?.avatar ? (
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl scale-125"></div>
                                    <img 
                                        src={user.avatar} 
                                        alt="Tu foto de perfil" 
                                        className="w-28 h-28 rounded-full object-cover relative z-10 border-4 border-surface-container-lowest shadow-xl"
                                        referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute -bottom-1 -right-1 z-20 bg-secondary text-on-secondary w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 border-surface-container-lowest">
                                        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl scale-125"></div>
                                    <div className="w-28 h-28 rounded-full bg-primary-container flex items-center justify-center relative z-10 border-4 border-surface-container-lowest shadow-xl">
                                        <span className="material-symbols-outlined text-5xl text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Welcome text */}
                        <h1 className="font-display-sm text-display-sm text-on-surface mb-2">
                            ¡Bienvenido{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
                        </h1>
                        <p className="text-body-md text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                            Estás a un paso de explorar los mejores destinos de los Andes. 
                            Confirma tus datos o continúa directamente.
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="mx-8 border-t border-outline-variant/50"></div>

                    {/* Form section */}
                    <div className="px-8 py-8">
                        {error && (
                            <div className="mb-5 flex items-center gap-2 bg-error-container text-on-error-container px-4 py-3 rounded-xl text-sm">
                                <span className="material-symbols-outlined text-lg">warning</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSave} className="space-y-5">
                            {/* Name field */}
                            <div className="group">
                                <label className="flex items-center gap-2 text-label-md font-label-md text-on-surface-variant mb-2">
                                    <span className="material-symbols-outlined text-lg text-primary">badge</span>
                                    Nombre Completo
                                </label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-3.5 rounded-xl border border-outline-variant bg-surface-container-low/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-on-surface-variant/50"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Tu nombre completo"
                                    required
                                />
                            </div>
                            
                            {/* Email field (read-only) */}
                            <div>
                                <label className="flex items-center gap-2 text-label-md font-label-md text-on-surface-variant mb-2">
                                    <span className="material-symbols-outlined text-lg text-primary">email</span>
                                    Correo Electrónico
                                </label>
                                <input 
                                    type="email" 
                                    className="w-full px-4 py-3.5 rounded-xl border border-outline-variant/50 bg-surface-dim/30 text-on-surface-variant cursor-not-allowed"
                                    value={user?.email || ''}
                                    disabled
                                />
                                <p className="text-xs text-on-surface-variant/60 mt-1.5 ml-1 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">lock</span>
                                    Vinculado a tu cuenta de Google
                                </p>
                            </div>

                            {/* Phone field */}
                            <div>
                                <label className="flex items-center gap-2 text-label-md font-label-md text-on-surface-variant mb-2">
                                    <span className="material-symbols-outlined text-lg text-primary">phone_iphone</span>
                                    Celular / WhatsApp
                                    <span className="text-xs text-on-surface-variant/50 font-normal">(Opcional)</span>
                                </label>
                                <input 
                                    type="tel" 
                                    className="w-full px-4 py-3.5 rounded-xl border border-outline-variant bg-surface-container-low/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-on-surface-variant/50"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+51 987 654 321"
                                />
                            </div>

                            {/* Action buttons */}
                            <div className="pt-4 space-y-3">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full bg-primary text-on-primary py-4 rounded-xl font-label-lg text-label-lg tracking-wide hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-lg">save</span>
                                            Guardar y Continuar
                                        </>
                                    )}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleSkip}
                                    className="w-full text-on-surface-variant py-3.5 rounded-xl font-label-md text-label-md hover:bg-surface-container-high/50 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                    Saltar por ahora
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer text */}
                <p className="text-center text-xs text-on-surface-variant/50 mt-6">
                    Podrás editar tu perfil más adelante desde tu panel de usuario.
                </p>
            </div>
        </div>
    );
};

export default ClientWelcome;
