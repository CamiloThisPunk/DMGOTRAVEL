import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [showPanel, setShowPanel] = useState(false);
    const [filter, setFilter] = useState('all');

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/admin/reservations');
            setReservations(response.data.data || response.data);
        } catch (error) {
            console.error("Error fetching admin reservations", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleOpenPanel = (reservation) => {
        setSelectedReservation(reservation);
        setShowPanel(true);
        document.body.style.overflow = 'hidden';
    };

    const handleClosePanel = () => {
        setShowPanel(false);
        setTimeout(() => {
            setSelectedReservation(null);
            document.body.style.overflow = '';
        }, 300);
    };

    const handleUpdateStatus = async (status) => {
        if (!selectedReservation) return;
        try {
            await api.patch(`/api/admin/reservations/${selectedReservation.id}/status`, { status });
            alert(`Reserva ${status} con éxito`);
            handleClosePanel();
            fetchReservations();
        } catch (error) {
            alert('Error al actualizar el estado: ' + (error.response?.data?.message || error.message));
        }
    };

    const renderStatusBadge = (status) => {
        const styles = {
            'confirmed': 'bg-[#d3f5d3] text-[#005000]',
            'pending': 'bg-secondary-fixed-dim text-on-secondary-fixed',
            'completed': 'bg-surface-variant text-on-surface-variant',
            'cancelled': 'bg-error-container text-on-error-container'
        };
        const dots = {
            'confirmed': 'bg-[#008000]',
            'pending': 'bg-secondary',
            'completed': 'bg-outline',
            'cancelled': 'bg-error'
        };
        const labels = {
            'confirmed': 'Confirmada',
            'pending': 'Pendiente',
            'completed': 'Completada',
            'cancelled': 'Cancelada'
        };
        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] || styles['pending']}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || dots['pending']}`}></span>
                {labels[status] || status}
            </span>
        );
    };

    const filteredReservations = reservations.filter(res => {
        if (filter === 'all') return true;
        return res.status === filter;
    });

    return (
        <div className="flex flex-col h-full relative">
            <header className="mb-stack-lg">
                <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-2">Control de Reservas</h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant">Gestión y seguimiento de itinerarios turísticos.</p>
            </header>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-2 mb-stack-lg flex flex-wrap gap-2 shadow-sm">
                <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg font-label-md text-label-md transition-colors border ${filter === 'all' ? 'bg-surface-container-high text-on-surface border-outline-variant' : 'text-on-surface-variant border-transparent hover:bg-surface-variant hover:border-outline-variant'}`}>Todas</button>
                <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-lg font-label-md text-label-md transition-colors border ${filter === 'pending' ? 'bg-secondary-container text-on-secondary-container border-transparent' : 'text-on-surface-variant border-transparent hover:bg-surface-variant hover:border-outline-variant'}`}>Pendientes</button>
                <button onClick={() => setFilter('confirmed')} className={`px-4 py-2 rounded-lg font-label-md text-label-md transition-colors border ${filter === 'confirmed' ? 'bg-[#d3f5d3] text-[#005000] border-transparent' : 'text-on-surface-variant border-transparent hover:bg-surface-variant hover:border-outline-variant'}`}>Confirmadas</button>
                <button onClick={() => setFilter('cancelled')} className={`px-4 py-2 rounded-lg font-label-md text-label-md transition-colors border ${filter === 'cancelled' ? 'bg-error-container text-on-error-container border-transparent' : 'text-on-surface-variant border-transparent hover:bg-surface-variant hover:border-outline-variant'}`}>Canceladas</button>
                <button onClick={() => setFilter('completed')} className={`px-4 py-2 rounded-lg font-label-md text-label-md transition-colors border ${filter === 'completed' ? 'bg-surface-variant text-on-surface-variant border-transparent' : 'text-on-surface-variant border-transparent hover:bg-surface-variant hover:border-outline-variant'}`}>Completadas</button>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden flex-1">
                <div className="overflow-x-auto h-full">
                    <table className="w-full text-left border-collapse min-w-[900px]">
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
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-on-surface-variant">Cargando reservas...</td>
                                </tr>
                            ) : filteredReservations.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-on-surface-variant">No se encontraron reservas.</td>
                                </tr>
                            ) : (
                                filteredReservations.map(res => {
                                    const dateObj = new Date(res.service_package?.date || res.created_at);
                                    const dateStr = `${dateObj.getDate()} ${['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][dateObj.getMonth()]} ${dateObj.getFullYear()}`;
                                    
                                    return (
                                        <tr key={res.id} className={`hover:bg-surface transition-colors group ${res.status === 'cancelled' ? 'opacity-75' : ''}`}>
                                            <td className={`p-4 font-semibold ${res.status === 'cancelled' ? 'text-outline' : 'text-primary'}`}>#RES-{res.id.toString().padStart(4, '0')}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${res.status === 'cancelled' ? 'bg-surface-variant text-outline' : 'bg-primary-container text-primary'}`}>
                                                        {res.user?.name?.substring(0, 2).toUpperCase() || 'NA'}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-on-surface">{res.user?.name || 'Cliente Desconocido'}</p>
                                                        <p className="text-sm text-on-surface-variant">{res.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <p className="font-semibold text-on-surface">{res.service_package?.name || 'Servicio'}</p>
                                                <p className="text-sm text-on-surface-variant">{res.passengers} Pasajeros</p>
                                            </td>
                                            <td className="p-4 text-on-surface-variant">{dateStr}</td>
                                            <td className={`p-4 font-semibold ${res.status === 'cancelled' ? 'text-outline line-through' : 'text-primary'}`}>S/ {res.total_price}</td>
                                            <td className="p-4">
                                                {renderStatusBadge(res.status)}
                                            </td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => handleOpenPanel(res)} className={`font-label-md text-label-md border px-3 py-1.5 rounded-lg hover:bg-surface-variant transition-colors inline-flex items-center gap-1 ${res.status === 'cancelled' ? 'text-outline border-outline-variant hover:text-primary' : 'text-primary border-primary hover:text-secondary'}`}>
                                                    Ver Detalle
                                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Side Panel Backdrop */}
            {showPanel && (
                <div className="fixed inset-0 bg-[#000000] bg-opacity-30 z-50 backdrop-enter-active" onClick={handleClosePanel}></div>
            )}

            {/* Details Side Panel */}
            <aside className={`fixed top-0 right-0 h-full w-full max-w-md bg-surface-container-lowest shadow-[-4px_0_24px_rgba(0,36,68,0.1)] z-50 border-l border-outline-variant flex flex-col transition-transform duration-300 ${showPanel ? 'translate-x-0' : 'translate-x-full'}`}>
                {selectedReservation && (
                    <>
                        <div className="p-gutter border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                            <div>
                                <h3 className="font-headline-sm text-headline-sm text-primary m-0 flex items-center gap-2">
                                    Detalle de Reserva
                                    <span className="text-sm px-2 py-1 bg-surface-variant rounded text-on-surface-variant font-label-md">#RES-{selectedReservation.id.toString().padStart(4, '0')}</span>
                                </h3>
                            </div>
                            <button onClick={handleClosePanel} className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors flex items-center justify-center">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-gutter flex flex-col gap-stack-lg">
                            {selectedReservation.status === 'pending' && (
                                <div className="bg-secondary-fixed p-4 rounded-xl border border-secondary-fixed-dim flex gap-3 items-start">
                                    <span className="material-symbols-outlined text-secondary mt-0.5">info</span>
                                    <div>
                                        <h4 className="font-label-md text-label-md text-on-secondary-fixed mb-1">Acción Requerida</h4>
                                        <p className="font-body-md text-sm text-on-secondary-fixed opacity-90">Esta reserva está pendiente de confirmación de pago. Verifique el comprobante antes de confirmar.</p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <h4 className="font-label-md text-label-md text-on-surface-variant mb-stack-sm uppercase tracking-wider text-xs">Información del Cliente</h4>
                                <div className="bg-surface border border-outline-variant rounded-xl p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg">
                                        {selectedReservation.user?.name?.substring(0, 2).toUpperCase() || 'NA'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-on-surface text-lg">{selectedReservation.user?.name}</p>
                                        <p className="font-body-md text-sm text-on-surface-variant flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">mail</span> {selectedReservation.user?.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-label-md text-label-md text-on-surface-variant mb-stack-sm uppercase tracking-wider text-xs">Detalles del Servicio</h4>
                                <div className="border border-outline-variant rounded-xl overflow-hidden">
                                    <div className="p-4 bg-surface-container-low border-b border-outline-variant">
                                        <p className="font-semibold text-primary text-lg">{selectedReservation.service_package?.name}</p>
                                        <p className="text-sm text-on-surface-variant">{selectedReservation.passengers} Pasajeros</p>
                                    </div>
                                    <div className="p-4 bg-surface-container-lowest grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-outline mb-1">Fecha Programada</p>
                                            <p className="font-semibold text-on-surface text-sm flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm text-primary">calendar_today</span> 
                                                {new Date(selectedReservation.service_package?.date || selectedReservation.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-label-md text-label-md text-on-surface-variant mb-stack-sm uppercase tracking-wider text-xs">Resumen de Pago</h4>
                                <div className="bg-surface rounded-xl p-4 border border-outline-variant">
                                    <div className="flex justify-between items-center pt-3 border-t border-outline-variant mt-2">
                                        <span className="font-semibold text-on-surface">Total</span>
                                        <span className="font-bold text-primary text-lg">S/ {selectedReservation.total_price}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {selectedReservation.status === 'pending' && (
                            <div className="p-gutter border-t border-outline-variant bg-surface-container-low flex gap-3">
                                <button onClick={() => handleUpdateStatus('cancelled')} className="flex-1 bg-surface-container-lowest border border-error text-error font-label-md text-label-md px-4 py-3 rounded-xl hover:bg-error-container hover:text-on-error-container transition-colors shadow-sm flex justify-center items-center gap-2">
                                    <span className="material-symbols-outlined">cancel</span>
                                    Rechazar
                                </button>
                                <button onClick={() => handleUpdateStatus('confirmed')} className="flex-1 bg-secondary text-on-secondary font-label-md text-label-md px-4 py-3 rounded-xl hover:bg-secondary-container hover:text-on-secondary-container transition-colors shadow-sm flex justify-center items-center gap-2">
                                    <span className="material-symbols-outlined">check_circle</span>
                                    Confirmar
                                </button>
                            </div>
                        )}
                    </>
                )}
            </aside>
        </div>
    );
};

export default AdminReservations;
