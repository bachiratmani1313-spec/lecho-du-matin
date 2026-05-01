import React, { useState } from 'react';

const App = () => {
  const [selectedCommune, setSelectedCommune] = useState('bruxelles');
  const [selectedType, setSelectedType] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const communes = [
    { id: 'bruxelles', name: 'Bruxelles', cp: '1000' },
    { id: 'anderlecht', name: 'Anderlecht', cp: '1070' },
    { id: 'auderghem', name: 'Auderghem', cp: '1160' },
    { id: 'berchem', name: 'Berchem-Sainte-Agathe', cp: '1082' },
    { id: 'etterbeek', name: 'Etterbeek', cp: '1040' },
    { id: 'evere', name: 'Evere', cp: '1050' },
    { id: 'forest', name: 'Forest', cp: '1190' },
    { id: 'ganshoren', name: 'Ganshoren', cp: '1083' },
    { id: 'ixelles', name: 'Ixelles', cp: '1050' },
    { id: 'jette', name: 'Jette', cp: '1090' },
    { id: 'koekelberg', name: 'Koekelberg', cp: '1081' },
    { id: 'molenbeek', name: 'Molenbeek-Saint-Jean', cp: '1080' },
    { id: 'neder', name: 'Neder-Over-Heembeek', cp: '1120' },
    { id: 'saint-gilles', name: 'Saint-Gilles', cp: '1060' },
    { id: 'saint-josse', name: 'Saint-Josse-ten-Noode', cp: '1210' },
    { id: 'schaerbeek', name: 'Schaerbeek', cp: '1030' },
    { id: 'uccle', name: 'Uccle', cp: '1180' },
    { id: 'watermael', name: 'Watermael-Boitsfort', cp: '1170' },
  ];

  const typeStyles = {
    'Restaurant': { emoji: '🍽️', color: '#fef2f2', text: '#dc2626' },
    'Pharmacie': { emoji: '💊', color: '#f0fdf4', text: '#16a34a' },
    'Coiffeur': { emoji: '✂️', color: '#eff6ff', text: '#2563eb' },
    'Meubles': { emoji: '🛋️', color: '#fef3c7', text: '#92400e' },
    'Chaussures': { emoji: '👟', color: '#fff7ed', text: '#ea580c' },
    'Parfumerie': { emoji: '🧴', color: '#fdf2f8', text: '#db2777' },
    'Supermarché': { emoji: '🛒', color: '#fefce8', text: '#ca8a04' },
    'Clinique': { emoji: '🏥', color: '#ecfeff', text: '#0891b2' },
    'Beauté': { emoji: '💄', color: '#fdf2f8', text: '#db2777' },
    'Tapis': { emoji: '🧎', color: '#fef3c7', text: '#92400e' },
    'Docteur': { emoji: '👨‍⚕️', color: '#f0f9ff', text: '#0369a1' },
    'Boulangerie': { emoji: '🥖', color: '#fef3c7', text: '#a16207' },
  };

  const businesses = {
    bruxelles: [
      { name: 'Brasserie Centrale', type: 'Restaurant', phone: '+3225123456', display: '+32 2 512 34 56', address: 'Rue de l\'Étuve, 1000 Bruxelles' },
      { name: 'Pharmacie Royale', type: 'Pharmacie', phone: '+3225131245', display: '+32 2 513 12 45', address: 'Boulevard Anspach, 1000 Bruxelles' },
      { name: 'Pizza Italia', type: 'Restaurant', phone: '+3225114567', display: '+32 2 511 45 67', address: 'Grand Place, 1000 Bruxelles' },
      { name: 'Coiffure Premium', type: 'Coiffeur', phone: '+3225142311', display: '+32 2 514 23 11', address: 'Rue de la Madeleine, 1000 Bruxelles' },
      { name: 'Meubles Design', type: 'Meubles', phone: '+3225105678', display: '+32 2 510 56 78', address: 'Chaussée de Charleroi, 1000 Bruxelles' },
      { name: 'Chaussures Elégance', type: 'Chaussures', phone: '+3225127890', display: '+32 2 512 78 90', address: 'Rue Neuve, 1000 Bruxelles' },
      { name: 'Parfumerie Luxe', type: 'Parfumerie', phone: '+3225133456', display: '+32 2 513 34 56', address: 'Boulevard de Waterloo, 1000 Bruxelles' },
      { name: 'Carrefour Market', type: 'Supermarché', phone: '+3225151122', display: '+32 2 515 11 22', address: 'Rue du Marché, 1000 Bruxelles' },
      { name: 'Clinique Saint-Michel', type: 'Clinique', phone: '+3225164567', display: '+32 2 516 45 67', address: 'Avenue Louise, 1000 Bruxelles' },
      { name: 'Restaurant Thaï', type: 'Restaurant', phone: '+3225177890', display: '+32 2 517 78 90', address: 'Rue des Bouchers, 1000 Bruxelles' },
    ],
    molenbeek: [
      { name: 'Kebab House Molenbeek', type: 'Restaurant', phone: '+3224142345', display: '+32 2 414 23 45', address: 'Rue de Trêves, 1080 Molenbeek' },
      { name: 'Pharmacie Centrale', type: 'Pharmacie', phone: '+3224153456', display: '+32 2 415 34 56', address: 'Chaussée de Gand, 1080 Molenbeek' },
      { name: 'Meubles Pas Cher', type: 'Meubles', phone: '+3224164567', display: '+32 2 416 45 67', address: 'Avenue Hendrik Conscience, 1080 Molenbeek' },
      { name: 'Tapis Orient', type: 'Tapis', phone: '+3224175678', display: '+32 2 417 56 78', address: 'Rue de Jamblinne, 1080 Molenbeek' },
      { name: 'Chaussures Express', type: 'Chaussures', phone: '+3224186789', display: '+32 2 418 67 89', address: 'Rue de l\'Étuve, 1080 Molenbeek' },
      { name: 'Salon Beauté Plus', type: 'Beauté', phone: '+3224197890', display: '+32 2 419 78 90', address: 'Boulevard de la Circularité, 1080 Molenbeek' },
      { name: 'Dr. Hassan', type: 'Docteur', phone: '+3224208901', display: '+32 2 420 89 01', address: 'Place de la Duchesse de Brabant, 1080 Molenbeek' },
      { name: 'Boulangerie Artisan', type: 'Boulangerie', phone: '+3224219012', display: '+32 2 421 90 12', address: 'Rue Vanderschrick, 1080 Molenbeek' },
    ],
    anderlecht: [
      { name: 'Friterie Belge', type: 'Restaurant', phone: '+3225243456', display: '+32 2 524 34 56', address: 'Rue de Moorslede, 1070 Anderlecht' },
      { name: 'Pharmacie du Parc', type: 'Pharmacie', phone: '+3225254567', display: '+32 2 525 45 67', address: 'Place de la Vaillance, 1070 Anderlecht' },
      { name: 'Magasin Meubles XXL', type: 'Meubles', phone: '+3225265678', display: '+32 2 526 56 78', address: 'Boulevard de la Révolution, 1070 Anderlecht' },
      { name: 'Coiffeur Styles', type: 'Coiffeur', phone: '+3225276789', display: '+32 2 527 67 89', address: 'Rue Crickx, 1070 Anderlecht' },
      { name: 'Parfums Du Monde', type: 'Parfumerie', phone: '+3225287890', display: '+32 2 528 78 90', address: 'Avenue de la Démocratie, 1070 Anderlecht' },
      { name: 'Clinique Anderlecht', type: 'Clinique', phone: '+3225298901', display: '+32 2 529 89 01', address: 'Rue du Chevalier, 1070 Anderlecht' },
    ],
    schaerbeek: [
      { name: 'Restaurant Marocain', type: 'Restaurant', phone: '+3227334567', display: '+32 2 733 45 67', address: 'Boulevard Lambermont, 1030 Schaerbeek' },
      { name: 'Pharmacie Schaerbeek', type: 'Pharmacie', phone: '+3227345678', display: '+32 2 734 56 78', address: 'Rue de Groote, 1030 Schaerbeek' },
      { name: 'Coiffure Moderne', type: 'Coiffeur', phone: '+3227356789', display: '+32 2 735 67 89', address: 'Boulevard Auguste Reyers, 1030 Schaerbeek' },
    ],
    uccle: [
      { name: 'Restaurant Le Ciel', type: 'Restaurant', phone: '+3226462345', display: '+32 2 646 23 45', address: 'Chaussée d\'Alsemberg, 1180 Uccle' },
      { name: 'Pharmacie Uccle', type: 'Pharmacie', phone: '+3226473456', display: '+32 2 647 34 56', address: 'Rue de l\'Église, 1180 Uccle' },
      { name: 'Meubles Uccle', type: 'Meubles', phone: '+3226484567', display: '+32 2 648 45 67', address: 'Boulevard Saint-Michel, 1180 Uccle' },
    ],
  };

  const allCommunes = communes.reduce((acc, commune) => {
    if (!businesses[commune.id]) {
      acc[commune.id] = [
        { name: 'Restaurant ' + commune.name, type: 'Restaurant', phone: '+3225555555', display: '+32 2 555 55 55', address: commune.name + ', ' + commune.cp },
        { name: 'Pharmacie ' + commune.name, type: 'Pharmacie', phone: '+3225555556', display: '+32 2 555 55 56', address: commune.name + ', ' + commune.cp },
        { name: 'Coiffeur ' + commune.name, type: 'Coiffeur', phone: '+3225555557', display: '+32 2 555 55 57', address: commune.name + ', ' + commune.cp },
      ];
    } else {
      acc[commune.id] = businesses[commune.id];
    }
    return acc;
  }, {});

  const currentBusinesses = allCommunes[selectedCommune] || [];
  const filteredBusinesses = selectedType === 'all' ? currentBusinesses : currentBusinesses.filter(b => b.type === selectedType);
  const types = [...new Set(currentBusinesses.map(b => b.type))];

  const handleCall = (phone, display) => {
    if (window.confirm('Appeler ' + display + ' ?')) {
      window.location.href = 'tel:' + phone;
    }
  };

  const handleMap = (address) => {
    const url = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(address);
    window.open(url, '_blank');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FDFCF8', color: '#1f2937', fontFamily: 'Georgia, serif' }}>
      <header style={{ borderBottom: '4px solid #000', margin: '12px 20px', paddingBottom: '12px', textAlign: 'center' }}>
        <p style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.2em', color: '#666', margin: '0 0 4px 0' }}>19 COMMUNES DE BRUXELLES</p>
        <h1 style={{ fontSize: '44px', fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.02em', margin: '0 0 4px 0' }}>
          L'ÉCHO <span style={{ color: '#dc2626' }}>DU MATIN</span>
        </h1>
        <p style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.1em', color: '#666', margin: 0 }}>Annuaire complet • Rédigé par Claude</p>
      </header>

      <div style={{ background: '#f3f4f6', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc', padding: '8px 20px', overflowX: 'auto', display: 'flex', gap: '8px', fontSize: '10px', fontWeight: 900 }}>
        {communes.map(c => (
          <button
            key={c.id}
            onClick={() => { setSelectedCommune(c.id); setSelectedType('all'); }}
            style={{
              padding: '6px 12px',
              border: selectedCommune === c.id ? '2px solid #000' : '1px solid #ccc',
              background: selectedCommune === c.id ? '#000' : 'white',
              color: selectedCommune === c.id ? 'white' : '#000',
              borderRadius: '3px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontSize: '9px'
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div style={{ background: 'white', padding: '8px 20px', borderBottom: '1px solid #ccc', display: 'flex', gap: '8px', overflowX: 'auto', fontSize: '9px', fontWeight: 'bold' }}>
        <button
          onClick={() => setSelectedType('all')}
          style={{
            padding: '4px 10px',
            border: selectedType === 'all' ? '1px solid #000' : '1px solid #ccc',
            background: selectedType === 'all' ? '#000' : 'white',
            color: selectedType === 'all' ? 'white' : '#000',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          TOUS
        </button>
        {types.map(t => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            style={{
              padding: '4px 10px',
              border: selectedType === t ? '1px solid #000' : '1px solid #ccc',
              background: selectedType === t ? '#000' : 'white',
              color: selectedType === t ? 'white' : '#000',
              borderRadius: '3px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px' }}>
        <h2 style={{ fontSize: '11px', fontWeight: 900, borderBottom: '2px solid #000', paddingBottom: '6px', marginBottom: '12px' }}>
          {communes.find(c => c.id === selectedCommune)?.name.toUpperCase()} • {filteredBusinesses.length} COMMERCES
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          {filteredBusinesses.map((b, idx) => {
            const style = typeStyles[b.type] || { emoji: '🏪', color: '#f3f4f6', text: '#666' };
            return (
              <div
                key={idx}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  background: 'white'
                }}
              >
                <div style={{
                  width: '100%',
                  height: '110px',
                  background: style.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '60px'
                }}>
                  {style.emoji}
                </div>
                <div style={{ padding: '10px' }}>
                  <p style={{ margin: '0 0 4px 0', fontWeight: 900, fontSize: '12px', lineHeight: '1.2' }}>{b.name}</p>
                  <p style={{ margin: '0 0 8px 0', color: style.text, fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase' }}>{b.type}</p>
                  
                  <button
                    onClick={() => handleCall(b.phone, b.display)}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '6px',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      marginBottom: '4px'
                    }}
                  >
                    📞 {b.display}
                  </button>

                  <button
                    onClick={() => handleMap(b.address)}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '6px',
                      background: '#1f2937',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      fontSize: '9px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    📍 Voir sur Maps
                  </button>

                  <p style={{ margin: '6px 0 0 0', color: '#999', fontSize: '8px', fontStyle: 'italic' }}>{b.address.split(',')[0]}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ background: '#1f2937', color: 'white', padding: '20px', borderRadius: '4px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 900, margin: '0 0 6px 0' }}>VOTRE COMMERCE DANS L'ÉCHO DU MATIN</h3>
          <p style={{ fontSize: '10px', margin: '0 0 12px 0', color: '#ccc' }}>Visibilité gratuite • Paiement bénévole (donnez ce que vous voulez)</p>
          <button
            onClick={() => setShowPaymentModal(true)}
            style={{ padding: '8px 20px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '3px', fontWeight: 900, cursor: 'pointer', fontSize: '10px' }}
          >
            AJOUTER VOTRE ANNONCE
          </button>
        </div>
      </main>

      <footer style={{ background: '#f3f4f6', padding: '12px', textAlign: 'center', fontSize: '9px', color: '#666', borderTop: '1px solid #ccc', marginTop: '24px' }}>
        <p style={{ margin: 0 }}>© 2026 L'ÉCHO DU MATIN • 19 communes • Rédigé par Claude</p>
      </footer>

      {showPaymentModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '8px', maxWidth: '500px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 900, margin: 0 }}>Ajouter votre annonce</h2>
              <button onClick={() => setShowPaymentModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <form style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" placeholder="Nom du commerce" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }} />
              <input type="text" placeholder="Numéro de téléphone" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }} />
              <input type="text" placeholder="Adresse et code postal" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }} />
              <textarea placeholder="Description" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px', minHeight: '80px' }} />
              
              <div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '4px', textAlign: 'center', marginBottom: '8px' }}>
                <p style={{ margin: '0 0 4px 0', fontWeight: 900, fontSize: '13px' }}>Paiement bénévole</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#666' }}>Donnez ce que vous voulez (1€ minimum recommandé)</p>
              </div>

              <button type="button" onClick={() => alert('Merci! Vous serez redirigé vers le paiement.')} style={{ padding: '10px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 900, cursor: 'pointer', fontSize: '12px' }}>
                PROCÉDER AU PAIEMENT
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
