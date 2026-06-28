import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ClientDashboard = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => { fetchReservations(); }, []);

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/client/reservations');
            setReservations(res.data?.data || res.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const cancelReservation = async (id) => {
        if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return;
        try {
            await api.patch(`/api/client/reservations/${id}/cancel`);
            await fetchReservations();
        } catch (e) { alert(e.response?.data?.message || 'Error al cancelar'); }
    };

    const getStatusBadge = (status) => {
        const styles = {
            confirmed:      { cls: 'bg-secondary-fixed text-on-secondary-fixed', label: 'Confirmada' },
            pending:        { cls: 'bg-surface-variant text-on-surface-variant', label: 'Pendiente' },
            pending_payment:{ cls: 'bg-surface-variant text-on-surface-variant', label: 'Pendiente Pago' },
            completed:      { cls: 'border border-outline-variant text-on-surface-variant', label: 'Completado' },
            cancelled:      { cls: 'bg-error-container text-on-error-container', label: 'Cancelado' },
        };
        const s = styles[status] || styles.pending;
        return <span className={`${s.cls} text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm tracking-wide`}>{s.label}</span>;
    };

    const getName = (r) => r.service_package?.name || r.tour_name || 'Tour';
    const getTotal = (r) => r.total_price || r.total || r.service_package?.price || 0;
    const getDate = (r) => r.reservation_date || r.travel_date || r.date || '';
    const getGuests = (r) => r.guests_count || r.passengers || 1;

    const now = new Date();
    const upcomingCount = reservations.filter(r => new Date(getDate(r)) >= now && r.status !== 'cancelled').length;
    const completedCount = reservations.filter(r => r.status === 'completed').length;

    const filtered = reservations.filter(r => {
        if (filter === 'upcoming') return new Date(getDate(r)) >= now && r.status !== 'cancelled';
        if (filter === 'past') return new Date(getDate(r)) < now || r.status === 'completed' || r.status === 'cancelled';
        return true;
    });

    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-surface-container-lowest border-b border-outline-variant py-8 px-gutter md:px-12">
                <div className="max-w-6xl mx-auto">
                    <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-2">Mis Reservas</h2>
                    <p className="text-on-surface-variant">Gestiona tus próximos viajes y revisa tu historial de aventuras.</p>
                </div>
            </div>

            <div className="p-gutter md:p-12 max-w-6xl mx-auto space-y-8">
                {/* Summary Cards */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col">
                        <div className="flex items-center gap-3 mb-4 text-primary">
                            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>flight_takeoff</span>
                            <h3 className="font-headline-sm text-headline-sm">Próximos</h3>
                        </div>
                        <div className="mt-auto flex items-end justify-between">
                            <span className="text-5xl font-bold text-on-surface">{upcomingCount}</span>
                            <span className="text-on-surface-variant mb-1">Aventuras</span>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col">
                        <div className="flex items-center gap-3 mb-4 text-on-surface-variant">
                            <span className="material-symbols-outlined text-3xl">history</span>
                            <h3 className="font-headline-sm text-headline-sm">Historial</h3>
                        </div>
                        <div className="mt-auto flex items-end justify-between">
                            <span className="text-5xl font-bold text-on-surface">{completedCount}</span>
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
                        <Link to="/client/catalog" className="bg-secondary-container text-on-secondary-container py-2 px-4 rounded-lg w-fit relative z-10 font-label-md text-label-md font-bold hover:bg-secondary hover:text-on-secondary transition-colors">
                            Buscar Tours
                        </Link>
                    </div>
                </section>

                {/* Reservations List */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-headline-md text-headline-md text-on-surface">Tus Viajes</h3>
                        <div className="hidden sm:flex bg-surface-container-high rounded-full p-1">
                            {[{ v: 'all', l: 'Todos' }, { v: 'upcoming', l: 'Próximos' }, { v: 'past', l: 'Pasados' }].map(btn => (
                                <button key={btn.v} onClick={() => setFilter(btn.v)}
                                    className={`px-4 py-1.5 rounded-full font-label-md text-label-md transition-colors ${
                                        filter === btn.v
                                            ? 'bg-surface-container-lowest text-on-surface shadow-sm border border-outline-variant/20'
                                            : 'text-on-surface-variant hover:text-on-surface'
                                    }`}>
                                    {btn.l}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex justify-center items-center py-20 text-on-surface-variant">
                                <span className="material-symbols-outlined animate-spin text-primary text-4xl mr-3">sync</span>
                                Cargando tus reservas...
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-20 bg-surface-container-low rounded-xl border border-dashed border-outline-variant">
                                <span className="material-symbols-outlined text-5xl text-outline-variant mb-4 block">event_busy</span>
                                <p className="text-on-surface-variant">No se encontraron reservas.</p>
                            </div>
                        ) : filtered.map(res => {
                            const dateStr = getDate(res);
                            const dateObj = dateStr ? new Date(dateStr) : new Date();
                            const isPast = dateObj < now || res.status === 'completed' || res.status === 'cancelled';
                            const canCancel = res.status !== 'cancelled' && res.status !== 'completed' && !isPast;

                            return (
                                <div key={res.id}
                                    className={`bg-surface-container-lowest border border-outline-variant rounded-lg p-4 md:p-6 ${
                                        isPast ? 'opacity-75 hover:opacity-100' : 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:border-b-2 hover:border-b-primary'
                                    } flex flex-col md:flex-row gap-6 items-start md:items-center transition-all duration-300`}>
                                    {/* Date Chip */}
                                    <div className={`${isPast ? 'bg-surface-dim' : 'bg-surface-container'} w-16 md:w-20 rounded-lg py-2 flex flex-col items-center justify-center border border-outline-variant shrink-0`}>
                                        <span className="text-xs font-bold text-on-surface-variant uppercase">{months[dateObj.getMonth()]}</span>
                                        <span className={`text-2xl font-bold ${isPast ? 'text-on-surface-variant' : 'text-primary'}`}>{dateObj.getDate()}</span>
                                    </div>
                                    {/* Details */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            {getStatusBadge(res.status)}
                                            <span className="text-xs text-on-surface-variant flex items-center gap-1">
                                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>confirmation_number</span>
                                                #{res.id}
                                            </span>
                                        </div>
                                        <h4 className="font-headline-sm text-headline-sm text-on-surface mb-1">{getName(res)}</h4>
                                        <p className="text-sm text-on-surface-variant flex items-center gap-4">
                                            <span><span className="material-symbols-outlined align-middle mr-1 text-[16px]">group</span>{getGuests(res)} Pasajeros</span>
                                            <span><span className="material-symbols-outlined align-middle mr-1 text-[16px]">payments</span>S/ {parseFloat(getTotal(res)).toFixed(2)} Total</span>
                                        </p>
                                    </div>
                                    {/* Actions */}
                                    <div className="w-full md:w-auto flex md:flex-col gap-3 shrink-0">
                                        {canCancel && (
                                            <button onClick={() => cancelReservation(res.id)}
                                                className="text-error font-label-md text-label-md hover:underline py-2 text-center md:text-left">
                                                Cancelar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ClientDashboard;
