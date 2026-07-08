import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AdminTouristPackages = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('Todas'); // 'Todas', 'Activos', 'Inactivos'
    const [form, setForm] = useState({ title: '', description: '', price: '', capacity: '', duration: '', image_360_url: '', is_active: 1 });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { fetchServices(); }, []);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/admin/services?type=paquete');
            setServices(res.data?.data || res.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const filtered = services.filter(s => {
        const matchSearch = !search || (s.title || '').toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'Todas' ? true : (filter === 'Activos' ? s.is_active : !s.is_active);
        return matchSearch && matchFilter;
    });

    const openCreate = () => {
        navigate('/admin/tourist-packages/create');
    };

    const openEdit = (service) => {
        navigate(`/admin/tourist-packages/${service.id}/edit`);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});
        
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('type', 'paquete');
        formData.append('description', form.description);
        formData.append('price', parseFloat(form.price));
        formData.append('capacity', parseInt(form.capacity));
        formData.append('duration', parseInt(form.duration));
        formData.append('is_active', form.is_active ? 1 : 0);
        
        if (imageFile instanceof File) {
            formData.append('image_360', imageFile);
        } else if (form.image_360_url && typeof form.image_360_url === 'string' && !form.image_360_url.includes('/storage/')) {
            formData.append('image_360_url', form.image_360_url);
        }

        if (editingService) {
            formData.append('_method', 'PUT');
        }

        try {
            await api.get('/sanctum/csrf-cookie');
            const config = { headers: { 'Content-Type': undefined } };

            if (editingService) {
                await api.post(`/api/admin/services/${editingService.id}`, formData, config);
            } else {
                await api.post('/api/admin/services', formData, config);
            }
            
            setShowModal(false);
            fetchServices();
        } catch (err) {
            console.error('Upload error:', err.response?.data);
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                alert(err.response?.data?.message || 'Error al guardar');
            }
        } finally { setSubmitting(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Seguro que deseas eliminar este paquete permanentemente?')) return;
        try {
            await api.delete(`/api/admin/services/${id}`);
            fetchServices();
        } catch (e) { alert('Error al eliminar'); }
    };

    const toggleStatus = async (service) => {
        try {
            await api.post(`/api/admin/services/${service.id}/toggle-status`);
            fetchServices();
        } catch (e) { alert('Error al cambiar el estado'); }
    };

    return (
        <div className="max-w-container-max mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary mb-1">Paquetes Turísticos</h2>
                    <p className="text-body-md font-body-md text-on-surface-variant">Catálogo de experiencias y tours en Ayacucho.</p>
                </div>
                <button onClick={openCreate} className="bg-primary text-on-primary px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-bold shadow-sm hover:bg-primary-container hover:text-on-primary-container active:scale-95 transition-all w-full md:w-auto">
                    <span className="material-symbols-outlined">add</span>
                    <span className="">Nuevo Paquete</span>
                </button>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-surface border border-outline-variant rounded-xl p-4 mb-6 shadow-sm flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                    <input 
                        className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none text-body-md" 
                        placeholder="Buscar paquete..." 
                        value={search} 
                        onChange={e => setSearch(e.target.value)} 
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
                    {['Todas', 'Activos', 'Inactivos'].map(f => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-label-md font-label-md border transition-colors ${filter === f ? 'bg-primary-container text-on-primary-container border-primary-container' : 'bg-surface-container-highest text-on-surface-variant border-outline-variant hover:bg-surface-variant'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Packages Table */}
            <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto min-h-[300px]">
                    {loading ? (
                        <div className="flex items-center justify-center p-12">
                            <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead className="bg-surface-container-low border-b border-outline-variant">
                                <tr>
                                    <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Paquete</th>
                                    <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Duración / Capacidad</th>
                                    <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Precio</th>
                                    <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant">
                                {filtered.length === 0 ? (
                                    <tr><td colSpan="5" className="p-8 text-center text-on-surface-variant">No se encontraron paquetes</td></tr>
                                ) : filtered.map(service => (
                                    <tr key={service.id} className="hover:bg-surface-muted transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-lg bg-surface-container-high overflow-hidden shrink-0 ${!service.is_active ? 'grayscale opacity-60' : ''}`}>
                                                    {service.image_360_url ? (
                                                        <img src={service.image_360_url} alt={service.title} onError={(e) => { e.target.onerror = null; e.target.src = '/images/demo-tour-1.jpg'; }} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                                                            <span className="material-symbols-outlined text-[24px]">image</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className={`text-body-md font-bold ${service.is_active ? 'text-primary' : 'text-on-surface-variant'}`}>{service.title}</div>
                                                    <div className="text-body-sm text-on-surface-variant line-clamp-1">{service.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-body-md text-on-surface-variant">
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px]">schedule</span> {service.duration} días
                                            </div>
                                            <div className="flex items-center gap-2 mt-1 text-sm">
                                                <span className="material-symbols-outlined text-[16px]">group</span> {service.capacity} pax
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`text-body-md font-bold ${service.is_active ? 'text-primary' : 'text-on-surface-variant'}`}>S/ {parseFloat(service.price).toFixed(2)}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            {service.is_active ? (
                                                <button onClick={() => toggleStatus(service)} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20 hover:bg-success/20 transition-colors">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-success mr-1.5"></span>
                                                    Activo
                                                </button>
                                            ) : (
                                                <button onClick={() => toggleStatus(service)} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-container-highest text-on-surface-variant border border-outline-variant hover:bg-surface-variant transition-colors">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant mr-1.5"></span>
                                                    Inactivo
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEdit(service)} className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container" title="Editar">
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                <button onClick={() => handleDelete(service.id)} className="p-2 text-on-surface-variant hover:text-error transition-colors rounded-full hover:bg-error-container" title="Eliminar">
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
                <div className="px-6 py-4 bg-surface border-t border-outline-variant flex items-center justify-between">
                    <p className="text-body-sm text-on-surface-variant">Mostrando {filtered.length} de {services.length} paquetes</p>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,36,68,0.4)', backdropFilter: 'blur(4px)' }}>
                    <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col border border-outline-variant overflow-hidden">
                        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container">
                            <h3 className="font-headline-sm text-headline-sm text-primary">{editingService ? 'Editar Paquete Turístico' : 'Crear Nuevo Paquete'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-on-surface-variant hover:text-error transition-colors p-1">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4 md:col-span-2">
                                    <h4 className="font-label-md text-label-md text-secondary uppercase tracking-wider mb-2 border-b border-outline-variant pb-1">Información General</h4>
                                </div>
                                <div className="space-y-2">
                                    <label className="font-label-md text-sm text-on-surface">Nombre del Paquete *</label>
                                    <input className="w-full px-4 py-2 border border-outline-variant rounded focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors bg-surface-container-lowest"
                                        value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="Ej: Full Day Millpu" />
                                    {errors.title && <p className="text-error text-xs">{errors.title[0]}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="font-label-md text-sm text-on-surface">Capacidad (Personas) *</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-[18px]">group</span>
                                        <input className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors bg-surface-container-lowest"
                                            type="number" min="1" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} required placeholder="Ej: 15" />
                                    </div>
                                    {errors.capacity && <p className="text-error text-xs">{errors.capacity[0]}</p>}
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="font-label-md text-sm text-on-surface">Descripción Detallada *</label>
                                    <textarea className="w-full px-4 py-2 border border-outline-variant rounded focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors bg-surface-container-lowest"
                                        value={form.description} onChange={e => setForm({...form, description: e.target.value})} required rows="3" placeholder="Describe la experiencia..." />
                                    {errors.description && <p className="text-error text-xs">{errors.description[0]}</p>}
                                </div>
                                
                                <div className="space-y-2 md:col-span-2">
                                    <label className="font-label-md text-sm text-on-surface block">Imagen Principal (Opcional)</label>
                                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                                        <div className="relative w-40 h-40 flex-shrink-0 border-2 border-dashed border-outline-variant rounded-xl overflow-hidden bg-surface-container-low flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container hover:border-secondary transition-colors group">
                                            {previewUrl ? (
                                                <img src={previewUrl} alt="Preview" onError={(e) => { e.target.onerror = null; e.target.src = '/images/demo-tour-1.jpg'; }} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center p-4">
                                                    <span className="material-symbols-outlined text-4xl mb-2 text-outline">add_photo_alternate</span>
                                                    <span className="text-xs text-center font-label-sm">Subir JPG</span>
                                                </div>
                                            )}
                                            {previewUrl && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="material-symbols-outlined text-white text-3xl">edit</span>
                                                </div>
                                            )}
                                            <input 
                                                type="file" accept=".jpg,.jpeg" onChange={handleFileChange} 
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" title="Subir imagen"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-4 w-full pt-2">
                                            <div className="space-y-2">
                                                <span className="text-xs text-on-surface-variant font-label-sm block">O pega una URL:</span>
                                                <div className="relative">
                                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">link</span>
                                                    <input className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors text-sm bg-surface-container-lowest"
                                                        type="url" placeholder="https://ejemplo.com/imagen.jpg" 
                                                        value={form.image_360_url} 
                                                        onChange={e => {
                                                            setForm({...form, image_360_url: e.target.value});
                                                            if (!imageFile) setPreviewUrl(e.target.value);
                                                        }} 
                                                    />
                                                </div>
                                                {errors.image_360_url && <p className="text-error text-xs">{errors.image_360_url[0]}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="font-label-md text-sm text-on-surface">Precio Base (S/) *</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">S/</span>
                                        <input className="w-full pl-8 pr-4 py-2 border border-outline-variant rounded focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors bg-surface-container-lowest"
                                            type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required placeholder="0.00" />
                                    </div>
                                    {errors.price && <p className="text-error text-xs">{errors.price[0]}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="font-label-md text-sm text-on-surface">Duración (minutos) *</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-[18px]">schedule</span>
                                        <input className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors bg-surface-container-lowest"
                                            type="number" min="1" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} required placeholder="Ej: 120" />
                                    </div>
                                    {errors.duration && <p className="text-error text-xs">{errors.duration[0]}</p>}
                                </div>
                                
                                <div className="space-y-2 md:col-span-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={form.is_active === 1} onChange={e => setForm({...form, is_active: e.target.checked ? 1 : 0})} className="rounded text-primary focus:ring-primary w-5 h-5 border-outline-variant" />
                                        <span className="font-body-md text-on-surface">Paquete Activo (Visible en Catálogo)</span>
                                    </label>
                                </div>
                            </div>
                        </form>
                        <div className="px-6 py-4 border-t border-outline-variant bg-surface-container flex justify-end gap-3">
                            <button onClick={() => setShowModal(false)} className="px-6 py-2 border border-outline-variant text-on-surface-variant font-label-md text-label-md rounded hover:bg-surface-container-highest transition-colors">
                                Cancelar
                            </button>
                            <button onClick={handleSubmit} disabled={submitting} className="px-6 py-2 bg-primary text-on-primary font-label-md text-label-md rounded hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm flex items-center gap-2">
                                <span className={`material-symbols-outlined text-[18px] ${submitting ? 'animate-spin' : ''}`}>{submitting ? 'sync' : 'save'}</span>
                                <span>{submitting ? 'Guardando...' : 'Guardar Paquete'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTouristPackages;
