import React, { useState } from 'react';
import { Category, NewsArticle, Language } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Plus, X, ExternalLink, Star } from 'lucide-react';

const ANNONCES: NewsArticle[] = [
  {
    id: '1',
    type: 'FACTUAL',
    title: 'RESTAURANT GOURMET PARIS',
    summary: '5 étoiles • Cuisine française gastronomique au cœur de Paris',
    content: 'Découvrez notre sélection de plats traditionnels revisités par nos chefs étoilés. Restaurant ouvert 7j/7 de 12h à 23h. Réservation recommandée.',
    truthContent: 'Vérifié',
    physicalFacts: '127 avis positifs',
    audioAnnounce: 'Restaurant Gourmet',
    imagePrompt: 'restaurant',
    strategicAdvice: { action: 'Réserver maintenant', details: 'Tables disponibles pour les groupes et événements privés' },
    location: 'Paris 8ème',
    timestamp: new Date().toISOString(),
    category: Category.UNES,
    imageUrl: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80',
    sources: [{ title: 'Restaurant Gourmet', uri: 'https://example.com' }]
  },
  {
    id: '2',
    type: 'FACTUAL',
    title: 'AGENCE IMMOBILIÈRE CÔTE D\'AZUR',
    summary: '★★★★★ • Propriétés exclusives et résidences de luxe',
    content: 'Spécialisée dans la vente de villas et appartements haut de gamme. Portfolio de 150+ propriétés. Accompagnement personnalisé pour chaque client.',
    truthContent: 'Vérifié',
    physicalFacts: '50 ans d\'expérience',
    audioAnnounce: 'Immobilier Côte d\'Azur',
    imagePrompt: 'immobilier',
    strategicAdvice: { action: 'Consulter les annonces', details: 'Visite virtuelle 3D disponible pour toutes les propriétés' },
    location: 'Côte d\'Azur',
    timestamp: new Date().toISOString(),
    category: Category.UNES,
    imageUrl: 'https://images.unsplash.com/photo-1570129477492-45a003537e1f?auto=format&fit=crop&w=1200&q=80',
    sources: [{ title: 'Agence Immobilière', uri: 'https://example.com' }]
  },
  {
    id: '3',
    type: 'FACTUAL',
    title: 'TECHHUB INNOVATION',
    summary: '★★★★★ • Solutions technologiques pour startups',
    content: 'Accompagnement complet: conseil en développement, infrastructure cloud, formation des équipes. 200+ startups accompagnées avec succès.',
    truthContent: 'Vérifié',
    physicalFacts: '15 ans d\'expertise',
    audioAnnounce: 'TechHub Innovation',
    imagePrompt: 'technologie',
    strategicAdvice: { action: 'Prendre rendez-vous', details: 'Audit technologique gratuit pour les nouveaux clients' },
    location: 'Paris 10ème',
    timestamp: new Date().toISOString(),
    category: Category.UNES,
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    sources: [{ title: 'TechHub', uri: 'https://example.com' }]
  },
  {
    id: '4',
    type: 'FACTUAL',
    title: 'WELLNESS CLINIC',
    summary: '★★★★★ • Centre médical premium avec spécialistes',
    content: 'Cardiologie, neurologie, dermatologie, dentisterie. Équipes reconnues internationalement. Prise de RDV en ligne 24h/24.',
    truthContent: 'Vérifié',
    physicalFacts: '1200+ patients satisfaits/mois',
    audioAnnounce: 'Wellness Clinic',
    imagePrompt: 'sante',
    strategicAdvice: { action: 'Prendre RDV', details: 'Consultation initiale offerte pour les nouveaux patients' },
    location: 'Lyon Centre',
    timestamp: new Date().toISOString(),
    category: Category.UNES,
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-112173f7f869?auto=format&fit=crop&w=1200&q=80',
    sources: [{ title: 'Wellness Clinic', uri: 'https://example.com' }]
  },
  {
    id: '5',
    type: 'FACTUAL',
    title: 'TRANSPORT PREMIUM LYON',
    summary: '★★★★★ • VTC et transport de luxe',
    content: 'Flottes modernes, chauffeurs professionnels formés, disponibilité 24/7. Trajets aéroport, entreprise, événements. Tarifs compétitifs.',
    truthContent: 'Vérifié',
    physicalFacts: '5000+ trajets/mois',
    audioAnnounce: 'Transport Premium',
    imagePrompt: 'transport',
    strategicAdvice: { action: 'Réserver un trajet', details: 'Application mobile avec suivi en temps réel' },
    location: 'Lyon',
    timestamp: new Date().toISOString(),
    category: Category.UNES,
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80',
    sources: [{ title: 'Transport Premium', uri: 'https://example.com' }]
  },
  {
    id: '6',
    type: 'FACTUAL',
    title: 'SALON DE BEAUTÉ PARIS',
    summary: '★★★★★ • Soins premium et bien-être',
    content: 'Coiffure, maquillage, massages, soins du visage. Produits haut de gamme bio. Ambiance zen et relaxante.',
    truthContent: 'Vérifié',
    physicalFacts: '800+ clients réguliers',
    audioAnnounce: 'Salon Beauté',
    imagePrompt: 'beaute',
    strategicAdvice: { action: 'Réserver un soin', details: 'Forfaits abonnement avec 20% de réduction' },
    location: 'Paris Marais',
    timestamp: new Date().toISOString(),
    category: Category.UNES,
    imageUrl: 'https://images.unsplash.com/photo-1552693938-d5dbe7e32397?auto=format&fit=crop&w=1200&q=80',
    sources: [{ title: 'Salon Beauté', uri: 'https://example.com' }]
  },
  {
    id: '7',
    type: 'FACTUAL',
    title: 'ÉCOLE DE LANGUES BORDEAUX',
    summary: '★★★★★ • Apprentissage intensif et flexible',
    content: 'Anglais, espagnol, allemand, mandarin. Cours individuels et groupes. Préparation aux certifications TOEFL, DELE, etc.',
    truthContent: 'Vérifié',
    physicalFacts: '2000+ étudiants formés',
    audioAnnounce: 'École de Langues',
    imagePrompt: 'education',
    strategicAdvice: { action: 'S\'inscrire', details: 'Essai gratuit d\'une semaine pour tous les nouveaux inscrits' },
    location: 'Bordeaux',
    timestamp: new Date().toISOString(),
    category: Category.UNES,
    imageUrl: 'https://images.unsplash.com/photo-1427504494785-cdaf8680d1d3?auto=format&fit=crop&w=1200&q=80',
    sources: [{ title: 'École de Langues', uri: 'https://example.com' }]
  },
  {
    id: '8',
    type: 'FACTUAL',
    title: 'AGENCE DE DESIGN MARSEILLE',
    summary: '★★★★★ • Création graphique et web',
    content: 'Logos, sites web, branding complet. Équipe créative de 12 designers. Devis gratuit en 24h.',
    truthContent: 'Vérifié',
    physicalFacts: '300+ projets réussis',
    audioAnnounce: 'Agence Design',
    imagePrompt: 'design',
    strategicAdvice: { action: 'Demander un devis', details: 'Consultation stratégique gratuite incluse' },
    location: 'Marseille',
    timestamp: new Date().toISOString(),
    category: Category.UNES,
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80',
    sources: [{ title: 'Agence Design', uri: 'https://example.com' }]
  },
  {
    id: '9',
    type: 'FACTUAL',
    title: 'FITNESS CENTER TOULOUSE',
    summary: '★★★★★ • Salle de sport nouvelle génération',
    content: 'Musculation, cardio, yoga, pilates. Coaching personnalisé. Nutrition et suivi personnalisé. Abonnements flexibles.',
    truthContent: 'Vérifié',
    physicalFacts: '1500+ membres actifs',
    audioAnnounce: 'Fitness Center',
    imagePrompt: 'fitness',
    strategicAdvice: { action: 'S\'inscrire', details: 'Mois gratuit + bilan de fitness offert' },
    location: 'Toulouse',
    timestamp: new Date().toISOString(),
    category: Category.UNES,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    sources: [{ title: 'Fitness Center', uri: 'https://example.com' }]
  },
  {
    id: '10',
    type: 'FACTUAL',
    title: 'BOULANGERIE ARTISANALE NICE',
    summary: '★★★★★ • Pain et pâtisseries faits maison',
    content: 'Boulangerie traditionnelle depuis 30 ans. Farines biologiques, levain naturel, zero additif. Livraison possible.',
    truthContent: 'Vérifié',
    physicalFacts: '500+ clients quotidiens',
    audioAnnounce: 'Boulangerie Artisanale',
    imagePrompt: 'boulangerie',
    strategicAdvice: { action: 'Commander', details: 'Pains et viennoiseries sur commande dès 6h du matin' },
    location: 'Nice',
    timestamp: new Date().toISOString(),
    category: Category.UNES,
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
    sources: [{ title: 'Boulangerie', uri: 'https://example.com' }]
  }
];

const SponsorBanner = () => (
  <div className="my-8 p-6 bg-zinc-900 text-white rounded-3xl space-y-4">
    <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest mb-4">
      <span className="text-zinc-500">Votre entreprise ici</span>
    </div>
    <div className="text-center space-y-4">
      <h3 className="text-2xl font-black italic">Mettez votre annonce dans L'ÉCHO DU MATIN</h3>
      <p className="text-sm text-zinc-300">À partir de 1€ • Rejoignez 10 entreprises visibles en ce moment</p>
      <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-black rounded-full hover:scale-105 transition-all">
        Ajouter votre annonce
      </button>
    </div>
  </div>
);

const App: React.FC = () => {
  const [lang] = useState<Language>(Language.FR);
  const [category] = useState<Category>(Category.UNES);
  const [selected, setSelected] = useState<NewsArticle | null>(null);

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-zinc-950">
      {/* Header */}
      <header className="border-b-4 border-zinc-900 mx-4 md:mx-10 mt-4 md:mt-6 pb-4 md:pb-6 text-center">
        <div className="text-center space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Annonces d'entreprises</p>
          <h1 className="font-serif text-[2.8rem] md:text-[7rem] font-black italic tracking-tighter leading-none">
            L'ÉCHO <span className="text-red-600">DU MATIN</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-2">
            Les meilleurs services et entreprises de France • Direc par Claude
          </p>
        </div>
      </header>

      {/* Navigation */}
      <div className="sticky top-0 bg-[#FDFCF8]/95 backdrop-blur z-50 border-b border-zinc-900 py-4 px-6">
        <nav className="flex items-center justify-center gap-8 overflow-x-auto">
          <button className="text-[10px] font-black uppercase tracking-widest text-black border-b-2 border-black whitespace-nowrap">
            À LA UNE
          </button>
          <button className="text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:text-zinc-600 whitespace-nowrap">
            ANNONCES LOCALES
          </button>
          <button className="text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:text-zinc-600 whitespace-nowrap">
            AJOUTER VOTRE ANNONCE
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10 w-full">
        <div className="space-y-8">
          {ANNONCES.map((annonce, idx) => (
            <article key={annonce.id} className="border-b border-zinc-100 pb-10 cursor-pointer group" onClick={() => setSelected(annonce)}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Image */}
                <div className="md:col-span-2">
                  <div className="aspect-video overflow-hidden rounded-sm border border-zinc-200 mb-6">
                    <img
                      src={annonce.imageUrl}
                      alt={annonce.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h2 className="font-serif font-black italic tracking-tighter text-2xl mb-3 group-hover:text-zinc-700 transition-colors">
                    {annonce.title}
                  </h2>
                  <p className="text-zinc-500 text-sm leading-relaxed italic line-clamp-3 mb-4">
                    {annonce.summary}
                  </p>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold">{annonce.location}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {/* Sponsor Banner */}
          <SponsorBanner />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 text-white py-16 px-10 text-center">
        <h2 className="font-serif text-3xl italic font-black mb-4">L'ÉCHO DU MATIN</h2>
        <p className="text-[10px] tracking-[0.5em] text-zinc-500 uppercase mb-6">Annuaire d'entreprises • Rédigé par Claude</p>
      </footer>

      {/* Modal Article */}
      {selected && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
          <div className="sticky top-0 p-4 flex justify-between items-center z-50 border-b bg-white/95 border-zinc-100 backdrop-blur">
            <button onClick={() => setSelected(null)} className="p-2 rounded-full hover:bg-zinc-100">
              ✕
            </button>
            <span className="font-serif font-black italic text-lg hidden sm:block">L'ÉCHO DU MATIN</span>
            <div></div>
          </div>

          <article className="max-w-3xl mx-auto py-10 px-4 md:px-6 space-y-10 pb-32">
            <h2 className="font-serif font-black italic tracking-tighter text-4xl md:text-6xl leading-[0.9]">
              {selected.title}
            </h2>

            <div className="aspect-video rounded-sm overflow-hidden border-2 border-zinc-900 shadow-2xl">
              <img src={selected.imageUrl} alt={selected.title} className="w-full h-full object-cover" />
            </div>

            <p className="text-lg md:text-2xl text-zinc-800 leading-relaxed font-serif italic whitespace-pre-line">
              {selected.content}
            </p>

            <div className="bg-zinc-900 text-white p-8 rounded-2xl space-y-4">
              <h4 className="font-bold text-lg">{selected.strategicAdvice?.action}</h4>
              <p className="text-sm text-zinc-300">{selected.strategicAdvice?.details}</p>
            </div>

            <div className="flex gap-4">
              
                href={selected.sources[0]?.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-grow p-5 bg-black text-white rounded-full font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all"
              >
                Visiter
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </article>
        </div>
      )}
    </div>
  );
};

export default App;
