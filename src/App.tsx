import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, X, ExternalLink, Star, ArrowRight, Zap } from 'lucide-react';

interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
  rating: number;
  image: string;
  featured: boolean;
  price: number;
  link?: string;
}

const CATEGORIES = [
  { name: '🍽️ Restaurants', color: 'from-orange-500 to-red-500', count: 12 },
  { name: '🏠 Immobilier', color: 'from-blue-500 to-cyan-500', count: 8 },
  { name: '💻 Technologie', color: 'from-purple-500 to-pink-500', count: 15 },
  { name: '🏥 Santé', color: 'from-green-500 to-emerald-500', count: 6 },
  { name: '🚗 Transport', color: 'from-yellow-500 to-orange-500', count: 9 },
  { name: '✂️ Beauté', color: 'from-pink-500 to-rose-500', count: 10 },
  { name: '📚 Éducation', color: 'from-indigo-500 to-blue-500', count: 7 },
  { name: '🎨 Services', color: 'from-teal-500 to-cyan-500', count: 11 }
];

const FEATURED_BUSINESSES: Business[] = [
  {
    id: '1',
    name: 'Gourmet Paris',
    category: '🍽️ Restaurants',
    description: 'Restaurant 5 étoiles au cœur de Paris. Cuisine française gastronomique.',
    rating: 4.9,
    image: '🍽️',
    featured: true,
    price: 1,
    link: 'https://example.com'
  },
  {
    id: '2',
    name: 'Luxe Côte d\'Azur',
    category: '🏠 Immobilier',
    description: 'Propriétés haut de gamme et villas exclusives sur la Côte d\'Azur.',
    rating: 4.8,
    image: '🏠',
    featured: true,
    price: 1,
    link: 'https://example.com'
  },
  {
    id: '3',
    name: 'TechHub Innovation',
    category: '💻 Technologie',
    description: 'Solutions technologiques d\'avant-garde pour les startups.',
    rating: 4.7,
    image: '💻',
    featured: true,
    price: 1,
    link: 'https://example.com'
  },
  {
    id: '4',
    name: 'Wellness Clinic',
    category: '🏥 Santé',
    description: 'Centre médical premium avec équipes spécialisées.',
    rating: 4.9,
    image: '🏥',
    featured: true,
    price: 1,
    link: 'https://example.com'
  }
];

const BusinessCard: React.FC<{ business: Business; index: number }> = ({ business, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -8 }}
      className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 hover:border-white/40 p-6 shadow-2xl hover:shadow-2xl transition-all"
    >
      {/* Gradient background accent */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

      {/* Content */}
      <div className="relative z-10 space-y-4">
        <div className="flex justify-between items-start">
          <span className="text-5xl">{business.image}</span>
          {business.featured && (
            <div className="flex items-center gap-1 bg-yellow-400/20 border border-yellow-400/50 rounded-full px-3 py-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-black text-yellow-400">FEATURED</span>
            </div>
          )}
        </div>

        <div>
          <h3 className="font-black text-xl text-white italic tracking-tight mb-2">
            {business.name}
          </h3>
          <p className="text-sm text-zinc-300 line-clamp-2">
            {business.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(business.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-zinc-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-zinc-400 font-bold">{business.rating}</span>
          </div>

          
            href={business.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black px-4 py-2 rounded-full text-xs hover:shadow-lg hover:shadow-cyan-500/50 transition-all group/btn"
          >
            Découvrir
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddBusiness, setShowAddBusiness] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: '', description: '' });

  const filteredBusinesses = selectedCategory
    ? FEATURED_BUSINESSES.filter(b => b.category.includes(selectedCategory.split(' ')[1]))
    : FEATURED_BUSINESSES;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-xl sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <h1 className="font-serif text-6xl md:text-7xl font-black italic tracking-tighter">
                L'ÉCHO <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">DU MATIN</span>
              </h1>
              <p className="text-lg text-zinc-400 italic font-serif">
                La plateforme qui met en avant vos entreprises • Dès 1€
              </p>

              {/* Search Bar */}
              <div className="flex items-center gap-2 max-w-md mx-auto mt-6">
                <div className="flex-grow relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Rechercher une entreprise..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-full pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-all backdrop-blur-xl"
