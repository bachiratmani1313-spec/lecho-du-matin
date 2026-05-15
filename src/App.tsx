import React, { useState, useEffect } from 'react';
import './index.css';

type LangCode = 'fr' | 'en' | 'es' | 'de' | 'ar';
type CategoryId = 'une' | 'geopolitique' | 'europe' | 'futur' | 'meteo' | 'archives' | 'partenaires';

interface Article {
  id: string;
  category: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  videoUrl?: string;
  link?: string;
}

// 📺 Configuration YouTube
const YOUTUBE_CHANNEL_ID = 'UCMhZrqyvbruHrPgAcfTH05Q';

const CATEGORIES = [
  { id: 'une', label: 'À LA UNE' },
  { id: 'geopolitique', label: 'GÉOPOLITIQUE' },
  { id: 'europe', label: 'BELGIQUE & EUROPE' },
  { id: 'futur', label: 'IA & FUTUR' },
  { id: 'meteo', label: 'MÉTÉO & CLIMAT' },
  { id: 'archives', label: 'ARCHIVES VIDÉO' },
  { id: 'partenaires', label: 'ANNONCES & PARTENAIRES' }
];

const LANGUAGES = [
  { code: 'fr' as LangCode, label: 'Français', flag: '🇫🇷' },
  { code: 'en' as LangCode, label: 'English', flag: '🇬🇧' },
  { code: 'es' as LangCode, label: 'Español', flag: '🇪🇸' },
  { code: 'de' as LangCode, label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar' as LangCode, label: 'العربية', flag: '🇸🇦' }
];

// 📰 Flux RSS par catégorie
const RSS_FEEDS: Record<string, string[]> = {
  'une': ['https://www.france24.com/fr/rss', 'https://feeds.bbci.co.uk/news/world/rss.xml'],
  'geopolitique': ['https://feeds.bbci.co.uk/news/world/rss.xml', 'https://feeds.reuters.com/Reuters/worldNews'],
  'europe': ['https://www.rtbf.be/info/rss', 'https://www.lalibre.be/arc/outboundfeeds/rss/?outputType=xml'],
  'futur': ['https://feeds.bbci.co.uk/news/technology/rss.xml', 'https://www.lemonde.fr/pixels/rss_full.xml'],
  'meteo': ['https://feeds.bbci.co.uk/news/science_and_environment/rss.xml'],
  'archives': [],
  'partenaires': []
};

// 🎬 Vidéos YouTube générées automatiquement
const generateYouTubeVideoUrl = (videoId: string) => {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&fs=1`;
};

// Vidéos exemple (dans la vraie version, ce sont des vidéos auto-générées)
const YOUTUBE_VIDEOS: Record<string, string[]> = {
  'une': ['dQw4w9WgXcQ', 'jNQXAC9IVRw'],
  'geopolitique': ['9bZkp7q19f0', 'oHg5SJYRHA0'],
  'europe': ['oHg5SJYRHA0', '9bZkp7q19f0'],
  'futur': ['dQw4w9WgXcQ', 'jNQXAC9IVRw'],
  'meteo': ['jNQXAC9IVRw', 'dQw4w9WgXcQ'],
  'archives': ['dQw4w9WgXcQ'],
  'partenaires': []
};

const App: React.FC = () => {
  const [category, setCategory] = useState<CategoryId>('une');
  const [lang, setLang] = useState<LangCode>('fr');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Article | null>(null);
  const [radioMode, setRadioMode] = useState(false);

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).toUpperCase();

  // 📥 Récupérer les articles RSS
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const feeds = RSS_FEEDS[category as keyof typeof RSS_FEEDS] || RSS_FEEDS['une'];
        const articles: Article[] = [];
        const categoryLabel = CATEGORIES.find(c => c.id === category)?.label || 'À LA UNE';

        for (let i = 0; i < feeds.length && articles.length < 2; i++) {
          try {
            const response = await fetch(
              `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feeds[i])}`
            );
            const data = await response.json();

            if (data.status === 'ok' && data.items) {
              const videoUrls = YOUTUBE_VIDEOS[category as keyof typeof YOUTUBE_VIDEOS] || [];
              
              data.items.slice(0, 2).forEach((item: any, idx: number) => {
                if (articles.length < 2) {
                  const videoUrl = videoUrls[articles.length] ? 
                    generateYouTubeVideoUrl(videoUrls[articles.length]) : 
                    null;

                  articles.push({
                    id: `${category}-${articles.length}`,
                    category: categoryLabel,
                    title: item.title || 'Sans titre',
                    summary: (item.description || '')
                      .replace(/<[^>]*>/g, '')
                      .substring(0, 200),
                    content: (item.description || '')
                      .replace(/<[^>]*>/g, '')
                      .substring(0, 800),
                    image: item.thumbnail || 
                      `https://image.pollinations.ai/prompt/${encodeURIComponent(item.title || 'news')}?width=800&height=450&nologo=true`,
                    videoUrl: videoUrl || undefined,
                    link: item.link
                  });
                }
              });
            }
          } catch (e) {
            console.error('Erreur RSS:', e);
          }
        }

        setArticles(articles.length > 0 ? articles : [
          {
            id: '0',
            category: categoryLabel,
            title: 'Aucun article disponible',
            summary: 'Les flux RSS sont momentanément indisponibles',
            content: 'Veuillez réessayer plus tard',
            image: `https://image.pollinations.ai/prompt/journal%20actualit%C3%A9s?width=800&height=450&nologo=true`
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [category]);

  const handleSpeak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap: Record<LangCode, string> = {
      fr: 'fr-FR',
      en: 'en-US',
      es: 'es-ES',
      de: 'de-DE',
      ar: 'ar-SA'
    };
    utterance.lang = langMap[lang] || 'fr-FR';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-black" style={{ fontFamily: "'Playfair Display', serif" }}>
      {/* Header */}
      <header className="border-b-4 border-black mx-4 md:mx-10 mt-4 pb-6 text-center">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-4">
          <span className="text-zinc-400">{today}</span>
          <div className="flex gap-2">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-3 py-1 rounded transition-all ${
                  lang === l.code
                    ? 'bg-black text-white'
                    : 'bg-zinc-100 hover:bg-zinc-200'
                }`}
              >
                {l.flag}
              </button>
            ))}
          </div>
        </div>

        <h1 className="text-6xl font-black italic mb-3" style={{ letterSpacing: '-0.02em' }}>
          L'Écho du Matin
        </h1>
        <p className="text-sm font-black uppercase tracking-[0.3em] text-zinc-600 mb-8">
          Informer le monde — analyses & décryptages, chaque matin
        </p>

        {/* Boutons d'action */}
        <div className="flex flex-col gap-4 items-center mb-8">
          <button
            onClick={() => {
              const text = articles[0]?.title || 'L\'Écho du Matin';
              const url = window.location.href;
              if (navigator.share) {
                navigator.share({ title: 'L\'Écho du Matin', text, url });
              } else {
                navigator.clipboard.writeText(url);
              }
            }}
            className="px-8 py-3 bg-black text-white font-black text-[11px] uppercase rounded-full hover:bg-zinc-800 transition-all"
          >
            📤 PARTAGER LE JOURNAL
          </button>

          <button
            onClick={() => {
              if (radioMode) {
                window.speechSynthesis.cancel();
                setRadioMode(false);
              } else {
                setRadioMode(true);
                const text = articles
                  .slice(0, 3)
                  .map(a => `${a.title}. ${a.summary}`)
                  .join(' ');
                handleSpeak(text);
              }
            }}
            className={`px-8 py-3 font-black text-[11px] uppercase rounded-full transition-all ${
              radioMode
                ? 'bg-red-600 text-white'
                : 'bg-black text-white hover:bg-zinc-800'
            }`}
          >
            {radioMode ? '⏹ ARRÊTER' : '🎙️ ÉCOUTER LE JOURNAL (RADIO)'}
          </button>
        </div>

        {/* Navigation catégories */}
        <nav className="flex flex-wrap justify-center gap-4 border-t-2 border-black pt-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id as CategoryId)}
              className={`text-[10px] font-black uppercase tracking-wider transition-all pb-2 ${
                category === cat.id
                  ? 'text-black border-b-2 border-black'
                  : 'text-zinc-400 hover:text-black'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Articles avec vidéos */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        {loading ? (
          <div className="text-center py-20 text-zinc-400">Chargement...</div>
        ) : (
          <div className="space-y-16">
            {articles.map((article, idx) => (
              <article
                key={article.id}
                className="cursor-pointer group border-b-2 border-zinc-200 pb-12"
                onClick={() => setSelected(article)}
              >
                {/* Vidéo YouTube si disponible */}
                {article.videoUrl && (
                  <div className="mb-8 aspect-video rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      width="100%"
                      height="100%"
                      src={article.videoUrl}
                      title={article.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                )}

                {/* Image si pas de vidéo */}
                {!article.videoUrl && (
                  <div className="mb-8 aspect-video rounded-lg overflow-hidden bg-zinc-100 shadow-lg">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Titre et résumé */}
                <div className="space-y-3">
                  <h2 className="text-3xl md:text-4xl font-black italic leading-tight group-hover:text-zinc-600 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-zinc-600 text-base leading-relaxed italic">
                    {article.summary}
                  </p>
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(article.content);
                      }}
                      className="px-6 py-2 bg-black text-white text-[9px] font-black uppercase rounded-full hover:bg-zinc-800 transition-all"
                    >
                      🔊 ÉCOUTER L'ARTICLE
                    </button>
                    {article.link && (
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-6 py-2 border-2 border-black text-[9px] font-black uppercase rounded-full hover:bg-black hover:text-white transition-all"
                      >
                        📖 LIRE LA SUITE
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Modal article complet */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-h-[90vh] overflow-y-auto w-full max-w-2xl">
            <div className="sticky top-0 bg-white border-b-2 border-black p-4 flex justify-between items-center">
              <h2 className="text-lg font-black italic">L'Écho du Matin</h2>
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 bg-black text-white text-[10px] font-black rounded hover:bg-zinc-800"
              >
                FERMER
              </button>
            </div>

            <div className="p-6 space-y-6">
              {selected.videoUrl && (
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={selected.videoUrl}
                    title={selected.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              )}

              {!selected.videoUrl && (
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="w-full rounded-lg"
                />
              )}

              <h1 className="text-4xl font-black italic leading-tight">
                {selected.title}
              </h1>

              <p className="text-zinc-700 text-lg leading-relaxed whitespace-pre-line">
                {selected.content}
              </p>

              <button
                onClick={() => {
                  handleSpeak(selected.content);
                }}
                className="w-full px-6 py-4 bg-black text-white font-black text-[11px] uppercase rounded-lg hover:bg-zinc-800 transition-all"
              >
                🎙️ ÉCOUTER CECI ARTICLE EN ENTIER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
