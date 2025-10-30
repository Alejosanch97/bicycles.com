import React from 'react';
import { useNavigate } from 'react-router-dom';
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import '../Styles/cart.css'; 

export const CartModal = ({ show, handleClose }) => {
    const { store, dispatch } = useGlobalReducer();
    // Ya no necesitamos 'allProducts' si manejamos la imagen correctamente al cambiar el color
    const { cart } = store; 
    const navigate = useNavigate();

    // 1. Manejar la eliminación por item.cartId
    const handleRemoveFromCart = (itemCartId) => {
        dispatch({
            type: "REMOVE_FROM_CART",
            payload: itemCartId 
        });
    };

    // 2. Manejar el cambio de color
    const handleChangeColor = (item, newColor) => {
        // Formatea el color exactamente como están las claves en tu objeto 'images' (minúsculas, sin espacios).
        const formattedColorKey = newColor.toLowerCase().replace(/\s/g, ''); 
        const newImage = item.images?.[formattedColorKey];

        if (newImage) {
            dispatch({
                type: "UPDATE_CART_ITEM_COLOR",
                payload: {
                    itemCartId: item.cartId, // ID único de la instancia
                    newColor: newColor,
                    newImage: newImage 
                }
            });
        } else {
            console.error(`Error: No se encontró la imagen para el color '${newColor}'.`);
        }
    };
    
    // ✅ 3. NUEVO HANDLER: Manejar el cambio de talla
    const handleChangeSize = (item, newSize) => {
        // Asegúrate de que tu reducer maneje la acción "UPDATE_CART_ITEM_SIZE"
        dispatch({
            type: "UPDATE_CART_ITEM_SIZE",
            payload: {
                itemCartId: item.cartId, // ID único de la instancia
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

    const handleConfirmOrder = () => {
        handleClose();
        navigate('/order-summary', { state: { scroll: true } });
    };

    return (
        <div 
            className={`modal fade ${show ? 'show d-block' : ''}`} 
            tabIndex="-1" 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={(e) => {
                // Cierra el modal solo si se hace clic en el fondo
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
                        {cart.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="fa-solid fa-box-open fa-3x text-muted mb-3"></i>
                                <p className="text-muted lead">Tu carrito está vacío. ¡Añade algo!</p>
                            </div>
                        ) : (
                            <div>
                                {/* Lista de Productos */}
                                {cart.map((item) => (
                                    <div key={item.cartId} className="cart-item row align-items-center mb-3 pb-3 border-bottom">
                                        
                                        {/* Columna 1: Imagen */}
                                        <div className="col-2">
                                            <img src={item.image} alt={item.name} className="img-fluid cart-item-image" />
                                        </div>
                                        
                                        {/* Columna 2: Info del Producto */}
                                        <div className="col-5">
                                            <h6 className="mb-0 fw-bold">{item.name}</h6>
                                            <small className="text-muted d-block">Color: {item.selectedColor || 'N/A'}</small>
                                            <small className="text-muted d-block">Talla: {item.selectedSize || 'N/A'}</small>
                                            <small className="text-muted d-block fw-bold">{formatPrice(item.price)}</small>
                                        </div>
                                        
                                        {/* Columna 3: Selectores (Color y Talla) */}
                                        <div className="col-3 d-flex flex-column gap-2">
                                            
                                            {/* ✅ Selector de TALLA (Columna Referencia) */}
                                            {/* Usamos item.availableSizes que se guardó en ADD_TO_CART */}
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
                                            {item.colors && item.colors.length > 1 && (
                                                <div className="mt-1">
                                                    <small className="fw-bold d-block mb-1" style={{fontSize: '0.8rem'}}>Cambiar Color:</small>
                                                    <div className="d-flex gap-2">
                                                        {item.colors.map(color => (
                                                            <span
                                                                key={color}
                                                                className={`color-dot-small color-${color.toLowerCase().replace(/\s/g, '')}`}
                                                                title={color}
                                                                style={{ 
                                                                    border: item.selectedColor === color ? '2px solid #3d3d3d' : '1px solid #ccc', 
                                                                }}
                                                                onClick={() => handleChangeColor(item, color)} 
                                                            ></span>
                                                        ))}
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
                                ))}
                                
                                {/* Resumen de Precios */}
                                <div className="mt-4 pt-3 border-top summary-box p-3">
                                    <h5 className="mb-3 text-center summary-title">Resumen del Pedido</h5>
                                    <div className="d-flex justify-content-between mb-2">
                                        <h6 className="text-muted">Subtotal:</h6>
                                        <h6>{formatPrice(subtotal)}</h6>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <h6 className="text-success">Descuento (5% por compras > $5M):</h6>
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
                            disabled={cart.length === 0}
                            onClick={handleConfirmOrder}
                        >
                            <i className="fa-solid fa-truck me-2"></i> Procesar Pago
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
