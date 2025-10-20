import React from 'react';
import '../Styles/featured.css';

const products = [
  { id: 1, name: 'Bolso de Mano Elegante', price: '$250', image: 'ruta/a/imagen/bolso1.jpg' },
  { id: 2, name: 'Billetera de Cuero Clásica', price: '$80', image: 'ruta/a/imagen/billetera1.jpg' },
  { id: 3, name: 'Cinturón de Cuero Genuino', price: '$65', image: 'ruta/a/imagen/cinturon1.jpg' },
  { id: 4, name: 'Portafolio de Negocios', price: '$350', image: 'ruta/a/imagen/portafolio1.jpg' },
];

const FeaturedProducts = () => {
  return (
    <section className="featured-products">
      <h2 className="section-title">Nuestros Productos Destacados</h2>
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">{product.price}</p>
              <button className="buy-button">Comprar</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;