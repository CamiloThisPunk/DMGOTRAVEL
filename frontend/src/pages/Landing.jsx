import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Landing = () => {
    const { user } = useAuth();
    const [services, setServices] = useState([]);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('inicio');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const [resServices, resPackages] = await Promise.all([
                    api.get('/api/services?type=servicio'),
                    api.get('/api/services?type=paquete')
                ]);
                setServices(resServices.data?.data || resServices.data || []);
                setPackages(resPackages.data?.data || resPackages.data || []);
            } catch (error) {
                console.error("Error fetching services", error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();

        const handleScroll = () => {
            const sections = ['inicio', 'destinos', 'paquetes', 'nosotros', 'contacto'];
            let current = 'inicio';

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // Offset by some pixels to trigger slightly before it hits the top
                    if (rect.top <= window.innerHeight / 3) {
                        current = section;
                    }
                }
            }
            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Helper to generate dynamic tags to fix the inconsistency of hardcoded tags
    const getCategory = (title, description) => {
        const text = (title + ' ' + description).toLowerCase();
        if (text.includes('inca') || text.includes('arqueol') || text.includes('hist') || text.includes('wari') || text.includes('museo')) {
            return { name: 'Cultura', icon: 'account_balance' };
        }
        if (text.includes('agua') || text.includes('catarata') || text.includes('bosque') || text.includes('puya') || text.includes('naturaleza')) {
            return { name: 'Naturaleza', icon: 'local_florist' };
        }
        if (text.includes('trekking') || text.includes('caminata') || text.includes('mirador') || text.includes('valle')) {
            return { name: 'Trekking', icon: 'hiking' };
        }
        if (text.includes('extremo') || text.includes('canopy') || text.includes('juego') || text.includes('aventura')) {
            return { name: 'Aventura', icon: 'explore' };
        }
        return { name: 'Destino', icon: 'location_on' };
    };

    const getNavClass = (sectionName) => {
        const baseClass = "transition-colors block pb-1 border-b-2 ";
        if (activeSection === sectionName) {
            return baseClass + "text-secondary border-secondary font-bold";
        }
        return baseClass + "text-on-surface-variant border-transparent hover:text-secondary hover:border-secondary font-normal";
    };

    return (
        <div className="bg-background text-on-background font-body-md text-body-md antialiased">
            {/* TopNavBar */}
            <header className="w-full sticky top-0 z-50 bg-surface-container-lowest border-b border-outline-variant">
                <nav className="container mx-auto max-w-[1320px] flex justify-between items-center h-20 px-gutter">
                    <a href="#inicio" className="font-display-lg md:text-display-lg text-display-lg-mobile text-primary tracking-tight">
                        DMGOTRAVEL
                    </a>
                    <ul className="hidden md:flex items-center gap-8 font-body-md text-body-md">
                        <li><a className={getNavClass('inicio')} href="#inicio">Inicio</a></li>
                        <li><a className={getNavClass('destinos')} href="#destinos">Destinos</a></li>
                        <li><a className={getNavClass('paquetes')} href="#paquetes">Paquetes Turísticos</a></li>
                        <li><a className={getNavClass('nosotros')} href="#nosotros">Nosotros</a></li>
                        <li><a className={getNavClass('contacto')} href="#contacto">Contacto</a></li>
                    </ul>
                    <div className="hidden md:block">
                        {user ? (
                            <Link to={user.roles?.includes('admin') ? '/admin/dashboard' : '/client/catalog'} className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded hover:bg-primary-container hover:text-on-primary-container transition-colors">
                                Ir a mi panel
                            </Link>
                        ) : (
                            <Link to="/auth" className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded hover:bg-primary-container hover:text-on-primary-container transition-colors">
                                Reservar ahora
                            </Link>
                        )}
                    </div>
                    <button className="md:hidden text-primary" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <span className="material-symbols-outlined text-3xl">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                </nav>
                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-surface-container-lowest border-t border-outline-variant py-4 px-gutter shadow-lg absolute w-full">
                        <ul className="flex flex-col gap-4 font-body-md text-body-md">
                            <li><a className={getNavClass('inicio') + " block pb-2"} href="#inicio" onClick={() => setIsMobileMenuOpen(false)}>Inicio</a></li>
                            <li><a className={getNavClass('destinos') + " block pb-2"} href="#destinos" onClick={() => setIsMobileMenuOpen(false)}>Destinos</a></li>
                            <li><a className={getNavClass('paquetes') + " block pb-2"} href="#paquetes" onClick={() => setIsMobileMenuOpen(false)}>Paquetes Turísticos</a></li>
                            <li><a className={getNavClass('nosotros') + " block pb-2"} href="#nosotros" onClick={() => setIsMobileMenuOpen(false)}>Nosotros</a></li>
                            <li><a className={getNavClass('contacto') + " block pb-2"} href="#contacto" onClick={() => setIsMobileMenuOpen(false)}>Contacto</a></li>
                            <li className="pt-2">
                                {user ? (
                                    <Link to={user.roles?.includes('admin') ? '/admin/dashboard' : '/client/catalog'} className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded text-center block w-full hover:bg-primary-container hover:text-on-primary-container transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                        Ir a mi panel
                                    </Link>
                                ) : (
                                    <Link to="/auth" className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded text-center block w-full hover:bg-primary-container hover:text-on-primary-container transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                        Reservar ahora
                                    </Link>
                                )}
                            </li>
                        </ul>
                    </div>
                )}
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative w-full h-[819px] min-h-[600px] flex items-center justify-center overflow-hidden" id="inicio">
                    <div className="absolute inset-0 z-0">
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-landing.jpg')" }}></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent"></div>
                    </div>
                    <div className="relative z-10 container mx-auto max-w-[1320px] px-gutter text-left">
                        <div className="max-w-2xl">
                            <h1 className="font-display-lg md:text-display-lg text-display-lg-mobile text-on-primary mb-stack-md drop-shadow-md">
                                Explora la Magia de Ayacucho
                            </h1>
                            <p className="font-body-lg text-body-lg text-on-primary mb-stack-lg opacity-90">
                                Descubre paisajes inolvidables, aventuras extremas y la calidez de nuestra historia. Tu próximo gran viaje comienza aquí.
                            </p>
                            <a className="inline-flex items-center justify-center bg-secondary-container text-on-secondary-container font-label-md text-label-md px-8 py-4 rounded font-bold shadow-sm hover:bg-secondary hover:text-on-secondary transition-colors" href="#destinos">
                                Ver Tours
                            </a>
                        </div>
                    </div>
                </section>

                {/* Service Catalog Section */}
                <section className="py-section-padding-mobile md:py-section-padding-desktop bg-surface" id="destinos">
                    <div className="container mx-auto max-w-[1320px] px-gutter">
                        <div className="text-center mb-12">
                            <h2 className="font-headline-md text-headline-md text-primary mb-2">Destinos Destacados</h2>
                            <p className="text-on-surface-variant max-w-2xl mx-auto">Experiencias diseñadas para el viajero moderno. Seguridad, profesionalismo y aventura en cada ruta.</p>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
                            </div>
                        ) : services.length === 0 ? (
                            <div className="text-center py-12 text-on-surface-variant">
                                No hay tours disponibles en este momento. Vuelve más tarde.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                                {services.slice(0, 4).map((service) => {
                                    const cat = getCategory(service.title, service.description);
                                    return (
                                        <article key={service.id} className="tour-card bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden flex flex-col h-full hover:border-primary transition-colors hover:shadow-md">
                                            <div className="h-44 overflow-hidden relative">
                                                {service.image_360_url ? (
                                                    <img className="w-full h-full object-cover" alt={service.title} src={service.image_360_url} onError={(e) => { e.target.onerror = null; e.target.src = '/images/demo-tour-1.jpg'; }} />
                                                ) : (
                                                    <div className="w-full h-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                                                        <span className="material-symbols-outlined text-4xl">image</span>
                                                    </div>
                                                )}
                                                <div className="absolute top-3 left-3 bg-surface-container-lowest text-primary font-bold text-[11px] px-2 py-1 rounded shadow-sm flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">{cat.icon}</span> {cat.name}
                                                </div>
                                            </div>
                                            <div className="p-4 flex-grow flex flex-col">
                                                <h3 className="font-bold text-[16px] text-primary mb-1.5 leading-tight" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {service.title}
                                                </h3>
                                                <p className="text-on-surface-variant flex-grow mb-3 text-[12px] leading-snug" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {service.description?.length > 80 ? service.description.substring(0, 80) + '...' : service.description}
                                                </p>
                                                <div className="flex justify-between items-center mt-auto border-t border-outline-variant pt-3 h-[50px]">
                                                    <div className="flex flex-col justify-center h-full">
                                                        {service.old_price && parseFloat(service.old_price) > parseFloat(service.price) ? (
                                                            <>
                                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                                    <span className="text-[10px] text-on-surface-variant line-through">S/ {parseFloat(service.old_price).toFixed(2)}</span>
                                                                    <span className="bg-error text-on-error text-[9px] font-bold px-1 py-0.5 rounded leading-none">-{Math.round((1 - service.price/service.old_price) * 100)}%</span>
                                                                </div>
                                                                <span className="text-primary font-bold text-[14px] whitespace-nowrap leading-none">S/ {parseFloat(service.price).toFixed(2)}</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-primary font-bold text-[14px] whitespace-nowrap leading-none">Desde S/ {parseFloat(service.price).toFixed(2)}</span>
                                                        )}
                                                    </div>
                                                    <Link to={`/auth`} className="text-secondary font-bold text-[13px] hover:text-secondary-container transition-colors flex items-center gap-0.5 shrink-0">
                                                        Reservar <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                {/* Service Catalog Section - Paquetes */}
                <section className="py-section-padding-mobile md:py-section-padding-desktop bg-surface-container-low" id="paquetes">
                    <div className="container mx-auto max-w-[1320px] px-gutter">
                        <div className="text-center mb-12">
                            <h2 className="font-headline-md text-headline-md text-primary mb-2">Paquetes Turísticos</h2>
                            <p className="text-on-surface-variant max-w-2xl mx-auto">Experiencias completas de varios días. Todo organizado para que solo te preocupes por disfrutar.</p>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
                            </div>
                        ) : packages.length === 0 ? (
                            <div className="text-center py-12 text-on-surface-variant">
                                No hay paquetes turísticos disponibles en este momento. Vuelve más tarde.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                                {packages.slice(0, 4).map((service) => {
                                    const cat = getCategory(service.title, service.description);
                                    return (
                                        <article key={service.id} className="tour-card bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden flex flex-col h-full hover:border-primary transition-colors hover:shadow-md">
                                            <div className="h-44 overflow-hidden relative">
                                                {service.image_360_url ? (
                                                    <img className="w-full h-full object-cover" alt={service.title} src={service.image_360_url} onError={(e) => { e.target.onerror = null; e.target.src = '/images/demo-tour-1.jpg'; }} />
                                                ) : (
                                                    <div className="w-full h-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                                                        <span className="material-symbols-outlined text-4xl">image</span>
                                                    </div>
                                                )}
                                                <div className="absolute top-3 left-3 bg-surface-container-lowest text-primary font-bold text-[11px] px-2 py-1 rounded shadow-sm flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">{cat.icon}</span> {cat.name}
                                                </div>
                                            </div>
                                            <div className="p-4 flex-grow flex flex-col">
                                                <h3 className="font-bold text-[16px] text-primary mb-1.5 leading-tight" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {service.title}
                                                </h3>
                                                <p className="text-on-surface-variant flex-grow mb-3 text-[12px] leading-snug" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {service.description?.length > 80 ? service.description.substring(0, 80) + '...' : service.description}
                                                </p>
                                                <div className="flex justify-between items-center mt-auto border-t border-outline-variant pt-3 h-[50px]">
                                                    <div className="flex flex-col justify-center h-full">
                                                        {service.old_price && parseFloat(service.old_price) > parseFloat(service.price) ? (
                                                            <>
                                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                                    <span className="text-[10px] text-on-surface-variant line-through">S/ {parseFloat(service.old_price).toFixed(2)}</span>
                                                                    <span className="bg-error text-on-error text-[9px] font-bold px-1 py-0.5 rounded leading-none">-{Math.round((1 - service.price/service.old_price) * 100)}%</span>
                                                                </div>
                                                                <span className="text-primary font-bold text-[14px] whitespace-nowrap leading-none">S/ {parseFloat(service.price).toFixed(2)}</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-primary font-bold text-[14px] whitespace-nowrap leading-none">Desde S/ {parseFloat(service.price).toFixed(2)}</span>
                                                        )}
                                                    </div>
                                                    <Link to={`/auth`} className="text-secondary font-bold text-[13px] hover:text-secondary-container transition-colors flex items-center gap-0.5 shrink-0">
                                                        Reservar <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                {/* About Us Section */}
                <section className="py-section-padding-mobile md:py-section-padding-desktop bg-surface-container-lowest border-y border-outline-variant min-h-screen scroll-mt-20" id="nosotros">
                    <div className="container mx-auto max-w-[1320px] px-gutter">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                            <div className="md:col-span-6 order-2 md:order-1 text-center">
                                <h2 className="font-headline-md text-headline-md text-primary mb-6">Expertos en Turismo Local</h2>
                                <p className="text-on-surface-variant mb-4">
                                    En DMGOTRAVEL, no solo organizamos viajes; creamos conexiones auténticas con el corazón de los Andes. Nuestro equipo está conformado por guías locales apasionados y certificados, listos para mostrarte los secretos mejor guardados de Ayacucho.
                                </p>
                                <p className="text-on-surface-variant mb-6">
                                    Combinamos la rica herencia histórica de la región con la emoción de la aventura moderna. Desde rutas arqueológicas en Quinua hasta deportes extremos, garantizamos una experiencia profesional, segura e inolvidable.
                                </p>
                                <div className="flex justify-start mb-8">
                                    <ul className="space-y-3 text-left">
                                        <li className="flex items-center gap-3 text-primary">
                                            <span className="material-symbols-outlined text-secondary">check_circle</span>
                                            Guías certificados y bilingües.
                                        </li>
                                        <li className="flex items-center gap-3 text-primary">
                                            <span className="material-symbols-outlined text-secondary">check_circle</span>
                                            Equipamiento de primera calidad.
                                        </li>
                                        <li className="flex items-center gap-3 text-primary">
                                            <span className="material-symbols-outlined text-secondary">check_circle</span>
                                            Compromiso con el turismo sostenible.
                                        </li>
                                    </ul>
                                </div>
                                <button className="border border-primary text-primary px-6 py-3 rounded font-label-md hover:bg-primary hover:text-on-primary transition-colors">
                                    Conoce al Equipo
                                </button>
                            </div>
                            <div className="md:col-span-6 order-1 md:order-2 h-[500px] rounded-lg overflow-hidden relative shadow-sm border border-outline-variant">
                                <img className="w-full h-full object-cover" alt="Guía turístico DMGOTRAVEL" src="/images/guide-landing.jpg" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="py-section-padding-mobile md:py-section-padding-desktop bg-surface-container-low" id="contacto">
                    <div className="container mx-auto max-w-[1320px] px-gutter text-center">
                        <h2 className="font-headline-md text-headline-md text-primary mb-8">¿Listo para tu próxima aventura?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            <div className="bg-surface-container-lowest p-8 rounded border border-outline-variant hover:border-secondary transition-colors">
                                <span className="material-symbols-outlined text-4xl text-secondary mb-4 block">call</span>
                                <h4 className="font-headline-sm text-headline-sm text-primary mb-2">Llámanos</h4>
                                <p className="text-on-surface-variant">+51 987 654 321</p>
                                <p className="text-on-surface-variant text-sm mt-1">Lun - Sab, 8am - 6pm</p>
                            </div>
                            <div className="bg-surface-container-lowest p-8 rounded border border-outline-variant hover:border-secondary transition-colors">
                                <span className="material-symbols-outlined text-4xl text-secondary mb-4 block">mail</span>
                                <h4 className="font-headline-sm text-headline-sm text-primary mb-2">Escríbenos</h4>
                                <p className="text-on-surface-variant">reservas@dmgotravel.pe</p>
                                <p className="text-on-surface-variant text-sm mt-1">Respuesta en 24h</p>
                            </div>
                            <div className="bg-surface-container-lowest p-8 rounded border border-outline-variant hover:border-secondary transition-colors">
                                <span className="material-symbols-outlined text-4xl text-secondary mb-4 block">location_on</span>
                                <h4 className="font-headline-sm text-headline-sm text-primary mb-2">Visítanos</h4>
                                <p className="text-on-surface-variant">Portal Constitución 123</p>
                                <p className="text-on-surface-variant text-sm mt-1">Plaza de Armas, Ayacucho</p>
                            </div>
                        </div>

                        {/* Google Maps */}
                        <div className="mt-12 max-w-5xl mx-auto">
                            <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant shadow-sm">
                                <div className="flex items-center gap-3 px-6 py-4 border-b border-outline-variant">
                                    <span className="material-symbols-outlined text-secondary">map</span>
                                    <h4 className="font-headline-sm text-headline-sm text-primary">Nuestra Ubicación</h4>
                                </div>
                                <iframe
                                    title="Ubicación DM GO TRAVEL - Ayacucho"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.5!2d-74.2277647!3d-13.160722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47ad3b3dd4e015ed%3A0x7c90f9dc139bc293!2sDM%20GO%20TRAVEL!5e0!3m2!1ses!2spe!4v1719000000000"
                                    width="100%"
                                    height="450"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="w-full"
                                ></iframe>
                            </div>
                            <a
                                href="https://www.google.com/maps/place/DM+GO+TRAVEL/@-13.160722,-74.2277647,17z"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 mt-4 text-primary hover:text-secondary transition-colors font-label-md text-label-md"
                            >
                                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                                Ver en Google Maps
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full py-stack-lg px-gutter flex flex-col items-center gap-stack-md bg-primary text-on-primary font-body-md text-body-md">
                <div className="font-headline-sm text-headline-sm text-on-primary tracking-tight">
                    DMGOTRAVEL
                </div>
                <ul className="flex flex-wrap justify-center gap-6 mt-4">
                    <li><a className="text-on-primary-container hover:text-secondary-fixed-dim transition-colors opacity-80 hover:opacity-100 block" href="#">Facebook</a></li>
                    <li><a className="text-on-primary-container hover:text-secondary-fixed-dim transition-colors opacity-80 hover:opacity-100 block" href="#">Instagram</a></li>
                    <li><a className="text-on-primary-container hover:text-secondary-fixed-dim transition-colors opacity-80 hover:opacity-100 block" href="#">WhatsApp</a></li>
                    <li><a className="text-on-primary-container hover:text-secondary-fixed-dim transition-colors opacity-80 hover:opacity-100 block" href="#">Términos y Condiciones</a></li>
                </ul>
                <div className="font-body-md text-body-md text-on-primary opacity-60 text-center">
                    &copy; {new Date().getFullYear()} DMGOTRAVEL. Explorando el corazón de los Andes.
                </div>
            </footer>
        </div>
    );
};

export default Landing;
