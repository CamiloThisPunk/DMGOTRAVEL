import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({ title: '', description: '', price: '', capacity: '', duration: '', image_360_url: '' });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
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
        const matchSearch = !search || (s.title || '').toLowerCase().includes(search.toLowerCase());
        return matchSearch;
    });

    const openCreate = () => {
        setEditingService(null);
        setForm({ title: '', description: '', price: '', capacity: '', duration: '', image_360_url: '' });
        setImageFile(null);
        setPreviewUrl('');
        setErrors({});
        setShowModal(true);
    };

    const openEdit = (service) => {
        setEditingService(service);
        setForm({
            title: service.title || '',
            description: service.description || '',
            price: service.price || '',
            capacity: service.capacity || '',
            duration: service.duration || '',
            image_360_url: service.image_360_url || '',
        });
        setImageFile(null);
        setPreviewUrl(service.image_360_url || '');
        setErrors({});
        setShowModal(true);
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
        
        // Convert to FormData to support file upload
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('description', form.description);
        formData.append('price', parseFloat(form.price));
        formData.append('capacity', parseInt(form.capacity));
        formData.append('duration', parseInt(form.duration));
        
        if (imageFile) {
            formData.append('image_360', imageFile);
        } else if (form.image_360_url && !form.image_360_url.startsWith('http://127.0.0.1')) {
            // Only send URL if it's an external URL, not an existing local storage one
            formData.append('image_360_url', form.image_360_url);
        }

        // Si es edición, en Laravel se recomienda mandar POST con _method=PUT cuando se usan archivos
        if (editingService) {
            formData.append('_method', 'PUT');
        }

        try {
            await api.get('/sanctum/csrf-cookie');
            if (editingService) {
                await api.post(`/api/admin/services/${editingService.id}`, formData);
            } else {
                await api.post('/api/admin/services', formData);
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
                    <div className="relative w-1/2">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                        <input className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest text-on-surface font-body-md text-body-md transition-all"
                            placeholder="Buscar por nombre..." value={search} onChange={e => setSearch(e.target.value)} />
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
                                    <th className="p-4 font-semibold w-16">Img</th>
                                    <th className="p-4 font-semibold">Nombre del Servicio</th>
                                    <th className="p-4 font-semibold w-32">Precio</th>
                                    <th className="p-4 font-semibold w-32">Duración (min)</th>
                                    <th className="p-4 font-semibold w-32">Capacidad</th>
                                    <th className="p-4 font-semibold w-48 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant font-body-md text-body-md">
                                {filtered.length === 0 ? (
                                    <tr><td colSpan="6" className="p-8 text-center text-on-surface-variant">No se encontraron servicios</td></tr>
                                ) : filtered.map(service => (
                                    <tr key={service.id} className="hover:bg-surface-container transition-colors group">
                                        <td className="p-4">
                                            {service.image_360_url ? (
                                                <img src={service.image_360_url} alt={service.title} className="w-10 h-10 object-cover rounded-md border border-outline-variant" />
                                            ) : (
                                                <div className="w-10 h-10 bg-surface-container rounded-md flex items-center justify-center border border-outline-variant">
                                                    <span className="material-symbols-outlined text-on-surface-variant text-sm">image</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-primary">{service.title}</div>
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
                                                <span className="material-symbols-outlined text-[16px]">group</span>
                                                {service.capacity} px
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
                                        value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="Ej: Full Day Millpu" />
                                    {errors.title && <p className="text-error text-xs">{errors.title[0]}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="font-label-md text-sm text-on-surface">Capacidad (Personas) *</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-[18px]">group</span>
                                        <input className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                            type="number" min="1" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} required placeholder="Ej: 15" />
                                    </div>
                                    {errors.capacity && <p className="text-error text-xs">{errors.capacity[0]}</p>}
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="font-label-md text-sm text-on-surface">Descripción Detallada *</label>
                                    <textarea className="w-full px-4 py-2 border border-outline-variant rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                        value={form.description} onChange={e => setForm({...form, description: e.target.value})} required rows="3" placeholder="Describe la experiencia..." />
                                    {errors.description && <p className="text-error text-xs">{errors.description[0]}</p>}
                                </div>
                                
                                <div className="space-y-2 md:col-span-2">
                                    <label className="font-label-md text-sm text-on-surface block">Imagen del Destino (Opcional)</label>
                                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                                        {/* Cuadro de previsualización / Carga */}
                                        <div className="relative w-40 h-40 flex-shrink-0 border-2 border-dashed border-outline-variant rounded-xl overflow-hidden bg-surface-container-low flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container hover:border-primary transition-colors group">
                                            {previewUrl ? (
                                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center p-4">
                                                    <span className="material-symbols-outlined text-4xl mb-2 text-outline">add_photo_alternate</span>
                                                    <span className="text-xs text-center font-label-sm">Subir JPG</span>
                                                </div>
                                            )}
                                            
                                            {/* Hover overlay for changing image */}
                                            {previewUrl && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="material-symbols-outlined text-white text-3xl">edit</span>
                                                </div>
                                            )}

                                            {/* Input file oculto que cubre todo el cuadro */}
                                            <input 
                                                type="file" 
                                                accept=".jpg,.jpeg" 
                                                onChange={handleFileChange} 
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                title="Haz clic para subir imagen"
                                            />
                                        </div>
                                        
                                        {/* Campo de URL alternativo */}
                                        <div className="flex-1 space-y-4 w-full pt-2">
                                            <div className="space-y-2">
                                                <span className="text-xs text-on-surface-variant font-label-sm block">O pega una URL de internet:</span>
                                                <div className="relative">
                                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">link</span>
                                                    <input className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm bg-surface-container-lowest"
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
                                            <p className="text-xs text-on-surface-variant italic border-l-2 border-secondary pl-3">
                                                Solo se admiten formatos JPG/JPEG. La imagen se adaptará automáticamente para verse perfecta en la galería de clientes.
                                            </p>
                                        </div>
                                    </div>
                                    {errors.image_360 && <p className="text-error text-xs">{errors.image_360[0]}</p>}
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
                                    <label className="font-label-md text-sm text-on-surface">Duración (minutos) *</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-[18px]">schedule</span>
                                        <input className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                            type="number" min="1" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} required placeholder="Ej: 120" />
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
