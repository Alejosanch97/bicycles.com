import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { toast } from 'react-toastify'; 
import '../Styles/cart.css'; 

// --- CONSTANTES ---
const BIKE_SIZE_GUIDE_IMAGE = "https://i.pinimg.com/736x/b6/2c/d6/b62cd699a027149f435ad4e93a540f33.jpg";
const BIKE_CATEGORY = "Bicicletas para Niños"; // Se mantiene por si se usa en otro lado, pero ya no filtra el botón.
const GUIDE_BUTTON_LABEL = "Guía de Tallas (Bicis)"; // Nombre más corto para el botón

// =============================================================
// COMPONENTE: SizeGuideModal (Modal Secundario)
// Muestra la imagen de la guía de tallas de bicicletas
// =============================================================
const SizeGuideModal = ({ show, handleClose }) => {
    if (!show) return null;

    return (
        <div 
            className="modal fade show d-block" 
            tabIndex="-1" 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 1060 }}
            onClick={(e) => {
                if (e.target.classList.contains('modal')) {
                    handleClose();
                }
            }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header header-cart">
                        <h5 className="modal-title">Guía de Tallas para Bicicletas</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body p-1 text-center">
                        <img 
                            src={BIKE_SIZE_GUIDE_IMAGE} 
                            alt="Guía de Tallas de Bicicletas para Niños por Rodado y Edad" 
                            className="img-fluid" 
                            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                        />
                    </div>
                    <div className="modal-footer justify-content-center">
                         <button type="button" className="btn btn-secondary" onClick={handleClose}>Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// =============================================================
// COMPONENTE: CartModal (Principal)
// =============================================================
export const CartModal = ({ show, handleClose }) => {
    const { store, dispatch } = useGlobalReducer();
    const { cart } = store; 
    const navigate = useNavigate();

    const [showSizeGuide, setShowSizeGuide] = useState(false);

    // 1. Manejar la eliminación por item.cartId
    const handleRemoveFromCart = (itemCartId) => {
        dispatch({
            type: "REMOVE_FROM_CART",
            payload: itemCartId 
        });
    };

    // 2. Manejar el cambio de color (AHORA CON VERIFICACIÓN DE STOCK)
    const handleChangeColor = (item, newColor) => {
        const outOfStockSet = new Set(item.outOfStockColors || []);

        if (outOfStockSet.has(newColor)) {
            toast.error(`❌ El color ${newColor} de ${item.name} está agotado.`, {
                position: "bottom-center", autoClose: 2500, hideProgressBar: true
            });
            return;
        }

        const formattedColorKey = newColor.toLowerCase().replace(/\s/g, ''); 
        const newImage = item.images?.[newColor] || item.images?.[formattedColorKey]; 
        
        if (newImage) {
            dispatch({
                type: "UPDATE_CART_ITEM_COLOR",
                payload: {
                    itemCartId: item.cartId, 
                    newColor: newColor,
                    newImage: newImage 
                }
            });
        } else {
            console.error(`Error: No se encontró la imagen para el color '${newColor}'.`);
        }
    };
    
    // 3. Manejar el cambio de talla
    const handleChangeSize = (item, newSize) => {
        dispatch({
            type: "UPDATE_CART_ITEM_SIZE",
            payload: {
                itemCartId: item.cartId, 
                newSize: newSize,
            }
        });
    };

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
    
    // 4. Verificar si hay algún producto agotado en el carrito que bloquee la compra
    const isCartBlocked = cart.some(item => 
        item.outOfStockColors && new Set(item.outOfStockColors).has(item.selectedColor)
    );

    // ❌ ELIMINAMOS LA LÓGICA DE FILTRADO hasBikeProduct 
    // Ahora el botón se muestra si el carrito NO está vacío.


    const handleConfirmOrder = () => {
        if (isCartBlocked) {
            toast.error("⚠️ Uno o más productos en el carrito han sido marcados como agotados. Por favor, elimina o cambia tu selección para continuar.", {
                position: "bottom-center", autoClose: 4000
            });
            return;
        }

        handleClose();
        navigate('/order-summary', { state: { scroll: true } });
    };

    return (
        <>
            {/* Modal Principal del Carrito */}
            <div 
                className={`modal fade ${show ? 'show d-block' : ''}`} 
                tabIndex="-1" 
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
                onClick={(e) => {
                    if (e.target.classList.contains('modal')) {
                        handleClose();
                    }
                }}
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header header-cart">
                            <h5 className="modal-title"><i className="fa-solid fa-cart-shopping me-2"></i> Mi Carrito</h5>
                            <button type="button" className="btn-close" onClick={handleClose}></button>
                        </div>
                        <div className="modal-body p-4">

                            {/* 💡 BOTÓN CONDICIONAL PARA LA GUÍA DE TALLAS (Muestra si el carrito NO está vacío) */}
                            {cart.length > 0 && (
                                <div className="text-center mb-4">
                                    <button 
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={() => setShowSizeGuide(true)} // Abre el modal secundario
                                    >
                                        <i className="fa-solid fa-ruler-combined me-1"></i> {GUIDE_BUTTON_LABEL}
                                    </button>
                                </div>
                            )}

                            {cart.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="fa-solid fa-box-open fa-3x text-muted mb-3"></i>
                                    <p className="text-muted lead">Tu carrito está vacío. ¡Añade algo!</p>
                                </div>
                            ) : (
                                <div>
                                    {/* Lista de Productos */}
                                    {cart.map((item) => {
                                        // LÓGICA DE FILTRADO PARA OCULTAR COLORES AGOTADOS
                                        
                                        // 1. Obtiene el Set de colores agotados para una búsqueda eficiente
                                        const outOfStockSet = new Set(item.outOfStockColors || []);
                                        
                                        // 2. Filtra la lista original de colores (item.colors) para obtener solo los disponibles
                                        const availableColors = item.colors ? 
                                            item.colors.filter(color => !outOfStockSet.has(color)) : [];
                                        
                                        // Comprobación de stock para el ítem actual seleccionado
                                        const isOutOfStock = outOfStockSet.has(item.selectedColor);

                                        return (
                                            <div 
                                                key={item.cartId} 
                                                className={`cart-item row align-items-center mb-3 pb-3 border-bottom ${isOutOfStock ? 'cart-item-out-of-stock' : ''}`}
                                            >
                                                
                                                {/* Columna 1: Imagen y Overlay de Agotado */}
                                                <div className="col-2 position-relative">
                                                    {isOutOfStock && (
                                                        <div className="cart-stock-overlay">AGOTADO</div>
                                                    )}
                                                    <img src={item.image} alt={item.name} className="img-fluid cart-item-image" />
                                                </div>
                                                
                                                {/* Columna 2: Info del Producto */}
                                                <div className="col-5">
                                                    <h6 className="mb-0 fw-bold">{item.name}</h6>
                                                    <small className="text-muted d-block">
                                                        Color: {item.selectedColor || 'N/A'}
                                                        {isOutOfStock && <span className="text-danger fw-bold ms-2">(AGOTADO)</span>}
                                                    </small>
                                                    <small className="text-muted d-block">Talla: {item.selectedSize || 'N/A'}</small>
                                                    <small className="text-muted d-block fw-bold">{formatPrice(item.price)}</small>
                                                </div>
                                                
                                                {/* Columna 3: Selectores (Color y Talla) */}
                                                <div className="col-3 d-flex flex-column gap-2">
                                                    
                                                    {/* Selector de TALLA */}
                                                    {(item.availableSizes && item.availableSizes.length > 0) && (
                                                        <div className="d-flex align-items-center">
                                                            <label htmlFor={`size-select-${item.cartId}`} className="me-2 fw-bold" style={{fontSize: '0.8rem'}}>Talla:</label>
                                                            <select
                                                                id={`size-select-${item.cartId}`}
                                                                className="form-select form-select-sm"
                                                                value={item.selectedSize}
                                                                onChange={(e) => handleChangeSize(item, e.target.value)}
                                                                style={{maxWidth: '80px'}}
                                                            >
                                                                {item.availableSizes.map(size => (
                                                                    <option key={size} value={size}>{size}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Selector de COLOR */}
                                                    {availableColors.length > 1 && (
                                                        <div className="mt-1">
                                                            <small className="fw-bold d-block mb-1" style={{fontSize: '0.8rem'}}>Cambiar Color:</small>
                                                            <div className="d-flex gap-2">
                                                                {/* Mapeamos SOLO los colores DISPONIBLES */}
                                                                {availableColors.map(color => { 
                                                                    return (
                                                                        <span
                                                                            key={color}
                                                                            className={`color-dot-small color-${color.toLowerCase().replace(/\s/g, '')}`} 
                                                                            title={color}
                                                                            style={{ 
                                                                                border: item.selectedColor === color ? '2px solid #3d3d3d' : '1px solid #ccc',
                                                                                cursor: 'pointer'
                                                                            }}
                                                                            onClick={() => handleChangeColor(item, color)} 
                                                                        >
                                                                        </span>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Columna 4: Botón Eliminar */}
                                                <div className="col-2 text-end">
                                                    <button 
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleRemoveFromCart(item.cartId)} 
                                                        title="Eliminar producto"
                                                    >
                                                        <i className="fa-solid fa-trash-can"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    
                                    {/* Resumen de Precios */}
                                    <div className="mt-4 pt-3 border-top summary-box p-3">
                                        {isCartBlocked && (
                                            <div className="alert alert-danger text-center mb-3 p-2 rounded-lg shadow-sm">
                                                <i className="fa-solid fa-triangle-exclamation me-2"></i> **¡Debes eliminar o cambiar los productos agotados para continuar!**
                                            </div>
                                        )}
                                        <h5 className="mb-3 text-center summary-title">Resumen del Pedido</h5>
                                        <div className="d-flex justify-content-between mb-2">
                                            <h6 className="text-muted">Subtotal:</h6>
                                            <h6>{formatPrice(subtotal)}</h6>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <h6 className="text-success">Descuento (5% por compras &gt; $5M):</h6>
                                            <h6 className="text-success">- {formatPrice(discount)}</h6>
                                        </div>
                                        <div className="d-flex justify-content-between mt-3 total-line">
                                            <h4>Total:</h4>
                                            <h4>{formatPrice(total)}</h4>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer justify-content-center footer-cart">
                            <button 
                                type="button" 
                                className="btn btn-lg btn-confirm-order" 
                                disabled={cart.length === 0 || isCartBlocked}
                                onClick={handleConfirmOrder}
                            >
                                <i className="fa-solid fa-truck me-2"></i> Procesar Pago
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Renderiza el modal secundario de la guía de tallas */}
            <SizeGuideModal 
                show={showSizeGuide} 
                handleClose={() => setShowSizeGuide(false)} 
            />
        </>
    );
};