import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ClientTouristPackageDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);

    // Reservation state
    const [guests, setGuests] = useState(1);
    const [date, setDate] = useState('');

    useEffect(() => {
        fetchPackage();
    }, [id]);

    const fetchPackage = async () => {
        try {
            const res = await api.get(`/api/services/${id}`);
            setPkg(res.data?.data || res.data);
        } catch (error) {
            console.error('Error fetching package:', error);
            navigate('/client/tourist-packages');
        } finally {
            setLoading(false);
        }
    };

    const handleReserve = () => {
        if (!date) {
            alert('Por favor selecciona una fecha de viaje.');
            return;
        }
        // Save the current selection to state/context or just pass via URL state
        navigate(`/client/tourist-packages/${id}/checkout`, {
            state: { guests, date, pkg }
        });
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-[#43474e]">Cargando detalles...</div>;
    }

    if (!pkg) {
        return <div className="min-h-screen flex items-center justify-center text-[#43474e]">Paquete no encontrado</div>;
    }

    const defaultImage = "/images/demo-tour-detail.jpg";
    const bgImage = pkg.image_360_url || defaultImage;

    // Parse itinerary safely
    let itineraryItems = [];
    if (pkg.itinerary) {
        try {
            itineraryItems = typeof pkg.itinerary === 'string' ? JSON.parse(pkg.itinerary) : pkg.itinerary;
        } catch (e) {
            console.error("Error parsing itinerary", e);
        }
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] pb-20">
            {/* Hero Section */}
            <div className="relative w-full h-[60vh] bg-[#000613]">
                <img 
                    src={pkg.image_360_url || '/images/demo-tour-detail.jpg'} 
                    alt={pkg.title} 
                    onError={(e) => { e.target.onerror = null; e.target.src = '/images/demo-tour-detail.jpg'; }}
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000613] to-transparent opacity-80"></div>
                
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                    <div className="max-w-7xl mx-auto flex gap-2 mb-4">
                        <span className="bg-[#ff851b] text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">Aventura</span>
                        <span className="bg-white text-[#000613] px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">{pkg.duration} Días</span>
                    </div>
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">{pkg.title}</h1>
                        <p className="text-white/90 flex items-center gap-2 text-lg">
                            <span className="material-symbols-outlined">location_on</span>
                            Explora Ayacucho y sus alrededores
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex flex-col lg:flex-row gap-12 relative">
                
                {/* Left Column (Details & Itinerary) */}
                <div className="flex-1">
                    
                    {/* Info Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-12">
                        <div className="bg-white border border-[#c4c6cf] rounded-xl p-6 text-center shadow-sm">
                            <span className="material-symbols-outlined text-[#964900] text-3xl mb-2">schedule</span>
                            <p className="text-[#74777f] text-xs uppercase tracking-wider font-bold mb-1">Duración</p>
                            <p className="text-[#000613] font-bold text-lg">{pkg.duration} Días</p>
                        </div>
                        <div className="bg-white border border-[#c4c6cf] rounded-xl p-6 text-center shadow-sm">
                            <span className="material-symbols-outlined text-[#964900] text-3xl mb-2">group</span>
                            <p className="text-[#74777f] text-xs uppercase tracking-wider font-bold mb-1">Grupo Máximo</p>
                            <p className="text-[#000613] font-bold text-lg">{pkg.capacity} Pax</p>
                        </div>
                    </div>

                    {/* About */}
                    <div className="mb-12">
                        <h3 className="text-2xl font-bold text-[#000613] mb-4">Acerca de este paquete</h3>
                        <p className="text-[#43474e] leading-relaxed text-lg">{pkg.description}</p>
                    </div>

                    {/* Itinerary */}
                    <div className="mb-12">
                        <h3 className="text-2xl font-bold text-[#000613] mb-8">Itinerario Detallado</h3>
                        
                        {itineraryItems && itineraryItems.length > 0 ? (
                            <div className="relative border-l-2 border-[#964900] ml-4 space-y-8 pl-8">
                                {itineraryItems.map((day, dIdx) => (
                                    <div key={dIdx} className="relative">
                                        <div className="absolute -left-[43px] top-1 w-5 h-5 rounded-full bg-white border-4 border-[#964900]"></div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <h4 className="text-xl font-bold text-[#000613]">{day.title}</h4>
                                        </div>
                                        <div className="space-y-4">
                                            {day.activities && day.activities.map((act, aIdx) => (
                                                <div key={aIdx} className="bg-white border border-[#c4c6cf] rounded-lg p-4 shadow-sm">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-[#ff851b] font-bold text-sm bg-[#ff851b]/10 px-2 py-1 rounded whitespace-nowrap">
                                                            {act.time}
                                                        </span>
                                                        <h5 className="font-bold text-[#000613]">{act.title}</h5>
                                                    </div>
                                                    <p className="text-[#43474e] text-sm leading-relaxed">{act.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white border border-[#c4c6cf] rounded-xl p-8 text-center text-[#43474e]">
                                El itinerario detallado estará disponible próximamente.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column (Sticky Reservation Card) */}
                <div className="w-full lg:w-[400px]">
                    <div className="sticky top-[100px] bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-[#c4c6cf]">
                        <div className="flex justify-between items-start border-b border-[#c4c6cf] pb-6 mb-6">
                            <div>
                                <p className="text-[#74777f] text-sm mb-1 line-through">S/ {(parseFloat(pkg.price) * 1.2).toFixed(2)}</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-[#000613]">S/ {parseFloat(pkg.price).toFixed(2)}</span>
                                    <span className="text-[#74777f]">/ persona</span>
                                </div>
                            </div>
                            <span className="bg-[#ff851b]/10 text-[#964900] px-2 py-1 rounded text-xs font-bold uppercase">-20% DCTO</span>
                        </div>

                        <div className="space-y-6 mb-8">
                            <div>
                                <label className="block text-sm font-bold text-[#000613] mb-2 uppercase tracking-wider">Fecha del Tour</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#74777f]">calendar_month</span>
                                    <input 
                                        type="date" 
                                        className="w-full pl-12 pr-4 py-3 border border-[#c4c6cf] rounded-xl focus:border-[#000613] focus:ring-1 focus:ring-[#000613] outline-none text-[#1a1c1e] bg-[#f8f9fa]"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-[#000613] mb-2 uppercase tracking-wider">Pasajeros</label>
                                <div className="flex items-center justify-between border border-[#c4c6cf] rounded-xl overflow-hidden bg-[#f8f9fa]">
                                    <button 
                                        type="button" 
                                        onClick={() => setGuests(Math.max(1, guests - 1))}
                                        className="px-4 py-3 hover:bg-[#e3e2e5] transition-colors text-[#43474e] border-r border-[#c4c6cf]"
                                    >
                                        <span className="material-symbols-outlined">remove</span>
                                    </button>
                                    <span className="font-bold text-[#000613] text-lg">{guests} Persona{guests > 1 ? 's' : ''}</span>
                                    <button 
                                        type="button" 
                                        onClick={() => setGuests(Math.min(pkg.capacity, guests + 1))}
                                        className="px-4 py-3 hover:bg-[#e3e2e5] transition-colors text-[#43474e] border-l border-[#c4c6cf]"
                                    >
                                        <span className="material-symbols-outlined">add</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleReserve}
                            className="w-full py-4 rounded-xl text-center font-bold text-lg transition-colors bg-[#000613] text-white hover:bg-[#001f3f] shadow-lg shadow-[#000613]/20"
                        >
                            Reservar Ahora
                        </button>
                        
                        <div className="mt-4 text-center">
                            <p className="text-[#74777f] text-sm">No se cobrará nada por el momento</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ClientTouristPackageDetail;
