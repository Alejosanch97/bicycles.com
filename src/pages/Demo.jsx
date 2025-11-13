import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer.jsx';
import { CartModal } from "../components/CartModal.jsx";
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import '../Styles/demo.css';

// 🚨🚨🚨 1. DEFINIR LA URL DE LA API AQUI 🚨🚨🚨
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbxqUoCMBgc7pNT7AWH3f1bguHlRB_IzEpO6SKIPDQ-lJ6uIMAlywB6EzWOzXLqpEu89/exec"; // Asegúrate que esta URL sea la de tu Apps Script implementado

// =============================================================
// ✅ COMPONENTE: ProductCard (Lógica de stock y color activo)
// =============================================================
const ProductCard = ({ product, handleAddToCart }) => {
    
    // 1. PROCESAR COLORES AGOTADOS
    const outOfStockColorsList = product.colores_agotados ? 
        product.colores_agotados.split(',').map(c => c.trim()).filter(c => c) : 
        [];
    const outOfStockColors = new Set(outOfStockColorsList);
    
    // 2. TALLAS Y COLORES INICIALES
    const availableSizes = product.reference.split(',').map(s => s.trim()).filter(s => s);
    const initialSize = availableSizes.length > 0 ? availableSizes[0] : 'Unica'; 
    
    const productColors = product.colors || [];
    
    // Define los colores DISPONIBLES (excluyendo los agotados)
    const availableColors = productColors.filter(color => !outOfStockColors.has(color));
    
    // El color inicial debe ser el primer color DISPONIBLE. Si no hay, toma el primer color original.
    const initialColor = availableColors.length > 0 ? availableColors[0] : (productColors.length > 0 ? productColors[0] : '');
    
    // ESTADOS
    const [currentImage, setCurrentImage] = useState(product.mainImage);
    const [currentColor, setCurrentColor] = useState(initialColor);
    const [selectedSize, setSelectedSize] = useState(initialSize); 
    // Estado para guardar el color REALMENTE SELECCIONADO (activo)
    const [activeColor, setActiveColor] = useState(initialColor); 

    const productRin = product.subcategoria || product.Subcategoria || product.subcategory || '';
    
    // Bandera para deshabilitar la compra si el color ACTIVO está agotado 
    const isActiveColorOutOfStock = outOfStockColors.has(activeColor) || availableColors.length === 0;

    // Efecto para inicializar la imagen al color disponible (si existe)
    useEffect(() => {
        const initialFormattedColor = initialColor.toLowerCase().replace(/\s/g, '');
        const initialImage = product.images?.[initialColor] || product.images?.[initialFormattedColor] || product.mainImage;
        setCurrentImage(initialImage);
    }, [product.id, initialColor, product.images, product.mainImage]); 

    // Mantiene la imagen principal/secundaria en hover sobre la CARD
    const handleImageCardHover = () => {
        if (product.hoverImage) {
            setCurrentImage(product.hoverImage);
        }
    };

    const handleImageCardLeave = () => {
        // Vuelve a la imagen del color activo
        const activeFormattedColor = activeColor.toLowerCase().replace(/\s/g, '');
        const activeImage = product.images?.[activeColor] || product.images?.[activeFormattedColor] || product.mainImage;
        setCurrentImage(activeImage);
    };

    // Función para manejar el CLICK de selección de color (Solo se ejecuta en colores disponibles)
    const handleColorClick = (color) => {
        setActiveColor(color);
        setCurrentColor(color);
        
        const formattedColor = color.toLowerCase().replace(/\s/g, '');
        const imageToDisplay = product.images?.[color] || product.images?.[formattedColor]; 
        setCurrentImage(imageToDisplay || product.mainImage);
    };

    // Función para previsualizar al pasar el ratón (HOVER)
    const handleColorHover = (color) => {
        setCurrentColor(color);
        
        // Muestra la imagen
        const formattedColor = color.toLowerCase().replace(/\s/g, '');
        const imageToDisplay = product.images?.[color] || product.images?.[formattedColor];
        setCurrentImage(imageToDisplay || product.mainImage);
    };
    
    // Función para volver al color ACTIVO al salir del ratón
    const handleColorLeave = () => {
        setCurrentColor(activeColor); 
        
        // Vuelve a la imagen de ese color activo
        const activeFormattedColor = activeColor.toLowerCase().replace(/\s/g, '');
        const activeImage = product.images?.[activeColor] || product.images?.[activeFormattedColor] || product.mainImage;
        setCurrentImage(activeImage);
    };
    
    const handleAddClick = () => {
        if (isActiveColorOutOfStock) {
             toast.error(`❌ El color ${activeColor} está agotado. Por favor, selecciona otro.`, {
                position: "bottom-right",
                autoClose: 3000,
            });
            return;
        }
        // Usamos activeColor para la compra
        handleAddToCart(product, activeColor, selectedSize); 
    };

    return (
        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 mb-4">
            <div 
                className="product-card h-100 position-relative"
            >
                
                <img 
                    src={currentImage} 
                    className="card-img-top product-image" 
                    alt={product.name}
                    onMouseEnter={handleImageCardHover}
                    onMouseLeave={handleImageCardLeave}
                />
                <div className="card-body text-center d-flex flex-column">
                    <h5 className="product-card-title">{product.name}</h5>
                    <p className="product-info text-muted">
                        ** {productRin}** | Tallas: {product.reference}
                    </p>
                    
                    {/* SELECTOR DE TALLA */}
                    {availableSizes.length > 1 || availableSizes[0] === 'Unica' ? (
                        <div className="mb-3 d-flex justify-content-center align-items-center">
                            <label htmlFor={`size-select-${product.id}`} className="me-2 text-muted fw-bold" style={{fontSize: '0.9rem'}}>Talla:</label>
                            <select 
                                id={`size-select-${product.id}`}
                                className="form-select form-select-sm"
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                                style={{maxWidth: '100px'}}
                            >
                                {availableSizes.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                         <div style={{height: '38px'}}></div> 
                    )}


                    <div className="product-colors mb-2">
                        {/* Usar availableColors.map para iterar SOLO sobre los disponibles */}
                        {availableColors.length > 0 ? (
                            availableColors.map(color => {
                                return (
                                    <span 
                                        key={color} 
                                        className={`color-dot color-${color.toLowerCase().replace(/\s/g, '')} ${activeColor === color ? 'active-color' : ''}`}
                                        title={color}
                                        onClick={() => handleColorClick(color)}
                                        onMouseEnter={() => handleColorHover(color)}
                                        onMouseLeave={handleColorLeave} 
                                    >
                                    </span>
                                );
                            })
                        ) : (
                            <small className="text-danger">Agotado en todos los colores</small>
                        )}
                    </div>
                    
                    <p className="product-price mt-1">$ {product.price.toLocaleString('es-CO')}</p> 
                    <button 
                        className="btn btn-buy-product mt-auto"
                        onClick={handleAddClick}
                        // Deshabilita el botón si no hay colores disponibles, o si el color activo está agotado
                        disabled={isActiveColorOutOfStock} 
                    >
                        {availableColors.length === 0 ? 'AGOTADO' : 'Comprar'}
                    </button>
                </div>
            </div>
        </div>
    );
};


export const Demo = () => {
    const { store, dispatch } = useGlobalReducer();
    const { cart } = store;

    // 🚨🚨🚨 ESTADOS 🚨🚨🚨
    const [products, setProducts] = useState([]); 
    const [loading, setLoading] = useState(true); 
    
    const location = useLocation();
    const [showCart, setShowCart] = useState(false);
    const handleShowCart = () => setShowCart(true);
    const handleCloseCart = () => setShowCart(false);

    // ESTADOS DE FILTROS ACTUALIZADOS
    const initialCategory = location.state?.category ? [location.state.category] : [];
    const [filteredProducts, setFilteredProducts] = useState([]); 
    const [priceRange, setPriceRange] = useState([0, 3000000]);
    const [selectedCategories, setSelectedCategories] = useState(initialCategory);
    
    const [selectedRins, setSelectedRins] = useState([]); 
    const [selectedSizes, setSelectedSizes] = useState([]); 
    const [selectedColors, setSelectedColors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('default');
    const [showMobileFilters, setShowMobileFilters] = useState(false); 

    // =============================================================
    // ✅ CÁLCULO DINÁMICO DE FILTROS (MODIFICADO para excluir colores agotados globalmente)
    // =============================================================
    const uniqueCategories = [...new Set(products.map(p => p.category))].filter(Boolean);
    
    const uniqueSizes = [...new Set(
        products.flatMap(p => p.reference.split(',').map(s => s.trim()))
    )].filter(s => s); 
    
    const uniqueRins = [...new Set(products.map(p => p.subcategoria || p.subcategory))].filter(Boolean);
    
    // Calcular colores únicos disponibles en AL MENOS un producto
    const availableColorsAcrossAllProducts = products.flatMap(p => {
        const allColors = p.colors || [];
        const outOfStock = p.colores_agotados ? new Set(p.colores_agotados.split(',').map(c => c.trim())) : new Set();
        // Solo retorna los colores que NO están en la lista de agotados de ese producto
        return allColors.filter(color => !outOfStock.has(color));
    });
    
    const uniqueColors = [...new Set(availableColorsAcrossAllProducts)].filter(Boolean);


    // =============================================================
    // 2. EFECTO PARA CARGAR LOS PRODUCTOS DE LA API
    // =============================================================
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(SHEET_API_URL);
                if (!response.ok) {
                    throw new Error(`Error HTTP! Estado: ${response.status}`);
                }
                const data = await response.json();
                
                if (!Array.isArray(data)) {
                    console.error("La API no devolvió una lista de productos:", data);
                    setProducts([]); 
                    setFilteredProducts([]);
                    return;
                }

                setProducts(data); 
                setFilteredProducts(data); 
            } catch (error) {
                console.error("Error al cargar los productos:", error);
                setProducts([]); 
                setFilteredProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
        window.scrollTo(0, 0); 
    }, []); 

    // Función de filtrado 
    const runFilters = useCallback(() => {
        let tempProducts = [...products]; 

        // 1. Filtrar por búsqueda
        if (searchTerm) {
            tempProducts = tempProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.reference.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 2. Filtrar por categorías
        if (selectedCategories.length > 0) {
            tempProducts = tempProducts.filter(product => selectedCategories.includes(product.category));
        }

        // 3. Filtrar por TALLA
        if (selectedSizes.length > 0) {
            tempProducts = tempProducts.filter(product => {
                const availableSizesForProduct = product.reference.split(',').map(s => s.trim());
                return availableSizesForProduct.some(size => selectedSizes.includes(size));
            });
        }

        // 4. Filtrar por RIN
        if (selectedRins.length > 0) {
            tempProducts = tempProducts.filter(product => {
                const subcat = product.subcategoria || product.subcategory;
                return selectedRins.includes(subcat);
            });
        }


        // 5. Filtrar por colores (CONSIDERA EL STOCK)
        if (selectedColors.length > 0) {
            tempProducts = tempProducts.filter(product => {
                const outOfStockColors = product.colores_agotados ? 
                    new Set(product.colores_agotados.split(',').map(c => c.trim())) : new Set();
                
                return product.colors.some(color => 
                    selectedColors.includes(color) && 
                    !outOfStockColors.has(color)
                );
            });
        }

        // 6. Filtrar por rango de precio
        tempProducts = tempProducts.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);

        // 7. Ordenar los productos
        if (sortBy === 'price_asc') {
            tempProducts.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price_desc') {
            tempProducts.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'name_asc') {
            tempProducts.sort((a, b) => a.name.localeCompare(b.name));
        }

        setFilteredProducts(tempProducts);
    }, [selectedCategories, selectedRins, selectedSizes, selectedColors, priceRange, searchTerm, sortBy, products]); 

    useEffect(() => {
        runFilters();
    }, [runFilters, location.state]);

    // HANDLERS:

    const handleCategoryChange = (e) => {
        const { value, checked } = e.target;
        setSelectedCategories(prev =>
            checked ? [...prev, value] : prev.filter(cat => cat !== value)
        );
    };

    const handleSizeChange = (e) => {
        const { value, checked } = e.target;
        setSelectedSizes(prev =>
            checked ? [...prev, value] : prev.filter(size => size !== value)
        );
    };

    const handleRinChange = (e) => {
        const { value, checked } = e.target;
        setSelectedRins(prev =>
            checked ? [...prev, value] : prev.filter(rin => rin !== value)
        );
    };

    const handleColorChange = (e) => {
        const { value, checked } = e.target;
        setSelectedColors(prev =>
            checked ? [...prev, value] : prev.filter(color => color !== value)
        );
    };
    
    const handlePriceRangeChange = (e) => {
        const { value } = e.target;
        setPriceRange(prev => [parseInt(value), prev[1]]);
    };
    
    // Función para añadir al carrito (CORREGIDA)
    const handleAddToCart = (product, color, size) => {
        // 1. Obtener la lista completa de colores agotados (ARRAY)
        const outOfStockColorsList = product.colores_agotados ? 
            product.colores_agotados.split(',').map(c => c.trim()).filter(c => c) : 
            [];
        // 2. Crear el Set para búsquedas rápidas (como la verificación de stock)
        const outOfStockColorsSet = new Set(outOfStockColorsList); 
        
        // 3. Verifica stock por seguridad
        if (outOfStockColorsSet.has(color)) {
            toast.error(`❌ El color ${color} de ${product.name} está agotado.`, {
                position: "bottom-right",
                autoClose: 3000,
            });
            return;
        }

        const formattedColor = color.toLowerCase().replace(/\s/g, '');
        const uniqueId = `${product.id}-${formattedColor}-${size}`; 
        
        const itemToAdd = {
            id: uniqueId, 
            productId: product.id, 
            name: product.name,
            reference: product.reference, 
            price: product.price,
            image: product.images[color] || product.images[formattedColor] || product.mainImage, 
            selectedColor: color,
            selectedSize: size, 
            colors: product.colors,
            images: product.images,
            availableSizes: product.reference.split(',').map(s => s.trim()), 
            
            // 🚨 CORRECCIÓN CLAVE: Envía la lista COMPLETA de colores agotados del producto.
            // Esto permite que el CartModal filtre correctamente las opciones y verifique el stock.
            outOfStockColors: outOfStockColorsList, 
        };

        dispatch({
            type: "ADD_TO_CART",
            payload: itemToAdd,
        });

        const sizeDisplay = size && size !== 'Unica' ? ` - Talla ${size}` : '';
        toast.success(`✅ ${product.name} - ${color}${sizeDisplay} agregado al carrito!`, {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };
    
    // *** FUNCIÓN AUXILIAR PARA RENDERIZAR EL CONTENIDO DE LOS FILTROS ***
    const renderFilterContent = () => (
        <>
            <div className="filter-group mb-4 pb-3 border-bottom">
                <h5 className="filter-heading">Precio</h5>
                <div className="price-range-display mb-2">
                    $ {priceRange[0].toLocaleString('es-CO')} - $ {priceRange[1].toLocaleString('es-CO')}
                </div>
                <div className="d-flex align-items-center justify-content-between">
                    <input
                        type="range"
                        min="0"
                        max="3000000"
                        value={priceRange[0]}
                        name="minPrice"
                        onChange={handlePriceRangeChange}
                        className="form-range"
                    />
                </div>
                <div className="d-flex justify-content-between mt-2">
                    <small>$0</small>
                    <small>$3000000+</small>
                </div>
            </div>
            
            <div className="filter-group mb-4 pb-3 border-bottom">
                <h5 className="filter-heading">Categoría</h5>
                <div className="category-list filter-scroll-box">
                    {uniqueCategories.map(category => (
                        <div key={category} className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                value={category}
                                id={`cat-${category}`}
                                checked={selectedCategories.includes(category)} 
                                onChange={handleCategoryChange}
                            />
                            <label className="form-check-label" htmlFor={`cat-${category}`}>
                                {category}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {uniqueSizes.length > 0 && (
                <div className="filter-group mb-4 pb-3 border-bottom">
                    <h5 className="filter-heading">Talla</h5>
                    <div className="reference-list filter-scroll-box">
                        {uniqueSizes.map(size => (
                            <div key={size} className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value={size}
                                    id={`size-${size}`}
                                    checked={selectedSizes.includes(size)} 
                                    onChange={handleSizeChange}
                                />
                                <label className="form-check-label" htmlFor={`size-${size}`}>
                                    {size}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {uniqueRins.length > 0 && (
                <div className="filter-group mb-4 pb-3 border-bottom">
                    <h5 className="filter-heading">Rin</h5>
                    <div className="subcategory-list filter-scroll-box">
                        {uniqueRins.map(rin => (
                            <div key={rin} className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value={rin}
                                    id={`rin-${rin}`}
                                    checked={selectedRins.includes(rin)} 
                                    onChange={handleRinChange}
                                />
                                <label className="form-check-label" htmlFor={`rin-${rin}`}>
                                    {rin}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="filter-group mb-4 pb-3 border-bottom">
                <h5 className="filter-heading">Color</h5>
                <div className="color-filter-grid">
                    {uniqueColors.map(color => (
                        <div key={color} className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                value={color}
                                id={`color-${color}`}
                                checked={selectedColors.includes(color)}
                                onChange={handleColorChange}
                            />
                            <label className="form-check-label color-dot-label" htmlFor={`color-${color}`}>
                                <span className={`color-dot color-${color.toLowerCase().replace(/\s/g, '')}`} title={color}></span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );

    if (loading) {
        return (
            <div className="demo-page container-fluid py-5 text-center">
                <h4 className="mb-3">Cargando productos...</h4>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }
    
    if (!loading && products.length === 0) {
        return (
            <div className="demo-page container-fluid py-5 text-center">
                <h4>⚠️ No se encontraron productos. Revisa tu Google Sheet y el Apps Script.</h4>
                <p>Asegúrate de que la hoja tenga datos y el script esté publicado como "Cualquier persona".</p>
            </div>
        );
    }


    return (
        <div className="demo-page container-fluid py-5">
            <ToastContainer />
            
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/">Inicio</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Productos</li>
                </ol>
            </nav>

            <div className="row">
                
                <div className="col-12 d-lg-none mb-4">
                    <button 
                        className="btn btn-primary w-100 mobile-filter-btn"
                        onClick={() => setShowMobileFilters(true)}
                    >
                        Filtrar Productos
                    </button>
                </div>

                <aside className="col-lg-3 d-none d-lg-block filters-column">
                    <h4 className="filters-title mb-4">Filtrar Por</h4>
                    <div className="filters-content-scroll">
                        {renderFilterContent()}
                    </div>
                </aside>

                <main className="col-lg-9 col-12 products-grid-container">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <p className="product-count mb-0">Hay {filteredProducts.length} productos</p>
                        <div className="sort-by-group d-flex align-items-center">
                            <label htmlFor="sortSelect" className="me-2 text-muted">Ordenar por:</label>
                            <select
                                id="sortSelect"
                                className="form-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="default">Seleccionar</option>
                                <option value="name_asc">Nombre (A-Z)</option>
                                <option value="price_asc">Precio (Menor a Mayor)</option>
                                <option value="price_desc">Precio (Mayor a Menor)</option>
                            </select>
                        </div>
                    </div>

                    <div className="row product-cards-grid">
                        {filteredProducts.length === 0 ? (
                            <div className="col-12 text-center py-5">
                                <p className="lead">No se encontraron productos con los filtros seleccionados.</p>
                                <button className="btn btn-outline-secondary" onClick={() => {
                                    setSelectedCategories([]);
                                    setSelectedRins([]); 
                                    setSelectedSizes([]); 
                                    setSelectedColors([]);
                                    setPriceRange([0, 8000000]); 
                                    setSearchTerm('');
                                    setSortBy('default');
                                }}>
                                    Borrar Filtros
                                </button>
                            </div>
                        ) : (
                            filteredProducts.map(product => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    handleAddToCart={handleAddToCart}
                                />
                            ))
                        )}
                    </div>
                </main>
            </div>
            
            {/* Overlay/Offcanvas para Filtros Móviles */}
            {showMobileFilters && (
                <div className="mobile-filters-overlay d-lg-none">
                    <div className="filters-content-modal">
                        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                            <h4 className="filters-title mb-0">Filtrar Por</h4>
                            <button className="btn-close" onClick={() => setShowMobileFilters(false)}></button>
                        </div>
                        
                        {renderFilterContent()}
                        
                        <button 
                            className="btn btn-buy-product w-100 mt-4" 
                            onClick={() => setShowMobileFilters(false)}
                        >
                            Ver {filteredProducts.length} Productos
                        </button>
                    </div>
                </div>
            )}
            
            {/* Botones Flotantes */}
            <div className="floating-buttons-container">
                <button 
                    className="btn floating-btn cart-btn position-relative" 
                    onClick={handleShowCart}
                    title="Ver Carrito de Compras"
                >
                    <i className="fa-solid fa-cart-shopping"></i>
                    {cart.length > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {cart.length}
                        </span>
                    )}
                </button>
                <a 
                    href="https://wa.me/573228551469" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn floating-btn whatsapp-btn"
                    title="Contáctanos por WhatsApp"
                >
                    <i className="fa-brands fa-whatsapp"></i>
                </a>
            </div>

            {/* Modal del Carrito */}
            <CartModal show={showCart} handleClose={handleCloseCart} />

        </div>
    );
};