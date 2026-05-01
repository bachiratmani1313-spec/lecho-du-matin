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
    description: 'Marre des recherches confuses ? Le Compagnon 2030 simplifie votre pratique islamique avec un apprentissage structuré, authentique et accessible. Pour seulement 2,50 €.',
    features: [
      '✨ Les 5 Piliers expliqués',
      '🙏 Salat guidée pas à pas',
      '🎵 Voix du Sheikh Mishary Rashid Alafasy',
      '💡 Technologie + Tradition'
    ],
    cta: 'JE COMMENCE (2,50 €)',
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
            <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${ad.color} text-white font-black text-[10px] uppercase tracking-widest whitespace-nowrap shadow-lg`}>
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
          className={`block w-full py-5 md:py-6 px-6 bg-gradient-to-r ${ad.color} text-white font-black uppercase tracking-widest text-center rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 group/btn`}
        >
          <span>{ad.cta}</span>
          <ExternalLink className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
        </a>

        {ad.id === 'compagnon-2030' && (
          <p className="text-[10px] text-zinc-600 italic text-center border-t border-zinc-200 pt-4 font-serif">
            "Apprendre la prière n'a jamais été aussi simple et accessible."<br/>
            <span className="font-bold">Exclusivité :</span> Accès complet à tous les modules d'apprentissage
          </p>
        )}
      </div>
    </motion.div>
  );
};

export const AnnouncementsView: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h2 className="font-serif text-5xl md:text-7xl font-black italic tracking-tighter">
          NOS <span className="text-red-600">PARTENAIRES</span>
        </h2>
        <p className="text-zinc-600 text-lg italic font-serif">
          Découvrez les services et applications recommandés par L'ÉCHO DU MATIN.
          Des solutions de confiance pour enrichir votre vie.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
        {ADS.map((ad, idx) => (
          <AdCard key={ad.id} ad={ad} index={idx} />
        ))}
      </div>

      <div className="bg-zinc-900 text-white rounded-3xl p-10 md:p-16 space-y-8 border border-zinc-800 shadow-2xl">
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <h3 className="font-serif text-3xl italic font-black">
            Pourquoi faire confiance à nos partenaires ?
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Sparkles className="w-8 h-8" />,
              title: 'Qualité Premium',
              description: 'Chaque service est sélectionné pour son excellence et son authenticité.'
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: 'Communauté de Confiance',
              description: 'Des milliers d\'utilisateurs satisfaits en France et dans le monde.'
            },
            {
              icon: <Clock className="w-8 h-8" />,
              title: 'Support 24/7',
              description: 'Équipes dédiées pour vous accompagner à chaque étape.'
            }
          ].map((benefit, i) => (
            <div key={i} className="space-y-3 text-center">
              <div className="flex justify-center text-red-500">{benefit.icon}</div>
              <h4 className="font-bold text-lg">{benefit.title}</h4>
              <p className="text-zinc-400 text-sm italic">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-3xl p-10 md:p-16 text-center space-y-6 shadow-2xl">
        <h3 className="font-serif text-4xl md:text-5xl font-black italic tracking-tighter">
          Vous hésitez encore ?
        </h3>
        <p className="text-lg italic font-serif opacity-90 max-w-2xl mx-auto">
          Chaque jour, des milliers de personnes choisissent ces services pour améliorer leur vie spirituelle, leurs voyages et leur apprentissage. À votre tour !
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center pt-4">
          
            href="https://bachiratmani1313.systeme.io/30245d2f"
            className="px-8 py-4 bg-white text-red-600 font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-lg"
          >
            Découvrir Le Compagnon 2030
          </a>
          
            href="https://limamvirtuel.com"
            className="px-8 py-4 bg-white/20 border-2 border-white text-white font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all backdrop-blur"
          >
            Explorer ImamVirtuel
          </a>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsView;
