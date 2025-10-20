import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../Styles/carousel.css';

// Componente para las flechas de navegación
const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
};

const CarouselSection = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        <div className="carousel-slide">
          <img src="ruta/a/tu/imagen1.jpg" alt="Promoción de Bolsos" className="carousel-image" />
          <div className="carousel-overlay">
            <h1>Nueva Colección de Verano</h1>
            <p>Descubre los estilos más frescos de esta temporada.</p>
          </div>
        </div>
        <div className="carousel-slide">
          <img src="ruta/a/tu/imagen2.jpg" alt="Descuento especial" className="carousel-image" />
          <div className="carousel-overlay">
            <h1>¡-30% en toda la tienda!</h1>
            <p>Aprovecha nuestros precios de liquidación por tiempo limitado.</p>
          </div>
        </div>
        <div className="carousel-slide">
          <img src="ruta/a/tu/imagen3.jpg" alt="Nuestros valores" className="carousel-image" />
          <div className="carousel-overlay">
            <h1>Calidad y Tradición</h1>
            <p>Productos de cuero hechos a mano con pasión.</p>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default CarouselSection;