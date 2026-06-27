import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ClientDashboard = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past'

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/client/reservations');
            // Assuming response is the data directly or response.data is the array/paginated object
            // Adjust according to Laravel's JSON resource output
            const data = response.data.data || response.data;
            setReservations(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching reservations", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return;
        try {
            await api.patch(`/api/client/reservations/${id}/cancel`);
            fetchReservations();
        } catch (error) {
            alert('Error al cancelar la reserva');
        }
    };

    const now = new Date();
    const upcomingCount = reservations.filter(r => new Date(r.service_package?.date || r.created_at) >= now && r.status !== 'cancelled').length;
    const historyCount = reservations.filter(r => new Date(r.service_package?.date || r.created_at) < now || r.status === 'completed' || r.status === 'cancelled').length;

    const filteredReservations = reservations.filter(r => {
        const date = new Date(r.service_package?.date || r.created_at);
        if (filter === 'upcoming') {
            return date >= now && r.status !== 'cancelled';
        } else if (filter === 'past') {
            return date < now || r.status === 'completed' || r.status === 'cancelled';
        }
        return true;
    });

    const renderStatusBadge = (status) => {
        const styles = {
            'confirmed': 'bg-secondary-fixed text-on-secondary-fixed',
            'pending': 'bg-surface-variant text-on-surface-variant',
            'completed': 'border border-outline-variant text-on-surface-variant',
            'cancelled': 'bg-error-container text-on-error-container'
        };
        const labels = {
            'confirmed': 'Confirmada',
            'pending': 'Pendiente',
            'completed': 'Completado',
            'cancelled': 'Cancelado'
        };
        return <span className={`${styles[status] || styles['pending']} text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm tracking-wide`}>{labels[status] || status}</span>;
    };

    return (
        <>
            {/* Page Header */}
            <div className="bg-surface-container-lowest border-b border-outline-variant py-8 px-gutter md:px-12">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-2">Mis Reservas</h2>
                        <p className="text-on-surface-variant">Gestiona tus próximos viajes y revisa tu historial de aventuras.</p>
                    </div>
                </div>
            </div>

            <div className="p-gutter md:p-12 max-w-6xl mx-auto space-y-section-padding-mobile">
                {/* Dashboard Summary Cards */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col">
                        <div className="flex items-center gap-3 mb-4 text-primary">
                            <span className="material-symbols-outlined icon-fill text-3xl">flight_takeoff</span>
                            <h3 className="font-headline-sm text-headline-sm">Próximos</h3>
                        </div>
                        <div className="mt-auto flex items-end justify-between">
                            <span className="text-5xl font-display-lg font-bold text-on-surface">{upcomingCount}</span>
                            <span className="text-on-surface-variant mb-1">Aventuras</span>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col">
                        <div className="flex items-center gap-3 mb-4 text-on-surface-variant">
                            <span className="material-symbols-outlined text-3xl">history</span>
                            <h3 className="font-headline-sm text-headline-sm">Historial</h3>
                        </div>
                        <div className="mt-auto flex items-end justify-between">
                            <span className="text-5xl font-display-lg font-bold text-on-surface">{historyCount}</span>
                            <span className="text-on-surface-variant mb-1">Completados</span>
                        </div>
                    </div>
                    <div className="bg-primary text-on-primary rounded-xl p-6 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute -right-6 -bottom-6 opacity-10">
                            <span className="material-symbols-outlined text-9xl">explore</span>
                        </div>
                        <div className="relative z-10">
                            <h3 className="font-headline-sm text-headline-sm mb-2">¿Listo para más?</h3>
                            <p className="text-on-primary-container text-sm mb-6">Explora nuevos destinos en los Andes.</p>
                        </div>
                        <Link to="/client/catalog" className="bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary transition-opacity py-2 px-4 rounded-lg w-fit relative z-10 font-label-md text-label-md font-bold">
                            Buscar Tours
                        </Link>
                    </div>
                </section>

                {/* Bookings List */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-headline-md text-headline-md text-on-surface">Tus Viajes</h3>
                        <div className="hidden sm:flex bg-surface-container-high rounded-full p-1">
                            <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-full font-label-md text-label-md transition-colors ${filter === 'all' ? 'bg-surface-container-lowest text-on-surface shadow-sm border border-outline-variant/20' : 'text-on-surface-variant hover:text-on-surface'}`}>Todos</button>
                            <button onClick={() => setFilter('upcoming')} className={`px-4 py-1.5 rounded-full font-label-md text-label-md transition-colors ${filter === 'upcoming' ? 'bg-surface-container-lowest text-on-surface shadow-sm border border-outline-variant/20' : 'text-on-surface-variant hover:text-on-surface'}`}>Próximos</button>
                            <button onClick={() => setFilter('past')} className={`px-4 py-1.5 rounded-full font-label-md text-label-md transition-colors ${filter === 'past' ? 'bg-surface-container-lowest text-on-surface shadow-sm border border-outline-variant/20' : 'text-on-surface-variant hover:text-on-surface'}`}>Pasados</button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex justify-center items-center py-20 text-on-surface-variant">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                                Cargando tus reservas...
                            </div>
                        ) : filteredReservations.length === 0 ? (
                            <div className="text-center py-20 bg-surface-container-low rounded-xl border border-dashed border-outline-variant">
                                <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">event_busy</span>
                                <p className="text-on-surface-variant">No se encontraron reservas.</p>
                            </div>
                        ) : (
                            filteredReservations.map(res => {
                                const dateObj = new Date(res.service_package?.date || res.created_at);
                                const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                                const day = dateObj.getDate() || '--';
                                const month = isNaN(dateObj.getMonth()) ? 'N/A' : months[dateObj.getMonth()];
                                const isPast = dateObj < now || res.status === 'completed' || res.status === 'cancelled';
                                const canCancel = res.status === 'pending';

                                return (
                                    <div key={res.id} className={`bg-surface-container-lowest border border-outline-variant rounded-lg p-4 md:p-6 ${isPast ? 'opacity-75 hover:opacity-100' : 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:border-b-2 hover:border-b-primary hover:-translate-y-0.5'} flex flex-col md:flex-row gap-6 items-start md:items-center transition-all duration-300`}>
                                        <div className={`${isPast ? 'bg-surface-dim' : 'bg-surface-container'} w-16 md:w-20 rounded-lg py-2 flex flex-col items-center justify-center border border-outline-variant shrink-0`}>
                                            <span className="text-xs font-bold text-on-surface-variant uppercase">{month}</span>
                                            <span className={`text-2xl font-bold ${isPast ? 'text-on-surface-variant' : 'text-primary'}`}>{day}</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                {renderStatusBadge(res.status)}
                                                <span className="text-xs text-on-surface-variant flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">confirmation_number</span>
                                                    #{res.id}
                                                </span>
                                            </div>
                                            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-1">{res.service_package?.name || 'Servicio Turístico'}</h4>
                                            <p className="text-sm text-on-surface-variant flex items-center gap-4">
                                                <span><span className="material-symbols-outlined align-middle mr-1 text-[16px]">group</span> {res.passengers} Pasajeros</span>
                                                <span><span className="material-symbols-outlined align-middle mr-1 text-[16px]">payments</span> S/ {res.total_price} Total</span>
                                            </p>
                                        </div>
                                        <div className="w-full md:w-auto flex md:flex-col gap-3 shrink-0">
                                            <button className="border border-primary text-primary hover:bg-primary hover:text-white py-2 px-6 rounded-lg font-label-md text-label-md flex-1 md:flex-none text-center transition-colors">
                                                Detalles
                                            </button>
                                            {canCancel && (
                                                <button onClick={() => handleCancel(res.id)} className="text-error font-label-md text-label-md hover:underline py-2 text-center md:text-left">
                                                    Cancelar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>
            </div>
        </>
    );
};

export default ClientDashboard;
