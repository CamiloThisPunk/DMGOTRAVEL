import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedRes, setSelectedRes] = useState(null);
    const [panelOpen, setPanelOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => { fetchReservations(); }, []);

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/admin/reservations');
            setReservations(res.data?.data || res.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const updateStatus = async (id, newStatus) => {
        setUpdating(true);
        try {
            await api.patch(`/api/admin/reservations/${id}/status`, { status: newStatus });
            await fetchReservations();
            if (selectedRes && selectedRes.id === id) {
                setSelectedRes(prev => ({ ...prev, status: newStatus }));
            }
        } catch (e) {
            alert(e.response?.data?.message || 'Error al actualizar estado');
        } finally { setUpdating(false); }
    };

    const getStatusConfig = (status) => {
        const configs = {
            pending:   { label: 'Pendiente',   bg: 'bg-secondary-fixed-dim', text: 'text-on-secondary-fixed', dot: 'bg-secondary' },
            confirmed: { label: 'Confirmada',  bg: 'bg-[#d3f5d3]',          text: 'text-[#005000]',         dot: 'bg-[#008000]' },
            cancelled: { label: 'Cancelada',   bg: 'bg-error-container',     text: 'text-on-error-container', dot: 'bg-error' },
            completed: { label: 'Completada',  bg: 'bg-primary-fixed',       text: 'text-on-primary-fixed',   dot: 'bg-primary' },
        };
        return configs[status] || configs.pending;
    };

    const filtered = reservations.filter(r => {
        const matchFilter = filter === 'all' || r.status === filter;
        const q = search.toLowerCase();
        const matchSearch = !q ||
            String(r.id).includes(q) ||
            (r.user?.name || r.customer?.name || '').toLowerCase().includes(q) ||
            (r.service_package?.name || r.service?.name || '').toLowerCase().includes(q);
        return matchFilter && matchSearch;
    });

    const openPanel = (res) => {
        setSelectedRes(res);
        setPanelOpen(true);
    };

    const filterButtons = [
        { value: 'all', label: 'Todas' },
        { value: 'pending', label: 'Pendientes' },
        { value: 'confirmed', label: 'Confirmadas' },
        { value: 'cancelled', label: 'Canceladas' },
        { value: 'completed', label: 'Completadas' },
    ];

    const getCustomerName = (r) => r.user?.name || r.customer?.name || 'Cliente';
    const getCustomerEmail = (r) => r.user?.email || r.customer?.email || '';
    const getServiceName = (r) => r.service_package?.name || r.service?.name || 'Servicio';
    const getTotal = (r) => r.total_price || r.total || r.service_package?.price || 0;
    const getTravelDate = (r) => r.reservation_date || r.travel_date || '';

    return (
        <>
            {/* Header */}
            <header className="flex justify-between items-center mb-stack-lg">
                <div>
                    <h2 className="font-headline-md text-headline-md text-primary">Control de Reservas</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">Gestión y seguimiento de itinerarios turísticos.</p>
                </div>
                <div className="flex items-center gap-stack-md">
                    <div className="relative hidden sm:block">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                        <input className="pl-10 pr-4 py-2 border border-outline-variant rounded-full bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body-md text-body-md w-64"
                            placeholder="Buscar ID, Cliente..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
            </header>

            {/* Filter Tabs */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-2 mb-stack-lg flex flex-wrap gap-2 shadow-sm">
                {filterButtons.map(btn => (
                    <button key={btn.value} onClick={() => setFilter(btn.value)}
                        className={`px-4 py-2 rounded-lg font-label-md text-label-md transition-colors border border-transparent ${
                            filter === btn.value
                                ? 'bg-secondary-container text-on-secondary-container'
                                : 'text-on-surface-variant hover:bg-surface-variant hover:border-outline-variant'
                        }`}>
                        {btn.label}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden relative">
                {loading && (
                    <div className="absolute inset-0 bg-surface-container-lowest/50 backdrop-blur-sm z-10 flex items-center justify-center">
                        <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low border-b border-outline-variant">
                                <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">ID</th>
                                <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Cliente</th>
                                <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Servicio</th>
                                <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Fecha Viaje</th>
                                <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total</th>
                                <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Estado</th>
                                <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="font-body-md text-body-md divide-y divide-outline-variant">
                            {filtered.length === 0 ? (
                                <tr><td colSpan="7" className="p-10 text-center text-on-surface-variant">
                                    {loading ? 'Cargando...' : 'No se encontraron reservas'}
                                </td></tr>
                            ) : filtered.map(res => {
                                const sc = getStatusConfig(res.status);
                                return (
                                    <tr key={res.id} className="hover:bg-surface transition-colors group">
                                        <td className="p-4 text-primary font-semibold">#{res.id}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-primary font-bold text-xs">
                                                    {getCustomerName(res).substring(0,2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-on-surface">{getCustomerName(res)}</p>
                                                    <p className="text-sm text-on-surface-variant">{getCustomerEmail(res)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 font-semibold text-on-surface">{getServiceName(res)}</td>
                                        <td className="p-4 text-on-surface-variant">{getTravelDate(res)}</td>
                                        <td className="p-4 font-semibold text-primary">S/ {parseFloat(getTotal(res)).toFixed(2)}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
                                                {sc.label}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => openPanel(res)} className="text-primary hover:text-secondary font-label-md text-label-md border border-outline-variant px-3 py-1.5 rounded-lg hover:bg-surface-variant transition-colors inline-flex items-center gap-1">
                                                Ver Detalle
                                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="border-t border-outline-variant p-4 flex items-center justify-between bg-surface-container-lowest">
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm">Mostrando {filtered.length} de {reservations.length} reservas</p>
                </div>
            </div>

            {/* Side Panel */}
            {panelOpen && selectedRes && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-30 z-50" onClick={() => setPanelOpen(false)}></div>
                    <aside className="fixed top-0 right-0 h-full w-full max-w-md bg-surface-container-lowest shadow-[-4px_0_24px_rgba(0,36,68,0.1)] z-50 border-l border-outline-variant flex flex-col">
                        {/* Panel Header */}
                        <div className="p-gutter border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                            <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
                                Detalle de Reserva
                                <span className="text-sm px-2 py-1 bg-surface-variant rounded text-on-surface-variant font-label-md">#{selectedRes.id}</span>
                            </h3>
                            <button onClick={() => setPanelOpen(false)} className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        {/* Panel Content */}
                        <div className="flex-1 overflow-y-auto p-gutter flex flex-col gap-stack-lg">
                            {selectedRes.status === 'pending' && (
                                <div className="bg-secondary-fixed p-4 rounded-xl border border-secondary-fixed-dim flex gap-3 items-start">
                                    <span className="material-symbols-outlined text-secondary mt-0.5">info</span>
                                    <div>
                                        <h4 className="font-label-md text-label-md text-on-secondary-fixed mb-1">Acción Requerida</h4>
                                        <p className="font-body-md text-sm text-on-secondary-fixed opacity-90">Esta reserva está pendiente de confirmación.</p>
                                    </div>
                                </div>
                            )}
                            {/* Client Info */}
                            <div>
                                <h4 className="font-label-md text-label-md text-on-surface-variant mb-stack-sm uppercase tracking-wider text-xs">Información del Cliente</h4>
                                <div className="bg-surface border border-outline-variant rounded-xl p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg">
                                        {getCustomerName(selectedRes).substring(0,2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-on-surface text-lg">{getCustomerName(selectedRes)}</p>
                                        <p className="font-body-md text-sm text-on-surface-variant flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">mail</span> {getCustomerEmail(selectedRes)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Service Info */}
                            <div>
                                <h4 className="font-label-md text-label-md text-on-surface-variant mb-stack-sm uppercase tracking-wider text-xs">Detalles del Servicio</h4>
                                <div className="border border-outline-variant rounded-xl overflow-hidden">
                                    <div className="p-4 bg-surface-container-low border-b border-outline-variant">
                                        <p className="font-semibold text-primary text-lg">{getServiceName(selectedRes)}</p>
                                        <p className="text-sm text-on-surface-variant">{selectedRes.guests_count || selectedRes.pax || 1} Pasajeros</p>
                                    </div>
                                    <div className="p-4 bg-surface-container-lowest grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-outline mb-1">Fecha de Viaje</p>
                                            <p className="font-semibold text-on-surface text-sm flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm text-primary">calendar_today</span> {getTravelDate(selectedRes)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-outline mb-1">Estado Actual</p>
                                            {(() => { const sc = getStatusConfig(selectedRes.status); return (
                                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${sc.bg} ${sc.text}`}>{sc.label}</span>
                                            ); })()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Payment */}
                            <div>
                                <h4 className="font-label-md text-label-md text-on-surface-variant mb-stack-sm uppercase tracking-wider text-xs">Resumen de Pago</h4>
                                <div className="bg-surface rounded-xl p-4 border border-outline-variant">
                                    <div className="flex justify-between items-center pt-3 border-t border-outline-variant">
                                        <span className="font-semibold text-on-surface">Total</span>
                                        <span className="font-bold text-primary text-lg">S/ {parseFloat(getTotal(selectedRes)).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Panel Actions */}
                        <div className="p-gutter border-t border-outline-variant bg-surface-container-low flex flex-wrap gap-3">
                            {selectedRes.status === 'pending' && (
                                <>
                                    <button disabled={updating} onClick={() => updateStatus(selectedRes.id, 'cancelled')}
                                        className="flex-1 bg-surface-container-lowest border border-error text-error font-label-md text-label-md px-4 py-3 rounded-xl hover:bg-error-container transition-colors shadow-sm flex justify-center items-center gap-2">
                                        <span className="material-symbols-outlined">cancel</span> Cancelar
                                    </button>
                                    <button disabled={updating} onClick={() => updateStatus(selectedRes.id, 'confirmed')}
                                        className="flex-1 bg-secondary text-on-secondary font-label-md text-label-md px-4 py-3 rounded-xl hover:bg-secondary-container hover:text-on-secondary-container transition-colors shadow-sm flex justify-center items-center gap-2">
                                        <span className="material-symbols-outlined">check_circle</span> Confirmar
                                    </button>
                                </>
                            )}
                            {selectedRes.status === 'confirmed' && (
                                <>
                                    <button disabled={updating} onClick={() => updateStatus(selectedRes.id, 'cancelled')}
                                        className="flex-1 bg-surface-container-lowest border border-outline text-on-surface-variant font-label-md text-label-md px-4 py-3 rounded-xl hover:bg-surface-variant transition-colors flex justify-center items-center gap-2">
                                        Anular
                                    </button>
                                    <button disabled={updating} onClick={() => updateStatus(selectedRes.id, 'completed')}
                                        className="flex-1 bg-primary text-on-primary font-label-md text-label-md px-4 py-3 rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm flex justify-center items-center gap-2">
                                        <span className="material-symbols-outlined">task_alt</span> Completar
                                    </button>
                                </>
                            )}
                            {(selectedRes.status === 'cancelled' || selectedRes.status === 'completed') && (
                                <p className="w-full text-center py-2 text-on-surface-variant text-sm font-label-md italic">
                                    Reserva en estado {getStatusConfig(selectedRes.status).label.toLowerCase()}
                                </p>
                            )}
                        </div>
                    </aside>
                </>
            )}
        </>
    );
};

export default AdminReservations;
