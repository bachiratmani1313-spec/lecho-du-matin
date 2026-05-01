import React, { useState } from 'react';

const App = () => {
  const [selectedZone, setSelectedZone] = useState('1000');

  const businesses = {
    '1000': [
      { name: 'Pizza Express', type: 'Restaurant', zone: '1000 Bruxelles' },
      { name: 'Carrefour Market', type: 'Supermarché', zone: '1000 Bruxelles' },
      { name: 'Electro Shop', type: 'Électronique', zone: '1000 Bruxelles' },
      { name: 'Boulangerie du Coin', type: 'Boulangerie', zone: '1000 Bruxelles' },
      { name: 'Coiffure Michel', type: 'Coiffeur', zone: '1000 Bruxelles' },
      { name: 'Pharmacie Central', type: 'Pharmacie', zone: '1000 Bruxelles' },
      { name: 'Bar du Marché', type: 'Café', zone: '1000 Bruxelles' },
      { name: 'Vestiaire Pro', type: 'Vêtements', zone: '1000 Bruxelles' },
      { name: 'Phone Store', type: 'Téléphonie', zone: '1000 Bruxelles' },
      { name: 'Chez Pierre', type: 'Restaurant', zone: '1000 Bruxelles' },
      { name: 'Fleurs Martine', type: 'Fleuriste', zone: '1000 Bruxelles' },
      { name: 'Auto Garage', type: 'Mécanique', zone: '1000 Bruxelles' },
      { name: 'Snack Palace', type: 'Fast Food', zone: '1000 Bruxelles' },
      { name: 'Libraire ABC', type: 'Librairie', zone: '1000 Bruxelles' },
      { name: 'Salon Beauté', type: 'Beauté', zone: '1000 Bruxelles' },
    ],
    '1040': [
      { name: 'Kebab House', type: 'Restaurant', zone: '1040 Etterbeek' },
      { name: 'Lidl Etterbeek', type: 'Supermarché', zone: '1040 Etterbeek' },
      { name: 'McDonald\'s', type: 'Fast Food', zone: '1040 Etterbeek' },
      { name: 'Pharmacie Etterbeek', type: 'Pharmacie', zone: '1040 Etterbeek' },
      { name: 'Salon Coiffure Plus', type: 'Coiffeur', zone: '1040 Etterbeek' },
      { name: 'Boucherie Carlier', type: 'Boucherie', zone: '1040 Etterbeek' },
      { name: 'Auchan', type: 'Supermarché', zone: '1040 Etterbeek' },
      { name: 'Opticien Vision', type: 'Optique', zone: '1040 Etterbeek' },
      { name: 'Resto Thai', type: 'Restaurant', zone: '1040 Etterbeek' },
      { name: 'Station essence', type: 'Carburant', zone: '1040 Etterbeek' },
    ],
    '1060': [
      { name: 'Tacos Mexico', type: 'Fast Food', zone: '1060 Saint-Gilles' },
      { name: 'Aldi', type: 'Supermarché', zone: '1060 Saint-Gilles' },
      { name: 'Café Noir', type: 'Café', zone: '1060 Saint-Gilles' },
      { name: 'Pharmacie Central', type: 'Pharmacie', zone: '1060 Saint-Gilles' },
      { name: 'Barbier Express', type: 'Coiffeur', zone: '1060 Saint-Gilles' },
      { name: 'Crêperie Française', type: 'Restaurant', zone: '1060 Saint-Gilles' },
      { name: 'Vêtements Mode', type: 'Vêtements', zone: '1060 Saint-Gilles' },
      { name: 'Quincaillerie Pro', type: 'Quincaillerie', zone: '1060 Saint-Gilles' },
      { name: 'Sushi Bar', type: 'Restaurant', zone: '1060 Saint-Gilles' },
      { name: 'Imprimerie Ink', type: 'Imprimerie', zone: '1060 Saint-Gilles' },
    ],
    '1070': [
      { name: 'Snack Rapide', type: 'Fast Food', zone: '1070 Anderlecht' },
      { name: 'Carrefour', type: 'Supermarché', zone: '1070 Anderlecht' },
      { name: 'Boulangerie Bio', type: 'Boulangerie', zone: '1070 Anderlecht' },
      { name: 'Coiffeur Men', type: 'Coiffeur', zone: '1070 Anderlecht' },
      { name: 'Pizzeria Napoli', type: 'Restaurant', zone: '1070 Anderlecht' },
      { name: 'Pharmacie Plus', type: 'Pharmacie', zone: '1070 Anderlecht' },
      { name: 'Spa Relax', type: 'Spa', zone: '1070 Anderlecht' },
      { name: 'Bureau Sens', type: 'Fournitures', zone: '1070 Anderlecht' },
      { name: 'Resto Chinois', type: 'Restaurant', zone: '1070 Anderlecht' },
      { name: 'Fleuriste Romain', type: 'Fleuriste', zone: '1070 Anderlecht' },
    ],
    '1080': [
      { name: 'Quick', type: 'Fast Food', zone: '1080 Molenbeek' },
      { name: 'Jumbo', type: 'Supermarché', zone: '1080 Molenbeek' },
      { name: 'Salon Barbershop', type: 'Coiffeur', zone: '1080 Molenbeek' },
      { name: 'Chez Mama', type: 'Restaurant', zone: '1080 Molenbeek' },
      { name: 'Pharmacie Molenbeek', type: 'Pharmacie', zone: '1080 Molenbeek' },
      { name: 'Burgers & Co', type: 'Restaurant', zone: '1080 Molenbeek' },
      { name: 'Vêtements Sport', type: 'Vêtements', zone: '1080 Molenbeek' },
      { name: 'Électroménager Pro', type: 'Électroménager', zone: '1080 Molenbeek' },
      { name: 'Café Internet', type: 'Café', zone: '1080 Molenbeek' },
      { name: 'Vitrerie Moderne', type: 'Vitrerie', zone: '1080 Molenbeek' },
    ],
    '1090': [
      { name: 'Thai Express', type: 'Restaurant', zone: '1090 Jette' },
      { name: 'Delhaize', type: 'Supermarché', zone: '1090 Jette' },
      { name: 'Coiffure Jette', type: 'Coiffeur', zone: '1090 Jette' },
      { name: 'Pains Artisan', type: 'Boulangerie', zone: '1090 Jette' },
      { name: 'Pharmacie Jette', type: 'Pharmacie', zone: '1090 Jette' },
      { name: 'Kebab Star', type: 'Fast Food', zone: '1090 Jette' },
      { name: 'Magasin Jouets', type: 'Jouets', zone: '1090 Jette' },
      { name: 'Salon Beauté Plus', type: 'Beauté', zone: '1090 Jette' },
      { name: 'Resto Méditerranéen', type: 'Restaurant', zone: '1090 Jette' },
      { name: 'Station Lavage', type: 'Services Auto', zone: '1090 Jette' },
    ],
  };

  const currentBusinesses = businesses[selectedZone] || [];

  return (
    <div style={{ minHeight: '100vh', background: '#FDFCF8', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <header style={{ background: '#1f2937', color: 'white', padding: '16px', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 900 }}>L'ÉCHO DU MATIN • BRUXELLES</h1>
        <p style={{ margin: 0, fontSize: '10px', color: '#999' }}>ANNUAIRE DES COMMERCES LOCAUX</p>
      </header>

      {/* Zone Selector */}
      <div style={{ background: '#f3f4f6', padding: '12px 16px', borderBottom: '1px solid #ccc', display: 'flex', gap: '8px', overflowX: 'auto', fontSize: '12px', fontWeight: 'bold' }}>
        {['1000', '1040', '1060', '1070', '1080', '1090'].map(zone => (
          <button
            key={zone}
            onClick={() => setSelectedZone(zone)}
            style={{
              padding: '6px 12px',
              border: selectedZone === zone ? '2px solid #000' : '1px solid #999',
              background: selectedZone === zone ? '#000' : 'white',
              color: selectedZone === zone ? 'white' : '#000',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }}
          >
            CP {zone}
          </button>
        ))}
      </div>

      {/* Content */}
      <main style={{ padding: '16px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 900, marginBottom: '12px', borderBottom: '2px solid #000', paddingBottom: '8px' }}>
          {selectedZone === '1000' && '1000 - CENTRE BRUXELLES'}
          {selectedZone === '1040' && '1040 - ETTERBEEK'}
          {selectedZone === '1060' && '1060 - SAINT-GILLES'}
          {selectedZone === '1070' && '1070 - ANDERLECHT'}
          {selectedZone === '1080' && '1080 - MOLENBEEK'}
          {selectedZone === '1090' && '1090 - JETTE'}
          ({currentBusinesses.length} commerces)
        </h2>

        {/* Grid Compact */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
          {currentBusinesses.map((business, idx) => (
            <div
              key={idx}
              style={{
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                background: 'white',
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f0f0f0';
                e.currentTarget.style.borderColor = '#000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#ccc';
              }}
            >
              <p style={{ margin: '0 0 4px 0', fontWeight: 900, fontSize: '12px' }}>{business.name}</p>
              <p style={{ margin: '0 0 2px 0', color: '#666', fontSize: '10px' }}>{business.type}</p>
              <p style={{ margin: 0, color: '#999', fontSize: '9px' }}>{business.zone}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: '#f3f4f6', padding: '12px', textAlign: 'center', fontSize: '10px', color: '#666', borderTop: '1px solid #ccc' }}>
        <p style={{ margin: 0 }}>© 2026 L'ÉCHO DU MATIN • Rédigé par Claude • Tous les commerces locaux</p>
      </footer>
    </div>
  );
};

export default App;
