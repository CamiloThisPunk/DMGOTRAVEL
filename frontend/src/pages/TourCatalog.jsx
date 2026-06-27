import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const TourCatalog = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [guestsCount, setGuestsCount] = useState(1);
    const [selectedTour, setSelectedTour] = useState(null);
    const [reservationDate, setReservationDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const response = await api.get('/api/services');
                setTours(response.data.data || response.data);
            } catch (error) {
                console.error("Error fetching services", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTours();
    }, []);

    const handleSelectTour = (tour) => {
        setSelectedTour(tour);
        if (window.innerWidth < 1024) {
            document.getElementById('reservation-form')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const adjustGuests = (delta) => {
        setGuestsCount(prev => Math.max(1, Math.min(20, prev + delta)));
    };

    const handleReservationSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTour || !reservationDate) return;
        
        setIsSubmitting(true);
        try {
            await api.post('/api/client/reservations', {
                service_package_id: selectedTour.id,
                date: reservationDate,
                passengers: guestsCount
            });
            alert('¡Reserva realizada con éxito! Pronto nos contactaremos contigo.');
            navigate('/client/dashboard');
        } catch (error) {
            console.error(error);
            alert('Error al realizar la reserva: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 p-gutter md:p-12 max-w-7xl mx-auto">
            {/* Main Content: Filters & Grid */}
            <div className="w-full lg:w-3/4 flex flex-col gap-8">
                {/* Filters Bar */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 md:p-6 flex flex-col md:flex-row gap-4 items-end shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                    <div className="w-full md:w-1/3 flex flex-col gap-2">
                        <label className="font-label-md text-label-md text-on-surface-variant">Categoría</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">hiking</span>
                            <select className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-DEFAULT focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none bg-surface-container-lowest font-body-md text-body-md text-on-surface">
                                <option>Todas las categorías</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tour Grid Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">
                    {loading ? (
                        <div className="col-span-full py-20 text-center text-on-surface-variant flex justify-center items-center gap-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                            Cargando catálogo de tours...
                        </div>
                    ) : tours.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-on-surface-variant">No se encontraron tours disponibles.</div>
                    ) : (
                        tours.map(tour => (
                            <div key={tour.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden group hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:border-b-4 hover:border-b-primary transition-all duration-300 flex flex-col h-full">
                                <div className="relative h-48 w-full overflow-hidden">
                                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                         src="https://images.unsplash.com/photo-1518173946687-a4c8a9b749f4?auto=format&fit=crop&q=80&w=800" 
                                         alt={tour.name} />
                                    <div className="absolute top-3 left-3 bg-secondary-container text-on-secondary-container font-label-md text-label-md px-3 py-1 rounded-full flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">hiking</span>
                                        {tour.type}
                                    </div>
                                </div>
                                <div className="p-4 md:p-6 flex flex-col flex-grow relative">
                                    <h3 className="font-headline-sm text-headline-sm text-primary mb-2 line-clamp-2">{tour.name}</h3>
                                    <p className="font-body-md text-body-md text-on-surface-variant mb-4 flex-grow line-clamp-3">
                                        {tour.description}
                                    </p>
                                    <div className="flex items-end justify-between mt-auto">
                                        <button onClick={() => handleSelectTour(tour)} className="bg-secondary text-on-secondary font-label-md text-label-md px-4 py-2 rounded-DEFAULT hover:bg-on-secondary-container transition-colors shadow-sm active:scale-95">
                                            Seleccionar
                                        </button>
                                        <div className="bg-surface-container text-primary font-headline-sm text-headline-sm px-3 py-1 rounded-DEFAULT">
                                            S/ {tour.price}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Floating Sidebar: Reservation Flow */}
            <div className="w-full lg:w-1/4">
                <form id="reservation-form" onSubmit={handleReservationSubmit} className="sticky top-[100px] bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                    <h2 className="font-headline-sm text-headline-sm text-primary mb-6 border-b border-outline-variant pb-4">Nueva Reserva</h2>
                    
                    <div className="mb-6 relative pl-8 border-l-2 border-primary">
                        <span className="absolute -left-[11px] top-0 bg-primary text-on-primary w-5 h-5 rounded-full flex items-center justify-center font-label-md text-[12px]">1</span>
                        <h4 className="font-label-md text-label-md text-primary mb-2">Elegir Fecha</h4>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">calendar_month</span>
                            <input value={reservationDate} onChange={e => setReservationDate(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-outline-variant rounded-DEFAULT focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface-container-lowest font-body-md text-body-md text-on-surface" required type="date" />
                        </div>
                    </div>

                    <div className="mb-6 relative pl-8 border-l-2 border-outline-variant">
                        <span className="absolute -left-[11px] top-0 bg-surface-variant text-on-surface-variant w-5 h-5 rounded-full flex items-center justify-center font-label-md text-[12px]">2</span>
                        <h4 className="font-label-md text-label-md text-on-surface-variant mb-2">Pasajeros</h4>
                        <div className="flex items-center justify-between border border-outline-variant rounded-DEFAULT overflow-hidden">
                            <button type="button" onClick={() => adjustGuests(-1)} className="px-3 py-2 bg-surface-container hover:bg-surface-variant transition-colors text-on-surface-variant">
                                <span className="material-symbols-outlined text-[18px]">remove</span>
                            </button>
                            <span className="font-body-md text-body-md font-bold text-primary">{guestsCount} Persona{guestsCount !== 1 ? 's' : ''}</span>
                            <button type="button" onClick={() => adjustGuests(1)} className="px-3 py-2 bg-surface-container hover:bg-surface-variant transition-colors text-on-surface-variant">
                                <span className="material-symbols-outlined text-[18px]">add</span>
                            </button>
                        </div>
                    </div>

                    <div className="mb-8 relative pl-8">
                        <span className="absolute -left-[11px] top-0 bg-surface-variant text-on-surface-variant w-5 h-5 rounded-full flex items-center justify-center font-label-md text-[12px]">3</span>
                        <h4 className="font-label-md text-label-md text-on-surface-variant mb-2">Confirmar Tour</h4>
                        {selectedTour ? (
                            <div className="font-body-md text-body-md text-primary font-bold">
                                Has seleccionado: {selectedTour.name}
                            </div>
                        ) : (
                            <div className="font-body-md text-body-md text-outline text-sm italic">
                                Selecciona un tour del catálogo para continuar.
                            </div>
                        )}
                    </div>

                    <button disabled={!selectedTour || isSubmitting} type="submit" className={`w-full font-label-md text-label-md py-3 rounded-DEFAULT text-center font-bold transition-colors ${!selectedTour || isSubmitting ? 'bg-surface-variant text-outline cursor-not-allowed' : 'bg-primary text-on-primary hover:bg-primary-container'}`}>
                        {isSubmitting ? 'Procesando...' : 'Continuar Reserva'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TourCatalog;
