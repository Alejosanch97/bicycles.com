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

    const [shippingOption, setShippingOption] = useState('delivery'); 
    const [loading, setLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false); 

    const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
    const discount = subtotal > 5000000 ? subtotal * 0.05 : 0;
    const total = subtotal - discount;
    const initialDeposit = total * 0.10; 

    const formatPrice = (price) => {
        return price.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        });
    };
    
    const formatValue = (price) => {
        return price.toLocaleString('es-CO', {
            minimumFractionDigits: 0,
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleShippingChange = (e) => {
        setShippingOption(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const orderItems = cart.map(item => ({
            image_url: item.image, 
            name: item.name,        
            units: 1,               
            price: formatValue(item.price), 
            color: item.selectedColor,
            // ✅ AGREGAMOS LA TALLA SELECCIONADA AL ARRAY DE ITEMS PARA EL EMAILJS
            size: item.selectedSize || 'N/A' 
        }));

        const templateParams = {
            email: formData.correo,
            nombre: formData.nombre,
            celular: formData.celular,
            pais: formData.pais,
            ciudad: formData.ciudad,
            direccion: shippingOption === 'delivery' ? formData.direccion : 'Recoge en Punto Físico',
            codigoPostal: formData.codigoPostal,
            notas: formData.notas,
            
            shipping_method: shippingOption === 'delivery' ? 'Entrega a Domicilio' : 'Recogida en Tienda',

            orders: orderItems, 
            order_id: `ORD-${Date.now()}`,
            
            cost: {
                shipping: shippingOption === 'delivery' ? 'GRATIS' : 'N/A', 
                tax: formatValue(0), 
                total: formatValue(total), 
                deposit: formatValue(initialDeposit), 
            },
            
            subtotal: formatPrice(subtotal),
            discount: formatPrice(discount),
            initialDeposit: formatPrice(initialDeposit) 
        };

        emailjs.send(
            "service_tt4kegw",
            "template_jvwl13j",
            templateParams,
            "iOcnHAkxn0lxNONK-"
        )
        .then(() => {
            setShowSuccessMessage(true);
            dispatch({ type: "clear_cart" });

            setTimeout(() => {
                setShowSuccessMessage(false);
                window.location.href = "/"; 
            }, 5000); 
        })
        .catch((err) => {
            console.error("❌ Error al enviar el correo:", err);
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
                <p className="lead text-muted">A continuación, encontrarás el resumen de tu pedido y el formulario para confirmar los datos.</p>
            </div>

            <div className="row g-4">
                {/* COLUMNA IZQUIERDA: RESUMEN Y MENSAJES INFORMATIVOS */}
                <div className="col-md-6 d-flex flex-column"> 
                    
                    {/* 1. RESUMEN DE LA ORDEN */}
                    <div className="card shadow-sm mb-4 flex-grow-1">
                        <div className="card-body">
                            <h5 className="card-title mb-3 fw-bold">Resumen de la Orden</h5>
                            {cart.map((item) => (
                                <div key={item.id} className="product-item-container d-flex align-items-start mb-3 pb-2 border-bottom">
                                    <img src={item.image} alt={item.name} className="img-thumbnail" />
                                    <div className="d-flex flex-column flex-grow-1 ms-3">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <h6 className="item-name mb-0">{item.name}</h6>
                                            <span className="item-price fw-bold">{formatPrice(item.price)}</span>
                                        </div>
                                        <small className="text-muted d-block">
                                            Color: {item.selectedColor} 
                                            {/* ✅ MOSTRAR LA TALLA SELECCIONADA AQUÍ */}
                                            {item.selectedSize && <span className="ms-3">Talla: {item.selectedSize}</span>}
                                        </small>
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
                                <div className="d-flex justify-content-between mb-1">
                                    <span className="text-muted">Envío:</span>
                                    <span>{shippingOption === 'delivery' ? 'GRATIS (Solo Bogotá)' : 'N/A'}</span>
                                </div>
                                <div className="d-flex justify-content-between mt-2 fw-bold">
                                    <h4>Total:</h4>
                                    <h4>{formatPrice(total)}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* 2. MENSAJE DE ENVÍO GRATIS EN BOGOTÁ */}
                    <div className="info-message success-bg p-3 rounded-3 mb-4">
                        <p className="mb-0 fw-bold">
                            <i className="fas fa-shipping-fast me-2"></i> 
                            ¡Envío Gratis en Bogotá!
                        </p>
                        <small>Recuerda que todos los pedidos con entrega a domicilio en Bogotá tienen envío gratis.</small>
                    </div>

                    {/* 3. MENSAJE DE ABONO DE CONFIRMACIÓN */}
                    <div className="info-message warning-bg p-3 rounded-3 mb-4">
                        <p className="mb-2 fw-bold text-dark">
                            <i className="fas fa-bicycle me-2"></i> 
                            ¡Bienvenido a Bicicletas Nevada!
                        </p>
                        <p className="mb-2">
                            Nos alegra mucho que hayas confiado en nosotros. Para garantizar el despacho de tu pedido y asegurar una entrega rápida y segura, te pedimos realizar un abono del **10% ( {formatPrice(initialDeposit)})** como confirmación de la compra.
                        </p>
                        <div className="deposit-info p-2 rounded-3 text-center mt-3">
                            <p className="mb-1 fw-bold">Puedes hacerlo fácilmente a través de:</p>
                            <p className="mb-0">
                                <span className="badge text-bg-nequi me-2">Nequi</span> 
                                <span className="badge text-bg-davi">Daviplata</span>
                                <span className="deposit-number ms-3">al número **314 356 3567**</span>
                            </p>
                        </div>
                        <p className="mt-2 mb-0">Una vez recibido el abono, procesaremos tu pedido y te mantendremos informado hasta la entrega. 🚴‍♂️✨</p>
                    </div>

                </div>

                {/* COLUMNA DERECHA: DATOS DE CONTACTO Y ENVÍO */}
                <div className="col-md-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title mb-3 fw-bold">Datos de Contacto y Envío</h5>
                            <form onSubmit={handleSubmit}>
                                {/* 1. CONTACTO: Nombre, Celular, Correo */}
                                <div className="mb-3">
                                    <label htmlFor="nombre" className="form-label">Nombre Completo</label>
                                    <input type="text" className="form-control" id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="celular" className="form-label">Celular</label>
                                        <input type="tel" className="form-control" id="celular" name="celular" value={formData.celular} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="correo" className="form-label">Correo Electrónico</label>
                                        <input type="email" className="form-control" id="correo" name="correo" value={formData.correo} onChange={handleInputChange} required />
                                    </div>
                                </div>
                                
                                {/* 2. CAMPOS DE DIRECCIÓN (CONDICIONALES) */}
                                {shippingOption === 'delivery' && (
                                    <>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="pais" className="form-label">País</label>
                                                <input type="text" className="form-control" id="pais" name="pais" value={formData.pais} onChange={handleInputChange} required={shippingOption === 'delivery'} />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="ciudad" className="form-label">Ciudad</label>
                                                <input type="text" className="form-control" id="ciudad" name="ciudad" value={formData.ciudad} onChange={handleInputChange} required={shippingOption === 'delivery'} />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="direccion" className="form-label">Dirección (Calle, número de casa, apto.)</label>
                                            <input type="text" className="form-control" id="direccion" name="direccion" value={formData.direccion} onChange={handleInputChange} required={shippingOption === 'delivery'} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="codigoPostal" className="form-label">Código Postal (Opcional)</label>
                                            <input type="text" className="form-control" id="codigoPostal" name="codigoPostal" value={formData.codigoPostal} onChange={handleInputChange} />
                                        </div>
                                    </>
                                )}
                                
                                {/* 3. NOTAS ADICIONALES */}
                                <div className="mb-4">
                                    <label htmlFor="notas" className="form-label">Notas adicionales para la entrega (o comentarios)</label>
                                    <textarea className="form-control" id="notas" name="notas" rows="3" value={formData.notas} onChange={handleInputChange}></textarea>
                                </div>

                                {/* 4. OPCIONES DE ENTREGA */}
                                <h5 className="card-title mb-3 fw-bold">Opciones de Entrega</h5>
                                <div className="d-flex justify-content-start gap-4 mb-4 delivery-options-group">
                                    {/* Opción 1: Entrega a Domicilio */}
                                    <div className="form-check">
                                        <input 
                                            className="form-check-input" 
                                            type="radio" 
                                            name="shippingOption" 
                                            id="delivery" 
                                            value="delivery"
                                            checked={shippingOption === 'delivery'} 
                                            onChange={handleShippingChange} 
                                        />
                                        <label className="form-check-label" htmlFor="delivery">
                                            Entrega a Domicilio (Pago Contra Entrega)
                                        </label>
                                    </div>
                                    {/* Opción 2: Recoger en Tienda */}
                                    <div className="form-check">
                                        <input 
                                            className="form-check-input" 
                                            type="radio" 
                                            name="shippingOption" 
                                            id="pickup" 
                                            value="pickup"
                                            checked={shippingOption === 'pickup'} 
                                            onChange={handleShippingChange} 
                                        />
                                        <label className="form-check-label" htmlFor="pickup">
                                            Recoger en Punto Físico
                                        </label>
                                    </div>
                                </div>
                                
                                {/* 5. INFORMACIÓN DE RECOGIDA (CONDICIONAL) */}
                                {shippingOption === 'pickup' && (
                                    <div className="pickup-info p-3 rounded-3 mb-4">
                                        <p className="fw-bold mb-1">Punto de Recogida:</p>
                                        <p className="mb-0">📍 **Bicicletas Nevada** - Calle 13 # 22 - 11, Bogotá, Colombia.</p>
                                        <p className="mb-0">Horario: Lunes a Viernes de 8:00 AM a 6:00 PM.</p>
                                    </div>
                                )}


                                {/* 6. BOTÓN DE CONFIRMACIÓN */}
                                <div className="d-grid mt-4">
                                    <button type="submit" className="btn btn-lg btn-dark" disabled={loading}>
                                        {loading ? "Registrando Pedido..." : "Confirmar Pedido"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* MENSAJE DE ÉXITO FLOTANTE */}
            <div className={`success-message ${showSuccessMessage ? 'show' : ''}`}>
                <div className="success-message-content">
                    <i className="fas fa-check-circle me-2"></i>
                    <span>¡Pedido registrado! La confirmación fue enviada a tu correo. Por favor, **no olvides el abono de 10%** para confirmar tu pedido y asegurar el despacho más rápido posible. 🥳</span>
                </div>
            </div>
        </div>
    );
};