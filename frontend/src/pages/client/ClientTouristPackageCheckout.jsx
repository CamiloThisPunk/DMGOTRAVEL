import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';

const ClientTouristPackageCheckout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // From previous page
    const state = location.state || {};
    const pkg = state.pkg;
    const initialGuests = state.guests || 1;
    const initialDate = state.date || '';

    // Form state
    const [guests, setGuests] = useState(initialGuests);
    const [date, setDate] = useState(initialDate);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (!pkg) {
            navigate(`/client/tourist-packages/${id}`);
        }
    }, [pkg, id, navigate]);

    if (!pkg) return null;

    const totalPrice = parseFloat(pkg.price) * guests;
    const defaultImage = "https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
    const bgImage = pkg.image_360_url || defaultImage;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/api/client/reservations', {
                service_package_id: pkg.id,
                reservation_date: date,
                guests_count: guests,
                special_requests: formData.message,
                // Contact info can be sent if backend supports it, otherwise it uses Auth user
            });
            setSuccessMessage('¡Reserva confirmada exitosamente! Te hemos enviado los detalles a tu correo.');
            setTimeout(() => {
                navigate('/client/dashboard');
            }, 3000);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error al procesar la reserva');
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-[#000613] mb-2">Completar Reserva</h1>
                    <p className="text-[#43474e] text-lg">Estás a un paso de confirmar tu aventura en DMGOTRAVEL.</p>
                </div>

                <div className="flex flex-col-reverse lg:flex-row gap-8">
                    
                    {/* Left Column (Form) */}
                    <div className="flex-1 bg-white rounded-2xl p-8 border border-[#c4c6cf] shadow-sm">
                        <h2 className="text-2xl font-bold text-[#000613] mb-8">Tus Datos</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-[#43474e] uppercase tracking-wider mb-2">Nombre completo</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f]">person</span>
                                        <input 
                                            type="text" required
                                            className="w-full pl-10 pr-4 py-3 border border-[#c4c6cf] rounded-xl focus:border-[#000613] focus:ring-1 focus:ring-[#000613] outline-none"
                                            placeholder="Ej. Juan Pérez"
                                            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#43474e] uppercase tracking-wider mb-2">Correo electrónico</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f]">mail</span>
                                        <input 
                                            type="email" required
                                            className="w-full pl-10 pr-4 py-3 border border-[#c4c6cf] rounded-xl focus:border-[#000613] focus:ring-1 focus:ring-[#000613] outline-none"
                                            placeholder="tu@email.com"
                                            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#43474e] uppercase tracking-wider mb-2">WhatsApp</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f]">phone_iphone</span>
                                        <input 
                                            type="tel" required
                                            className="w-full pl-10 pr-4 py-3 border border-[#c4c6cf] rounded-xl focus:border-[#000613] focus:ring-1 focus:ring-[#000613] outline-none"
                                            placeholder="+51 987 654 321"
                                            value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#43474e] uppercase tracking-wider mb-2">Fecha preferida</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f]">calendar_month</span>
                                        <input 
                                            type="date" required min={new Date().toISOString().split('T')[0]}
                                            className="w-full pl-10 pr-4 py-3 border border-[#c4c6cf] rounded-xl focus:border-[#000613] focus:ring-1 focus:ring-[#000613] outline-none"
                                            value={date} onChange={e => setDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-[#43474e] uppercase tracking-wider mb-2">Número de personas</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f]">group</span>
                                        <select 
                                            className="w-full pl-10 pr-4 py-3 border border-[#c4c6cf] rounded-xl focus:border-[#000613] focus:ring-1 focus:ring-[#000613] outline-none appearance-none"
                                            value={guests} onChange={e => setGuests(Number(e.target.value))}
                                        >
                                            {[...Array(pkg.capacity)].map((_, i) => (
                                                <option key={i+1} value={i+1}>{i+1} Persona{i+1 > 1 ? 's' : ''}</option>
                                            ))}
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#74777f] pointer-events-none">expand_more</span>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-[#43474e] uppercase tracking-wider mb-2">Mensaje o requerimientos especiales (Opcional)</label>
                                    <textarea 
                                        rows="3"
                                        className="w-full p-4 border border-[#c4c6cf] rounded-xl focus:border-[#000613] focus:ring-1 focus:ring-[#000613] outline-none resize-none"
                                        placeholder="Indícanos si tienes alguna alergia alimentaria, requerimiento de movilidad, etc."
                                        value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                                    ></textarea>
                                </div>
                            </div>

                            {successMessage && (
                                <div className="p-4 bg-green-50 text-green-800 rounded-xl border border-green-200 flex items-center gap-2">
                                    <span className="material-symbols-outlined">check_circle</span>
                                    {successMessage}
                                </div>
                            )}

                            <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 pt-6 mt-6 border-t border-[#c4c6cf]">
                                <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                                    <span className="material-symbols-outlined text-xl">verified_user</span>
                                    Pago Seguro y Encriptado
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={submitting || successMessage}
                                    className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold text-lg transition-colors ${
                                        submitting || successMessage 
                                        ? 'bg-[#c4c6cf] text-[#43474e] cursor-not-allowed'
                                        : 'bg-[#964900] text-white hover:bg-[#7a3b00] shadow-lg shadow-[#964900]/20'
                                    }`}
                                >
                                    {submitting ? 'Procesando...' : 'Confirmar y Pagar'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Column (Summary) */}
                    <div className="w-full lg:w-[400px]">
                        <div className="bg-[#f2f4f7] rounded-2xl p-6 border border-[#c4c6cf] sticky top-[100px]">
                            <div className="relative h-48 rounded-xl overflow-hidden mb-6">
                                <img src={bgImage} alt={pkg.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-4 left-4">
                                    <span className="text-white text-xs font-bold bg-black/30 px-2 py-1 rounded backdrop-blur-sm mb-2 inline-block">{pkg.duration} Días</span>
                                    <h3 className="text-white font-bold text-xl leading-tight">{pkg.title}</h3>
                                </div>
                            </div>

                            <h4 className="text-xs font-bold text-[#74777f] uppercase tracking-wider mb-4">Resumen de tu selección</h4>
                            
                            <div className="space-y-4 mb-6 pb-6 border-b border-[#c4c6cf]">
                                {/* We could show itinerary highlights here, but since it's dynamic we just show a static placeholder or basic details */}
                                <div className="flex gap-3">
                                    <span className="material-symbols-outlined text-[#964900]">check_circle</span>
                                    <div>
                                        <p className="font-bold text-[#000613] text-sm">Guía Oficial de Turismo</p>
                                        <p className="text-xs text-[#74777f]">Asistencia permanente</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="material-symbols-outlined text-[#964900]">check_circle</span>
                                    <div>
                                        <p className="font-bold text-[#000613] text-sm">Movilidad Turística</p>
                                        <p className="text-xs text-[#74777f]">Traslados incluidos</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="material-symbols-outlined text-[#964900]">check_circle</span>
                                    <div>
                                        <p className="font-bold text-[#000613] text-sm">Tickets de Ingreso</p>
                                        <p className="text-xs text-[#74777f]">A todos los atractivos</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-[#43474e] text-sm">
                                    <span>Precio por persona</span>
                                    <span>S/ {parseFloat(pkg.price).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[#43474e] text-sm">
                                    <span>Cantidad</span>
                                    <span>x {guests}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-6 border-t border-[#c4c6cf]">
                                <span className="text-lg font-bold text-[#000613]">Total</span>
                                <span className="text-2xl font-bold text-[#964900]">S/ {totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ClientTouristPackageCheckout;
