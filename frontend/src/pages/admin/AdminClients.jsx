import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminClients = () => {
    const [clients, setClients] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showLogs, setShowLogs] = useState(false);

    useEffect(() => { fetchClients(); fetchLogs(); }, []);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/admin/clients');
            setClients(res.data?.data || res.data?.clients || res.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const fetchLogs = async () => {
        try {
            const res = await api.get('/api/admin/logs');
            setLogs(res.data?.data || res.data?.logs || res.data || []);
        } catch (e) { console.error(e); }
    };

    const filtered = clients.filter(c => {
        const q = search.toLowerCase();
        return !q || (c.name || '').toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q);
    });

    return (
        <>
            {/* Header */}
            <header className="flex justify-between items-center mb-stack-lg">
                <div>
                    <h2 className="font-headline-md text-headline-md text-primary">Gestión de Clientes</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">Supervisión de usuarios registrados y actividad.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowLogs(!showLogs)}
                        className={`font-label-md text-label-md px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border ${
                            showLogs ? 'bg-secondary-container text-on-secondary-container border-secondary-container' : 'border-outline-variant text-on-surface-variant hover:bg-surface-variant'
                        }`}>
                        <span className="material-symbols-outlined text-[18px]">history</span>
                        {showLogs ? 'Ver Clientes' : 'Ver Logs'}
                    </button>
                </div>
            </header>

            {!showLogs ? (
                /* Clients Table */
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
                    {/* Search */}
                    <div className="p-gutter border-b border-outline-variant bg-surface-container flex items-center">
                        <div className="relative w-1/3">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                            <input className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest text-on-surface font-body-md text-body-md transition-all"
                                placeholder="Buscar clientes..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                    </div>
                    <div className="overflow-x-auto min-h-[300px]">
                        {loading ? (
                            <div className="flex items-center justify-center p-8">
                                <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md border-b border-outline-variant">
                                    <tr>
                                        <th className="p-4 font-semibold">Cliente</th>
                                        <th className="p-4 font-semibold">Email</th>
                                        <th className="p-4 font-semibold">Teléfono</th>
                                        <th className="p-4 font-semibold">Rol</th>
                                        <th className="p-4 font-semibold">Registro</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant font-body-md text-body-md">
                                    {filtered.length === 0 ? (
                                        <tr><td colSpan="5" className="p-8 text-center text-on-surface-variant">No se encontraron clientes</td></tr>
                                    ) : filtered.map(client => (
                                        <tr key={client.id} className="hover:bg-surface-container transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm">
                                                        {(client.name || '').substring(0,2).toUpperCase()}
                                                    </div>
                                                    <span className="font-semibold text-primary">{client.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-on-surface-variant">{client.email}</td>
                                            <td className="p-4 text-on-surface-variant">{client.phone || '-'}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-0.5 text-[10px] rounded uppercase font-bold tracking-wider ${
                                                    client.role === 'admin' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-variant text-on-surface-variant'
                                                }`}>
                                                    {client.role || 'client'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-on-surface-variant text-sm">{client.created_at ? new Date(client.created_at).toLocaleDateString() : '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    <div className="p-gutter border-t border-outline-variant flex justify-between items-center bg-surface-container-lowest">
                        <span className="font-body-md text-sm text-on-surface-variant">{filtered.length} clientes encontrados</span>
                    </div>
                </div>
            ) : (
                /* Audit Logs */
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
                    <div className="p-gutter border-b border-outline-variant bg-surface-container">
                        <h3 className="font-headline-sm text-headline-sm text-primary">Registro de Actividad</h3>
                    </div>
                    <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
                        {logs.length === 0 ? (
                            <p className="text-center text-on-surface-variant py-8">No hay registros de actividad</p>
                        ) : logs.map((log, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 bg-surface rounded-lg border border-outline-variant">
                                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary flex-shrink-0">
                                    <span className="material-symbols-outlined text-[20px]">
                                        {log.action === 'login' ? 'login' : log.action === 'logout' ? 'logout' : 'info'}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-label-md text-label-md text-on-surface">{log.action || log.description || 'Actividad'}</p>
                                    <p className="text-sm text-on-surface-variant">{log.user?.name || log.user_name || 'Usuario'} • {log.created_at ? new Date(log.created_at).toLocaleString() : ''}</p>
                                    {log.details && <p className="text-xs text-outline mt-1">{log.details}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminClients;
