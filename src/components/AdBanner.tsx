import React from 'react';
import { ExternalLink, Star, Sparkles, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  cta: string;
  ctaLink: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  badge?: string;
}

const ADS: AdCard[] = [
  {
    id: 'vrax-voyage',
    title: 'VraxVoyage.com',
    subtitle: 'Voyages Authentiques',
    description: 'Découvrez des destinations extraordinaires avec nos ressources de voyage de pointe. Planifiez votre prochain aventure spirituelle ou culturelle en toute confiance.',
    features: [
      '✈️ Billets aériens optimisés',
      '🗺️ Itinéraires personnalisés',
      '💎 Expériences exclusives',
      '🔒 Sécurité garantie'
    ],
    cta: 'Explorer les Voyages',
    ctaLink: 'https://vrax-voyage.com',
    icon: '✈️',
    color: 'from-blue-600 to-cyan-600',
    bgGradient: 'from-blue-50 to-cyan-50',
    badge: 'Voyages Premium'
  },
  {
    id: 'imam-virtuel',
    title: 'ImamVirtuel.com',
    subtitle: 'Apprentissage Islamique',
    description: 'Une plateforme complète pour apprendre l\'Islam sereinement. Radio douce avec sourates, cours de Tajwid, lecture coranique guidée, et bien plus.',
    features: [
      '📖 Alphabet & Tajwid',
      '🎙️ Radio douce jour/nuit',
      '📿 Salat guidée (Play)',
      '🕌 Apprentissage structuré'
    ],
    cta: 'Commencer l\'Apprentissage',
    ctaLink: 'https://limamvirtuel.com',
    icon: '📿',
    color: 'from-green-600 to-emerald-600',
    bgGradient: 'from-green-50 to-emerald-50',
    badge: 'Apprentissage Spirituel'
  },
  {
    id: 'compagnon-2030',
    title: 'Le Compagnon 2030',
    subtitle: 'Votre Guide Interactif',
    description: 'Marre des recherches confuses ? Le Compagnon 2030 simplifie votre pratique islamique avec un apprentissage structuré, authentique et accessible. Pour seulement 2,50 EUR.',
    features: [
      '✨ Les 5 Piliers expliqués',
      '🙏 Salat guidée pas à pas',
      '🎵 Voix du Sheikh Mishary Rashid Alafasy',
      '💡 Technologie + Tradition'
    ],
    cta: 'JE COMMENCE (2,50 EUR)',
    ctaLink: 'https://bachiratmani1313.systeme.io/30245d2f',
    icon: '💎',
    color: 'from-amber-600 to-red-600',
    bgGradient: 'from-amber-50 to-red-50',
    badge: 'Bestseller 🔥'
  }
];

const AdCard: React.FC<{ ad: AdCard; index: number }> = ({ ad, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`relative overflow-hidden rounded-3xl border-2 border-zinc-200 shadow-lg hover:shadow-2xl transition-all duration-300 group bg-gradient-to-br ${ad.bgGradient}`}
    >
      <div className={`absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br ${ad.color} opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity duration-500`}></div>

      <div className="relative z-10 p-8 md:p-10 space-y-6">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-5xl">{ad.icon}</span>
              <h3 className="font-serif text-3xl md:text-4xl font-black italic tracking-tighter">
                {ad.title}
              </h3>
            </div>
            <p className={`text-sm font-bold uppercase tracking-widest bg-gradient-to-r ${ad.color} bg-clip-text text-transparent`}>
              {ad.subtitle}
            </p>
          </div>
          {ad.badge && (
            <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${ad.color} text-white font-black text-xs uppercase tracking-widest whitespace-nowrap shadow-lg`}>
              {ad.badge}
            </div>
          )}
        </div>

        <p className="text-zinc-700 text-base md:text-lg leading-relaxed italic font-serif">
          {ad.description}
        </p>

        <div className="bg-white/60 backdrop-blur rounded-2xl p-6 space-y-3 border border-white/40">
          {ad.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${ad.color}`}></div>
              <p className="text-sm text-zinc-700 font-medium">{feature}</p>
            </div>
          ))}
        </div>

        
          href={ad.ctaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-5 md:py-6 px-6 bg-gradient-to-r text-white font-black uppercase tracking-widest text-center rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center
