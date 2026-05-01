import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, rgb(15, 23, 42), rgb(30, 58, 138), rgb(15, 23, 42))', color: 'white', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '56px', fontWeight: 900, marginBottom: '20px' }}>LECHO DU MATIN</h1>
          <p style={{ fontSize: '18px', color: '#a1a5b4', marginBottom: '30px' }}>La plateforme pour vos entreprises</p>
          
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: 'linear-gradient(to right, rgb(6, 182, 212), rgb(14, 165, 233))',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '24px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Ajouter entreprise
          </button>
        </div>

        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '20px' }}>Categories</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            {['Restaurants', 'Immobilier', 'Tech', 'Sante', 'Transport', 'Beaute'].map(cat => (
              <div key={cat} style={{ padding: '20px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.2)', cursor: 'pointer', textAlign: 'center' }}>
                <p style={{ fontSize: '14px' }}>{cat}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '20px' }}>En vedette</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {['Gourmet Paris', 'Luxe Azur', 'TechHub', 'Wellness'].map((name) => (
              <div key={name} style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '8px' }}>{name}</h3>
                <p style={{ fontSize: '12px', color: '#999', marginBottom: '16px' }}>Description</p>
                <button style={{ background: 'linear-gradient(to right, rgb(6, 182, 212), rgb(14, 165, 233))', color: 'white', padding: '8px 16px', borderRadius: '20px', border: 'none', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Decouvrir
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '40px', borderRadius: '24px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '12px' }}>Votre entreprise en avant</h3>
          <p style={{ fontSize: '16px', color: '#ccc', marginBottom: '24px' }}>A partir de 1 EUR</p>
          <button onClick={() => setShowModal(true)} style={{ background: 'linear-gradient(to right, rgb(6, 182, 212), rgb(14, 165, 233))', color: 'white', padding: '12px 32px', borderRadius: '24px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
            Je veux etre visible
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '60px' }}>
          {[{ num: '527+', label: 'Entreprises' }, { num: '45K+', label: 'Visiteurs' }, { num: '4.8', label: 'Note' }].map((stat) => (
            <div key={stat.label} style={{ padding: '20px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
              <p style={{ fontSize: '28px', fontWeight: 900, color: 'rgb(6, 182, 212)', marginBottom: '8px' }}>{stat.num}</p>
              <p style={{ fontSize: '12px', color: '#999' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '60px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '12px', color: '#999' }}>
        <p>2026 LECHODUMATIN</p>
        <p style={{ color: 'rgb(6, 182, 212)', fontWeight: 'bold' }}>Redige par Claude</p>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.5)' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} style={{ width: '90%', maxWidth: '500px', background: 'linear-gradient(to bottom right, rgb(30, 41, 59), rgb(15, 23, 42))', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '16px', padding: '32px', position: 'relative' }}>
              <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '24px' }}>X</button>
              
              <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '24px', color: 'rgb(6, 182, 212)' }}>Ajouter votre entreprise</h2>

              <form style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input type="text" placeholder="Nom" style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.2)', background: 'rgba(255, 255, 255, 0.05)', color: 'white' }} />
                <select style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.2)', background: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                  <option>Categorie</option>
                  <option>Restaurants</option>
                  <option>Immobilier</option>
                </select>
                <textarea placeholder="Description" style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.2)', background: 'rgba(255, 255, 255, 0.05)', color: 'white', minHeight: '80px' }} />
                
                <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', textAlign: 'center', marginBottom: '12px' }}>
                  <p style={{ fontWeight: 'bold', color: 'rgb(6, 182, 212)', fontSize: '14px' }}>A partir de 1 EUR</p>
                </div>

                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '12px', background: 'linear-gradient(to right, rgb(6, 182, 212), rgb(14, 165, 233))', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Paiement 1 EUR
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
