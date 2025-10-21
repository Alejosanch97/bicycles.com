import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer.jsx';
import { CartModal } from "../components/CartModal.jsx";
import { ToastContainer, toast } from 'react-toastify'; // 👈 IMPORTADO: Toast
import 'react-toastify/dist/ReactToastify.css'; // 👈 IMPORTADO: Estilos de Toastify
import '../Styles/demo.css';

// 🚨🚨🚨 1. DEFINIR LA URL DE LA API AQUI 🚨🚨🚨
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbxqUoCMBgc7pNT7AWH3f1bguHlRB_IzEpO6SKIPDQ-lJ6uIMAlywB6EzWOzXLqpEu89/exec";

// Componente individual de la tarjeta de producto (sin cambios)
const ProductCard = ({ product, handleAddToCart }) => {
    // ... (ProductCard se mantiene igual)
    const [currentImage, setCurrentImage] = useState(product.mainImage);
    const [currentColor, setCurrentColor] = useState(product.colors[0]);

    const handleImageHover = () => {
        if (product.hoverImage) {
            setCurrentImage(product.hoverImage);
        }
    };

    const handleImageLeave = () => {
        setCurrentImage(product.mainImage);
    };

    const handleColorHover = (color) => {
        const formattedColor = color.toLowerCase().replace(/\s/g, '');
        // Asegúrate de que 'images' exista antes de acceder
        const imageToDisplay = product.images?.[formattedColor];
        if (imageToDisplay) {
            setCurrentImage(imageToDisplay);
            setCurrentColor(color);
        } else {
            setCurrentImage(product.mainImage);
            setCurrentColor(product.colors[0]);
        }
    };
    
    const handleAddClick = () => {
        handleAddToCart(product, currentColor);
    };

    return (
        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 mb-4">
            <div 
                className="product-card h-100 position-relative"
            >
                {/* Usar currentImage, que es dinámica */}
                <img 
                    src={currentImage} 
                    className="card-img-top product-image" 
                    alt={product.name}
                    onMouseEnter={handleImageHover}
                    onMouseLeave={handleImageLeave}
                />
                <div className="card-body text-center">
                    <h5 className="product-card-title">{product.name}</h5>
                    <p className="product-reference text-muted">{product.reference}</p>
                    <div className="product-colors mb-2">
                        {/* Iterar sobre product.colors, que viene de la API */}
                        {product.colors.map(color => (
                            <span 
                                key={color} 
                                className={`color-dot color-${color.toLowerCase().replace(/\s/g, '')} ${currentColor === color ? 'active-color' : ''}`}
                                title={color}
                                onMouseEnter={() => handleColorHover(color)}
                                onClick={() => handleColorHover(color)}
                            ></span>
                        ))}
                    </div>
                    {/* toLocaleString para formato de moneda */}
                    <p className="product-price">$ {product.price.toLocaleString('es-CO')}</p> 
                    <button 
                        className="btn btn-buy-product mt-auto"
                        onClick={handleAddClick}
                    >
                        Comprar
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
    const [priceRange, setPriceRange] = useState([0, 8000000]);
    const [selectedCategories, setSelectedCategories] = useState(initialCategory);
    // ✅ NUEVOS ESTADOS DE FILTRO
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    const [selectedReferences, setSelectedReferences] = useState([]); 
    const [selectedColors, setSelectedColors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('default');
    const [showMobileFilters, setShowMobileFilters] = useState(false); 

    // ✅ CÁLCULO DINÁMICO: Aseguramos que se actualicen al cargar 'products'.
    const uniqueCategories = [...new Set(products.map(p => p.category))].filter(Boolean);
    
    // ✅ CORRECCIÓN CLAVE: Usamos 'subcategoria' (sin acento) para coincidir con la API de Google Script.
    const uniqueSubcategories = [...new Set(products.map(p => p.subcategoria || p.subcategory))].filter(Boolean); 
    
    const uniqueReferences = [...new Set(products.map(p => p.reference))].filter(Boolean);
    const uniqueColors = [...new Set(products.flatMap(p => p.colors || []))].filter(Boolean);


    // =============================================================
    // 🚨 2. EFECTO PARA CARGAR LOS PRODUCTOS DE LA API (CLAVE)
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
                setFilteredProducts(data); // Inicializar productos filtrados
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

        // 1. Filtrar por búsqueda (Referencia y Nombre)
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

        // ✅ 3. Filtrar por subcategorías (Usando la propiedad corregida o la anterior)
        if (selectedSubcategories.length > 0) {
            tempProducts = tempProducts.filter(product => selectedSubcategories.includes(product.subcategoria || product.subcategory));
        }

        // ✅ 4. Filtrar por referencias
        if (selectedReferences.length > 0) {
            tempProducts = tempProducts.filter(product => selectedReferences.includes(product.reference));
        }

        // 5. Filtrar por colores
        if (selectedColors.length > 0) {
            tempProducts = tempProducts.filter(product => product.colors.some(color => selectedColors.includes(color)));
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
    }, [selectedCategories, selectedSubcategories, selectedReferences, selectedColors, priceRange, searchTerm, sortBy, products]); 

    useEffect(() => {
        runFilters();
    }, [runFilters, location.state]);

    // ✅ HANDLERS COMPLETOS: Lógica necesaria para marcar/desmarcar checkboxes

    const handleCategoryChange = (e) => {
        const { value, checked } = e.target;
        setSelectedCategories(prev =>
            checked ? [...prev, value] : prev.filter(cat => cat !== value)
        );
    };

    // ✅ NUEVO HANDLER: Subcategoría
    const handleSubcategoryChange = (e) => {
        const { value, checked } = e.target;
        setSelectedSubcategories(prev =>
            checked ? [...prev, value] : prev.filter(subcat => subcat !== value)
        );
    };

    // ✅ NUEVO HANDLER: Referencia
    const handleReferenceChange = (e) => {
        const { value, checked } = e.target;
        setSelectedReferences(prev =>
            checked ? [...prev, value] : prev.filter(ref => ref !== value)
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
    
    // Función para añadir al carrito (MODIFICADA para incluir la notificación)
    const handleAddToCart = (product, color) => {
        const formattedColor = color.toLowerCase().replace(/\s/g, '');
        const itemToAdd = {
            id: product.id,
            name: product.name,
            reference: product.reference,
            price: product.price,
            // Usamos product.images, que viene de la API
            image: product.images[formattedColor] || product.mainImage, 
            selectedColor: color,
            colors: product.colors,
            images: product.images,
        };

        dispatch({
            type: "ADD_TO_CART",
            payload: itemToAdd,
        });

        // 🚨 AQUÍ ESTÁ LA NOTIFICACIÓN 🚨
        toast.success(`✅ ${product.name} - ${color} agregado al carrito!`, {
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
                        max="8000000"
                        value={priceRange[0]}
                        name="minPrice"
                        onChange={handlePriceRangeChange}
                        className="form-range"
                    />
                </div>
                <div className="d-flex justify-content-between mt-2">
                    <small>$0</small>
                    <small>$8000000+</small>
                </div>
            </div>
            
            {/* Filtro de Categoría existente */}
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

            {/* ✅ FILTRO: Talla (Referencia) */}
            {uniqueReferences.length > 0 && (
                <div className="filter-group mb-4 pb-3 border-bottom">
                    <h5 className="filter-heading">Talla</h5>
                    <div className="reference-list filter-scroll-box">
                        {uniqueReferences.map(reference => (
                            <div key={reference} className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value={reference}
                                    id={`ref-${reference}`}
                                    checked={selectedReferences.includes(reference)} 
                                    onChange={handleReferenceChange}
                                />
                                <label className="form-check-label" htmlFor={`ref-${reference}`}>
                                    {reference}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* ✅ FILTRO: Subcategoría (Debe aparecer con la corrección de la propiedad) */}
            {uniqueSubcategories.length > 0 && (
                <div className="filter-group mb-4 pb-3 border-bottom">
                    <h5 className="filter-heading">Rin</h5>
                    <div className="subcategory-list filter-scroll-box">
                        {uniqueSubcategories.map(subcategory => (
                            <div key={subcategory} className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value={subcategory}
                                    id={`subcat-${subcategory}`}
                                    checked={selectedSubcategories.includes(subcategory)} 
                                    onChange={handleSubcategoryChange}
                                />
                                <label className="form-check-label" htmlFor={`subcat-${subcategory}`}>
                                    {subcategory}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Filtro de Color existente */}
            <div className="filter-group mb-4 pb-3 border-bottom">
                <h5 className="filter-heading">Color</h5>
                <div className="color-filter-grid">
                    {/* ✅ Mapeo de colores con la lista única */}
                    {uniqueColors.map(color => (
                        <div key={color} className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                value={color}
                                id={`color-${color}`}
                                // ✅ Usar selectedColors para ver si debe estar marcado
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

    // =============================================================
    // 🚨 3. MANEJAR ESTADO DE CARGA (LOADING)
    // =============================================================
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
    
    // Si ya cargó y no hay productos
    if (!loading && products.length === 0) {
        return (
            <div className="demo-page container-fluid py-5 text-center">
                <h4>⚠️ No se encontraron productos. Revisa tu Google Sheet y el Apps Script.</h4>
                <p>Asegúrate de que la hoja tenga datos y el script esté publicado como "Cualquier persona".</p>
            </div>
        );
    }


    // *** INICIO DEL RENDER PRINCIPAL (Si ya cargó y hay productos) ***
    return (
        <div className="demo-page container-fluid py-5">
            {/* 🚨 AÑADIR ToastContainer AQUÍ 🚨 */}
            <ToastContainer />
            
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/">Inicio</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Productos</li>
                </ol>
            </nav>

            <div className="row">
                
                {/* 1. Botón de Filtro para Móviles */}
                <div className="col-12 d-lg-none mb-4">
                    <button 
                        className="btn btn-primary w-100 mobile-filter-btn"
                        onClick={() => setShowMobileFilters(true)}
                    >
                        Filtrar Productos
                    </button>
                </div>

                {/* 2. Columna de Filtros de Escritorio */}
                <aside className="col-lg-3 d-none d-lg-block filters-column">
                    <h4 className="filters-title mb-4">Filtrar Por</h4>
                    {/* ✅ DIV DEL SCROLL AÑADIDO AQUÍ */}
                    <div className="filters-content-scroll">
                        {renderFilterContent()}
                    </div>
                </aside>

                {/* 3. Contenedor Principal de Productos */}
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
                                    setSelectedSubcategories([]); // ✅ Limpiar subcategorías
                                    setSelectedReferences([]); // ✅ Limpiar referencias
                                    setSelectedColors([]);
                                    setPriceRange([0, 8000000]); // Ajustado a max de 8M
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
            
            {/* 4. Overlay/Offcanvas para Filtros Móviles (renderFilterContent) */}
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
            
            {/* 5. Botones Flotantes */}
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
                    href="https://wa.me/573143563567" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn floating-btn whatsapp-btn"
                    title="Contáctanos por WhatsApp"
                >
                    <i className="fa-brands fa-whatsapp"></i>
                </a>
            </div>

            {/* 6. Modal del Carrito */}
            <CartModal show={showCart} handleClose={handleCloseCart} />

        </div>
    );
};