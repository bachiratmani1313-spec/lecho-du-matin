import React, { useState } from 'react';

const App = () => {
  const [selected, setSelected] = useState(null);

  const annonces = [
    { 
      id: '1', 
      title: 'PIZZA EXPRESS BRUXELLES', 
      zone: '1000 Bruxelles Centre', 
      desc: 'Restaurant italien authentique au cœur de Bruxelles. Pizzas faites maison, pâtes fraîches, ambiance chaleureuse. Ouvert 7j/7.',
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
      type: 'Restaurant'
    },
    { 
      id: '2', 
      title: 'CARREFOUR MARKET ETTERBEEK', 
      zone: '1040 Etterbeek', 
      desc: 'Supermarché moderne avec large gamme de produits. Fruits frais quotidiens, boucherie, fromagerie. Drive disponible.',
      image: 'https://images.unsplash.com/photo-1585521924905-c3400ca199e7?w=800&q=80',
      type: 'Supermarché'
    },
    { 
      id: '3', 
      title: 'SALON COIFFURE MICHEL', 
      zone: '1060 Saint-Gilles', 
      desc: 'Coiffeur professionnel depuis 25 ans. Coupes hommes et femmes, coloration, soins. Barbier traditionnel.',
      image: 'https://images.unsplash.com/photo-1585747860715-cd4628902046?w=800&q=80',
      type: 'Coiffeur'
    },
    { 
      id: '4', 
      title: 'CRÊPERIE FRANÇAISE SAINT-GILLES', 
      zone: '1060 Saint-Gilles', 
      desc: 'Crêperie traditionnelle française. Crêpes sucrées et salées, galettes bretonnes. Terrasse en été.',
      image: 'https://images.unsplash.com/photo-1586190936529-385a432d3ace?w=800&q=80',
      type: 'Restaurant'
    },
    { 
      id: '5', 
      title: 'PHARMACIE CENTRALE ANDERLECHT', 
      zone: '1070 Anderlecht', 
      desc: 'Pharmacie moderne avec équipe diplômée. Conseil en santé, ordonnances, produits de parapharmacie.',
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde0f?w=800&q=80',
      type: 'Pharmacie'
    },
    { 
      id: '6', 
      title: 'ALDI MOLENBEEK', 
      zone: '1080 Molenbeek', 
      desc: 'Supermarché discount qualité. Produits alimentaires variés, marques propres excellentes. Prix imbattables.',
      image: 'https://images.unsplash.com/photo-1578916547515-7ecbab49a803?w=800&q=80',
      type: 'Supermarché'
    },
    { 
      id: '7', 
      title: 'SPA RELAX ANDERLECHT', 
      zone: '1070 Anderlecht', 
      desc: 'Centre de bien-être avec massages, soins du visage, hammam. Équipe professionnelle, ambiance zen.',
      image: 'https://images.unsplash.com/photo-1596178065887-cf88eb7ce338?w=800&q=80',
      type: 'Spa'
    },
    { 
      id: '8', 
      title: 'THAI EXPRESS JETTE', 
      zone: '1090 Jette', 
      desc: 'Restaurant thaïlandais authentique. Curry, pad thai, soupes traditionnelles. Livraison et menu à emporter.',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
      type: 'Restaurant'
    },
    { 
      id: '9', 
      title: 'OPTICIEN VISION ETTERBEEK', 
      zone: '1040 Etterbeek', 
      desc: 'Opticien avec large choix de montures. Verres dernière génération, examen vue, réparations rapides.',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
      type: 'Optique'
    },
    { 
      id: '10', 
      title: 'BOULANGERIE ARTISAN JETTE', 
      zone: '1090 Jette', 
      desc: 'Boulangerie traditionnelle. Pain au levain naturel, pains complets, croissants beurre. Bio certifié.',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
      type: 'Boulangerie'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#FDFCF8', color: '#1f2937' }}>
      {/* Header */}
      <header style={{ borderBottom: '4px solid #000', margin: '16px 40px', paddingBottom: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.15em', color: '#666', marginBottom: '8px' }}>ANNONCES LOCALES BRUXELLES</p>
        <h1 style={{ fontSize: '64px', fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.02em', margin: '0 0 12px 0' }}>
          L'ÉCHO <span style={{ color: '#dc2626' }}>DU MATIN</span>
        </h1>
        <p style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.15em', color: '#666', margin: 0 }}>Les meilleurs commerces de votre quartier • Rédigé par Claude</p>
      </header>

      {/* Main */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {annonces.map((a, idx) => (
            <article 
              key={a.id} 
              style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '40px', cursor: 'pointer' }}
              onClick={() => setSelected(a)}
            >
              {/* Grid: Image + Content */}
              <div style={{ display: 'grid', gridTemplateColumns: idx % 2 === 0 ? '2fr 1fr' : '1fr 2fr', gap: '32px', alignItems: 'start' }}>
                {/* Image */}
                <div style={{ order: idx % 2 === 0 ? 1 : 2 }}>
                  <img 
                    src={a.image} 
                    alt={a.title}
                    style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>

                {/* Content */}
                <div style={{ order: idx % 2 === 0 ? 2 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 900, background: '#dc2626', color: 'white', padding: '4px 8px', borderRadius: '3px' }}>
                      {a.type.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '10px', color: '#999', fontWeight: 900 }}>★★★★★</span>
                  </div>

                  <h2 style={{ fontSize: '28px', fontWeight: 900, fontStyle: 'italic', margin: '0 0 12px 0', lineHeight: '1.1' }}>
                    {a.title}
                  </h2>

                  <p style={{ fontSize: '13px', color: '#999', fontWeight: 700, margin: '0 0 16px 0' }}>
                    📍 {a.zone}
                  </p>

                  <p style={{ fontSize: '14px', color: '#333', lineHeight: '1.6', margin: '0 0 16px 0', fontStyle: 'italic' }}>
                    {a.desc}
                  </p>

                  <button 
                    style={{
                      padding: '10px 20px',
                      background: '#000',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 900,
                      fontSize: '12px',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    Voir la fiche
                  </button>
                </div>
              </div>
            </article>
          ))}

          {/* CTA */}
          <div style={{ padding: '40px', background: '#1f2937', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 12px 0' }}>Votre commerce dans L'ÉCHO DU MATIN</h3>
            <p style={{ fontSize: '14px', margin: '0 0 20px 0' }}>À partir de 1€ • Rejoignez 150+ commerces locaux</p>
            <button style={{ padding: '12px 32px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 900, cursor: 'pointer', fontSize: '12px' }}>
              AJOUTER VOTRE ANNONCE
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: '#1f2937', color: 'white', padding: '48px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontStyle: 'italic', fontWeight: 900, margin: '0 0 12px 0' }}>L'ÉCHO DU MATIN</h2>
        <p style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#999', margin: 0 }}>ANNUAIRE DES COMMERCES LOCAUX • RÉDIGÉ PAR CLAUDE</p>
      </footer>

      {/* Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'white', overflowY: 'auto' }}>
          <div style={{ position: 'sticky', top: 0, padding: '24px 40px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✕</button>
            <span style={{ fontSize: '16px', fontStyle: 'italic', fontWeight: 900 }}>L'ÉCHO DU MATIN</span>
            <div></div>
          </div>

          <article style={{ maxWidth: '900px', margin: '0 auto', padding: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <span style={{ fontSize: '11px', fontWeight: 900, background: '#dc2626', color: 'white', padding: '6px 12px', borderRadius: '3px' }}>
                {selected.type.toUpperCase()}
              </span>
              <span style={{ fontSize: '11px', color: '#999', fontWeight: 900 }}>★★★★★</span>
            </div>

            <h2 style={{ fontSize: '48px', fontWeight: 900, fontStyle: 'italic', margin: '0 0 24px 0', lineHeight: '1.1' }}>
              {selected.title}
            </h2>

            <p style={{ fontSize: '14px', color: '#999', fontWeight: 700, margin: '0 0 24px 0' }}>
              📍 {selected.zone}
            </p>

            <img 
              src={selected.image} 
              alt={selected.title}
              style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '4px', marginBottom: '40px', border: '2px solid #000' }}
            />

            <p style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '40px', color: '#333', fontStyle: 'italic' }}>
              {selected.desc}
            </p>

            <button
              style={{
                padding: '14px 32px',
                background: '#000',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 900,
                fontSize: '13px',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Contacter le commerce
            </button>
          </article>
        </div>
      )}
    </div>
  );
};

export default App;
