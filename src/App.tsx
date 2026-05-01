import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, X, Star, ArrowRight, Zap } from 'lucide-react';

const CATEGORIES = [
  { name: '🍽️ Restaurants', count: 12 },
  { name: '🏠 Immobilier', count: 8 },
  { name: '💻 Technologie', count: 15 },
  { name: '🏥 Santé', count: 6 },
  { name: '🚗 Transport', count: 9 },
  { name: '✂️ Beauté', count: 10 },
  { name: '📚 Éducation', count: 7 },
  { name: '🎨 Services', count: 11 }
];

const FEATURED = [
  { id: '1', name: 'Gourmet Paris', category: '🍽️ Restaurants', rating: 4.9, emoji: '🍽️' },
  { id: '2', name: 'Luxe Côte d\'Azur', category: '🏠 Immobilier', rating: 4.8, emoji: '🏠' },
  { id: '3', name: 'TechHub', category: '💻 Technologie', rating: 4.7, emoji: '💻' },
  { id: '4', name: 'Wellness Clinic', category: '🏥 Santé', rating: 4.9, emoji: '🏥' }
];

const App: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: '', desc: '' });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-xl sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center space-y-4">
              <h1 className="font-serif text-6xl md:text-7xl font-black italic">
                L&apos;ÉCHO <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">DU MATIN</span>
              </h1>
              <p className="text-lg text-zinc-400 italic">La plateforme qui met en avant vos entreprises</p>

              <div className="flex items-center gap-2 max-w-md mx-auto mt-6">
                <div className="flex-grow relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="w-full bg-white/10 border border-white/20 rounded-full pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black px-6 py-3 rounded-full hover:shadow-lg transition-all"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Ajouter</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-16">
          {/* Categories */}
          <div className="mb-16">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <Zap className="w-6 h-6 text-cyan-400" />
              Catégories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CATEGORIES.map((cat, idx) => (
                <motion.button
                  key={cat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-4 rounded-xl backdrop-blur-xl border border-white/20 bg-white/5 hover:border-white/40 transition-all"
                >
                  <div className="text-2xl mb-2">{cat.name.split(' ')[0]}</div>
                  <p className="text-xs text-zinc-300 font-bold">{cat.count} offres</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Featured */}
          <div className="mb-20">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
              <Star className="w-6 h-6 text-yellow-400" />
              En vedette
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURED.map((biz, idx) => (
                <motion.div
                  key={biz.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 hover:border-white/40 p-6 shadow-2xl transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-5xl">{biz.emoji}</span>
                    <div className="flex items-center gap-1 bg-yellow-400/20 border border-yellow-400/50 rounded-full px-3 py-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-black text-yellow-400">TOP</span>
                    </div>
                  </div>

                  <h3 className="font-black text-xl text-white mb-2">{biz.name}</h3>
                  <p className="text-sm text-zinc-300 mb-4">{biz.category}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-xs text-zinc-400">{biz.rating}</span>
                    
                      href="https://example.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black px-4 py-2 rounded-full text-xs hover:shadow-lg transition-all"
                    >
                      Découvrir
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="rounded-3xl overflow-hidden p-12 md:p-16 backdrop-blur-xl border border-white/20 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 shadow-2xl text-center"
          >
            <h3 className="text-4xl md:text-5xl font-black italic mb-6">Votre entreprise en avant-plan</h3>
            <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">À partir de 1€ seulement. Mettez votre entreprise en avant.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black uppercase rounded-full hover:shadow-lg transition-all"
              >
                Je veux être visible
              </button>
              <button className="px-8 py-4 border-2 border-white/50 text-white font-black uppercase rounded-full hover:border-white transition-all">
                En savoir plus
              </button>
            </div>
          </motion.section>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-6 text-center">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
              <p className="text-3xl font-black text-cyan-400 mb-2">527+</p>
              <p className="text-sm text-zinc-400">Entreprises</p>
            </div>
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
              <p className="text-3xl font-black text-cyan-400 mb-2">45K+</p>
              <p className="text-sm text-zinc-400">Visiteurs</p>
            </div>
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
              <p className="text-3xl font-black text-cyan-400 mb-2">4.8/5</p>
              <p className="text-sm text-zinc-400">Note</p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 backdrop-blur-xl py-12 mt-20 text-center">
          <p className="text-zinc-400 text-sm mb-2">© 2026 L&apos;ÉCHO DU MATIN</p>
          <p className="text-zinc-600 text-xs"><span className="text-cyan-400 font-black">Rédigé par Claude</span> • Plateforme d&apos;annuaires 2040+</p>
        </footer>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-lg bg-gradient-to-br from-slate-900 to-slate-950 border border-white/20 rounded-2xl p-8 shadow-2xl"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Ajouter votre entreprise
              </h2>

              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Nom"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">Catégorie</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                <textarea
                  placeholder="Description"
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  rows={3}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                ></textarea>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 text-center">
                  <p className="text-sm font-black text-cyan-400">À partir de 1€</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ name: '', category: '', desc: '' });
                  }}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black py-3 rounded-lg hover:shadow-lg transition-all"
                >
                  Procéder au paiement (1€)
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
