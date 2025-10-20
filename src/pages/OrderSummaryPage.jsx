import React, { useState, useEffect } from 'react';
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom"; 
import emailjs from "@emailjs/browser"; 
import '../Styles/ordersummary.css';

export const OrderSummaryPage = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []); 

    const { store, dispatch } = useGlobalReducer();
    const { cart } = store;

    const [formData, setFormData] = useState({
        nombre: '',
        celular: '',
        correo: '',
        pais: '',
        ciudad: '',
        direccion: '', 
        codigoPostal: '', 
        notas: '' 
    });

    const [loading, setLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false); 

    const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
    const discount = subtotal > 5000000 ? subtotal * 0.05 : 0;
    const total = subtotal - discount;

    const formatPrice = (price) => {
        return price.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        });
    };
    
    // Función auxiliar para formatear precio sin símbolo ni decimales (útil para el template)
    const formatValue = (price) => {
        return price.toLocaleString('es-CO', {
            minimumFractionDigits: 0,
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // 1. CREAR EL ARRAY 'orders' con las variables que la plantilla espera
        const orderItems = cart.map(item => ({
            // Template espera 'image_url' (usamos la URL de la imagen del carrito)
            image_url: item.image, 
            // Template espera 'name'
            name: item.name,        
            // Template espera 'units'
            units: 1,               
            // Template espera 'price' (usamos el valor sin símbolo de moneda)
            price: formatValue(item.price), 
            color: item.selectedColor 
        }));

        // 2. CONSTRUIR templateParams con las estructuras de la plantilla
        const templateParams = {
            // Datos del formulario
            email: formData.correo,
            nombre: formData.nombre,
            celular: formData.celular,
            pais: formData.pais,
            ciudad: formData.ciudad,
            direccion: formData.direccion,
            codigoPostal: formData.codigoPostal,
            notas: formData.notas,
            
            // La plantilla espera 'orders' para el bucle de productos
            orders: orderItems, 
            
            // La plantilla espera 'order_id'
            order_id: `ORD-${Date.now()}`,
            
            // La plantilla espera los totales anidados en 'cost'
            cost: {
                shipping: 'GRATIS', 
                tax: formatValue(0), // No estás calculando impuestos
                total: formatValue(total), // El total final sin símbolo COP
            },
            
            // Variables opcionales, si decides usar el Subtotal y Descuento por separado en el futuro:
            subtotal: formatPrice(subtotal),
            discount: formatPrice(discount),
        };

        emailjs.send(
            "service_tt4kegw",
            "template_jvwl13j",
            templateParams,
            "iOcnHAkxn0lxNONK-"
        )
        .then(() => {
            setShowSuccessMessage(true);

            setTimeout(() => {
                setShowSuccessMessage(false);
                dispatch({ type: "clear_cart" });
                // Redirecciona solo después del éxito
                window.location.href = "/"; 
            }, 3000);
        })
        .catch((err) => {
            console.error("❌ Error al enviar el correo:", err);
            // Mostrar el mensaje de error para el usuario
            alert("Hubo un error al registrar tu pedido. Intenta nuevamente.");
        })
        .finally(() => {
            setLoading(false);
        });
    };

    if (cart.length === 0) {
        return (
            <div className="container mt-5 text-center">
                <h2>Tu carrito está vacío.</h2>
                <p>Por favor, agrega productos para poder ver el resumen del pedido.</p>
                <Link to="/demo" className="btn btn-dark mt-3">Ver Productos</Link>
            </div>
        );
    }

    return (
        <div className="container my-5 order-summary-page">
            <div className="text-center mb-4">
                <h2 className="display-6 fw-bold">¡Gracias por tu compra!</h2>
                <p className="lead text-muted">A continuación, encontrarás el resumen de tu pedido y el formulario para confirmar los datos de envío.</p>
            </div>

            <div className="row g-4">
                <div className="col-md-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title mb-3 fw-bold">Resumen de la Orden</h5>
                            {cart.map((item) => (
                                <div key={item.id} className="product-item-container d-flex align-items-start mb-3 pb-2">
                                    <img src={item.image} alt={item.name} className="img-thumbnail" />
                                    <div className="d-flex flex-column flex-grow-1 ms-3">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <h6 className="item-name mb-0">{item.name}</h6>
                                            <span className="item-price fw-bold">{formatPrice(item.price)}</span>
                                        </div>
                                        <small className="text-muted d-block">Color: {item.selectedColor}</small>
                                    </div>
                                </div>
                            ))}
                            <div className="mt-4 pt-3 border-top">
                                <div className="d-flex justify-content-between mb-1">
                                    <span className="text-muted">Subtotal:</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="text-success">Descuento (5%):</span>
                                        <span className="text-success">- {formatPrice(discount)}</span>
                                    </div>
                                )}
                                <div className="d-flex justify-content-between mt-2 fw-bold">
                                    <h4>Total:</h4>
                                    <h4>{formatPrice(total)}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title mb-3 fw-bold">Datos de Envío</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="nombre" className="form-label">Nombre Completo</label>
                                    <input type="text" className="form-control" id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="celular" className="form-label">Celular</label>
                                    <input type="tel" className="form-control" id="celular" name="celular" value={formData.celular} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="correo" className="form-label">Correo Electrónico</label>
                                    <input type="email" className="form-control" id="correo" name="correo" value={formData.correo} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="pais" className="form-label">País</label>
                                    <input type="text" className="form-control" id="pais" name="pais" value={formData.pais} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="ciudad" className="form-label">Ciudad</label>
                                    <input type="text" className="form-control" id="ciudad" name="ciudad" value={formData.ciudad} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="direccion" className="form-label">Dirección (Calle, número de casa, apto.)</label>
                                    <input type="text" className="form-control" id="direccion" name="direccion" value={formData.direccion} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="codigoPostal" className="form-label">Código Postal</label>
                                    <input type="text" className="form-control" id="codigoPostal" name="codigoPostal" value={formData.codigoPostal} onChange={handleInputChange} />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="notas" className="form-label">Notas adicionales para la entrega</label>
                                    <textarea className="form-control" id="notas" name="notas" rows="3" value={formData.notas} onChange={handleInputChange}></textarea>
                                </div>
                                
                                <h5 className="card-title mb-3 fw-bold">Método de Pago</h5>
                                <div className="form-check mb-4">
                                    <input className="form-check-input" type="radio" name="paymentMethod" id="pagoContraEntrega" checked readOnly />
                                    <label className="form-check-label" htmlFor="pagoContraEntrega">
                                        Pago Contra Entrega
                                    </label>
                                </div>

                                <div className="d-grid mt-4">
                                    <button type="submit" className="btn btn-lg btn-dark" disabled={loading}>
                                        {loading ? "Enviando..." : "Confirmar Pedido"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className={`success-message ${showSuccessMessage ? 'show' : ''}`}>
                <div className="success-message-content">
                    <i className="fas fa-check-circle"></i>
                    <span>¡Pedido registrado con éxito! Gracias por tu compra.</span>
                </div>
            </div>
        </div>
    );
};