import React from 'react';
import { Link } from 'react-router-dom';

const TopNavBar = () => {
    return (
        <header className="w-full sticky top-0 z-50 bg-surface-container-lowest border-b border-outline-variant">
            <nav className="container mx-auto max-w-[1320px] flex justify-between items-center h-20 px-gutter">
                <Link className="font-display-lg md:text-display-lg text-display-lg-mobile text-primary tracking-tight" to="/">
                    DMGOTRAVEL
                </Link>
                
                <ul className="hidden md:flex items-center gap-8 font-body-md text-body-md">
                    <li>
                        <a className="text-primary font-bold border-b-2 border-secondary pb-1 block hover:text-secondary transition-colors" href="#inicio">
                            Inicio
                        </a>
                    </li>
                    <li>
                        <a className="text-on-surface-variant hover:text-secondary transition-colors block pb-1 border-b-2 border-transparent" href="#destinos">
                            Destinos
                        </a>
                    </li>
                    <li>
                        <a className="text-on-surface-variant hover:text-secondary transition-colors block pb-1 border-b-2 border-transparent" href="#nosotros">
                            Nosotros
                        </a>
                    </li>
                    <li>
                        <a className="text-on-surface-variant hover:text-secondary transition-colors block pb-1 border-b-2 border-transparent" href="#contacto">
                            Contacto
                        </a>
                    </li>
                </ul>
                
                <div className="hidden md:block">
                    <Link to="/login" className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded hover:bg-primary-container hover:text-on-primary-container transition-colors scale-95 active:scale-90">
                        Reservar ahora
                    </Link>
                </div>
                
                <button className="md:hidden text-primary">
                    <span className="material-symbols-outlined text-3xl">menu</span>
                </button>
            </nav>
        </header>
    );
};

export default TopNavBar;
