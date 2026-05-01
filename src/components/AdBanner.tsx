import React from 'react';
import { ExternalLink } from 'lucide-react';

export const AnnouncementsView: React.FC = () => {
  return (
    <div className="space-y-12 py-20">
      <div className="text-center space-y-4">
        <h2 className="font-serif text-6xl font-black italic">
          NOS PARTENAIRES
        </h2>
        <p className="text-zinc-600 text-lg">
          Découvrez nos services recommandés
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* CARTE 1 */}
        <div className="border-2 border-zinc-200 rounded-3xl p-8 shadow-lg">
          <span className="text-5xl block mb-4">✈️</span>
          <h3 className="font-serif text-3xl font-black mb-2">VraxVoyage.com</h3>
          <p className="text-sm text-zinc-600 font-bold mb-4">Voyages Authentiques</p>
          <p className="text-zinc-700 mb-6">Découvrez des destinations extraordinaires avec nos ressources de voyage de pointe.</p>
          
          <div className="bg-white/60 rounded-2xl p-4 mb-6 space-y-2">
            <p className="text-sm">✈️ Billets aériens optimisés</p>
            <p className="text-sm">🗺️ Itinéraires personnalisés</p>
            <p className="text-sm">💎 Expériences exclusives</p>
            <p className="text-sm">🔒 Sécurité garantie</p>
          </div>

          <a 
            href="https://vrax-voyage.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-blue-600 text-white font-black py-4 rounded-2xl text-center hover:bg-blue-700 transition-all"
          >
            Explorer les Voyages
          </a>
        </div>

        {/* CARTE 2 */}
        <div className="border-2 border-zinc-200 rounded-3xl p-8 shadow-lg">
          <span className="text-5xl block mb-4">📿</span>
          <h3 className="font-serif text-3xl font-black mb-2">ImamVirtuel.com</h3>
          <p className="text-sm text-zinc-600 font-bold mb-4">Apprentissage Islamique</p>
          <p className="text-zinc-700 mb-6">Une plateforme complète pour apprendre l'Islam sereinement.</p>
          
          <div className="bg-white/60 rounded-2xl p-4 mb-6 space-y-2">
            <p className="text-sm">📖 Alphabet & Tajwid</p>
            <p className="text-sm">🎙️ Radio douce jour/nuit</p>
            <p className="text-sm">📿 Salat guidée (Play)</p>
            <p className="text-sm">🕌 Apprentissage structuré</p>
          </div>

          <a 
            href="https://limamvirtuel.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-600 text-white font-black py-4 rounded-2xl text-center hover:bg-green-700 transition-all"
          >
            Commencer l'Apprentissage
          </a>
        </div>

        {/* CARTE 3 */}
        <div className="border-2 border-zinc-200 rounded-3xl p-8 shadow-lg">
          <span className="text-5xl block mb-4">💎</span>
          <h3 className="font-serif text-3xl font-black mb-2">Le Compagnon 2030</h3>
          <p className="text-sm text-zinc-600 font-bold mb-4">Votre Guide Interactif</p>
          <p className="text-zinc-700 mb-6">Simplifie votre pratique islamique. Pour seulement 2,50 EUR.</p>
          
          <div className="bg-white/60 rounded-2xl p-4 mb-6 space-y-2">
            <p className="text-sm">✨ Les 5 Piliers expliqués</p>
            <p className="text-sm">🙏 Salat guidée pas à pas</p>
            <p className="text-sm">🎵 Voix Sheikh Mishary Rashid</p>
            <p className="text-sm">💡 Technologie + Tradition</p>
          </div>

          <a 
            href="https://bachiratmani1313.systeme.io/30245d2f" 
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-red-600 text-white font-black py-4 rounded-2xl text-center hover:bg-red-700 transition-all"
          >
            JE COMMENCE (2,50 EUR)
          </a>
        </div>
      </div>

      {/* SECTION FINALE */}
      <div className="bg-zinc-900 text-white rounded-3xl p-16 text-center space-y-6">
        <h3 className="font-serif text-5xl font-black">Vous hésitez encore ?</h3>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          Chaque jour, des milliers de personnes choisissent ces services pour améliorer leur vie spirituelle.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center pt-4">
          
            href="https://bachiratmani1313.systeme.io/30245d2f"
            className="px-8 py-4 bg-white text-red-600 font-black rounded-full hover:scale-105 transition-all"
          >
            Découvrir Le Compagnon 2030
          </a>
          
            href="https://limamvirtuel.com"
            className="px-8 py-4 bg-white/20 border-2 border-white text-white font-black rounded-full hover:scale-105 transition-all"
          >
            Explorer ImamVirtuel
          </a>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsView;
