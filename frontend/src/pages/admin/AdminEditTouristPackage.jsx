import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../services/api';

const AdminEditTouristPackage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
        title: '',
        price: '',
        old_price: '',
        duration: '',
        category: 'Cultura e Historia',
        description: '',
        image_360_url: '',
    });
    
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const [itinerary, setItinerary] = useState([
        {
            title: 'Día 1',
            activities: [
                { time: '09:00', title: 'Actividad de ejemplo', description: 'Descripción de la actividad.' }
            ]
        }
    ]);

    useEffect(() => {
        if (isEdit) {
            fetchPackage();
        }
    }, [id]);

    const fetchPackage = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/api/admin/services/${id}`);
            const data = res.data?.data || res.data;
            setForm({
                title: data.title || '',
                price: data.price || '',
                old_price: data.old_price || '',
                duration: data.duration || '',
                category: data.category || 'Cultura e Historia',
                description: data.description || '',
                image_360_url: data.image_360_url || '',
            });
            setPreviewUrl(data.image_360_url || '');
            let parsedItinerary = [];
            if (data.itinerary) {
                try {
                    parsedItinerary = typeof data.itinerary === 'string' ? JSON.parse(data.itinerary) : data.itinerary;
                } catch(e) {
                    console.error("Error parsing itinerary", e);
                }
            }
            if (Array.isArray(parsedItinerary) && parsedItinerary.length > 0) {
                setItinerary(parsedItinerary);
            }
        } catch (err) {
            console.error(err);
            setError('Error al cargar el paquete.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const addDay = (e) => {
        e.preventDefault();
        setItinerary([...itinerary, {
            title: `Día ${itinerary.length + 1}`,
            activities: []
        }]);
    };

    const removeDay = (index) => {
        const newItinerary = [...itinerary];
        newItinerary.splice(index, 1);
        setItinerary(newItinerary);
    };

    const updateDayTitle = (index, value) => {
        const newItinerary = [...itinerary];
        newItinerary[index].title = value;
        setItinerary(newItinerary);
    };

    const addActivity = (dayIndex, e) => {
        e.preventDefault();
        const newItinerary = [...itinerary];
        newItinerary[dayIndex].activities.push({ time: '', title: '', description: '' });
        setItinerary(newItinerary);
    };

    const removeActivity = (dayIndex, actIndex) => {
        const newItinerary = [...itinerary];
        newItinerary[dayIndex].activities.splice(actIndex, 1);
        setItinerary(newItinerary);
    };

    const updateActivity = (dayIndex, actIndex, field, value) => {
        const newItinerary = [...itinerary];
        newItinerary[dayIndex].activities[actIndex][field] = value;
        setItinerary(newItinerary);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('type', 'paquete');
        formData.append('description', form.description);
        formData.append('price', parseFloat(form.price) || 0);
        if (form.old_price) {
            formData.append('old_price', parseFloat(form.old_price));
        } else {
            formData.append('old_price', ''); // Send empty if cleared
        }
        formData.append('capacity', 15); // Default capacity for now if removed from UI
        formData.append('duration', parseInt(form.duration) || 1);
        formData.append('itinerary', JSON.stringify(itinerary));
        
        if (imageFile instanceof File) {
            formData.append('image_360', imageFile);
        } else if (form.image_360_url && typeof form.image_360_url === 'string' && !form.image_360_url.includes('/storage/')) {
            formData.append('image_360_url', form.image_360_url);
        }

        if (isEdit) {
            formData.append('_method', 'PUT');
        }

        try {
            await api.get('/sanctum/csrf-cookie');
            const config = { headers: { 'Content-Type': undefined } };

            if (isEdit) {
                await api.post(`/api/admin/services/${id}`, formData, config);
            } else {
                await api.post('/api/admin/services', formData, config);
            }
            navigate('/admin/tourist-packages');
        } catch (err) {
            console.error(err);
            if (err.response?.status === 422) {
                setError('Error de validación. Revisa los campos requeridos.');
            } else {
                setError('Error al guardar el paquete.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Cargando...</div>;
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-surface pb-12">
            {/* Header */}
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-[#43474e] text-sm mb-2">
                        <Link to="/admin/tourist-packages" className="hover:text-[#000613] transition-colors">Paquetes Turísticos</Link>
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        <span className="text-[#1a1c1e]">{isEdit ? 'Edición' : 'Nuevo'}</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#000613]">
                        {isEdit ? `Editar Paquete: ${form.title}` : 'Crear Nuevo Paquete'}
                    </h1>
                </div>
            </header>

            {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
                {/* Left Column: Datos Generales */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="bg-white rounded-xl border border-[#c4c6cf] p-6 shadow-sm">
                        <h2 className="text-[20px] leading-tight font-semibold mb-6 flex items-center gap-2 border-b border-[#c4c6cf] pb-4">
                            <span className="material-symbols-outlined text-[#000613]">info</span>
                            Información General
                        </h2>
                        
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-[#43474e] mb-1">Nombre del Paquete</label>
                                <input name="title" value={form.title} onChange={handleFormChange} required
                                    className="w-full bg-[#faf9fc] border border-[#c4c6cf] rounded-lg px-4 py-3 focus:outline-none focus:border-[#000613] focus:ring-1 focus:ring-[#000613] transition-all text-[#1a1c1e] placeholder-[#74777f]" 
                                    placeholder="Ej. Ruta de la Independencia" type="text" />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[#43474e] mb-1">Precio Final (S/)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#43474e]">S/</span>
                                        <input name="price" value={form.price} onChange={handleFormChange} required min="0" step="0.01"
                                            className="w-full bg-[#faf9fc] border border-[#c4c6cf] rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-[#000613] focus:ring-1 focus:ring-[#000613] transition-all text-[#1a1c1e]" 
                                            type="number" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#43474e] mb-1">Precio Normal (Opc)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#43474e]">S/</span>
                                        <input name="old_price" value={form.old_price} onChange={handleFormChange} min="0" step="0.01"
                                            className="w-full bg-[#faf9fc] border border-[#c4c6cf] rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-[#000613] focus:ring-1 focus:ring-[#000613] transition-all text-[#1a1c1e]" 
                                            type="number" placeholder="Ej. 120" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#43474e] mb-1">Duración (Días)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#43474e] text-[20px]">calendar_today</span>
                                        <input name="duration" value={form.duration} onChange={handleFormChange} required min="1"
                                            className="w-full bg-[#faf9fc] border border-[#c4c6cf] rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-[#000613] focus:ring-1 focus:ring-[#000613] transition-all text-[#1a1c1e]" 
                                            type="number" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#43474e] mb-1">Categoría</label>
                                <div className="relative">
                                    <select name="category" value={form.category} onChange={handleFormChange}
                                        className="w-full bg-[#faf9fc] border border-[#c4c6cf] rounded-lg pl-4 pr-10 py-3 appearance-none focus:outline-none focus:border-[#000613] focus:ring-1 focus:ring-[#000613] transition-all text-[#1a1c1e]">
                                        <option>Aventura</option>
                                        <option>Cultura e Historia</option>
                                        <option>Naturaleza</option>
                                        <option>Gastronómico</option>
                                    </select>
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-[#43474e]">expand_more</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#43474e] mb-1">Descripción Corta</label>
                                <textarea name="description" value={form.description} onChange={handleFormChange} required
                                    className="w-full bg-[#faf9fc] border border-[#c4c6cf] rounded-lg px-4 py-3 focus:outline-none focus:border-[#000613] focus:ring-1 focus:ring-[#000613] transition-all text-[#1a1c1e] resize-none" rows="4"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#43474e] mb-2">Imagen Principal</label>
                                <label className="border-2 border-dashed border-[#c4c6cf] rounded-xl h-40 bg-[#faf9fc] flex flex-col items-center justify-center text-[#43474e] hover:bg-[#f4f3f6] transition-colors cursor-pointer group relative overflow-hidden">
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                    {previewUrl && (
                                        <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-20 transition-opacity" style={{ backgroundImage: `url(${previewUrl})` }}></div>
                                    )}
                                    <div className="relative z-10 flex flex-col items-center">
                                        <span className="material-symbols-outlined text-[32px] mb-2 group-hover:text-[#FF881B] transition-colors">add_a_photo</span>
                                        <span className="text-sm font-semibold group-hover:text-[#FF881B]">Cambiar Imagen</span>
                                        <span className="text-xs opacity-70 mt-1">JPG, PNG max 5MB</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Itinerario */}
                <div className="lg:col-span-7 flex flex-col">
                    <div className="bg-white rounded-xl border border-[#c4c6cf] flex-grow shadow-sm flex flex-col min-h-[600px]">
                        <div className="p-6 border-b border-[#c4c6cf] flex items-center justify-between">
                            <h2 className="text-[20px] leading-tight font-semibold flex items-center gap-2 text-[#000613]">
                                <span className="material-symbols-outlined">map</span>
                                Constructor de Itinerario
                            </h2>
                            <button type="button" onClick={addDay} className="text-[#FF881B] font-semibold text-sm flex items-center gap-1 hover:opacity-80 transition-opacity">
                                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                                Añadir Día
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-grow">
                            {itinerary.map((day, dIdx) => (
                                <div key={dIdx} className="mb-8">
                                    <div className="flex items-center justify-between mb-4 bg-[#f4f3f6] p-3 rounded-lg border border-[#c4c6cf]">
                                        <div className="flex items-center gap-3 flex-grow">
                                            <div className="bg-[#FF881B] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm min-w-[2rem]">D{dIdx + 1}</div>
                                            <input className="bg-transparent border-none focus:ring-0 text-[18px] text-[#1a1c1e] font-semibold p-0 w-full" 
                                                type="text" value={day.title} onChange={(e) => updateDayTitle(dIdx, e.target.value)} required />
                                        </div>
                                        <button type="button" onClick={() => removeDay(dIdx)} className="text-[#43474e] hover:text-[#ba1a1a] transition-colors p-1 rounded-md hover:bg-[#e3e2e5] ml-2">
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </div>

                                    <div className="pl-4 relative">
                                        <style dangerouslySetInnerHTML={{__html: `
                                            .stepper-item:not(:last-child) .stepper-line {
                                                position: absolute; left: 15px; top: 32px; bottom: 0; width: 2px; background-color: #c4c6cf;
                                            }
                                        `}} />
                                        
                                        {day.activities.map((act, aIdx) => (
                                            <div key={aIdx} className="relative pl-10 pb-6 stepper-item group">
                                                <div className="stepper-line"></div>
                                                <div className="absolute left-0 top-1 w-8 h-8 bg-[#faf9fc] border-2 border-[#c4c6cf] rounded-full flex items-center justify-center z-10 group-focus-within:border-[#FF881B] transition-colors">
                                                    <span className="material-symbols-outlined text-[16px] text-[#c4c6cf] group-focus-within:text-[#FF881B]">schedule</span>
                                                </div>
                                                
                                                <div className="bg-[#faf9fc] border border-[#c4c6cf] rounded-lg p-4 shadow-sm group-focus-within:border-[#FF881B] group-focus-within:ring-1 group-focus-within:ring-[#FF881B] transition-all relative">
                                                    <button type="button" onClick={() => removeActivity(dIdx, aIdx)} className="absolute top-2 right-2 text-[#74777f] hover:text-[#ba1a1a]">
                                                        <span className="material-symbols-outlined text-[16px]">close</span>
                                                    </button>
                                                    <div className="flex gap-4">
                                                        <div className="w-1/4 max-w-[100px]">
                                                            <input className="w-full bg-white border border-[#c4c6cf] rounded-md px-3 py-2 text-sm text-[#1a1c1e] focus:outline-none focus:border-[#FF881B]" 
                                                                type="time" value={act.time} onChange={(e) => updateActivity(dIdx, aIdx, 'time', e.target.value)} required />
                                                        </div>
                                                        <div className="flex-grow">
                                                            <input className="w-full bg-transparent border-none border-b border-[#c4c6cf] rounded-none px-0 py-2 text-[#1a1c1e] focus:ring-0 focus:border-[#FF881B] mb-2 font-semibold" 
                                                                type="text" value={act.title} onChange={(e) => updateActivity(dIdx, aIdx, 'title', e.target.value)} required placeholder="Título de la actividad" />
                                                            <textarea className="w-full bg-white border border-[#c4c6cf] rounded-md px-3 py-2 text-sm text-[#43474e] focus:outline-none focus:border-[#FF881B] resize-none mt-2" 
                                                                placeholder="Detalles de la actividad..." rows="2" value={act.description} onChange={(e) => updateActivity(dIdx, aIdx, 'description', e.target.value)} required></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        <button type="button" onClick={(e) => addActivity(dIdx, e)} className="ml-10 flex items-center gap-2 text-[#43474e] text-sm font-semibold hover:text-[#FF881B] transition-colors py-2 mt-2">
                                            <span className="material-symbols-outlined text-[18px]">add</span>
                                            Añadir Actividad
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="p-6 border-t border-[#c4c6cf] bg-white mt-auto flex justify-end gap-3 rounded-b-xl">
                            <Link to="/admin/tourist-packages" className="px-6 py-2 bg-[#f4f3f6] text-[#43474e] rounded-lg font-semibold hover:bg-[#e3e2e5] transition-colors">
                                Cancelar
                            </Link>
                            <button type="submit" disabled={submitting} className="px-6 py-2 bg-[#FF881B] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm disabled:opacity-50">
                                {submitting ? 'Guardando...' : 'Guardar'}
                                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminEditTouristPackage;
