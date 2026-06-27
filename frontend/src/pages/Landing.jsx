import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="bg-background text-on-background font-body-md text-body-md antialiased">
            {/* TopNavBar */}
            <header className="w-full sticky top-0 z-50 bg-surface-container-lowest border-b border-outline-variant">
                <nav className="container mx-auto max-w-[1320px] flex justify-between items-center h-20 px-gutter">
                    <Link to="/" className="font-display-lg md:text-display-lg text-display-lg-mobile text-primary tracking-tight">
                        DMGOTRAVEL
                    </Link>
                    <ul className="hidden md:flex items-center gap-8 font-body-md text-body-md">
                        <li><a className="text-primary font-bold border-b-2 border-secondary pb-1 block hover:text-secondary transition-colors" href="#inicio">Inicio</a></li>
                        <li><a className="text-on-surface-variant hover:text-secondary transition-colors block pb-1 border-b-2 border-transparent" href="#destinos">Destinos</a></li>
                        <li><a className="text-on-surface-variant hover:text-secondary transition-colors block pb-1 border-b-2 border-transparent" href="#nosotros">Nosotros</a></li>
                        <li><a className="text-on-surface-variant hover:text-secondary transition-colors block pb-1 border-b-2 border-transparent" href="#contacto">Contacto</a></li>
                    </ul>
                    <div className="hidden md:block">
                        <Link to="/auth" className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded hover:bg-primary-container hover:text-on-primary-container transition-colors">
                            Reservar ahora
                        </Link>
                    </div>
                    <button className="md:hidden text-primary">
                        <span className="material-symbols-outlined text-3xl">menu</span>
                    </button>
                </nav>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative w-full h-[819px] min-h-[600px] flex items-center justify-center overflow-hidden" id="inicio">
                    <div className="absolute inset-0 z-0">
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDD_V6y9OlnL1qSmdBpUSbPE79P1JJs937IgKkdGtg1OTRRz5UKBCSyDEVWC7594oYnHMRHzFFrqjnDsWmIYM8SHibpBoRTjqd7eyaTlrtJaNOtUHHcQrNBwtutm-M2HVtdCKdothcGmeyvXgHeZFoEv7HfTtLYWOp3vtWRl1lKqExM5lRfHUsEk1RlSv5nJVJ2pgnWi2w86IfTP7lh6YtueNFAZ7OVjAZIXvAwn6dAX5UFoSX55ngzpcy9K960u3lGvwFUZFEssxs')" }}></div>
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                            {/* Card 1 */}
                            <article className="tour-card bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden flex flex-col h-full">
                                <div className="h-64 overflow-hidden relative">
                                    <img className="w-full h-full object-cover" alt="Ciudadela Inca de Vilcashuamán" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJGrL6LQf6tw1ldrqGFXEK-hIY_1Zb-JjQ_AjvN_dp0NXFt1Hpbb5cXnJkIHZPzB0ph5NZ-KTV4sPHLUmtYIylevCu1YmThbwMeUzYVTQ0huAJClWwV92YmcZFif_mquZ_VVszredxUi55jTIrmh9FLls-E43GLiZllixrbLh9cPO7yGYLHv-U7CVMlK278HzNNqcTA02F4XAS2iVNKwqPKxf7KKLTmrcVvgKo8RNeaRfkAoqgh-aGFKQtLZpLX6HzvpkkNf4ua5g" />
                                    <div className="absolute top-4 left-4 bg-surface-container-lowest text-primary font-label-md text-label-md px-3 py-1 rounded shadow-sm flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">account_balance</span> Cultura
                                    </div>
                                </div>
                                <div className="p-6 flex-grow flex flex-col">
                                    <h3 className="font-headline-sm text-headline-sm text-primary mb-2">Ciudadela Inca de Vilcashuamán</h3>
                                    <p className="text-on-surface-variant flex-grow mb-4">Explora la majestuosidad arquitectónica del antiguo imperio. Un viaje profundo a nuestras raíces andinas en la región de Ayacucho.</p>
                                    <div className="flex justify-between items-center mt-auto border-t border-outline-variant pt-4">
                                        <span className="bg-surface-container text-primary px-3 py-1 rounded font-bold text-sm">Desde S/ 120</span>
                                        <button className="text-secondary font-label-md text-label-md hover:text-secondary-container transition-colors flex items-center gap-1">
                                            Detalles <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            </article>
                            {/* Card 2 */}
                            <article className="tour-card bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden flex flex-col h-full">
                                <div className="h-64 overflow-hidden relative">
                                    <img className="w-full h-full object-cover" alt="Valle Esmeralda de Huanta" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmrkMsUShFOS-8VPZMsEeTyGwTXb0oAWz9F7J-MaCRalseeVvhFtUR1W6iCeqjjlrp4rB-J3IjvdlB8C_uKFRKmJP3ald_WebMmyKzSe2Bpiip-t8L6iG6BSMW8qcdI7d89YEP2iX3w8nh145x8WiFasQeHdbMH5cKv7XNjtBJFKrs9XWcIFOHt0rAoKXqu_wi7c2wurUCEGgpVUAMpGogt-1m_6aF_Xf7GQNL2vBQBb0QUX9T0zy2GWo3nASUlTM4VUYYNblQQBs" />
                                    <div className="absolute top-4 left-4 bg-surface-container-lowest text-primary font-label-md text-label-md px-3 py-1 rounded shadow-sm flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">local_florist</span> Naturaleza
                                    </div>
                                </div>
                                <div className="p-6 flex-grow flex flex-col">
                                    <h3 className="font-headline-sm text-headline-sm text-primary mb-2">Valle Esmeralda de Huanta</h3>
                                    <p className="text-on-surface-variant flex-grow mb-4">Disfruta del clima cálido y paisajes vibrantes. Ideal para turismo vivencial y degustación de licores locales en Huanta.</p>
                                    <div className="flex justify-between items-center mt-auto border-t border-outline-variant pt-4">
                                        <span className="bg-surface-container text-primary px-3 py-1 rounded font-bold text-sm">Desde S/ 85</span>
                                        <button className="text-secondary font-label-md text-label-md hover:text-secondary-container transition-colors flex items-center gap-1">
                                            Detalles <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            </article>
                            {/* Card 3 */}
                            <article className="tour-card bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden flex flex-col h-full">
                                <div className="h-64 overflow-hidden relative">
                                    <img className="w-full h-full object-cover" alt="Hiking en las Aguas de Millpu" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnR0fCn5KtabHFx4ML6nm4f5Hr0YgqQB4_6_jZX276zc7N2W-8kqZApN_6wRldryV-_PcSzuCbRqx87M8WoZqBc2tE0UwCY7glfLS6JydgEfC6vujvir7RIQ-wNkwA0tNsvFw67QICxLjwlgU-A0UW6mpqeqVnMmdeRKEYg9ejcmyQX_vit7wkhRmEgUtVck4m-giu-MH_CqObAx5XJOPLAipBkp6upCaVDi9q1Aj4OAHrGmNSgi9YIVIHFYEN0mUpbGj9mZXqz5c" />
                                    <div className="absolute top-4 left-4 bg-surface-container-lowest text-primary font-label-md text-label-md px-3 py-1 rounded shadow-sm flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">hiking</span> Trekking
                                    </div>
                                </div>
                                <div className="p-6 flex-grow flex flex-col">
                                    <h3 className="font-headline-sm text-headline-sm text-primary mb-2">Hiking en las Aguas de Millpu</h3>
                                    <p className="text-on-surface-variant flex-grow mb-4">Caminatas guiadas hacia las impresionantes pozas turquesas escondidas en el cañón. Naturaleza pura y senderismo seguro en Ayacucho.</p>
                                    <div className="flex justify-between items-center mt-auto border-t border-outline-variant pt-4">
                                        <span className="bg-surface-container text-primary px-3 py-1 rounded font-bold text-sm">Desde S/ 60</span>
                                        <button className="text-secondary font-label-md text-label-md hover:text-secondary-container transition-colors flex items-center gap-1">
                                            Detalles <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                </section>

                {/* About Us Section */}
                <section className="py-section-padding-mobile md:py-section-padding-desktop bg-surface-container-lowest border-y border-outline-variant" id="nosotros">
                    <div className="container mx-auto max-w-[1320px] px-gutter">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                            <div className="md:col-span-6 order-2 md:order-1">
                                <h2 className="font-headline-md text-headline-md text-primary mb-6">Expertos en Turismo Local</h2>
                                <p className="text-on-surface-variant mb-4">
                                    En DMGOTRAVEL, no solo organizamos viajes; creamos conexiones auténticas con el corazón de los Andes. Nuestro equipo está conformado por guías locales apasionados y certificados, listos para mostrarte los secretos mejor guardados de Ayacucho.
                                </p>
                                <p className="text-on-surface-variant mb-6">
                                    Combinamos la rica herencia histórica de la región con la emoción de la aventura moderna. Desde rutas arqueológicas en Quinua hasta deportes extremos, garantizamos una experiencia profesional, segura e inolvidable.
                                </p>
                                <ul className="space-y-3 mb-8">
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
                                <button className="border border-primary text-primary px-6 py-3 rounded font-label-md hover:bg-primary hover:text-on-primary transition-colors">
                                    Conoce al Equipo
                                </button>
                            </div>
                            <div className="md:col-span-6 order-1 md:order-2 h-[500px] rounded-lg overflow-hidden relative shadow-sm border border-outline-variant">
                                <img className="w-full h-full object-cover" alt="Guía turístico DMGOTRAVEL" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcasfvf2ILNz6EsZ9NHP9-UlOQL0YABzRfzAUXg-cf6EqPeiLeJIP2HV7lpacSITSGHbmZ1pvMA80vSFwP0a8M75s7tAeTcxr7T8Liov4-93Z3tVW8GwDv40s6iYqL8V6WVXtSc-uoOfej7SIjyQJuY0VyVk-QLSBkr5-5jxU86p18JFtdwfRqeLuSv9iOhm3JgsEIxmhxrYukq71_VB0J4QKHvXR4f1TH8VbKYGYpHC4-um-RvcsO_8Kn3tt5b7js2PvzHL3Nk-0" />
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
                <div className="mt-4 text-center text-sm opacity-80">
                    © 2024 DMGOTRAVEL. Explorando el corazón de los Andes.
                </div>
            </footer>
        </div>
    );
};

export default Landing;
