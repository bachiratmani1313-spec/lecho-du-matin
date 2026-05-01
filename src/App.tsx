import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';

const App: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #0f172a, #1e3a8a, #0f172a)', color: 'white', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '56px', fontWeight: 'black', marginBottom: '20px', fontStyle: 'italic' }}>
            L&apos;ÉCHO <span style={{ color: '#06b6d4' }}>DU MATIN</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#a1a5b4', marginBottom: '30px' }}>La plateforme qui met en avant vos entreprises</p>
          
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: 'linear-gradient(to right, #06b6d4, #0ea5e9)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '24px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            + Ajouter entreprise
          </button>
        </div>

        {/* Categories */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'black', marginBottom: '20px' }}>Catégories</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            {['🍽️ Restaurants', '🏠 Immobilier', '💻 Tech', '🏥 Santé', '🚗 Transport', '✂️ Beauté'].map(cat => (
              <div
                key={cat}
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <p style={{ fontSize: '20px', marginBottom: '8px' }}>{cat.split(' ')[0]}</p>
                <p style={{ fontSize: '12px', color: '#999' }}>Voir les offres</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'black', marginBottom: '20px' }}>En vedette</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {['Gourmet Paris', 'Luxe Côte d\'Azur', 'TechHub', 'Wellness'].map((name, i) => (
              <div
                key={name}
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>
                  {['🍽️', '🏠', '💻', '🏥'][i]}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 'black', marginBottom: '8px' }}>{name}</h3>
                <p style={{ fontSize: '12px', color: '#999', marginBottom: '16px' }}>Description de l&apos;entreprise</p>
                
                  href="https://example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    background: 'linear-gradient(to right, #06b6d4, #0ea5e9)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  Découvrir
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          padding: '40px',
          borderRadius: '24px',
          background: 'rgba(6, 182, 212, 0.1)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '32px', fontWeight: 'black', marginBottom: '12px' }}>Votre entreprise en avant-plan</h3>
          <p style={{ fontSize: '16px', color: '#ccc', marginBottom: '24px' }}>À partir de 1€ seulement</p>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: 'linear-gradient(to right, #06b6d4, #0ea5e9)',
              color: 'white',
              padding: '12px 32px',
              borderRadius: '24px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Je veux être visible
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '60px' }}>
          {[{ num: '527+', label: 'Entreprises' }, { num: '45K+', label: 'Visiteurs' }, { num: '4.8/5', label: 'Note' }].map(stat => (
            <div
              key={stat.label}
              style={{
                padding: '20px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center'
              }}
            >
              <p style={{ fontSize: '28px', fontWeight: 'black', color: '#06b6d4', marginBottom: '8px' }}>{stat.num}</p>
              <p style={{ fontSize: '12px', color: '#999' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '60px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '12px', color: '#999' }}>
        <p>© 2026 L&apos;ÉCHO DU MATIN</p>
        <p><span style={{ color: '#06b6d4', fontWeight: 'bold' }}>Rédigé par Claude</span> • Plateforme d&apos;annuaires 2040+</p>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)'
            }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              style={{
                width: '90%',
