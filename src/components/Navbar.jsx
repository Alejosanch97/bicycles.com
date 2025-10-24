import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CartModal } from "./CartModal.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import "../Styles/navbar.css";

export const Navbar = () => {
    // Estado local para controlar la visibilidad del modal del carrito
    const [showCart, setShowCart] = useState(false);
    // Estado para controlar la visibilidad del modal de contacto
    const [showContact, setShowContact] = useState(false);
    // Estado para manejar los datos del formulario de contacto
    const [formData, setFormData] = useState({
        Nombre: '',
        Correo: '',
        Celular: '',
        Mensaje: ''
    });

    // Estado para el mensaje de éxito
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    // Estado para el botón de carga
    const [isSending, setIsSending] = useState(false);

    // Accedemos al estado global del carrito
    const { store } = useGlobalReducer();
    const { cart } = store;

    // Funciones para mostrar y ocultar el modal del carrito
    const handleShowCart = () => setShowCart(true);
    const handleCloseCart = () => setShowCart(false);

    // Funciones para mostrar y ocultar el modal de contacto
    const handleShowContact = () => setShowContact(true);
    const handleCloseContact = () => setShowContact(false);

    // Maneja los cambios en los campos del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Maneja el envío del formulario a Google Sheets
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSending(true);

        const scriptURL = 'https://script.google.com/macros/s/AKfycbzxmZlwqpMq975OsPvVXp3p9B0LjH_w4Chwl1JuDWUb34XGdW5LRn1BY5YPx_1Ginyauw/exec';

        try {
            await fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData).toString(),
            });

            // Cierra modal y muestra mensaje de éxito
            handleCloseContact();
            setShowSuccessMessage(true);

            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);

            // Limpia el formulario
            setFormData({ Nombre: '', Correo: '', Celular: '', Mensaje: '' });

        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            alert('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <>
            <nav className="navbar avana-navbar navbar-expand-lg">
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link to="/" className="nav-link">Inicio</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/docs/nosotros" className="nav-link">Nosotros</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/demo" className="nav-link">Productos</Link>
                            </li>
                            <li className="nav-item">
                                <button onClick={handleShowContact} className="nav-link btn">
                                    Contacto
                                </button>
                            </li>
                            <li className="nav-item d-lg-none d-flex justify-content-center mt-3">
                                <a href="https://wa.me/573228551469" target="_blank" rel="noopener noreferrer" className="btn nav-icon-btn">
                                    <i className="fa-brands fa-whatsapp"></i>
                                </a>
                                <button className="btn nav-icon-btn position-relative" onClick={handleShowCart}>
                                    <i className="fa-solid fa-cart-shopping"></i>
                                    {cart.length > 0 && (
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            {cart.length}
                                        </span>
                                    )}
                                </button>
                            </li>
                        </ul>
                    </div>

                    <Link to="/" className="navbar-brand position-absolute top-50 start-50 translate-middle">
                        <img src="./logo.png" alt="Avana Leather Logo" className="logo" />
                    </Link>

                    <div className="d-flex align-items-center ms-auto">
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarNav"
                            aria-controls="navbarNav"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="d-none d-lg-flex align-items-center">
                            <button className="btn nav-icon-btn position-relative" onClick={handleShowCart}>
                                <i className="fa-solid fa-cart-shopping"></i>
                                {cart.length > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {cart.length}
                                    </span>
                                )}
                            </button>
                            <a href="https://wa.me/573228551469" target="_blank" rel="noopener noreferrer" className="btn nav-icon-btn">
                                <i className="fa-brands fa-whatsapp"></i>
                            </a>
                        </div>
                    </div>
                </div>
                
                <CartModal show={showCart} handleClose={handleCloseCart} />
            </nav>
            <div class="menu-overlay"></div>


            {/* Modal de contacto */}
            <div 
                className={`modal fade ${showContact ? 'd-block show' : ''}`} 
                tabIndex="-1" 
                role="dialog" 
                style={{ backgroundColor: showContact ? 'rgba(0,0,0,0.5)' : 'transparent', transition: 'background-color 0.3s' }}
                onClick={(e) => e.target.classList.contains('modal') && handleCloseContact()}
            >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header d-flex justify-content-center border-0">
                            <h5 className="modal-title contact-modal-title">CONTÁCTANOS</h5>
                            <button type="button" className="btn-close" onClick={handleCloseContact}></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        name="Nombre"
                                        placeholder="Nombre Completo"
                                        value={formData.Nombre}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        name="Correo"
                                        placeholder="Correo"
                                        value={formData.Correo}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <input 
                                        type="tel" 
                                        className="form-control" 
                                        name="Celular"
                                        placeholder="Celular"
                                        value={formData.Celular}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <textarea 
                                        className="form-control" 
                                        name="Mensaje" 
                                        rows="4"
                                        placeholder="Mensaje"
                                        value={formData.Mensaje}
                                        onChange={handleInputChange}
                                        required
                                    ></textarea>
                                </div>
                                <div className="d-grid">
                                    <button 
                                        type="submit" 
                                        className="btn btn-dark btn-lg" 
                                        disabled={isSending}
                                    >
                                        {isSending ? 'Enviando...' : 'ENVIAR'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mensaje de éxito */}
            <div className={`success-message ${showSuccessMessage ? 'show' : ''}`}>
                <div className="success-message-content">
                    <i className="fas fa-check-circle"></i>
                    <span>¡Mensaje enviado con éxito!</span>
                </div>
            </div>
        </>
    );
};
