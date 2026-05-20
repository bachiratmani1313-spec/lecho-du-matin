import React, { useState, useEffect, useRef } from 'react';
import { Category, NewsArticle, Language } from './types';
import { fetchNews, speakArticle, decodeAudio, createWavBlob } from './services/geminiService';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Download, 
  ChevronLeft, 
  Radio, 
  AlertCircle,
  RefreshCw,
  Key,
  Sword,
  TrendingUp,
  Cpu,
  Trophy,
  Stethoscope,
  Globe,
  Palette,
  CloudSun,
  Newspaper,
  LayoutGrid,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const CATEGORY_IMAGES: Record<string, string> = {
  [Category.UNES]: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80",
  [Category.GEOPOLITIQUE]: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80",
  [Category.FINANCE]: "https://images.unsplash.com/photo-1611974714024-46202e33bc3b?auto=format&fit=crop&w=1200&q=80",
  [Category.METEO]: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1200&q=80",
  [Category.SOCIETE]: "https://images.unsplash.com/photo-1560161407-063991206644?auto=format&fit=crop&w=1200&q=80",
  [Category.TECH]: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
  [Category.ANNONCES]: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80"
};

const ISLAM_MODULES_INIT: any[] = [
  {
    id: 'm1',
    title: "Alphabet & Tajwid",
    description: "Apprenez les bases de la lecture coranique sur ImamVirtuel.com.",
    content: "Sur ImamVirtuel.com, nous facilitons l'apprentissage de l'arabe et les règles de Tajwid. Notre interface vous guide pas à pas pour une prononciation parfaite, soutenue par notre radio douce qui diffuse des sourates en continu.",
    isUnlocked: true
  },
  {
    id: 'm2',
    title: "La Radio Intelligente",
    description: "Invocations synchronisées jour et nuit.",
    content: "L'une des innovations d'ImamVirtuel est sa radio de fond. Elle s'adapte à votre horloge : invocations lumineuses le jour, mélodies spirituelles apaisantes la nuit. Naviguez sur le site tout en restant en connexion spirituelle.",
    isUnlocked: false
  },
  {
    id: 'm3',
    title: "Prière Guidée (Play)",
    description: "L'accompagnement automatique pour votre Salat.",
    content: "Une fois formé, utilisez notre Web App de prière. Posez votre tapis, appuyez sur 'PLAY' et laissez-vous guider par la lecture et les mouvements. C'est l'outil ultime pour réussir sa prière avec précision et sérénité.",
    isUnlocked: false,
    questions: [
      { question: "Avez-vous bien fait vos ablutions ?", answer: true },
      { question: "Êtes-vous orienté vers la Qibla ?", answer: true },
      { question: "Êtes-vous dans un état de pureté ?", answer: true },
      { question: "Votre tapis est-il propre ?", answer: true },
      { question: "Maîtrisez-vous les bases des cours précédents ?", answer: true }
    ]
  }
];

const SponsorBanner: React.FC = () => (
  <div className="my-8 p-6 bg-zinc-900 text-white rounded-3xl space-y-4">
    <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
      <span className="text-zinc-500">Partenaires de Confiance</span>
      <LayoutGrid className="w-4 h-4 text-red-600" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-2">
        <h4 className="font-bold text-sm">Bravox Travel</h4>
        <p className="text-[10px] text-zinc-400">Ressources technologiques de pointe pour vos billets d'avion.</p>
        <a href="https://VreksVoyage.com" target="_blank" rel="noreferrer" className="text-red-500 font-bold text-[9px] underline block">VreksVoyage.com</a>
      </div>
      <div className="space-y-2 border-l border-zinc-800 pl-6">
        <h4 className="font-bold text-sm">ImamVirtuel.com</h4>
        <p className="text-[10px] text-zinc-400">Apprentissage, Radio Invocations Jour/Nuit & Prière Guidée.</p>
        <a href="https://ImamVirtuel.com" target="_blank" rel="noreferrer" className="text-red-500 font-bold text-[9px] underline block hover:text-red-400">ImamVirtuel.com</a>
      </div>
      <div className="space-y-2 border-l border-zinc-800 pl-6">
        <h4 className="font-bold text-sm">Voice Bridge</h4>
        <p className="text-[10px] text-zinc-400">Traduction pro sur ChatGPT : Arabe, Mandarin, etc.</p>
        <p className="text-zinc-500 text-[9px]">Recherchez sur GPT Store</p>
      </div>
    </div>
  </div>
);

const IslamCourseView: React.FC<{ modules: any[], onModuleComplete: (id: string) => void }> = ({ modules, onModuleComplete }) => {
  const [selectedModule, setSelectedModule] = useState<any | null>(null);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="font-serif text-4xl md:text-6xl font-black italic tracking-tighter">Apprentissage Islam</h2>
        <p className="text-zinc-500 italic">Un parcours structuré pour découvrir les bases de la foi et de la pratique.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
        {modules.map((m, idx) => (
          <div 
            key={m.id} 
            className={cn(
              "p-8 rounded-[2.5rem] border transition-all relative overflow-hidden group h-full flex flex-col",
              m.isUnlocked ? "bg-white border-zinc-100 shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-1" : "bg-zinc-50 border-zinc-100 opacity-60 grayscale"
            )}
            onClick={() => m.isUnlocked && setSelectedModule(m)}
          >
            <div className="flex justify-between items-start mb-6">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl", m.isUnlocked ? "bg-red-600 text-white" : "bg-zinc-200 text-zinc-400")}>
                {idx + 1}
              </div>
              {!m.isUnlocked && <Key className="w-5 h-5 text-zinc-300" />}
            </div>
            <h3 className="font-serif text-2xl font-black italic mb-2 tracking-tight shrink-0">{m.title}</h3>
            <p className="text-zinc-500 text-xs leading-relaxed flex-grow">{m.description}</p>
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-900/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        ))}
      </div>

      {selectedModule && (
        <div className="fixed inset-0 z-[200] bg-white overflow-y-auto animate-in slide-in-from-bottom duration-500">
          <div className="max-w-2xl mx-auto py-20 px-6 space-y-12">
            <button onClick={() => setSelectedModule(null)} className="p-3 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="space-y-6">
              <h2 className="font-serif text-5xl font-black italic tracking-tighter">{selectedModule.title}</h2>
              <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em]">Module Apprentissage</p>
              <div className="prose prose-zinc max-w-none text-xl leading-relaxed font-serif italic text-zinc-700">
                {selectedModule.content}
              </div>
            </div>

            {selectedModule.questions && (
              <div className="bg-zinc-900 text-white p-8 md:p-12 rounded-[3.5rem] space-y-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600"></div>
                <div className="space-y-2">
                   <h3 className="text-2xl font-bold flex items-center gap-3 italic font-serif">
                    <CheckCircle2 className="text-red-500 w-8 h-8" />
                    Validation de l'Accompagnateur
                  </h3>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Répondez à ces questions pour débloquer la suite</p>
                </div>
                <div className="space-y-4">
                  {selectedModule.questions.map((q: any, i: number) => (
                    <div key={i} className="flex items-center justify-between gap-4 p-5 rounded-3xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                      <p className="text-xs font-medium">{q.question}</p>
                      <button 
                        onClick={() => setAnswers(prev => ({...prev, [`${selectedModule.id}-${i}`]: true}))}
                        className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                          answers[`${selectedModule.id}-${i}`] ? "bg-green-600 text-white scale-110" : "bg-white/10 text-white/40 hover:bg-white/20"
                        )}
                      >
                        <CheckCircle2 className="w-6 h-6" />
                      </button>
                    </div>
                  ))}
                </div>
                {Object.keys(answers).filter(k => k.startsWith(selectedModule.id)).length === selectedModule.questions.length && (
                  <button 
                    onClick={() => {
                      onModuleComplete(selectedModule.id);
                      setSelectedModule(null);
                    }}
                    className="w-full py-6 bg-red-600 text-white rounded-full font-black uppercase tracking-[0.4em] text-[10px] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-red-900/50"
                  >
                    Débloquer le module suivant
                  </button>
                )}
              </div>
            )}

            {!selectedModule.questions && (
              <button 
                onClick={() => {
                  onModuleComplete(selectedModule.id);
                  setSelectedModule(null);
                }}
                className="w-full py-6 bg-zinc-900 text-white rounded-full font-black uppercase tracking-[0.4em] text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                Chapitre Suivant
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ArticleIllustration: React.FC<{ category: Category; className?: string }> = ({ category, className }) => {
  const imageUrl = CATEGORY_IMAGES[category] || CATEGORY_IMAGES[Category.UNES];

  return (
    <div className={cn("relative w-full h-full overflow-hidden border border-zinc-100", className)}>
      <img 
        src={imageUrl} 
        alt={category} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
      <div className="absolute bottom-4 left-4 right-4">
        <p className="text-[7px] font-black uppercase tracking-[0.4em] text-white/80">L'ÉCHO • {category}</p>
      </div>
    </div>
  );
};

const getDailyEditionKey = () => {
  // Obtenir l'heure actuelle en UTC
  const now = new Date();
  // Créer une date représentant l'heure de La Mecque (UTC+3)
  const meccaTime = new Date(now.getTime() + (3 * 60 * 60 * 1000));
  
  // Si l'heure à La Mecque est avant 5h du matin, c'est encore l'édition de la veille
  if (meccaTime.getUTCHours() < 5) {
    meccaTime.setUTCDate(meccaTime.getUTCDate() - 1);
  }
  
  // Retourner la date formatée YYYY-MM-DD
  const year = meccaTime.getUTCFullYear();
  const month = String(meccaTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(meccaTime.getUTCDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

const App: React.FC = () => {
  // Sync ID: 2026-04-22-1740
  const editionKey = getDailyEditionKey();
  const [lang, setLang] = useState<Language>(Language.FR);

  // Dictionnaire de traduction de l'INTERFACE (onglets, gros titres, boutons)
  const UI: Record<string, Record<string, string>> = {
    "À la une": { EN: "Headlines", ES: "Portada", DE: "Schlagzeilen", AR: "الأبرز" },
    "Géopolitique & Conflits": { EN: "Geopolitics & Conflicts", ES: "Geopolítica y Conflictos", DE: "Geopolitik & Konflikte", AR: "الجيوسياسة والنزاعات" },
    "Finance & Crypto": { EN: "Finance & Crypto", ES: "Finanzas y Cripto", DE: "Finanzen & Krypto", AR: "المال والعملات الرقمية" },
    "Météo & Alertes Sat": { EN: "Weather & Sat Alerts", ES: "Clima y Alertas", DE: "Wetter & Warnungen", AR: "الطقس والتنبيهات" },
    "Belgique & Europe": { EN: "Belgium & Europe", ES: "Bélgica y Europa", DE: "Belgien & Europa", AR: "بلجيكا وأوروبا" },
    "IA & Futur": { EN: "AI & Future", ES: "IA y Futuro", DE: "KI & Zukunft", AR: "الذكاء الاصطناعي والمستقبل" },
    "Partenariats & Annonces": { EN: "Partners & Ads", ES: "Socios y Anuncios", DE: "Partner & Anzeigen", AR: "الشركاء والإعلانات" },
    "6 HEURES, VU PAR L'IA": { EN: "6 AM, SEEN BY AI", ES: "LAS 6, VISTO POR IA", DE: "6 UHR, VON KI GESEHEN", AR: "السادسة صباحًا بعين الذكاء الاصطناعي" },
    "DIRECTEUR :": { EN: "DIRECTOR:", ES: "DIRECTOR:", DE: "DIREKTOR:", AR: "المدير:" },
    "DIRECT": { EN: "LIVE", ES: "EN VIVO", DE: "LIVE", AR: "مباشر" },
    "ÉCOUTER LE JOURNAL (RADIO)": { EN: "LISTEN TO THE PAPER (RADIO)", ES: "ESCUCHAR EL DIARIO (RADIO)", DE: "ZEITUNG HÖREN (RADIO)", AR: "استمع إلى الصحيفة (راديو)" },
    "ÉCOUTER": { EN: "LISTEN", ES: "ESCUCHAR", DE: "HÖREN", AR: "استمع" },
    "ARRÊTER": { EN: "STOP", ES: "PARAR", DE: "STOPP", AR: "إيقاف" },
    "Lire la suite": { EN: "Read more", ES: "Leer más", DE: "Weiterlesen", AR: "اقرأ المزيد" },
    "La Une": { EN: "Top", ES: "Portada", DE: "Top", AR: "الرئيسية" },
    "RADIO": { EN: "RADIO", ES: "RADIO", DE: "RADIO", AR: "راديو" },
    "L'ÉCHO DU MATIN": { EN: "THE MORNING ECHO", ES: "EL ECO DE LA MAÑANA", DE: "DAS MORGENECHO", AR: "صدى الصباح" },
    "Partager": { EN: "Share", ES: "Compartir", DE: "Teilen", AR: "مشاركة" },
  };

  // Traduit une chaîne d'interface selon la langue choisie (FR = original)
  const tr = (s: string): string => {
    if (lang === Language.FR) return s;
    const langKey =
      lang === Language.EN ? 'EN' :
      lang === Language.ES ? 'ES' :
      lang === Language.DE ? 'DE' :
      lang === Language.AR ? 'AR' : 'FR';
    return (UI[s] && UI[s][langKey]) ? UI[s][langKey] : s;
  };


  // Renvoie titre/résumé/contenu dans la langue choisie (FR = original)
  const L = (a: NewsArticle) => {
    const map: Record<string, string> = {
      [Language.EN]: 'en',
      [Language.ES]: 'es',
      [Language.DE]: 'de',
      [Language.AR]: 'ar',
    };
    const key = map[lang];
    const tr = key && a.translations ? a.translations[key] : undefined;
    if (tr && (tr.title || tr.content)) {
      return {
        title: tr.title || a.title,
        summary: tr.summary || a.summary,
        content: tr.content || a.content,
      };
    }
    return { title: a.title, summary: a.summary, content: a.content };
  };

  const [category, setCategory] = useState<Category>(Category.UNES);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [selected, setSelected] = useState<NewsArticle | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [isRadioMode, setIsRadioMode] = useState(false);
  const [radioIndex, setRadioIndex] = useState(-1);
  const [islamModules, setIslamModules] = useState<any[]>(ISLAM_MODULES_INIT);
  const [showIslamCourse, setShowIslamCourse] = useState(false);
  const [hasKey, setHasKey] = useState<boolean>(true); // Forcé à true puisque la clé est intégrée
  const [isKeyChecking, setIsKeyChecking] = useState(false); // Forcé à false puisque la clé est intégrée
  const [manualKey, setManualKey] = useState("");
  
  const audioCtx = useRef<AudioContext | null>(null);
  const audioSource = useRef<AudioBufferSourceNode | null>(null);

  const todayStr = `${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • Édition du Jour (Aube de La Mecque)`;

  // Vérification de la clé API au démarrage simplifiée (clé intégrée)
  useEffect(() => {
    setIsKeyChecking(false);
  }, []);

  useEffect(() => {
    console.log("[App] État de la clé - hasKey:", hasKey, "isKeyChecking:", isKeyChecking);
  }, [hasKey, isKeyChecking]);

  const handleOpenKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
      setIsKeyChecking(false);
    }
  };

  const handleSaveManualKey = () => {
    const trimmedKey = manualKey.trim();
    if (trimmedKey.startsWith("AIza")) {
      localStorage.setItem('GEMINI_API_KEY', trimmedKey);
      setHasKey(true);
      setIsKeyChecking(false);
      window.location.reload();
    } else {
      alert("La clé doit commencer par 'AIza...'");
    }
  };

  const handleResetKey = () => {
    localStorage.removeItem('GEMINI_API_KEY');
    window.location.reload();
  };

  const handleModuleComplete = (moduleId: string) => {
    setIslamModules(prev => {
      const idx = prev.findIndex(m => m.id === moduleId);
      if (idx !== -1 && idx < prev.length - 1) {
        const next = [...prev];
        next[idx + 1] = { ...next[idx + 1], isUnlocked: true };
        return next;
      }
      return prev;
    });
  };

  const handleShare = async (article: NewsArticle) => {
    const shareText = `🗞️ L'ÉCHO DU MATIN\n\n${article.title.toUpperCase()}\n\n${article.content}\n\n✨ Par Atmani Bachir`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: shareText,
          url: window.location.href
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error("Erreur de partage:", err);
          copyToClipboard(shareText);
        }
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const handleShareCard = async (e: React.MouseEvent, article: NewsArticle) => {
    e.stopPropagation();
    const t = L(article);
    const siteUrl = 'https://lechodumatin.com';
    const shareText = `🗞️ ${t.title}\n\n${t.summary}\n\n📰 Lire sur L'Écho du Matin : ${siteUrl}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: t.title, text: shareText, url: siteUrl });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    const performCopy = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(performCopy)
        .catch((err) => {
          console.error("Clipboard error:", err);
          fallbackCopy(text);
        });
    } else {
      fallbackCopy(text);
    }

    function fallbackCopy(text: string) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (successful) performCopy();
      } catch (err) {
        console.error("Fallback copy failed:", err);
      }
    }
  };

  const handleDownloadAudio = async (article: NewsArticle) => {
    setIsAudioLoading(true);
    try {
      const bytes = await speakArticle(article.content, lang);
      if (bytes) {
        const blob = createWavBlob(bytes);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${article.title.slice(0, 30)}.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        alert("Impossible de générer le fichier audio pour le moment.");
      }
    } catch (e) {
      alert("Erreur lors de la génération de l'audio.");
    } finally {
      setIsAudioLoading(false);
    }
  };

  // Chargement ultra-robuste et instantané
  useEffect(() => {
    if (isKeyChecking || !hasKey) return;

    let isMounted = true;

    const loadData = async () => {
      const cacheKey = `news_edition_v23_${editionKey}_${category}_${lang}`;
      const cached = localStorage.getItem(cacheKey);
      let hadCache = false;

      // 1. Affichage INSTANTANÉ du cache (si présent) pour ne pas attendre
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (isMounted && parsed && parsed.length > 0) {
            setArticles(parsed);
            setLoading(false);
            hadCache = true;
          }
        } catch (e) {
          localStorage.removeItem(cacheKey);
        }
      }
      if (!hadCache && isMounted) {
        setLoading(true);
      }

      // 2. On rafraîchit TOUJOURS depuis le pipeline en arrière-plan
      //    (le site reste utilisable pendant ce temps grâce au cache)
      if (isMounted) setIsUpdating(true);
      if (isMounted && !hadCache) setLoadingMessage("Récupération de l'Édition du Jour (Aube de La Mecque)...");
      if (isMounted) setError(null);

      const messageTimeout = setTimeout(() => {
        if (isMounted && !hadCache) setLoadingMessage("Consultation des archives et dépêches réelles...");
      }, 7000);

      try {
        const fetchTimeout = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error("La recherche mondiale de l'IA prend trop de temps (Timeout 90s).")), 90000)
        );

        const data = await Promise.race([fetchNews(category, lang), fetchTimeout]);
        if (!isMounted) return;

        if (data && data.length > 0) {
          // 3. On remplace par la version FRAÎCHE et on met à jour le cache
          setArticles(data);
          localStorage.setItem(cacheKey, JSON.stringify(data));
        } else if (!hadCache) {
          throw new Error("Le rédacteur n'a pas pu trouver d'informations vérifiées.");
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error("Erreur de mise à jour:", err);
        // Si on avait déjà le cache affiché, on ne casse pas l'écran pour une erreur réseau
        if (hadCache) {
          if (isMounted) { setIsUpdating(false); clearTimeout(messageTimeout); }
          return;
        }
        let userMessage = "L'accès aux serveurs de presse est difficile en ce moment.";
        const technicalDetails = err?.message || String(err);
        
        if (technicalDetails.includes("429") || technicalDetails.toLowerCase().includes("quota")) {
          userMessage = "Limite d'accès atteinte. Veuillez patienter une minute.";
        } else if (technicalDetails.includes("API_KEY_INVALID")) {
          userMessage = "La clé API semble incorrecte.";
        }

        if (!cached) {
          setArticles([]);
          setError(`${userMessage}\n\n(Détails : ${technicalDetails.slice(0, 80)}...)`);
        }
      } finally {
        if (isMounted) {
          clearTimeout(messageTimeout);
          setLoading(false);
          setIsUpdating(false);
          setLoadingMessage("");
        }
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [category, lang, hasKey, isKeyChecking]);

  const handleSpeak = async (text: string, id: string, onEnded?: () => void) => {
    if (speakingId === id) {
      if (audioSource.current) {
        try { audioSource.current.stop(); } catch(e) {}
      }
      setSpeakingId(null);
      return;
    }
    
    if (audioSource.current) {
      try { audioSource.current.stop(); } catch(e) {}
    }

    setSpeakingId(id);
    setIsAudioLoading(true);
    if (!audioCtx.current) audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    try {
      const bytes = await speakArticle(text, lang);
      if (bytes && audioCtx.current) {
        const buffer = await decodeAudio(bytes, audioCtx.current);
        const source = audioCtx.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.current.destination);
        source.onended = () => {
          setSpeakingId(null);
          if (onEnded) onEnded();
        };
        audioSource.current = source;
        source.start(0);
      } else {
        throw new Error("Audio indisponible");
      }
    } catch (err) {
      console.error("Speech error:", err);
      setSpeakingId(null);
      alert("L'intelligence vocale est momentanément occupée.");
    } finally {
      setIsAudioLoading(false);
    }
  };

  const startRadioMode = () => {
    if (articles.length === 0) return;
    setIsRadioMode(true);
    playNextRadioArticle(0);
  };

  const stopRadioMode = () => {
    setIsRadioMode(false);
    setRadioIndex(-1);
    if (audioSource.current) {
      try { audioSource.current.stop(); } catch(e) {}
    }
    setSpeakingId(null);
  };

  const playNextRadioArticle = (index: number) => {
    if (index >= articles.length) {
      stopRadioMode();
      return;
    }
    setRadioIndex(index);
    const article = articles[index];
    handleSpeak(`${article.title}. ${article.content}`, article.id, () => {
      playNextRadioArticle(index + 1);
    });
  };

  if (isKeyChecking) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin mx-auto"></div>
          <p className="font-serif italic text-zinc-400">Vérification des accès...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen bg-[#FDFCF8] text-zinc-950 flex flex-col transition-colors duration-500",
      lang === Language.AR ? 'text-right font-serif' : 'text-left'
    )} dir={lang === Language.AR ? 'rtl' : 'ltr'}>
      {/* HEADER FIXE ET OPTIMISÉ MOBILE */}
      <header className="border-b-4 border-zinc-900 mx-4 md:mx-10 mt-4 md:mt-6 pb-4 md:pb-6 text-center">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-4">
          <span className="bg-red-600 text-white px-2 py-0.5">{tr(category)}</span>
          <div className="text-zinc-400 hidden lg:block italic">{tr("DIRECTEUR :")} <span className="text-zinc-900 font-bold uppercase">Atmani Bachir</span></div>
          <div className="flex gap-3 items-center">
            <button 
              onClick={() => window.location.reload()} 
              className="p-1 hover:bg-zinc-100 rounded-full transition-colors"
              title="Actualiser"
            >
              <RefreshCw className={cn("w-3 h-3", isUpdating && "animate-spin")} />
            </button>
            <button 
              onClick={handleResetKey} 
              className="p-1 hover:bg-zinc-100 rounded-full transition-colors"
              title="Réinitialiser la clé"
            >
              <Key className="w-3 h-3" />
            </button>
            {Object.values(Language).map(l => {
              const labels: Record<string, string> = {
                [Language.FR]: 'FR',
                [Language.EN]: 'EN',
                [Language.ES]: 'ES',
                [Language.DE]: 'DE',
                [Language.AR]: 'AR',
              };
              return (
                <button key={l} onClick={() => setLang(l)} title={l} className={`transition-all ${lang === l ? 'font-black border-b-2 border-black' : 'text-zinc-300'}`}>{labels[l] || l.slice(0, 2).toUpperCase()}</button>
              );
            })}
          </div>
        </div>
        <h1 className="font-serif text-[2.8rem] md:text-[7rem] font-black italic tracking-tighter leading-none">
          {lang === Language.FR ? (
            <>L'ÉCHO <span className="text-red-600">DU MATIN</span></>
          ) : (() => {
            const t = tr("L'ÉCHO DU MATIN");
            const parts = t.split(' ');
            if (parts.length > 1) {
              const last = parts.pop();
              return <>{parts.join(' ')} <span className="text-red-600">{last}</span></>;
            }
            return <span className="text-red-600">{t}</span>;
          })()}
        </h1>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500">{tr("6 HEURES, VU PAR L'IA")}</p>
              <span className="w-1 h-1 bg-zinc-200 rounded-full"></span>
              <span className="text-[10px] font-serif italic text-zinc-400 capitalize">{todayStr}</span>
            </div>
            
            {!loading && articles.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-red-600 text-white rounded text-[7px] font-black animate-pulse">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  {tr("DIRECT")}
                </div>
                <button 
                  onClick={isRadioMode ? stopRadioMode : startRadioMode}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all font-black text-[10px] uppercase tracking-widest shadow-lg ${isRadioMode ? 'bg-red-600 text-white border-red-400 animate-pulse' : 'bg-zinc-900 text-white border-zinc-700 hover:scale-110 hover:shadow-zinc-200'}`}
                >
                  <Radio className="w-4 h-4" />
                  {isRadioMode ? `${tr("RADIO")} ${radioIndex + 1}/3` : tr('ÉCOUTER LE JOURNAL (RADIO)')}
                </button>
              </div>
            )}
        </div>
      </header>

      {/* NAVIGATION SCROLLABLE MOBILE CORRIGÉE */}
      <div className="sticky top-0 bg-[#FDFCF8]/95 backdrop-blur z-50 border-b border-zinc-900 nav-container">
        <nav className="no-scrollbar py-4 px-6 overflow-x-auto flex items-center justify-start md:justify-center gap-8 scroll-smooth">
          {Object.values(Category).map(cat => (
            <button 
              key={cat} 
              data-tab={cat}
              onClick={(e) => {
                setShowIslamCourse(false);
                if (category !== cat) {
                    setCategory(cat);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                (e.currentTarget as HTMLElement).scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
              }} 
              className={`nav-item whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all ${category === cat && !showIslamCourse ? 'text-black border-b-2 border-black' : 'text-zinc-300 hover:text-zinc-600'}`}
            >
              {tr(cat)}
            </button>
          ))}
          <button 
            onClick={() => {
              setShowIslamCourse(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`nav-item whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${showIslamCourse ? 'text-red-600 border-b-2 border-red-600' : 'text-zinc-300 hover:text-red-400'}`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Apprentissage Islam
          </button>
        </nav>
        {isUpdating && (
          <div className="absolute bottom-0 left-0 w-full">
            <div className="h-0.5 bg-black animate-[shimmer_2s_infinite]" style={{ backgroundSize: '200% 100%' }}></div>
            <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-white/90 px-2 py-0.5 rounded-full border border-zinc-100 shadow-sm">
              <p className="text-[6px] font-black uppercase tracking-widest text-zinc-400 whitespace-nowrap">{loadingMessage}</p>
            </div>
          </div>
        )}
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10 w-full">
        {showIslamCourse ? (
          <IslamCourseView modules={islamModules} onModuleComplete={handleModuleComplete} />
        ) : loading && articles.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-12 lg:col-span-8 space-y-6">
              <div className="aspect-video overflow-hidden rounded-sm relative border border-zinc-200">
                <ArticleIllustration category={category} />
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center">
                  <div className="text-center p-6 bg-white/90 backdrop-blur rounded-3xl shadow-2xl border border-white/20 scale-90 md:scale-100">
                    <div className="w-12 h-12 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin mx-auto mb-4"></div>
                    <h3 className="font-serif text-xl italic font-black mb-1">Rédaction en cours...</h3>
                    <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">L'IA Atmani Bachir analyse le monde</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-12 skeleton w-full rounded-lg"></div>
                <div className="h-4 skeleton w-3/4 rounded-md"></div>
                <div className="h-4 skeleton w-1/2 rounded-md"></div>
              </div>
            </div>
            <div className="md:col-span-6 lg:col-span-4 space-y-6 hidden lg:block">
              <div className="aspect-video skeleton rounded-sm"></div>
              <div className="h-10 skeleton w-full rounded-lg"></div>
              <div className="h-4 skeleton w-3/4 rounded-md"></div>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 max-w-md mx-auto">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-600">
              <AlertCircle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl italic font-black">L'ÉCHO est interrompu (Erreur)</h3>
              <p className="text-zinc-500 text-sm">{error}</p>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <button 
                onClick={() => window.location.reload()} 
                className="bg-black text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Réessayer
              </button>
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <p className="text-zinc-500 font-serif italic text-xl">L'ÉCHO DU MATIN est encore endormi... Réessayez dans un instant.</p>
            <button onClick={() => window.location.reload()} className="bg-black text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest">Réveiller L'ÉCHO DU MATIN</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 animate-in fade-in duration-500">
            {articles.map((art, idx) => (
              <article key={art.id} className={`${idx === 0 ? 'md:col-span-12 lg:col-span-8' : 'md:col-span-6 lg:col-span-4'} border-b border-zinc-100 pb-10 cursor-pointer group relative`} onClick={() => setSelected(art)}>
                <div className="aspect-video overflow-hidden mb-6 rounded-sm relative border border-zinc-200 bg-black">
                  {art.youtubeId ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${art.youtubeId}?rel=0`}
                      title={art.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : art.videoFile ? (
                    <video
                      width="100%"
                      height="100%"
                      controls
                      playsInline
                      preload="none"
                      poster={art.imageUrl}
                      src={art.videoFile}
                      className="w-full h-full object-cover"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <ArticleIllustration category={art.category} />
                  )}
                  
                  {isRadioMode && radioIndex === idx && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="flex gap-1 items-end h-8">
                        <div className="w-1.5 bg-white animate-[music-bar_0.6s_ease-in-out_infinite]"></div>
                        <div className="w-1.5 bg-white animate-[music-bar_0.9s_ease-in-out_infinite]"></div>
                        <div className="w-1.5 bg-white animate-[music-bar_0.7s_ease-in-out_infinite]"></div>
                        <div className="w-1.5 bg-white animate-[music-bar_0.5s_ease-in-out_infinite]"></div>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`text-[7px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-lg ${art.type === 'FACTUAL' ? 'bg-green-600 text-white' : 'bg-amber-500 text-black'}`}>
                      {art.type === 'FACTUAL' ? 'Vérifié' : 'Magazine'}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDownloadAudio(art); }}
                      className="bg-white/90 backdrop-blur p-1 rounded shadow-lg hover:scale-110 transition-all flex items-center justify-center min-w-[24px] min-h-[24px]"
                      title="Télécharger l'audio"
                      disabled={isAudioLoading}
                    >
                      {isAudioLoading && speakingId === art.id ? <RefreshCw className="w-3 h-3 text-zinc-900 animate-spin" /> : <Download className="w-3 h-3 text-zinc-900" />}
                    </button>
                  </div>
                  {idx === 0 && (
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); startRadioMode(); }}
                        className="w-16 h-16 rounded-full bg-zinc-900 text-white border-2 border-zinc-700 flex flex-col items-center justify-center shadow-2xl hover:scale-110 transition-all"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>
                        <span className="text-[7px] font-black uppercase mt-1">RADIO</span>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleSpeak(L(art).content, art.id); }}
                        className={`w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all border-2 ${speakingId === art.id ? 'bg-red-600 text-white border-red-400 animate-pulse' : 'bg-white text-zinc-900 border-zinc-200 hover:scale-110'}`}
                        disabled={isAudioLoading}
                      >
                        <div className="relative">
                          {isAudioLoading && speakingId === art.id ? (
                            <RefreshCw className="w-7 h-7 animate-spin" />
                          ) : (
                            <>
                              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>
                              <svg className="absolute -top-2 -right-2 w-5 h-5 text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
                            </>
                          )}
                        </div>
                        <span className="text-[7px] font-black uppercase mt-1 tracking-tighter">
                          {isAudioLoading && speakingId === art.id ? 'CHARGEMENT' : tr('La Une')}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
                <h2 className={`font-serif font-black italic tracking-tighter transition-colors group-hover:text-zinc-700 ${idx === 0 ? 'text-3xl md:text-6xl mb-4' : 'text-2xl mb-2'}`}>
                  {L(art).title}
                </h2>
                <p className="text-zinc-500 text-sm leading-relaxed italic line-clamp-3">{L(art).summary}</p>
                <button
                  onClick={(e) => handleShareCard(e, art)}
                  className="mt-4 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-black border border-zinc-200 hover:border-black rounded-full px-4 py-2 transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  {tr("Partager")}
                </button>
              </article>
            ))}
            {(category === Category.UNES || category === Category.ANNONCES) && <SponsorBanner />}
          </div>
        )}
      </main>

      <footer className="bg-zinc-900 text-white py-16 px-10 text-center">
        <h2 className="font-serif text-3xl md:text-4xl italic font-black mb-4">L'ÉCHO DU MATIN</h2>
        <p className="text-[10px] tracking-[0.5em] text-zinc-500 uppercase mb-6">Propriété Exclusive : Atmani Bachir</p>
        
        <button 
          onClick={handleResetKey}
          className="text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white border border-zinc-800 px-4 py-2 rounded-full transition-all"
        >
          Supprimer la Clé API / Réinitialiser
        </button>
      </footer>

      {/* MODAL ARTICLE : INSTANTANÉ ET ADAPTÉ MOBILE */}
      {selected && (
        <div className={`fixed inset-0 z-[100] bg-white overflow-y-auto animate-in fade-in slide-in-from-bottom duration-300 ${isReadingMode ? 'bg-zinc-950 text-white' : ''}`}>
          <div className={`sticky top-0 p-4 flex justify-between items-center z-50 border-b ${isReadingMode ? 'bg-zinc-950/90 border-zinc-800' : 'bg-white/95 border-zinc-100'} backdrop-blur`}>
            <div className="flex items-center gap-4">
              <button onClick={() => { setSelected(null); setIsReadingMode(false); }} className={`p-2 rounded-full ${isReadingMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              <span className="font-serif font-black italic text-lg md:text-xl hidden sm:block">{tr("L'ÉCHO DU MATIN")}</span>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
              <button 
                onClick={() => setIsReadingMode(!isReadingMode)} 
                className={`whitespace-nowrap px-4 py-2 rounded-full font-black text-[9px] uppercase tracking-widest transition-all ${isReadingMode ? 'bg-white text-black' : 'bg-zinc-100 text-zinc-600'}`}
              >
                {isReadingMode ? 'Normal' : 'Lecture'}
              </button>
              <button 
                onClick={() => copyToClipboard(`🗞️ L'ÉCHO DU MATIN\n\n${L(selected).title.toUpperCase()}\n\n${L(selected).content}\n\n✨ Par Atmani Bachir`)} 
                className={cn(
                  "whitespace-nowrap px-4 py-2 rounded-full font-black text-[9px] uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all",
                  copied ? "bg-green-600 text-white" : "bg-zinc-900 text-white"
                )}
              >
                {copied ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M18 2h-8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14h-8V4h8v12zM6 4H4v12c0 1.1.9 2 2 2h2v-2H6V4z"/></svg>
                )}
                {copied ? 'COPIÉ !' : 'TIKTOK'}
              </button>
              <button 
                onClick={() => handleShare(selected)} 
                className="whitespace-nowrap bg-zinc-100 text-zinc-900 px-4 py-2 rounded-full font-black text-[9px] uppercase tracking-widest flex items-center gap-2 border border-zinc-200"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path></svg>
                PARTAGER
              </button>
              <button 
                onClick={() => copyToClipboard(`🗞️ L'ÉCHO DU MATIN\n\n${L(selected).title.toUpperCase()}\n\n${L(selected).content}\n\n✨ Par Atmani Bachir`)} 
                className={cn(
                  "whitespace-nowrap px-4 py-2 rounded-full font-black text-[9px] uppercase tracking-widest flex items-center gap-2 border transition-all",
                  copied ? "bg-green-50 border-green-200 text-green-700" : "bg-zinc-100 text-zinc-900 border-zinc-200"
                )}
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z"></path><path d="M5 5a2 2 0 012-2h6a2 2 0 012 2v2H7a4 4 0 00-4 4v6H5V5z"></path></svg>
                {copied ? 'COPIÉ !' : 'COPIER'}
              </button>
              <button 
                onClick={() => {
                  const imageUrl = CATEGORY_IMAGES[selected.category] || CATEGORY_IMAGES[Category.UNES];
                  window.open(imageUrl, '_blank');
                }} 
                className="whitespace-nowrap bg-zinc-100 text-zinc-900 px-4 py-2 rounded-full font-black text-[9px] uppercase tracking-widest flex items-center gap-2 border border-zinc-200"
              >
                <Download className="w-3 h-3" />
                IMAGE
              </button>
            </div>
          </div>
          
          <article className={`max-w-3xl mx-auto py-8 md:py-10 px-4 md:px-6 space-y-10 md:space-y-12 pb-32 ${isReadingMode ? 'text-center' : ''}`}>
            <h2 
              className={`font-serif font-black italic tracking-tighter leading-[0.9] cursor-pointer active:scale-95 transition-transform ${isReadingMode ? 'text-5xl md:text-8xl mb-12' : 'text-4xl md:text-7xl'}`}
              onClick={() => setIsReadingMode(!isReadingMode)}
            >
              {L(selected).title}
            </h2>
            
            {!isReadingMode && (
              <div className="aspect-video rounded-sm overflow-hidden border-2 border-zinc-900 shadow-2xl bg-black">
                {selected.youtubeId ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${selected.youtubeId}?rel=0`}
                    title={selected.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : selected.videoFile ? (
                  <video
                    width="100%"
                    height="100%"
                    controls
                    playsInline
                    poster={selected.imageUrl}
                    src={selected.videoFile}
                    className="w-full h-full object-cover"
                  >
                    Votre navigateur ne supporte pas la vidéo.
                  </video>
                ) : (
                  <ArticleIllustration category={selected.category} />
                )}
              </div>
            )}
            
            <div 
              className={cn(
                "leading-relaxed font-serif italic dropcap whitespace-pre-line cursor-pointer active:opacity-80 transition-opacity markdown-body",
                isReadingMode ? 'text-2xl md:text-4xl text-zinc-300' : 'text-lg md:text-2xl text-zinc-800',
                selected.type !== 'FACTUAL' && !isReadingMode ? 'bg-amber-50/40 p-6 md:p-10 rounded-3xl border border-dashed border-amber-200' : ''
              )}
              onClick={() => setIsReadingMode(!isReadingMode)}
            >
              <ReactMarkdown>{L(selected).content}</ReactMarkdown>
            </div>

            {selected.strategicAdvice && !isReadingMode && (
                <div className="bg-zinc-900 text-white p-8 md:p-10 rounded-[2rem] shadow-xl">
                    <h4 className="text-[8px] md:text-[9px] font-black text-zinc-500 uppercase mb-3 tracking-widest">CONSEIL D'ATMANI BACHIR</h4>
                    <p className="font-bold text-base md:text-lg italic mb-2">"{selected.strategicAdvice.action}"</p>
                    <p className="text-[11px] md:text-xs text-zinc-400 leading-relaxed">{selected.strategicAdvice.details}</p>
                </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <button onClick={() => handleSpeak(L(selected).content, selected.id)} className={`flex-grow p-5 md:p-6 border-2 font-black uppercase tracking-widest flex items-center justify-center gap-4 rounded-full transition-all ${speakingId === selected.id ? 'bg-red-600 text-white border-red-600' : isReadingMode ? 'border-white text-white hover:bg-white hover:text-black' : 'border-black text-black hover:bg-zinc-50'}`}>
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>
                    <span className="text-[10px] md:text-xs">{speakingId === selected.id ? tr('ARRÊTER') : tr('ÉCOUTER')}</span>
                </button>
                <button onClick={() => handleDownloadAudio(selected)} className={`p-5 md:p-6 border-2 font-black uppercase tracking-widest flex items-center justify-center rounded-full transition-all ${isReadingMode ? 'border-white text-white hover:bg-white hover:text-black' : 'border-black text-black hover:bg-zinc-50'}`}>
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
              </div>
              
              {isReadingMode && (
                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.5em] mt-10">Faites défiler pour lire • Maintenez pour copier</p>
              )}
            </div>
          </article>
        </div>
      )}
      {/* RADIO PLAYER FIXE (BAS DE PAGE) */}
      <AnimatePresence>
        {isRadioMode && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-6 left-6 right-6 z-[110] bg-zinc-900 text-white p-4 md:p-6 rounded-[2rem] shadow-2xl border border-zinc-700 flex flex-col md:flex-row items-center gap-4 md:gap-8"
          >
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center animate-pulse">
                <Radio className="w-6 h-6" />
              </div>
              <div className="flex-grow overflow-hidden">
                <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500">RADIO L'ÉCHO</p>
                <h4 className="font-serif italic font-bold text-sm truncate">{articles[radioIndex]?.title || "Chargement..."}</h4>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <button 
                onClick={() => playNextRadioArticle(Math.max(0, radioIndex - 1))}
                className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={stopRadioMode}
                className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-all"
              >
                <Pause className="w-6 h-6" />
              </button>
              <button 
                onClick={() => playNextRadioArticle(radioIndex + 1)}
                className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
              >
                <Play className="w-6 h-6 rotate-0" />
              </button>
            </div>

            <div className="hidden md:flex flex-grow items-center gap-4">
              <div className="flex gap-1 items-end h-4">
                <div className="w-1 bg-red-500 animate-[music-bar_0.6s_infinite]"></div>
                <div className="w-1 bg-red-500 animate-[music-bar_0.9s_infinite]"></div>
                <div className="w-1 bg-red-500 animate-[music-bar_0.7s_infinite]"></div>
                <div className="w-1 bg-red-500 animate-[music-bar_0.5s_infinite]"></div>
              </div>
              <div className="h-1 bg-zinc-800 flex-grow rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-red-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${((radioIndex + 1) / articles.length) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-black text-zinc-500">{radioIndex + 1} / {articles.length}</span>
            </div>

            <button 
              onClick={stopRadioMode}
              className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white"
            >
              Quitter
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {copied && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest"
          >
            <CheckCircle2 className="w-4 h-4" />
            Copié dans le presse-papiers
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;