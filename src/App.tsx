import React, { useState } from 'react';

const App = () => {
  const [showModal, setShowModal] = useState(false);

  const uneArticles = [
    { id: '1', title: 'PIZZA EXPRESS', zone: '1000', desc: 'Restaurant italien • Pizzas maison', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&q=80' },
    { id: '2', title: 'CARREFOUR MARKET', zone: '1040', desc: 'Supermarché • Produits frais', image: 'https://images.unsplash.com/photo-1585521924905-c3400ca199e7?w=300&q=80' },
    { id: '3', title: 'SALON COIFFURE MICHEL', zone: '1060', desc: 'Coiffeur • 25 ans expérience', image: 'https://images.unsplash.com/photo-1585747860715-cd4628902046?w=300&q=80' },
  ];

  const sectionArticles = [
    { id: '4', title: 'Crêperie Française', zone: '1060 Saint-Gilles', image: 'https://images.unsplash.com/photo-1586190936529-385a432d3ace?w=200&q=80' },
    { id: '5', title: 'Pharmacie Centrale', zone: '1070 Anderlecht', image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde0f?w=200&q=80' },
    { id: '6', title: 'Aldi Molenbeek', zone: '1080 Molenbeek', image: 'https://images.unsplash.com/photo-1578916547515-7ecbab49a803?w=200&q=80' },
    { id: '7', title: 'Spa Relax', zone: '1070 Anderlecht', image: 'https://images.unsplash.com/photo-1596178065887-cf88eb7ce338?w=200&q=80' },
    { id: '8', title: 'Thai Express', zone: '1090 Jette', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80' },
    { id: '9', title: 'Opticien Vision', zone: '1040 Etterbeek', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&q=80' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#FDFCF8', color: '#1f2937', fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <header style={{ borderBottom: '4px solid #000', margin: '12px 20px', paddingBottom: '12px', textAlign: 'center' }}>
        <p style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.2em', color: '#666', margin: '0 0 4px 0' }}>ANNONCES LOCALES</p>
        <h1 style={{ fontSize: '44px', fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.02em', margin: '0 0 4px 0' }}>
          L'ÉCHO <span style={{ color: '#dc2626' }}>DU MATIN</span>
        </h1>
        <p style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.1em', color: '#666', margin: 0 }}>Bruxelles • Rédigé par Claude</p>
      </header>

      {/* Navigation */}
      <div style={{ background: '#f3f4f6', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc', padding: '6px 20px', fontSize: '10px', fontWeight: 900, display: 'flex', gap: '16px', overflowX: 'auto' }}>
        <span style={{ cursor: 'pointer', borderBottom: '2px solid #000' }}>À LA UNE</span>
        <span style={{ cursor: 'pointer', color: '#999' }}>BRUXELLES</span>
        <span style={{ cursor: 'pointer', color: '#999' }}>RESTAURANTS</span>
        <span style={{ cursor: 'pointer', color: '#999' }}>SERVICES</span>
      </div>

      {/* Main Content */}
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '16px 20px' }}>
        
        {/* À LA UNE */}
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: 900, borderBottom: '2px solid #000', paddingBottom: '6px', marginBottom: '12px', letterSpacing: '0.1em' }}>À LA UNE</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
            {uneArticles.map(a => (
              <div key={a.id} style={{ border: '1px solid #ccc', borderRadius: '3px', overflow: 'hidden', cursor: 'pointer' }}>
                <img src={a.image} alt={a.title} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                <div style={{ padding: '8px', fontSize: '11px' }}>
                  <p style={{ margin: '0 0 3px 0', fontWeight: 900, lineHeight: '1.2' }}>{a.title}</p>
                  <p style={{ margin: '0', color: '#666', fontSize: '9px' }}>{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Séparateur */}
        <div style={{ height: '1px', background: '#ccc', margin: '16px 0' }}></div>

        {/* Autres Sections */}
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: 900, borderBottom: '2px solid #000', paddingBottom: '6px', marginBottom: '12px', letterSpacing: '0.1em' }}>COMMERCES DE QUARTIER</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
            {sectionArticles.map(a => (
              <div key={a.id} style={{ border: '1px solid #ccc', borderRadius: '3px', overflow: 'hidden', cursor: 'pointer', fontSize: '9px' }}>
                <img src={a.image} alt={a.title} style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                <div style={{ padding: '4px' }}>
                  <p style={{ margin: '0 0 2px 0', fontWeight: 900, lineHeight: '1.1', fontSize: '8px' }}>{a.title}</p>
                  <p style={{ margin: 0, color: '#999', fontSize: '7px' }}>{a.zone}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div style={{ background: '#1f2937', color: 'white', padding: '20px', borderRadius: '4px', textAlign: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 900, margin: '0 0 6px 0' }}>VOTRE COMMERCE DANS L'ÉCHO DU MATIN</h3>
          <p style={{ fontSize: '10px', margin: '0 0 12px 0', color: '#ccc' }}>À partir de 1€ • Rejoignez 150+ commerces</p>
          <button 
            onClick={() => setShowModal(true)}
            style={{ padding: '8px 20px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '3px', fontWeight: 900, cursor: 'pointer', fontSize: '10px' }}
          >
            AJOUTER VOTRE ANNONCE
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: '#f3f4f6', padding: '12px', textAlign: 'center', fontSize: '9px', color: '#666', borderTop: '1px solid #ccc' }}>
        <p style={{ margin: 0 }}>© 2026 L'ÉCHO DU MATIN • Rédigé par Claude</p>
      </footer>

      {/* Modal Paiement */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '8px', maxWidth: '500px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 900, margin: 0 }}>Ajouter votre annonce</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <form style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" placeholder="Nom du commerce" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }} />
              <input type="text" placeholder="Adresse et code postal" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }} />
              <textarea placeholder="Description" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px', minHeight: '80px' }} />
              
              <div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '4px', textAlign: 'center', marginBottom: '8px' }}>
                <p style={{ margin: '0 0 4px 0', fontWeight: 900, fontSize: '13px' }}>Prix: 1€</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#666' }}>Paiement sécurisé par Stripe</p>
              </div>

              <button type="button" style={{ padding: '10px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 900, cursor: 'pointer', fontSize: '12px' }}>
                PAYER 1€ ET PUBLIER
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
