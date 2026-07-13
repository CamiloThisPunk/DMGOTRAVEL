import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const ClientTouristPackageCheckout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    // From previous page
    const state = location.state || {};
    const pkg = state.pkg;
    const initialGuests = state.guests || 1;
    const initialDate = state.date || '';

    // Form state
    const [guests, setGuests] = useState(initialGuests);
    const [date, setDate] = useState(initialDate);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        message: ''
    });
    const [voucherFile, setVoucherFile] = useState(null);
    const [voucherPreview, setVoucherPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (!pkg) {
            navigate(`/client/tourist-packages/${id}`);
        }
    }, [pkg, id, navigate]);

    if (!pkg) return null;

    const totalPrice = parseFloat(pkg.price) * guests;
    const defaultImage = "/images/demo-tour-detail.jpg";
    const bgImage = pkg.image_360_url || defaultImage;

    const handleVoucherChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('El archivo es demasiado grande. Máximo 5MB.');
                return;
            }
            setVoucherFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setVoucherPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const removeVoucher = () => {
        setVoucherFile(null);
        setVoucherPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!voucherFile) {
            alert('Por favor sube tu comprobante de pago de Yape antes de confirmar.');
            return;
        }

        setSubmitting(true);
        try {
            const formPayload = new FormData();
            formPayload.append('service_package_id', pkg.id);
            formPayload.append('reservation_date', date);
            formPayload.append('guests_count', guests);
            if (formData.message) {
                formPayload.append('special_requests', formData.message);
            }
            formPayload.append('payment_voucher', voucherFile);

            await api.post('/api/client/reservations', formPayload);
            setSuccessMessage('¡Reserva confirmada exitosamente! Te hemos enviado los detalles a tu correo.');
            setTimeout(() => {
                navigate('/client/dashboard');
            }, 3000);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error al procesar la reserva');
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-[#000613] mb-2">Completar Reserva</h1>
                    <p className="text-[#43474e] text-lg">Estás a un paso de confirmar tu aventura en DMGOTRAVEL.</p>
                </div>

                <div className="flex flex-col-reverse lg:flex-row gap-8">
                    
                    {/* Left Column (Form) */}
                    <div className="flex-1 space-y-8">

                        {/* Section 1: Personal Data */}
                        <div className="bg-white rounded-2xl p-8 border border-[#c4c6cf] shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-8 h-8 rounded-full bg-[#000613] text-white flex items-center justify-center text-sm font-bold">1</div>
                                <h2 className="text-2xl font-bold text-[#000613]">Tus Datos</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-[#43474e] uppercase tracking-wider mb-2">Nombre completo</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f]">person</span>
                                        <input 
                                            type="text" required
                                            className="w-full pl-10 pr-4 py-3 border border-[#c4c6cf] rounded-xl focus:border-[#000613] focus:ring-1 focus:ring-[#000613] outline-none"
                                            placeholder="Ej. Juan Pérez"
                                            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#43474e] uppercase tracking-wider mb-2">Correo electrónico</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f]">mail</span>
                                        <input 
                                            type="email" required
                                            className="w-full pl-10 pr-4 py-3 border border-[#c4c6cf] rounded-xl focus:border-[#000613] focus:ring-1 focus:ring-[#000613] outline-none"
                                            placeholder="tu@email.com"
                                            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#43474e] uppercase tracking-wider mb-2">WhatsApp</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f]">phone_iphone</span>
                                        <input 
                                            type="tel" required
                                            className="w-full pl-10 pr-4 py-3 border border-[#c4c6cf] rounded-xl focus:border-[#000613] focus:ring-1 focus:ring-[#000613] outline-none"
                                            placeholder="+51 987 654 321"
                                            value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#43474e] uppercase tracking-wider mb-2">Fecha preferida</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f]">calendar_month</span>
                                        <input 
                                            type="date" required min={new Date().toISOString().split('T')[0]}
                                            className="w-full pl-10 pr-4 py-3 border border-[#c4c6cf] rounded-xl focus:border-[#000613] focus:ring-1 focus:ring-[#000613] outline-none"
                                            value={date} onChange={e => setDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-[#43474e] uppercase tracking-wider mb-2">Número de personas</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f]">group</span>
                                        <select 
                                            className="w-full pl-10 pr-4 py-3 border border-[#c4c6cf] rounded-xl focus:border-[#000613] focus:ring-1 focus:ring-[#000613] outline-none appearance-none"
                                            value={guests} onChange={e => setGuests(Number(e.target.value))}
                                        >
                                            {[...Array(pkg.capacity)].map((_, i) => (
                                                <option key={i+1} value={i+1}>{i+1} Persona{i+1 > 1 ? 's' : ''}</option>
                                            ))}
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#74777f] pointer-events-none">expand_more</span>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-[#43474e] uppercase tracking-wider mb-2">Mensaje o requerimientos especiales (Opcional)</label>
                                    <textarea 
                                        rows="3"
                                        className="w-full p-4 border border-[#c4c6cf] rounded-xl focus:border-[#000613] focus:ring-1 focus:ring-[#000613] outline-none resize-none"
                                        placeholder="Indícanos si tienes alguna alergia alimentaria, requerimiento de movilidad, etc."
                                        value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Yape Payment */}
                        <div className="bg-white rounded-2xl p-8 border border-[#c4c6cf] shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-8 h-8 rounded-full bg-[#000613] text-white flex items-center justify-center text-sm font-bold">2</div>
                                <h2 className="text-2xl font-bold text-[#000613]">Pago con Yape</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* QR Code */}
                                <div className="flex flex-col items-center">
                                    <div className="bg-gradient-to-br from-[#742284] to-[#9b30b8] rounded-2xl p-6 w-full max-w-[280px] shadow-lg shadow-purple-200">
                                        <div className="text-center mb-4">
                                            <span className="text-white font-bold text-2xl tracking-wide">yape</span>
                                        </div>
                                        <div className="bg-white rounded-xl p-4 mb-4">
                                            <img 
                                                src="/images/yape-qr.png" 
                                                alt="QR de Yape - DMGOTRAVEL" 
                                                className="w-full h-auto rounded-lg"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-white font-bold text-sm">DMGOTRAVEL</p>
                                            <p className="text-white/80 text-xs">+51 999 888 777</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <p className="text-[#43474e] text-sm font-medium">Escanea el QR con tu app de Yape</p>
                                        <p className="text-[#964900] font-bold text-lg mt-1">Monto: S/ {totalPrice.toFixed(2)}</p>
                                    </div>
                                </div>

                                {/* Upload Voucher */}
                                <div className="flex flex-col">
                                    <div className="mb-4">
                                        <h3 className="text-sm font-bold text-[#000613] uppercase tracking-wider mb-2">Pasos para pagar</h3>
                                        <ol className="space-y-3 text-sm text-[#43474e]">
                                            <li className="flex gap-3">
                                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#742284]/10 text-[#742284] flex items-center justify-center text-xs font-bold">1</span>
                                                <span>Abre tu app de <strong className="text-[#742284]">Yape</strong> y escanea el código QR</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#742284]/10 text-[#742284] flex items-center justify-center text-xs font-bold">2</span>
                                                <span>Ingresa el monto de <strong className="text-[#964900]">S/ {totalPrice.toFixed(2)}</strong></span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#742284]/10 text-[#742284] flex items-center justify-center text-xs font-bold">3</span>
                                                <span>Toma una <strong>captura de pantalla</strong> del voucher</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#742284]/10 text-[#742284] flex items-center justify-center text-xs font-bold">4</span>
                                                <span>Sube tu comprobante aquí abajo</span>
                                            </li>
                                        </ol>
                                    </div>

                                    <label className="block text-xs font-bold text-[#43474e] uppercase tracking-wider mb-2">
                                        Comprobante de pago <span className="text-red-500">*</span>
                                    </label>

                                    {!voucherPreview ? (
                                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-[#c4c6cf] rounded-xl cursor-pointer hover:border-[#742284] hover:bg-[#742284]/5 transition-all group">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <span className="material-symbols-outlined text-4xl text-[#74777f] group-hover:text-[#742284] mb-2 transition-colors">cloud_upload</span>
                                                <p className="text-sm text-[#43474e] group-hover:text-[#742284] transition-colors">
                                                    <strong>Haz clic para subir</strong> tu voucher
                                                </p>
                                                <p className="text-xs text-[#74777f] mt-1">PNG, JPG o WebP (máx. 5MB)</p>
                                            </div>
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={handleVoucherChange}
                                            />
                                        </label>
                                    ) : (
                                        <div className="relative border-2 border-green-300 rounded-xl overflow-hidden bg-green-50">
                                            <img 
                                                src={voucherPreview} 
                                                alt="Comprobante de pago" 
                                                className="w-full h-48 object-contain p-2"
                                            />
                                            <div className="absolute top-2 right-2 flex gap-2">
                                                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-lg font-bold flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                                    Subido
                                                </span>
                                                <button 
                                                    type="button"
                                                    onClick={removeVoucher}
                                                    className="bg-red-500 text-white w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-sm">close</span>
                                                </button>
                                            </div>
                                            <div className="px-3 py-2 bg-green-100 text-green-800 text-xs font-medium flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">attach_file</span>
                                                {voucherFile?.name}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Section */}
                        <div className="bg-white rounded-2xl p-8 border border-[#c4c6cf] shadow-sm">
                            <form onSubmit={handleSubmit}>
                                {successMessage && (
                                    <div className="p-4 bg-green-50 text-green-800 rounded-xl border border-green-200 flex items-center gap-2 mb-6">
                                        <span className="material-symbols-outlined">check_circle</span>
                                        {successMessage}
                                    </div>
                                )}

                                <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                                        <span className="material-symbols-outlined text-xl">verified_user</span>
                                        Pago Seguro y Encriptado
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={submitting || successMessage}
                                        className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold text-lg transition-colors ${
                                            submitting || successMessage 
                                            ? 'bg-[#c4c6cf] text-[#43474e] cursor-not-allowed'
                                            : 'bg-[#964900] text-white hover:bg-[#7a3b00] shadow-lg shadow-[#964900]/20'
                                        }`}
                                    >
                                        {submitting ? 'Procesando...' : 'Confirmar y Pagar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column (Summary) */}
                    <div className="w-full lg:w-[400px]">
                        <div className="bg-[#f2f4f7] rounded-2xl p-6 border border-[#c4c6cf] sticky top-[100px]">
                            <div className="relative h-48 rounded-xl overflow-hidden mb-6">
                                <img src={bgImage} alt={pkg.title} onError={(e) => { e.target.onerror = null; e.target.src = '/images/demo-tour-detail.jpg'; }} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-4 left-4">
                                    <span className="text-white text-xs font-bold bg-black/30 px-2 py-1 rounded backdrop-blur-sm mb-2 inline-block">{pkg.duration} Días</span>
                                    <h3 className="text-white font-bold text-xl leading-tight">{pkg.title}</h3>
                                </div>
                            </div>

                            <h4 className="text-xs font-bold text-[#74777f] uppercase tracking-wider mb-4">Resumen de tu selección</h4>
                            
                            <div className="space-y-4 mb-6 pb-6 border-b border-[#c4c6cf]">
                                <div className="flex gap-3">
                                    <span className="material-symbols-outlined text-[#964900]">check_circle</span>
                                    <div>
                                        <p className="font-bold text-[#000613] text-sm">Guía Oficial de Turismo</p>
                                        <p className="text-xs text-[#74777f]">Asistencia permanente</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="material-symbols-outlined text-[#964900]">check_circle</span>
                                    <div>
                                        <p className="font-bold text-[#000613] text-sm">Movilidad Turística</p>
                                        <p className="text-xs text-[#74777f]">Traslados incluidos</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="material-symbols-outlined text-[#964900]">check_circle</span>
                                    <div>
                                        <p className="font-bold text-[#000613] text-sm">Tickets de Ingreso</p>
                                        <p className="text-xs text-[#74777f]">A todos los atractivos</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-[#43474e] text-sm">
                                    <span>Precio por persona</span>
                                    <span>S/ {parseFloat(pkg.price).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[#43474e] text-sm">
                                    <span>Cantidad</span>
                                    <span>x {guests}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-6 border-t border-[#c4c6cf]">
                                <span className="text-lg font-bold text-[#000613]">Total</span>
                                <span className="text-2xl font-bold text-[#964900]">S/ {totalPrice.toFixed(2)}</span>
                            </div>

                            {/* Payment method indicator */}
                            <div className="mt-6 pt-4 border-t border-[#c4c6cf]">
                                <div className="flex items-center gap-3 bg-[#742284]/10 rounded-xl p-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#742284] flex items-center justify-center">
                                        <span className="text-white font-bold text-xs">Y</span>
                                    </div>
                                    <div>
                                        <p className="text-[#742284] font-bold text-sm">Pago con Yape</p>
                                        <p className="text-[#74777f] text-xs">Transferencia inmediata</p>
                                    </div>
                                    {voucherFile && (
                                        <span className="material-symbols-outlined text-green-500 ml-auto">check_circle</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ClientTouristPackageCheckout;
