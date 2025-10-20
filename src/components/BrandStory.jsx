import React from 'react';
import '../Styles/story.css';

const BrandStory = () => {
  return (
    <section className="brand-story">
      <div className="story-content">
        <h2 className="section-title">Nuestra Historia</h2>
        <p>
          En Avana Leather, cada pieza cuenta una historia. Fundada con la pasión por el trabajo artesanal y el amor por el cuero genuino, nuestra marca se dedica a crear productos duraderos y atemporales.
        </p>
        <p>
          Creemos en la calidad sobre la cantidad, y cada artículo es diseñado y fabricado con el más alto nivel de detalle por artesanos expertos. Cuando eliges Avana, eliges un legado de tradición y excelencia.
        </p>
      </div>
      <div className="story-image">
        <img src="ruta/a/imagen/historia.jpg" alt="Historia de Avana Leather" />
      </div>
    </section>
  );
};

export default BrandStory;