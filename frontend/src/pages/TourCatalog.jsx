import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const TourCatalog = () => {
    const navigate = useNavigate();
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTour, setSelectedTour] = useState(null);
    const [guestsCount, setGuestsCount] = useState(1);
    const [reservationDate, setReservationDate] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => { fetchTours(); }, []);

    const fetchTours = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/services?type=servicio');
            setTours(res.data?.data || res.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleSelectTour = (tour) => {
        setSelectedTour(tour);
        setSuccessMessage('');
        if (window.innerWidth < 1024) {
            document.getElementById('reservation-form')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTour) { alert('Selecciona un tour primero'); return; }
        if (!reservationDate) { alert('Selecciona una fecha'); return; }

        setSubmitting(true);
        try {
            await api.post('/api/client/reservations', {
                service_package_id: selectedTour.id,
                reservation_date: reservationDate,
                guests_count: guestsCount,
            });
            setSuccessMessage('¡Reserva confirmada! Redirigiendo a tus reservas...');
            setTimeout(() => {
                navigate('/client/dashboard');
            }, 2000);
        } catch (err) {
            if (err.response?.status === 422) {
                const errors = err.response.data.errors;
                if (errors) {
                    let msg = 'Error de validación:';
                    Object.values(errors).forEach(errs => { msg += `\n- ${errs.join(', ')}`; });
                    alert(msg);
                } else {
                    alert(err.response.data.message || 'Datos inválidos');
                }
            } else {
                alert(err.response?.data?.message || 'Error al procesar la reserva');
            }
        } finally { setSubmitting(false); }
    };

    return (
        <>
            {/* Hero Header */}
            <section className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center">
                <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuASk_GMG8YT_ni-NW5RrapIqAvGmmEBTQ1pZzmbCeJcIl8tq7mEDi_MQK6W9Are9Old_zIJdi3WitDUIldjeUVrVSDNeuMY-q4jnqKKAAIITfj7TtfWbF1Abc7FAZr1tVKNJxTfd0j0RLXOuXHTlwt8c5wuFq7wrPuSvc_0pvRU_e0Gdml_umpQL7A5e9Fq3Y2U6nT5wtX4wTlXdsMm_DWWI1ESMBySonUqUj_hhu5fL0L1Fq8c7L_2ObJ5mTc4HAgcUL2KDoAAxwU')" }}></div>
                <div className="absolute inset-0 bg-primary/60 z-10"></div>
                <div className="relative z-20 text-center px-gutter w-full max-w-[1320px] mx-auto">
                    <h1 className="font-display-lg md:text-display-lg text-display-lg-mobile text-on-primary mb-stack-sm drop-shadow-md">
                        Reserva tu Próxima Aventura
                    </h1>
                    <p className="font-body-lg text-body-lg text-primary-fixed max-w-2xl mx-auto drop-shadow">
                        Descubre paisajes milenarios, culturas vivas y rutas inolvidables en el corazón de los Andes.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-gutter max-w-[1320px] py-section-padding-mobile md:py-section-padding-desktop">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Tour Grid */}
                    <div className="w-full lg:w-3/4 flex flex-col gap-8">
                        {/* Tour Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">
                            {loading ? (
                                <div className="col-span-full py-20 text-center text-on-surface-variant flex flex-col items-center gap-3">
                                    <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
                                    Cargando catálogo de tours...
                                </div>
                            ) : tours.length === 0 ? (
                                <div className="col-span-full py-20 text-center text-on-surface-variant">No se encontraron tours disponibles.</div>
                            ) : tours.map(tour => (
                                <div key={tour.id} className={`bg-surface-container-lowest border rounded-xl overflow-hidden group hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col h-full ${
                                    selectedTour?.id === tour.id ? 'border-secondary border-2' : 'border-outline-variant hover:border-b-4 hover:border-b-primary'
                                }`}>
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            src={tour.image_360_url || 'https://images.unsplash.com/photo-1518173946687-a4c8a9b749f4?auto=format&fit=crop&q=80&w=800'}
                                            alt={tour.title} />
                                        <div className="absolute top-3 left-3 bg-secondary-container text-on-secondary-container font-label-md text-label-md px-3 py-1 rounded-full flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[16px]">hiking</span>
                                            {tour.category || 'Aventura'}
                                        </div>
                                    </div>
                                    <div className="p-4 md:p-6 flex flex-col flex-grow">
                                        <h3 className="font-headline-sm text-headline-sm text-primary mb-2 line-clamp-2">{tour.title}</h3>
                                        <p className="font-body-md text-body-md text-on-surface-variant mb-4 flex-grow line-clamp-3">{tour.description}</p>
                                        <div className="flex items-center gap-4 mb-4 text-on-surface-variant font-body-md text-body-md">
                                            <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">schedule</span> {tour.duration} días</div>
                                            <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">group</span> Máx {tour.capacity || 15}</div>
                                        </div>
                                        <div className="flex items-end justify-between mt-auto">
                                            <button onClick={() => handleSelectTour(tour)}
                                                className={`font-label-md text-label-md px-4 py-2 rounded transition-colors shadow-sm active:scale-95 ${
                                                    selectedTour?.id === tour.id
                                                        ? 'bg-primary text-on-primary'
                                                        : 'bg-secondary text-on-secondary hover:bg-on-secondary-container'
                                                }`}>
                                                {selectedTour?.id === tour.id ? '✓ Seleccionado' : 'Seleccionar'}
                                            </button>
                                            <div className="bg-surface-container text-primary font-headline-sm text-headline-sm px-3 py-1 rounded">
                                                S/ {parseFloat(tour.price || 0).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reservation Sidebar */}
                    <div className="w-full lg:w-1/4">
                        <form id="reservation-form" onSubmit={handleSubmit} className="sticky top-[100px] bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                            <h2 className="font-headline-sm text-headline-sm text-primary mb-6 border-b border-outline-variant pb-4">Nueva Reserva</h2>

                            {/* Step 1: Date */}
                            <div className="mb-6 relative pl-8 border-l-2 border-primary">
                                <span className="absolute -left-[11px] top-0 bg-primary text-on-primary w-5 h-5 rounded-full flex items-center justify-center font-label-md text-[12px]">1</span>
                                <h4 className="font-label-md text-label-md text-primary mb-2">Elegir Fecha</h4>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">calendar_month</span>
                                    <input className="w-full pl-10 pr-3 py-2 border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface-container-lowest font-body-md text-body-md text-on-surface"
                                        type="date" value={reservationDate} onChange={e => setReservationDate(e.target.value)} required />
                                </div>
                            </div>

                            {/* Step 2: Guests */}
                            <div className="mb-6 relative pl-8 border-l-2 border-outline-variant">
                                <span className="absolute -left-[11px] top-0 bg-surface-variant text-on-surface-variant w-5 h-5 rounded-full flex items-center justify-center font-label-md text-[12px]">2</span>
                                <h4 className="font-label-md text-label-md text-on-surface-variant mb-2">Pasajeros</h4>
                                <div className="flex items-center justify-between border border-outline-variant rounded overflow-hidden">
                                    <button type="button" onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))} className="px-3 py-2 bg-surface-container hover:bg-surface-variant transition-colors text-on-surface-variant">
                                        <span className="material-symbols-outlined text-[18px]">remove</span>
                                    </button>
                                    <span className="font-body-md text-body-md font-bold text-primary">{guestsCount} Persona{guestsCount > 1 ? 's' : ''}</span>
                                    <button type="button" onClick={() => setGuestsCount(Math.min(20, guestsCount + 1))} className="px-3 py-2 bg-surface-container hover:bg-surface-variant transition-colors text-on-surface-variant">
                                        <span className="material-symbols-outlined text-[18px]">add</span>
                                    </button>
                                </div>
                            </div>

                            {/* Step 3: Confirm */}
                            <div className="mb-8 relative pl-8">
                                <span className="absolute -left-[11px] top-0 bg-surface-variant text-on-surface-variant w-5 h-5 rounded-full flex items-center justify-center font-label-md text-[12px]">3</span>
                                <h4 className="font-label-md text-label-md text-on-surface-variant mb-2">Confirmar Tour</h4>
                                <div className="font-body-md text-body-md text-sm">
                                    {selectedTour ? (
                                        <span className="text-primary font-bold">{selectedTour.title}</span>
                                    ) : (
                                        <span className="text-outline italic">Selecciona un tour del catálogo para continuar.</span>
                                    )}
                                </div>
                            </div>

                            <button type="submit" disabled={!selectedTour || submitting || successMessage}
                                className={`w-full font-label-md text-label-md py-3 rounded text-center font-bold transition-colors ${
                                    successMessage 
                                        ? 'bg-green-600 text-white' 
                                        : (selectedTour ? 'bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container' : 'bg-surface-variant text-outline cursor-not-allowed')
                                }`}>
                                {successMessage ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined">check_circle</span>
                                        ¡Reserva Exitosa!
                                    </div>
                                ) : submitting ? 'Procesando...' : 'Continuar Reserva'}
                            </button>

                            {successMessage && (
                                <div className="mt-4 p-3 bg-green-50 text-green-800 text-sm rounded-lg border border-green-200 text-center animate-fade-in">
                                    {successMessage}
                                </div>
                            )}

                            <div className="mt-4 flex items-center gap-2 justify-center text-on-surface-variant">
                                <span className="material-symbols-outlined text-[16px]">lock</span>
                                <span className="font-body-md text-body-md text-[12px]">Pago seguro y garantizado</span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TourCatalog;
