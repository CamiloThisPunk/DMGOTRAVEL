import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ClientTouristPackages = () => {
    const navigate = useNavigate();
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTour, setSelectedTour] = useState(null);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('Todos');

    useEffect(() => { fetchTours(); }, []);

    const fetchTours = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/services?type=paquete');
            setTours(res.data?.data || res.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleSelectTour = (tour) => {
        navigate(`/client/tourist-packages/${tour.id}`);
    };

    const filtered = tours.filter(t => {
        const matchSearch = !search || (t.title || '').toLowerCase().includes(search.toLowerCase());
        // Just mock filter for now, you can add logic if category exists
        return matchSearch;
    });

    return (
        <div className="bg-background min-h-screen">
            {/* Hero Section */}
            <section className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-client-catalog.jpg')" }}></div>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,31,63,0.8) 0%, rgba(0,6,19,0.9) 100%)' }}></div>
                <div className="relative z-10 text-center px-4 max-w-[1280px] mx-auto">
                    <h1 className="text-[32px] md:text-[48px] leading-tight font-bold text-white mb-4">Encuentra tu próxima aventura</h1>
                    <p className="text-[16px] md:text-[18px] text-[#e9e7eb] max-w-2xl mx-auto">
                        Explora los paisajes más impresionantes, sumérgete en culturas milenarias y vive experiencias inolvidables en el corazón de los Andes.
                    </p>
                </div>
            </section>

            {/* Search & Filter Bar */}
            <section className="max-w-[1280px] mx-auto px-4 md:px-16 py-8 -mt-12 relative z-20">
                <div className="bg-[#faf9fc] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-6 border border-[#c4c6cf]/30 flex flex-col md:flex-row gap-6 items-center">
                    <div className="relative w-full md:w-1/3">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#74777f]">search</span>
                        <input 
                            className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border border-[#c4c6cf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#964900] focus:border-transparent text-[16px] text-[#1a1c1e] placeholder:text-[#74777f]" 
                            placeholder="Buscar destinos, paquetes..." 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 flex gap-3 overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-full">
                        {['Todos', 'Aventura', 'Cultura', 'Naturaleza', 'Trekking'].map(f => (
                            <button 
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`whitespace-nowrap px-4 py-2 font-bold rounded-full text-[12px] uppercase tracking-wider transition-colors ${
                                    filter === f ? 'bg-[#ff851b] text-[#612d00] hover:opacity-90' : 'bg-[#F8FAFC] text-[#43474e] border border-[#c4c6cf] hover:bg-[#e3e2e5]'
                                }`}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="max-w-[1280px] mx-auto px-4 md:px-16 py-8 pb-20">
                <div className="w-full">
                        {loading ? (
                            <div className="py-20 text-center flex flex-col items-center gap-3 text-[#43474e]">
                                <span className="material-symbols-outlined animate-spin text-4xl text-[#000613]">sync</span>
                                Cargando catálogo de paquetes...
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="py-20 text-center text-[#43474e]">No se encontraron paquetes.</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filtered.map(tour => (
                                    <div key={tour.id} 
                                        className={`bg-[#faf9fc] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border flex flex-col group ${
                                            selectedTour?.id === tour.id ? 'border-[#ff851b] border-2' : 'border-[#c4c6cf]/30'
                                        }`}>
                                        <div className="relative h-56 overflow-hidden bg-[#e3e2e5]">
                                            <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                src={tour.image_360_url || '/images/demo-tour-1.jpg'}
                                                onError={(e) => { e.target.onerror = null; e.target.src = '/images/demo-tour-1.jpg'; }}
                                                alt={tour.title} />
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-[#faf9fc]/90 backdrop-blur-sm text-[#964900] font-bold text-[12px] uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                                                    {tour.category || 'Paquete'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-[24px] leading-tight font-semibold text-[#1a1c1e] line-clamp-1">{tour.title}</h3>
                                                <div className="flex items-center gap-1 text-[#FFB703]">
                                                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                    <span className="text-[14px] font-bold text-[#1a1c1e]">4.8</span>
                                                </div>
                                            </div>
                                            <p className="text-[14px] text-[#43474e] mb-6 line-clamp-2 min-h-[40px]">{tour.description}</p>
                                            <div className="flex items-center gap-4 mb-6 mt-auto">
                                                <div className="flex items-center gap-2 text-[#43474e]">
                                                    <span className="material-symbols-outlined text-[20px]">schedule</span>
                                                    <span className="text-[12px] font-bold uppercase tracking-wider">{tour.duration} días</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[#43474e]">
                                                    <span className="material-symbols-outlined text-[20px]">group</span>
                                                    <span className="text-[12px] font-bold uppercase tracking-wider">Máx {tour.capacity} pax</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center justify-between pt-4 border-t border-[#c4c6cf]/30 gap-3">
                                                <div>
                                                    <p className="text-[12px] font-bold uppercase tracking-wider text-[#43474e]">Precio Base</p>
                                                    {tour.old_price && parseFloat(tour.old_price) > parseFloat(tour.price) && (
                                                        <p className="text-xs text-[#74777f] line-through -mt-1">S/ {parseFloat(tour.old_price).toFixed(2)}</p>
                                                    )}
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <p className="text-[24px] leading-tight font-bold text-[#000613] whitespace-nowrap">S/ {parseFloat(tour.price).toFixed(2)}</p>
                                                        {tour.old_price && parseFloat(tour.old_price) > parseFloat(tour.price) && (
                                                            <span className="bg-error text-on-error text-[12px] font-bold px-1.5 py-0.5 rounded">-{Math.round((1 - tour.price/tour.old_price) * 100)}%</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <button onClick={() => handleSelectTour(tour)}
                                                    className="bg-[#964900] text-white hover:bg-[#964900]/90 px-6 py-2.5 rounded-lg text-[16px] transition-colors font-bold shrink-0">
                                                    Ver Detalle
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
            </section>
        </div>
    );
};

export default ClientTouristPackages;
