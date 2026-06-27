import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        description: '',
        price: '',
        duration: '',
        image_url: '' // Will act as the 360 image placeholder
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/admin/services');
            setServices(response.data.data || response.data);
        } catch (error) {
            console.error("Error fetching admin services", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/api/admin/services', formData);
            alert('Servicio guardado con éxito');
            setShowModal(false);
            setFormData({ name: '', type: '', description: '', price: '', duration: '', image_url: '' });
            fetchServices();
        } catch (error) {
            alert('Error al guardar el servicio: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Está seguro de que desea eliminar este servicio?')) return;
        try {
            await api.delete(`/api/admin/services/${id}`);
            fetchServices();
        } catch (error) {
            alert('Error al eliminar el servicio');
        }
    };

    return (
        <>
            {/* Page Header */}
            <div className="flex justify-between items-end mb-stack-lg max-w-[1320px] mx-auto">
                <div>
                    <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-2">Gestión de Servicios</h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant">Administra el catálogo de tours, experiencias y paquetes.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="bg-secondary text-on-secondary font-label-md text-label-md px-6 py-3 rounded-DEFAULT hover:bg-secondary-container hover:text-on-secondary-container transition-colors shadow-sm flex items-center gap-2">
                    <span className="material-symbols-outlined">add_circle</span>
                    Nuevo Servicio
                </button>
            </div>

            {/* Data Table Container */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm max-w-[1320px] mx-auto overflow-hidden">
                <div className="p-gutter border-b border-outline-variant bg-surface-container flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-1/3">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                        <input className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-DEFAULT focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest text-on-surface font-body-md text-body-md transition-all" placeholder="Buscar servicios..." type="text" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md border-b border-outline-variant">
                            <tr>
                                <th className="p-4 font-semibold w-24 text-center">Imagen</th>
                                <th className="p-4 font-semibold">Nombre del Servicio</th>
                                <th className="p-4 font-semibold w-32">Precio</th>
                                <th className="p-4 font-semibold w-32 text-center">Estado</th>
                                <th className="p-4 font-semibold w-48 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant font-body-md text-body-md">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-on-surface-variant">Cargando servicios...</td>
                                </tr>
                            ) : services.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-on-surface-variant">No hay servicios registrados.</td>
                                </tr>
                            ) : (
                                services.map(service => (
                                    <tr key={service.id} className="hover:bg-surface-container transition-colors group">
                                        <td className="p-4 text-center">
                                            <img className="w-16 h-12 object-cover rounded-DEFAULT border border-outline-variant" src={service.image_url || "https://images.unsplash.com/photo-1518173946687-a4c8a9b749f4?auto=format&fit=crop&q=80&w=150"} alt={service.name} />
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-primary">{service.name}</div>
                                            <div className="text-sm text-on-surface-variant flex items-center gap-1 mt-1">
                                                <span className="material-symbols-outlined text-[16px]">category</span> {service.type}
                                            </div>
                                        </td>
                                        <td className="p-4 font-semibold text-on-surface">S/ {service.price}</td>
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-xs">
                                                <span className="w-2 h-2 rounded-full bg-primary"></span> Activo
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-error hover:bg-error-container rounded-DEFAULT transition-colors" title="Eliminar" onClick={() => handleDelete(service.id)}>
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Service Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 36, 68, 0.4)', backdropFilter: 'blur(4px)' }}>
                    <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col border border-outline-variant overflow-hidden">
                        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container">
                            <h3 className="font-headline-sm text-headline-sm text-primary">Crear Nuevo Servicio</h3>
                            <button onClick={() => setShowModal(false)} className="text-on-surface-variant hover:text-error transition-colors p-1">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto font-body-md text-body-md">
                            <form id="create-service-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4 md:col-span-2">
                                    <h4 className="font-label-md text-label-md text-primary-fixed-dim uppercase tracking-wider mb-2 border-b border-outline-variant pb-1">Información General</h4>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="font-label-md text-sm text-on-surface">Nombre del Servicio *</label>
                                    <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-outline-variant rounded-DEFAULT focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="Ej: Full Day Millpu" type="text" />
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="font-label-md text-sm text-on-surface">Categoría *</label>
                                    <select required name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 border border-outline-variant rounded-DEFAULT focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors">
                                        <option value="">Seleccionar categoría...</option>
                                        <option value="Aventura">Aventura</option>
                                        <option value="Cultural">Cultural</option>
                                        <option value="Gastronomico">Gastronómico</option>
                                    </select>
                                </div>
                                
                                <div className="space-y-2 md:col-span-2">
                                    <label className="font-label-md text-sm text-on-surface">Descripción Detallada *</label>
                                    <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border border-outline-variant rounded-DEFAULT focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="Describe la experiencia..." rows="3"></textarea>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="font-label-md text-sm text-on-surface">Precio Base (S/) *</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">S/</span>
                                        <input required name="price" value={formData.price} onChange={handleChange} className="w-full pl-8 pr-4 py-2 border border-outline-variant rounded-DEFAULT focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="0.00" type="number" step="0.01" />
                                    </div>
                                </div>

                                {/* Media section simulating 360 viewer required feature */}
                                <div className="space-y-4 md:col-span-2 mt-2">
                                    <h4 className="font-label-md text-label-md text-primary-fixed-dim uppercase tracking-wider mb-2 border-b border-outline-variant pb-1">Contenido Multimedia</h4>
                                </div>
                                
                                <div className="space-y-2 md:col-span-2">
                                    <label className="font-label-md text-sm text-on-surface flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[20px] text-secondary">360</span>
                                        Imagen 360° (Experiencia Inmersiva) <span className="text-xs text-on-surface-variant font-normal">(Requerido para RF-07)</span>
                                    </label>
                                    <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center text-center bg-surface hover:bg-surface-container transition-colors cursor-pointer group">
                                        <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-3xl text-primary">panorama_horizontal</span>
                                        </div>
                                        <p className="font-label-md text-primary mb-1">Haz clic para subir o arrastra la imagen aquí</p>
                                        <p className="text-sm text-on-surface-variant">Soporta JPG, PNG (Formatos equirectangulares para 360°). Max 10MB.</p>
                                    </div>
                                </div>
                            </form>
                        </div>
                        
                        <div className="px-6 py-4 border-t border-outline-variant bg-surface-container flex justify-end gap-3">
                            <button onClick={() => setShowModal(false)} className="px-6 py-2 border border-primary text-primary font-label-md text-label-md rounded-DEFAULT hover:bg-primary hover:text-on-primary transition-colors">
                                Cancelar
                            </button>
                            <button form="create-service-form" disabled={isSubmitting} type="submit" className="px-6 py-2 bg-secondary text-on-secondary font-label-md text-label-md rounded-DEFAULT hover:bg-secondary-container hover:text-on-secondary-container transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50">
                                <span className="material-symbols-outlined text-[18px]">save</span>
                                {isSubmitting ? 'Guardando...' : 'Guardar Servicio'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminServices;
