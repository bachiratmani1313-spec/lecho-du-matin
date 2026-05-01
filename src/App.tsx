import React, { useState } from 'react';

const App = () => {
  const [selected, setSelected] = useState(null);

  const annonces = [
    { id: '1', title: 'RESTAURANT GOURMET PARIS', location: 'Paris 8ème', desc: '5 étoiles - Cuisine française gastronomique', image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600' },
    { id: '2', title: 'AGENCE IMMOBILIÈRE CÔTE D\'AZUR', location: 'Côte d\'Azur', desc: '★★★★★ - Propriétés exclusives', image: 'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=600' },
    { id: '3', title: 'TECHHUB INNOVATION', location: 'Paris 10ème', desc: '★★★★★ - Solutions technologiques', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600' },
    { id: '4', title: 'WELLNESS CLINIC', location: 'Lyon Centre', desc: '★★★★★ - Centre médical premium', image: 'https://images.unsplash.com/photo-1576091160550-112173f7f869?w=600' },
    { id: '5', title: 'TRANSPORT PREMIUM', location: 'Lyon', desc: '★★★★★ - VTC et transport de luxe', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600' },
    { id: '6', title: 'SALON DE BEAUTÉ PARIS', location: 'Paris Marais', desc: '★★★★★ - Soins premium et bien-être', image: 'https://images.unsplash.com/photo-1552693938-d5dbe7e32397?w=600' },
    { id: '7', title: 'ÉCOLE DE LANGUES BORDEAUX', location: 'Bordeaux', desc: '★★★★★ - Apprentissage intensif', image: 'https://images.unsplash.com/photo-1427504494785-cdaf8680d1d3?w=600' },
    { id: '8', title: 'AGENCE DE DESIGN MARSEILLE', location: 'Marseille', desc: '★★★★★ - Création graphique et web', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600' },
    { id: '9', title: 'FITNESS CENTER TOULOUSE', location: 'Toulouse', desc: '★★★★★ - Salle de sport nouvelle génération', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600' },
    { id: '10', title: 'BOULANGERIE ARTISANALE NICE', location: 'Nice', desc: '★★★★★ - Pain et pâtisseries faits maison', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#FDFCF8', color: '#1f2937' }}>
      {/* Header */}
      <header style={{ borderBottom: '4px solid #000', margin: '16px 40px', paddingBottom: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.15em', color: '#999', marginBottom: '8px' }}>ANNONCES D'ENTREPRISES</p>
        <h1 style={{ fontSize: '56px', fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.02em', marginBottom: '12px' }}>
          L'ÉCHO <span style={{ color: '#dc2626' }}>DU MATIN</span>
        </h1>
        <p style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.15em', color: '#999' }}>Les meilleurs services et entreprises de France • Redige par Claude</p>
      </header>

      {/* Main */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {annonces.map((a) => (
            <article key={a.id} style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '40px', cursor: 'pointer' }} onClick={() => setSelected(a)}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <div>
                  <img src={a.image} alt={a.title} style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '4px', marginBottom: '24px' }} />
                </div>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 900, fontStyle: 'italic', marginBottom: '12px' }}>{a.title}</h2>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px', lineHeight: '1.6' }}>{a.desc}</p>
                  <p style={{ fontSize: '12px', fontWeight: 700 }}>{a.location}</p>
                </div>
              </div>
            </article>
          ))}

          {/* CTA */}
          <div style={{ padding: '32px', background: '#1f2937', color: 'white', borderRadius: '12px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '12px' }}>Mettez votre annonce dans L'ÉCHO DU MATIN</h3>
            <p style={{ fontSize: '14px', marginBottom: '20px' }}>À partir de 1€ • Rejoignez 10 entreprises visibles en ce moment</p>
            <button style={{ padding: '12px 32px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '24px', fontWeight: 900, cursor: 'pointer' }}>
              Ajouter votre annonce
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: '#1f2937', color: 'white', padding: '64px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontStyle: 'italic', fontWeight: 900, marginBottom: '16px' }}>L'ÉCHO DU MATIN</h2>
        <p style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#999' }}>Annuaire d'entreprises • Rédigé par Claude</p>
      </footer>

      {/* Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'white', overflowY: 'auto' }}>
          <div style={{ position: 'sticky', top: 0, padding: '16px 40px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✕</button>
            <span style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 900, display: 'none' }}>L'ÉCHO DU MATIN</span>
            <div></div>
          </div>

          <article style={{ maxWidth: '900px', margin: '0 auto', padding: '40px' }}>
            <h2 style={{ fontSize: '48px', fontWeight: 900, fontStyle: 'italic', marginBottom: '32px' }}>{selected.title}</h2>
            <img src={selected.image} alt={selected.title} style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px', marginBottom: '32px', border: '2px solid #000' }} />
            <p style={{ fontSize: '18px', fontStyle: 'italic', lineHeight: '1.8', marginBottom: '32px', color: '#333' }}>{selected.desc}</p>
            <p style={{ fontSize: '16px', marginBottom: '32px', color: '#666' }}>Localisation: {selected.location}</p>

            <button
              onClick={() => window.open('https://example.com')}
              style={{
                width: '100%',
                padding: '16px',
                background: '#000',
                color: 'white',
                border: 'none',
                borderRadius: '24px',
                fontWeight: 900,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Visiter l'annonce
            </button>
          </article>
        </div>
      )}
    </div>
  );
};

export default App;
