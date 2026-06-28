import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [form, setForm] = useState({ name: '', category: '', description: '', price: '', duration: '' });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { fetchServices(); }, []);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/admin/services');
            setServices(res.data?.data || res.data?.services || res.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const filtered = services.filter(s => {
        const matchSearch = !search || (s.name || '').toLowerCase().includes(search.toLowerCase());
        const matchCat = !categoryFilter || s.category === categoryFilter;
        return matchSearch && matchCat;
    });

    const openCreate = () => {
        setEditingService(null);
        setForm({ name: '', category: '', description: '', price: '', duration: '' });
        setErrors({});
        setShowModal(true);
    };

    const openEdit = (service) => {
        setEditingService(service);
        setForm({
            name: service.name || '',
            category: service.category || '',
            description: service.description || '',
            price: service.price || '',
            duration: service.duration || '',
        });
        setErrors({});
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});
        try {
            if (editingService) {
                await api.put(`/api/admin/services/${editingService.id}`, form);
            } else {
                await api.post('/api/admin/services', form);
            }
            setShowModal(false);
            fetchServices();
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                alert(err.response?.data?.message || 'Error al guardar');
            }
        } finally { setSubmitting(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Seguro que deseas eliminar este servicio permanentemente?')) return;
        try {
            await api.delete(`/api/admin/services/${id}`);
            fetchServices();
        } catch (e) { alert('Error al eliminar'); }
    };

    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-end mb-stack-lg">
                <div>
                    <h1 className="font-headline-md text-headline-md text-primary mb-2">Gestión de Servicios</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant">Administra el catálogo de tours, experiencias y paquetes.</p>
                </div>
                <button onClick={openCreate} className="bg-secondary text-on-secondary font-label-md text-label-md px-6 py-3 rounded hover:bg-secondary-container hover:text-on-secondary-container transition-colors shadow-sm flex items-center gap-2">
                    <span className="material-symbols-outlined">add_circle</span>
                    Nuevo Servicio
                </button>
            </div>

            {/* Table */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
                {/* Filters */}
                <div className="p-gutter border-b border-outline-variant bg-surface-container flex justify-between items-center">
                    <div className="relative w-1/3">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                        <input className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest text-on-surface font-body-md text-body-md transition-all"
                            placeholder="Buscar servicios..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <select className="border border-outline-variant rounded px-4 py-2 bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary font-body-md text-body-md"
                        value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                        <option value="">Categoría</option>
                        <option value="aventura">Aventura</option>
                        <option value="cultural">Cultural</option>
                        <option value="gastronomico">Gastronómico</option>
                        <option value="full_day">Full Day</option>
                    </select>
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
                                    <th className="p-4 font-semibold">Nombre del Servicio</th>
                                    <th className="p-4 font-semibold w-32">Precio</th>
                                    <th className="p-4 font-semibold w-32">Duración</th>
                                    <th className="p-4 font-semibold w-32">Categoría</th>
                                    <th className="p-4 font-semibold w-48 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant font-body-md text-body-md">
                                {filtered.length === 0 ? (
                                    <tr><td colSpan="5" className="p-8 text-center text-on-surface-variant">No se encontraron servicios</td></tr>
                                ) : filtered.map(service => (
                                    <tr key={service.id} className="hover:bg-surface-container transition-colors group">
                                        <td className="p-4">
                                            <div className="font-bold text-primary">{service.name}</div>
                                            <div className="text-sm text-on-surface-variant mt-1 line-clamp-1">{service.description}</div>
                                        </td>
                                        <td className="p-4 font-semibold text-on-surface">S/ {parseFloat(service.price || 0).toFixed(2)}</td>
                                        <td className="p-4 text-on-surface-variant">
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[18px]">schedule</span> {service.duration}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-on-surface-variant capitalize flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px]">category</span>
                                                {(service.category || '').replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEdit(service)} className="p-2 text-primary hover:bg-surface-variant rounded transition-colors" title="Editar">
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                <button onClick={() => handleDelete(service.id)} className="p-2 text-error hover:bg-error-container rounded transition-colors" title="Eliminar">
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className="p-gutter border-t border-outline-variant flex justify-between items-center bg-surface-container-lowest">
                    <span className="font-body-md text-sm text-on-surface-variant">Mostrando {filtered.length} de {services.length} servicios</span>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,36,68,0.4)', backdropFilter: 'blur(4px)' }}>
                    <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col border border-outline-variant overflow-hidden">
                        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container">
                            <h3 className="font-headline-sm text-headline-sm text-primary">{editingService ? 'Editar Servicio' : 'Crear Nuevo Servicio'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-on-surface-variant hover:text-error transition-colors p-1">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4 md:col-span-2">
                                    <h4 className="font-label-md text-label-md text-primary-fixed-dim uppercase tracking-wider mb-2 border-b border-outline-variant pb-1">Información General</h4>
                                </div>
                                <div className="space-y-2">
                                    <label className="font-label-md text-sm text-on-surface">Nombre del Servicio *</label>
                                    <input className="w-full px-4 py-2 border border-outline-variant rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                        value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="Ej: Full Day Millpu" />
                                    {errors.name && <p className="text-error text-xs">{errors.name[0]}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="font-label-md text-sm text-on-surface">Categoría *</label>
                                    <select className="w-full px-4 py-2 border border-outline-variant rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                        value={form.category} onChange={e => setForm({...form, category: e.target.value})} required>
                                        <option value="">Seleccionar categoría...</option>
                                        <option value="aventura">Aventura</option>
                                        <option value="cultural">Cultural</option>
                                        <option value="gastronomico">Gastronómico</option>
                                        <option value="full_day">Full Day</option>
                                    </select>
                                    {errors.category && <p className="text-error text-xs">{errors.category[0]}</p>}
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="font-label-md text-sm text-on-surface">Descripción Detallada *</label>
                                    <textarea className="w-full px-4 py-2 border border-outline-variant rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                        value={form.description} onChange={e => setForm({...form, description: e.target.value})} required rows="3" placeholder="Describe la experiencia..." />
                                    {errors.description && <p className="text-error text-xs">{errors.description[0]}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="font-label-md text-sm text-on-surface">Precio Base (S/) *</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">S/</span>
                                        <input className="w-full pl-8 pr-4 py-2 border border-outline-variant rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                            type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required placeholder="0.00" />
                                    </div>
                                    {errors.price && <p className="text-error text-xs">{errors.price[0]}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="font-label-md text-sm text-on-surface">Duración Estimada *</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-[18px]">schedule</span>
                                        <input className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                            value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} required placeholder="Ej: 8 horas" />
                                    </div>
                                    {errors.duration && <p className="text-error text-xs">{errors.duration[0]}</p>}
                                </div>
                            </div>
                        </form>
                        <div className="px-6 py-4 border-t border-outline-variant bg-surface-container flex justify-end gap-3">
                            <button onClick={() => setShowModal(false)} className="px-6 py-2 border border-primary text-primary font-label-md text-label-md rounded hover:bg-primary hover:text-on-primary transition-colors">
                                Cancelar
                            </button>
                            <button onClick={handleSubmit} disabled={submitting} className="px-6 py-2 bg-secondary text-on-secondary font-label-md text-label-md rounded hover:bg-secondary-container hover:text-on-secondary-container transition-colors shadow-sm flex items-center gap-2">
                                <span className={`material-symbols-outlined text-[18px] ${submitting ? 'animate-spin' : ''}`}>{submitting ? 'sync' : 'save'}</span>
                                <span>{submitting ? 'Guardando...' : 'Guardar Servicio'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminServices;
