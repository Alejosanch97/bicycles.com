import React, { useState } from 'react'; // 👈 IMPORTADO: useState
import { useNavigate } from 'react-router-dom';
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/home.css';
// Se agregaron íconos para la nueva sección de pagos
import { FaShippingFast, FaCalendarCheck, FaMoneyBillWave, FaMobileAlt, FaCreditCard, FaLink, FaStore, FaPhoneAlt } from 'react-icons/fa'; 
import { CartModal } from "../components/CartModal.jsx"; // 👈 IMPORTADO: CartModal (Ajusta la ruta si es necesario)


export const Home = () => {
    // Lógica del Carrito (Copiada de Navbar)
    const [showCart, setShowCart] = useState(false);
    const handleShowCart = () => setShowCart(true);
    const handleCloseCart = () => setShowCart(false);

    const { store, dispatch } = useGlobalReducer();
    const { cart } = store; // 👈 OBTENER el contenido del carrito
    const navigate = useNavigate();

    // Datos de los Productos Destacados
    const products = [
        { id: 1, name: 'GW EXTREME DE IMPULSO', price: 240000, category: 'Bicicletas para Niños', image: 'https://i.pinimg.com/736x/d3/4a/20/d34a203eac36c7d20a8855544e276f44.jpg' },
        { id: 2, name: 'GW CANDY Rin 12', price: 340000, category: 'Bicicletas para Niños', image: 'https://www.classbike.co/wp-content/uploads/2022/11/RIN-16-PWP.webp' },
        { id: 3, name: 'GW LIGHTNING Rin 12', price: 350000, category: 'Bicicletas para Niños', image: 'https://tu360compras.bancolombia.com/624324-large_default/bicicleta-para-nios-rin-12-gw-lightning-lila-perla.jpg' },
        { id: 4, name: 'GW PILOT Rin 16', price: 340000, category: 'Bicicletas para Niños', image: 'https://wuilpy.com/wp-content/uploads/2025/10/Bicicleta-para-ninos-Rin-12-Gw-Pilot-Rojo-Wuilpy-Bike-300x300.png' },
        { id: 5, name: 'GW LINX 7X3 Rin 20', price: 630000, category: 'Bicicletas para Niños', image: 'https://http2.mlstatic.com/D_NQ_NP_2X_952673-MCO89228698842_082025-T.webp' },
        { id: 6, name: 'GW MONKEY ALUMINIO 7 X 3 Riin 20', price: 630000, category: 'Bicicletas para Niños', image: 'https://www.cyclewear.com.co/cdn/shop/files/060728-77476-0-bf6c8515-11b9-4b9d-b7fb-fd9711b6344a_cc3d2400-03a9-4215-a8d7-a51609d105e1.jpg?v=1732595751' },
        { id: 7, name: 'BICICLETA OPTIMUS TUCANA 12 VEL Rin 29', price: 1850000, category: 'Bicicletas MTB', image: 'https://www.optimusbikes.com/cdn/shop/products/Tucana-verde-1.png?v=1628696540' },
        { id: 8, name: 'BICICLETA RIN 28 TURISMERA Rin 28', price: 780000, category: 'Bicicletas MTB', image: 'https://i.pinimg.com/736x/ec/1b/05/ec1b055014ac9ad48a71bddb7565ed32.jpg' }
    ];

    const categories = [
        { id: 1, name: 'Bicicletas para Niños', image: 'https://i.pinimg.com/474x/77/ea/f2/77eaf2d0c0c4828ad2f2a25d46967c53.jpg' },
        { id: 2, name: 'Mountain Bike (MTB) y Bicicletas de Ruta', image: 'https://i.pinimg.com/736x/12/05/f1/1205f1a8b7a123a3fa6b785744fa8d0e.jpg' },
        { id: 3, name: 'E-Bikes', image: 'https://i.pinimg.com/736x/80/94/70/8094700b1f2234ae247cea65da565103.jpg' },
        { id: 4, name: 'Accesorios y Repuestos', image: 'https://i.pinimg.com/1200x/d6/18/4e/d6184e195ec7194a5b44509f995a13df.jpg' },
    ];

    // Función para añadir productos al carrito
    const handleAddToCart = (product) => {
        dispatch({ type: "ADD_TO_CART", payload: product });
        toast.success(`${product.name} agregado al carrito!`, {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    // Nueva función para manejar el clic en la categoría y navegar
    const handleCategoryClick = (categoryName) => {
        navigate('/demo', { state: { category: categoryName } });
    };

    // FUNCIÓN PARA MOSTRAR LA NOTIFICACIÓN DE GIFT CARD
    const handleGiftCardClick = (e) => {
        e.preventDefault(); // Evita que el enlace recargue la página
        toast.info("¡Próximamente! Estamos trabajando para que puedas comprar tus Gift Cards.", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    return (
        <div className="home-container">
            {/* Agregamos el ToastContainer al final del componente */}
            <ToastContainer />
            <div className="top-banner-envios" style={{ backgroundColor: '#750901ff' }}>
                <p className="banner-text-envios">Envíos flash: Entregas en 2 a 5 días hábiles</p>
            </div>
            {/* Sección del Carrusel (Carousel de Bootstrap) */}
            <section className="carousel-section">
                <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
                    {/* Indicadores: Ajustados para 5 slides (antes había 4, ahora hay 5 con la nueva) */}
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1 (Bicicletas Nevada)"></button>
                        <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="1" aria-label="Slide 2 (Medios de Pago)"></button>
                        <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="2" aria-label="Slide 3 (Envios Gratis)"></button>
                        <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="3" aria-label="Slide 4 (Video)"></button>
                        <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="4" aria-label="Slide 5 (Descuentos)"></button>
                    </div>

                    <div className="carousel-inner">
                        
                        {/* 1. SLIDE: BICICLETAS NEVADA (Original 2, ahora 1) - ACTIVA */}
                        <div className="carousel-item active">
                            {/* La imagen de fondo */}
                            <img
                                src="./bici1.jpg" // Utiliza la imagen que tenías antes
                                className="d-block w-100 carousel-media"
                                alt="Avana Leather Banner"
                            />

                            {/* Contenedor principal del texto y las cards */}
                            <div className="custom-caption-overlay d-flex flex-column align-items-center justify-content-center text-center text-white px-4">
                                {/* Título principal */}
                                <h1 className="avana-title">
                                    BICICLETAS NEVADA
                                </h1>

                                {/* Contenedor de las mini cards (ENVIOS, ENTREGAS, PAGOS) */}
                                <div className="container info-boxes-container">
                                    <div className="row g-3 justify-content-center">
                                        {/* 1️⃣ Envíos */}
                                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                            <div className="info-box d-flex flex-column align-items-center p-3">
                                                <div className="info-icon mb-2">
                                                    <FaShippingFast size={32} />
                                                </div>
                                                <h3 className="info-box-title">ENVIOS</h3>
                                                <p className="info-box-text">Cobertura en todo el país</p>
                                            </div>
                                        </div>

                                        {/* 2️⃣ Entregas */}
                                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                            <div className="info-box d-flex flex-column align-items-center p-3">
                                                <div className="info-icon mb-2">
                                                    <FaCalendarCheck size={32} />
                                                </div>
                                                <h3 className="info-box-title">ENTREGAS</h3>
                                                <p className="info-box-text">De 2 a 5 días hábiles</p>
                                            </div>
                                        </div>

                                        {/* 3️⃣ Pago Contra Entrega */}
                                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                            <div className="info-box d-flex flex-column align-items-center p-3">
                                                <div className="info-icon mb-2">
                                                    <FaMoneyBillWave size={32} />
                                                </div>
                                                <h3 className="info-box-title">PAGOS</h3>
                                                <p className="info-box-text">Contra entrega</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. SLIDE: ENVIOS GRATIS (Original 4, ahora 3) */}
                        <div className="carousel-item">
                            <img src="./bici4.png" className="d-block w-100 carousel-media" alt="Descuento especial" />  
                            <div className="carousel-caption">
                                <h1>¡Envios Gratis!</h1>
                                <p>Envíos gratis en Bogotá 🚴‍♂️. ¡Aprovecha nuestro Super Sale y llévate tu bicicleta favorita al mejor precio!</p>
                            </div>
                        </div>

                        {/* 3. SLIDE: MEDIOS DE PAGO (NUEVO) */}
                        <div className="carousel-item">
                            {/* La imagen de fondo. Usamos una imagen de pagos/bici. */}
                            <img
                                src="./bici5.jpg" // Reutilizamos esta imagen para el fondo
                                className="d-block w-100 carousel-media"
                                alt="Medios de Pago"
                            />

                            {/* Contenedor principal del texto y las cards */}
                            <div className="custom-caption-overlay d-flex flex-column align-items-center justify-content-center text-center text-white px-4">
                                {/* Título principal */}
                                <h1 className="avana-title">
                                    MEDIOS DE PAGO
                                </h1>

                                {/* Contenedor de las mini cards (PAGOS) */}
                                <div className="container info-boxes-container">
                                    <div className="row g-3 justify-content-center">
                                        
                                        {/* 1️⃣ Daviplata y Nequi */}
                                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                            <div className="info-box d-flex flex-column align-items-center p-3">
                                                <div className="info-icon mb-2">
                                                    <FaMobileAlt size={32} />
                                                </div>
                                                <h3 className="info-box-title">DAVIPLATA</h3>
                                                <p className="info-box-text">+57 314 356 35 67</p>
                                            </div>
                                        </div>

                                        {/* 2️⃣ Tarjeta (Débito/Crédito) */}
                                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                            <div className="info-box d-flex flex-column align-items-center p-3">
                                                <div className="info-icon mb-2">
                                                    <FaCreditCard size={32} />
                                                </div>
                                                <h3 className="info-box-title">TARJETAS Y TRANSFERENCIAS</h3>
                                            </div>
                                        </div>

                                        {/* 3️⃣ Link de Pago */}
                                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                            <div className="info-box d-flex flex-column align-items-center p-3">
                                                <div className="info-icon mb-2">
                                                    <FaLink size={32} />
                                                </div>
                                                <h3 className="info-box-title">LINK DE PAGO</h3>
                                                <p className="info-box-text">Fácil y Seguro</p>
                                            </div>
                                        </div>
                                        
                                        {/* 4️⃣ Sistecredito y Addi (Canales Presenciales) */}
                                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                            <div className="info-box d-flex flex-column align-items-center p-3">
                                                <div className="info-icon mb-2">
                                                    <FaStore size={32} />
                                                </div>
                                                <h3 className="info-box-title">CRÉDITO</h3>
                                                <p className="info-box-text">Sistecredito / Addi (Presencial)</p>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. SLIDE: VIDEO (Original 1, ahora 4) */}
                        <div className="carousel-item">
                            <video className="d-block w-100 carousel-media" autoPlay muted loop playsInline>
                                <source src="./6420515-hd_1920_1080_24fps.mp4" type="video/mp4" />
                                Tu navegador no soporta videos.
                            </video>
                            
                            <div className="carousel-caption">
                                <h1>Libera la Velocidad</h1>
                                <p>Diseñadas para devorar kilómetros. Encuentra la máquina perfecta para tu próxima aventura.</p>
                            </div>
                        </div>

                        {/* 5. SLIDE: DESCUENTOS IMPERDIBLES (Original 3, ahora 5) */}
                        <div className="carousel-item">
                            <img src="./bici2.png" className="d-block w-100 carousel-media" alt="Descuento especial" />
                            <div className="carousel-caption">
                                <h1>¡Descuentos Imperdibles!</h1>
                                <p>Descubre referencias exclusivas de marcas como Optimus, GW, Venzo.</p>
                            </div>
                        </div>

                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </section>
            {/* --- */}

            {/* Nueva Sección: Texto "Hecho en Pasto, Colombia" */}
            <section className="info-section text-center bg-light-gray section-wrapper">
                <h2 className="section-title">Pedaleando con Pasión <span className="text-colombia">Colombiana</span></h2>
                <p className="info-text">Somos tu punto de partida. Distribuidores oficiales de las mejores marcas, garantizando calidad y rendimiento en cada kilómetro.</p>
            </section>

            {/* Nueva Sección: Categorías de Productos */}
            <section className="categories-section container bg-white section-wrapper">
                <h2 className="text-center section-title">Categorías</h2>
                <div className="row category-grid">
                    {categories.map(category => (
                        <div
                            key={category.id}
                            className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                            onClick={() => handleCategoryClick(category.name)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="card category-card h-100">
                                <img src={category.image} className="card-img-top category-image" alt={category.name} />
                                <div className="card-body d-flex flex-column align-items-center text-center">
                                    <h3 className="card-title category-name">{category.name}</h3>
                                    <div className="btn category-button mt-auto">Ver Más</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Nueva Sección: El Alma de Avana */}
            <section className="quality-section bg-light-gray section-wrapper">
                <div className="container">
                    <h2 className="text-center section-title mb-5">Detalles que Marcan la Diferencia</h2>
                    <div className="row justify-content-center align-items-center">

                        {/* Columna Izquierda */}
                        <div className="col-md-4">
                            <div className="quality-item mb-4">
                                <h3 className="section-title-small">1. Cuadro en acero resistente</h3>
                                <p>
                                    El cuadro está fabricado en acero de alta calidad, ofreciendo solidez y durabilidad. Su diseño estructural garantiza estabilidad y soporte en todo tipo de terrenos.
                                </p>
                            </div>

                            <div className="quality-item">
                                <h3 className="section-title-small">2. Ruedas con aros reforzados</h3>
                                <p>
                                    Las llantas están diseñadas con materiales resistentes que aseguran un rodado suave y seguro. Su estructura soporta el uso diario y proporciona un excelente rendimiento.
                                </p>
                            </div>
                        </div>

                        {/* Columna Central para la Imagen */}
                        <div className="col-md-4 text-center">
                            <img src="./bici3.png" className="img-fluid central-image" alt="Detalles de calidad del producto" />
                        </div>

                        {/* Columna Derecha */}
                        <div className="col-md-4">
                            <div className="quality-item mb-4">
                                <h3 className="section-title-small">3. Manillar ergonómico en acero</h3>
                                <p>
                                    El manillar combina resistencia con un diseño cómodo que facilita el control de la bicicleta. Ofrece una experiencia de manejo estable y segura.
                                </p>
                            </div>

                            <div className="quality-item">
                                <h3 className="section-title-small">4. Sillín acolchado</h3>
                                <p>
                                    El asiento está diseñado para brindar comodidad en recorridos largos o cortos. Su ergonomía reduce la presión y mejora la experiencia de pedaleo.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección de Productos Destacados */}
            <section className="featured-products container bg-white section-wrapper">
                <h2 className="text-center section-title">Nuestros Productos Destacados</h2>
                <div id="productCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-wrap="true">
                    <div className="carousel-inner">
                        {products.map((product, index) => (
                            <div key={product.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                <div className="d-flex justify-content-center">
                                    <div className="card product-card h-100" style={{ maxWidth: "320px", width: "100%" }}>
                                        <img src={product.image} className="card-img-top product-image" alt={product.name} />
                                        <div className="card-body d-flex flex-column align-items-center text-center">
                                            <h3 className="card-title product-name">{product.name}</h3>
                                            <p className="card-text product-price">$ {product.price.toLocaleString('es-CO')}</p>
                                            <button
                                                className="btn buy-button mt-auto"
                                                onClick={() => handleAddToCart(product)}>
                                                Comprar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Anterior</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Siguiente</span>
                    </button>
                </div>
            </section>

            {/* Sección de Comentarios de Clientes (Testimonios) */}
            <section className="testimonials-section bg-light-gray section-wrapper">
                <div className="container">
                    <h2 className="text-center section-title">La Opinión de Nuestros Ciclistas</h2>
                    <p className="text-center section-subtitle">Miles de kilómetros y experiencias nos respaldan.</p>
                    {/* Carrusel de Testimonios */}
                    <div id="testimonialCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="5000">
                        <div className="carousel-inner">
                            {/* 1. Testimonio Ejemplo 1: Rendimiento */}
                            <div className="carousel-item active">
                                <div className="testimonial-box">
                                    <i className="fa-solid fa-quote-left testimonial-icon"></i>
                                    <p className="testimonial-text">"La bicicleta de ruta que compré aquí es una máquina. El servicio fue rápido y la asesoría en tallaje fue perfecta. ¡Superaron mis expectativas!"</p>
                                    <div className="testimonial-author-rating">
                                        <span className="testimonial-author">— Juan P. Gómez</span>
                                        <div className="star-rating">
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* 2. Testimonio Ejemplo 2: Calidad y Marcas */}
                            <div className="carousel-item">
                                <div className="testimonial-box">
                                    <i className="fa-solid fa-quote-left testimonial-icon"></i>
                                    <p className="testimonial-text">"Pude encontrar mi GW favorita al mejor precio. Se nota que solo manejan marcas de calidad. La entrega fue en menos de 3 días hábiles. ¡Recomendado 100%!"</p>
                                    <div className="testimonial-author-rating">
                                        <span className="testimonial-author">— María C. Rojas</span>
                                        <div className="star-rating">
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star-half-stroke"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* 3. Testimonio Ejemplo 3: Servicio al Cliente y Variedad */}
                            <div className="carousel-item">
                                <div className="testimonial-box">
                                    <i className="fa-solid fa-quote-left testimonial-icon"></i>
                                    <p className="testimonial-text">"El servicio al cliente es excepcional. Tenía dudas sobre la talla y me asesoraron perfectamente. La variedad de productos es enorme, encontré todo lo que necesitaba para mi bici."</p>
                                    <div className="testimonial-author-rating">
                                        <span className="testimonial-author">— Juan P. Gómez</span>
                                        <div className="star-rating">
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 4. Testimonio Ejemplo 4: Rapidez y Empaque */}
                            <div className="carousel-item">
                                <div className="testimonial-box">
                                    <i className="fa-solid fa-quote-left testimonial-icon"></i>
                                    <p className="testimonial-text">"¡Increíblemente rápido! Mi pedido llegó al día siguiente y el empaque era perfecto, todo protegido. La calidad de los repuestos Shimano es la esperada. Volveré a comprar sin dudarlo."</p>
                                    <div className="testimonial-author-rating">
                                        <span className="testimonial-author">— Laura V. M.</span>
                                        <div className="star-rating">
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 5. Testimonio Ejemplo 5: Precios y Facilidad de Compra */}
                            <div className="carousel-item">
                                <div className="testimonial-box">
                                    <i className="fa-solid fa-quote-left testimonial-icon"></i>
                                    <p className="testimonial-text">"Los mejores precios que encontré online para accesorios Specialized. La página web es muy fácil de usar y el proceso de pago fue muy simple. Excelente experiencia de compra."</p>
                                    <div className="testimonial-author-rating">
                                        <span className="testimonial-author">— Carlos A. Restrepo</span>
                                        <div className="star-rating">
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star-half-stroke"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 6. Testimonio Ejemplo 6: Productos Específicos y Confianza */}
                            <div className="carousel-item">
                                <div className="testimonial-box">
                                    <i className="fa-solid fa-quote-left testimonial-icon"></i>
                                    <p className="testimonial-text">"Compré un grupo SRAM y superó mis expectativas. Es difícil encontrar estos componentes con tanta garantía. Totalmente confiables y serios con los tiempos de entrega."</p>
                                    <div className="testimonial-author-rating">
                                        <span className="testimonial-author">— Sofía G. P.</span>
                                        <div className="star-rating">
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 7. Testimonio Ejemplo 7: Ideal para Principiantes y Asesoría */}
                            <div className="carousel-item">
                                <div className="testimonial-box">
                                    <i className="fa-solid fa-quote-left testimonial-icon"></i>
                                    <p className="testimonial-text">"Como principiante, estaba perdida, pero el chat de soporte me ayudó a elegir la bicicleta perfecta para empezar. ¡Muy agradecida por la paciencia y la excelente atención!"</p>
                                    <div className="testimonial-author-rating">
                                        <span className="testimonial-author">— Daniel J. B.</span>
                                        <div className="star-rating">
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star-half-stroke"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Indicadores (Opcional, si quieres ver en qué slide estás) */}
                        <div className="carousel-indicators testimonial-indicators">
                            <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                            <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                            <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
                            <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="3" aria-label="Slide 4"></button>
                            <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="4" aria-label="Slide 5"></button>
                            <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="5" aria-label="Slide 6"></button>
                            <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="6" aria-label="Slide 7"></button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Botones Flotantes (NUEVOS: Carrito y WhatsApp) */}
            <div className="floating-buttons-container">
                {/* Botón de Carrito Flotante (Encima) */}
                <button
                    className="btn floating-btn cart-btn position-relative"
                    onClick={handleShowCart}
                    title="Ver Carrito de Compras"
                >
                    <i className="fa-solid fa-cart-shopping"></i>
                    {/* Contador de ítems */}
                    {cart.length > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {cart.length}
                        </span>
                    )}
                </button>
                {/* Botón de WhatsApp Flotante (Debajo) */}
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

            {/* Modal del Carrito (NUEVO) */}
            <CartModal show={showCart} handleClose={handleCloseCart} />
        </div>
    );
};