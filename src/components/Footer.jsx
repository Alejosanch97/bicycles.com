import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/footer.css';

export const Footer = () => (
    <footer className="main-footer py-5">
        <div className="container">
            <div className="row">
                {/* Columna 1: Redes Sociales */}
                <div className="col-lg-3 col-md-6 mb-4">
                    <h5 className="footer-title">Síguenos en redes:</h5>
                    <div className="social-icons">
                        <a href="https://www.instagram.com//" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <i className="fa-brands fa-instagram"></i>
                        </a>
                        <a href="https://wa.me/573143563567" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <i className="fa-brands fa-whatsapp"></i>
                        </a>
                    </div>
                </div>

                {/* Columna 2: Información General */}
                <div className="col-lg-3 col-md-6 mb-4">
                    <h5 className="footer-title">Información</h5>
                    <ul className="footer-links list-unstyled">
                        <li><Link to="/docs/terminos-y-condiciones">Términos de servicio</Link></li>
                        <li><Link to="/docs/politica-de-privacidad">Política de privacidad</Link></li>
                        <li><Link to="/docs/politica-de-reembolso">Política de reembolso</Link></li>
                        <li><Link to="/docs/politica-de-envio">Política de envío</Link></li>
                        <li><Link to="/docs/informacion-de-contacto">Información de contacto</Link></li>
                    </ul>
                </div>

                {/* Columna 3: Preguntas Frecuentes y Cuidados */}
                <div className="col-lg-3 col-md-6 mb-4">
                    <h5 className="footer-title">Ayuda</h5>
                    <ul className="footer-links list-unstyled">
                        <li><Link to="/docs/preguntas-frecuentes">Preguntas frecuentes</Link></li>
                        <li><Link to="/docs/garantia-y-devoluciones">Garantía</Link></li>
                        <li><Link to="/docs/cuidados-productos">Cuidados para tus productos</Link></li>
                    </ul>
                </div>

                {/* Columna 4: Contacto y Suscripción */}
                <div className="col-lg-3 col-md-6 mb-4">
                    <h5 className="footer-title">Contacto</h5>
                    <ul className="footer-links list-unstyled">
                        <li><a href="tel:+573143563567">Llámanos: +57 314 356 3567</a></li>
                        <li><a href="mailto:avanaleather@gmail.com">Correo: bicicletasnevada1@gmail.com</a></li>
                    </ul>
                </div>
            </div>
        </div>

    </footer>
);