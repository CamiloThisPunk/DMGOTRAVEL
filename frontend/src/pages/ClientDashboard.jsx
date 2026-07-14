import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ClientDashboard = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedReservation, setSelectedReservation] = useState(null);

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

    const getName = (r) => r.service?.title || r.service_title || r.tour_name || 'Tour';
    const getType = (r) => r.service?.type === 'paquete' ? 'Paquete Turístico' : 'Destino';
    const getTotal = (r) => r.total_price || r.total || r.service?.price || 0;
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
                                            <span className="text-xs text-on-surface-variant flex items-center gap-1" title={`ID BD: ${res.id}`}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>confirmation_number</span>
                                                #{reservations.length - reservations.findIndex(r => r.id === res.id)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-headline-sm text-headline-sm text-on-surface">{getName(res)}</h4>
                                            {res.service && (
                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full tracking-wide ${
                                                    res.service.type === 'paquete' 
                                                    ? 'bg-primary-container text-on-primary-container' 
                                                    : 'bg-secondary-container text-on-secondary-container'
                                                }`}>
                                                    {getType(res)}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-on-surface-variant flex items-center gap-4">
                                            <span><span className="material-symbols-outlined align-middle mr-1 text-[16px]">group</span>{getGuests(res)} Pasajeros</span>
                                            <span className="flex items-center gap-2">
                                                <span><span className="material-symbols-outlined align-middle mr-1 text-[16px]">payments</span>S/ {parseFloat(getTotal(res)).toFixed(2)} Total</span>
                                                {res.service?.old_price && parseFloat(res.service.old_price) > parseFloat(res.service.price) && (
                                                    <span className="bg-error text-on-error text-[10px] font-bold px-1.5 py-0.5 rounded">
                                                        -{Math.round((1 - res.service.price/res.service.old_price) * 100)}%
                                                    </span>
                                                )}
                                            </span>
                                        </p>
                                    </div>
                                    {/* Actions */}
                                    <div className="w-full md:w-auto flex md:flex-col gap-3 shrink-0">
                                        <button onClick={() => setSelectedReservation(res)}
                                            className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-label-md text-label-md font-bold hover:bg-primary hover:text-on-primary transition-colors text-center w-full md:w-auto">
                                            Ver Detalles
                                        </button>
                                        {canCancel && (
                                            <button onClick={() => cancelReservation(res.id)}
                                                className="text-error font-label-md text-label-md hover:underline py-2 text-center md:text-left w-full md:w-auto">
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

            {/* Modal de Detalle de Reserva */}
            {selectedReservation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedReservation(null)}>
                    <div className="bg-surface rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-outline-variant flex justify-between items-center sticky top-0 bg-surface z-10">
                            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">receipt_long</span>
                                Detalle de Reserva
                            </h3>
                            <button onClick={() => setSelectedReservation(null)} className="text-on-surface-variant hover:text-on-surface p-2 rounded-full hover:bg-surface-variant/50 transition-colors flex items-center justify-center">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        {getStatusBadge(selectedReservation.status)}
                                        <span className="text-xs text-on-surface-variant">ID: #{selectedReservation.id}</span>
                                    </div>
                                    <h4 className="font-title-lg text-title-lg text-on-surface mb-2">{getName(selectedReservation)}</h4>
                                    <div className="flex flex-col gap-1 text-sm text-on-surface-variant">
                                        <p className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                                            Fecha: {getDate(selectedReservation)}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[18px]">group</span>
                                            Pasajeros: {getGuests(selectedReservation)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-on-surface">Total del Servicio</span>
                                    <div className="text-right">
                                        {selectedReservation.service?.old_price && parseFloat(selectedReservation.service.old_price) > parseFloat(selectedReservation.service.price) && (
                                            <div className="text-xs text-on-surface-variant line-through mb-0.5">
                                                S/ {(parseFloat(selectedReservation.service.old_price) * getGuests(selectedReservation)).toFixed(2)}
                                            </div>
                                        )}
                                        <div className="flex items-center justify-end gap-2">
                                            <span className="font-bold text-primary text-xl">
                                                S/ {parseFloat(getTotal(selectedReservation)).toFixed(2)}
                                            </span>
                                            {selectedReservation.service?.old_price && parseFloat(selectedReservation.service.old_price) > parseFloat(selectedReservation.service.price) && (
                                                <span className="bg-error text-on-error text-[10px] font-bold px-1.5 py-0.5 rounded">
                                                    -{Math.round((1 - selectedReservation.service.price/selectedReservation.service.old_price) * 100)}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-on-surface-variant mb-5">
                                    {selectedReservation.payment_voucher_url ? 'Pagado vía Yape' : 'Pendiente o sin comprobante'}
                                </p>
                                
                                {selectedReservation.special_requests && (
                                    <div className="pt-5 border-t border-outline-variant">
                                        <h5 className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider mb-3">Requerimientos Especiales</h5>
                                        <div className="bg-surface-container-low p-3 rounded-lg text-sm text-on-surface whitespace-pre-wrap">
                                            {selectedReservation.special_requests}
                                        </div>
                                    </div>
                                )}
                                
                                {selectedReservation.payment_voucher_url && (
                                    <div className="pt-5 border-t border-outline-variant mt-5">
                                        <h5 className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-[18px]">image</span>
                                            Comprobante de Pago
                                        </h5>
                                        <a href={selectedReservation.payment_voucher_url} target="_blank" rel="noopener noreferrer" 
                                           className="block w-full max-w-sm rounded-lg overflow-hidden border border-outline-variant hover:opacity-90 hover:ring-2 hover:ring-primary transition-all mx-auto sm:mx-0">
                                            <img src={selectedReservation.payment_voucher_url} alt="Voucher de pago" className="w-full h-auto object-cover bg-surface-container-lowest" />
                                        </a>
                                        <p className="text-[10px] text-on-surface-variant mt-2">Haz clic en la imagen para verla en tamaño completo.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientDashboard;
