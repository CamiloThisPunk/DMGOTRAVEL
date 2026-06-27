import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminClients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                // Assuming we'll have this endpoint or use /api/users filtered by role
                const response = await api.get('/api/admin/clients').catch(() => ({ data: { data: [] } }));
                setClients(response.data.data || response.data);
            } catch (error) {
                console.error("Error fetching clients", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    return (
        <div className="flex flex-col h-full relative">
            <header className="mb-stack-lg">
                <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-2">Gestión de Clientes</h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant">Base de datos de pasajeros y viajeros.</p>
            </header>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden flex-1">
                <div className="p-gutter border-b border-outline-variant bg-surface-container flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-1/3">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                        <input className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-DEFAULT focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest text-on-surface font-body-md text-body-md transition-all" placeholder="Buscar clientes..." type="text" />
                    </div>
                </div>

                <div className="overflow-x-auto h-full">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-surface-container-low border-b border-outline-variant">
                                <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Cliente</th>
                                <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Email</th>
                                <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Registro</th>
                                <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="font-body-md text-body-md divide-y divide-outline-variant">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-on-surface-variant">Cargando clientes...</td>
                                </tr>
                            ) : clients.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-on-surface-variant">No se encontraron clientes registrados.</td>
                                </tr>
                            ) : (
                                clients.map(client => (
                                    <tr key={client.id} className="hover:bg-surface transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold">
                                                    {client.name?.substring(0, 2).toUpperCase()}
                                                </div>
                                                <p className="font-semibold text-on-surface">{client.name}</p>
                                            </div>
                                        </td>
                                        <td className="p-4 text-on-surface-variant">{client.email}</td>
                                        <td className="p-4 text-on-surface-variant">{new Date(client.created_at).toLocaleDateString()}</td>
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d3f5d3] text-[#005000] font-label-md text-xs">
                                                <span className="w-2 h-2 rounded-full bg-[#008000]"></span> Activo
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminClients;
