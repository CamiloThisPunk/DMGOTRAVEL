import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full py-stack-lg px-gutter flex flex-col items-center gap-stack-md bg-primary text-on-primary font-body-md text-body-md">
            <div className="font-headline-sm text-headline-sm text-on-primary tracking-tight">
                DMGOTRAVEL
            </div>
            
            <ul className="flex flex-wrap justify-center gap-6 mt-4">
                <li>
                    <a className="text-on-primary-container hover:text-secondary-fixed-dim transition-colors opacity-80 hover:opacity-100 block" href="#">
                        Facebook
                    </a>
                </li>
                <li>
                    <a className="text-on-primary-container hover:text-secondary-fixed-dim transition-colors opacity-80 hover:opacity-100 block" href="#">
                        Instagram
                    </a>
                </li>
                <li>
                    <a className="text-on-primary-container hover:text-secondary-fixed-dim transition-colors opacity-80 hover:opacity-100 block" href="#">
                        WhatsApp
                    </a>
                </li>
                <li>
                    <a className="text-on-primary-container hover:text-secondary-fixed-dim transition-colors opacity-80 hover:opacity-100 block" href="#">
                        Términos y Condiciones
                    </a>
                </li>
            </ul>
            
            <div className="mt-4 text-center text-sm opacity-80">
                © 2026 DMGOTRAVEL. Explorando el corazón de los Andes.
            </div>
        </footer>
    );
};

export default Footer;
