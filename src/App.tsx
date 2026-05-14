// =====================================================================
//  L'ÉCHO DU MATIN — Journal multilingue (FR / EN / ES / DE / AR)
//  Tout-en-un : types + configuration + service de données + interface
//  100% GRATUIT — aucune clé API, aucun risque de facture
//
//  Sources : Le Monde, France 24, BBC, Al Jazeera, Tagesschau,
//            Deutsche Welle, Euronews  (flux RSS publics gratuits)
//  Images  : Pollinations.ai (gratuit, illimité)
//  Audio   : Web Speech API du navigateur (gratuit)
//  Météo   : open-meteo.com (gratuit, sans clé)
//  Vidéos  : flux RSS public de la chaîne YouTube
// =====================================================================

import { useState, useEffect, useCallback, useRef } from 'react';
// Note : les styles (index.css) sont chargés par main.tsx

// =====================================================================
//  1. TYPES
// =====================================================================
type LangCode = 'fr' | 'en' | 'es' | 'de' | 'ar';
type CategoryId =
  | 'une' | 'geopolitique' | 'europe' | 'futur'
  | 'meteo' | 'archives' | 'partenaires';

interface Article {
  id: string; title: string; summary: string; link: string;
  source: string; date: string; image: string;
}
interface VideoItem {
  id: string; title: string; date: string; thumbnail: string; link: string;
}
interface Partner {
  name: string; description: Record<LangCode, string>; link: string; emoji: string;
}
interface CityWeather {
  city: string; temp: number; tempMax: number; tempMin: number; code: number;
}

// =====================================================================
//  2. CONFIGURATION
// =====================================================================

// --- Chaîne YouTube (section Archives) ---
const YOUTUBE_CHANNEL_ID = 'UCMhZrqyvbruHrPgAcfTH05Q';

// --- Langues ---
const LANGUAGES: { code: LangCode; label: string; flag: string; dir: 'ltr' | 'rtl'; voice: string }[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷', dir: 'ltr', voice: 'fr-FR' },
  { code: 'en', label: 'English',  flag: '🇬🇧', dir: 'ltr', voice: 'en-US' },
  { code: 'es', label: 'Español',  flag: '🇪🇸', dir: 'ltr', voice: 'es-ES' },
  { code: 'de', label: 'Deutsch',  flag: '🇩🇪', dir: 'ltr', voice: 'de-DE' },
  { code: 'ar', label: 'العربية',  flag: '🇸🇦', dir: 'rtl', voice: 'ar-SA' },
];

// --- Catégories (ordre du menu) ---
const CATEGORIES: CategoryId[] = [
  'une', 'geopolitique', 'europe', 'futur', 'meteo', 'archives', 'partenaires',
];

// --- Flux RSS natifs : par langue puis par catégorie ---
type FeedMap = Record<LangCode, Partial<Record<CategoryId, string[]>>>;
const RSS_FEEDS: FeedMap = {
  // ---------- FRANÇAIS ----------
  fr: {
    une:          ['https://www.lemonde.fr/rss/une.xml', 'https://www.france24.com/fr/rss'],
    geopolitique: ['https://www.lemonde.fr/international/rss_full.xml', 'https://www.france24.com/fr/moyen-orient/rss'],
    europe:       ['https://www.lemonde.fr/europe/rss_full.xml', 'https://www.france24.com/fr/europe/rss'],
    futur:        ['https://www.lemonde.fr/pixels/rss_full.xml', 'https://www.lemonde.fr/sciences/rss_full.xml'],
    meteo:        ['https://www.lemonde.fr/planete/rss_full.xml'],
  },
  // ---------- ENGLISH ----------
  en: {
    une:          ['https://feeds.bbci.co.uk/news/rss.xml'],
    geopolitique: ['https://feeds.bbci.co.uk/news/world/rss.xml', 'https://www.aljazeera.com/xml/rss/all.xml'],
    europe:       ['https://feeds.bbci.co.uk/news/world/europe/rss.xml'],
    futur:        ['https://feeds.bbci.co.uk/news/technology/rss.xml'],
    meteo:        ['https://feeds.bbci.co.uk/news/science_and_environment/rss.xml'],
  },
  // ---------- ESPAÑOL ----------
  es: {
    une:          ['https://es.euronews.com/rss', 'https://feeds.bbci.co.uk/mundo/rss.xml'],
    geopolitique: ['https://feeds.bbci.co.uk/mundo/rss.xml', 'https://es.euronews.com/rss'],
    europe:       ['https://es.euronews.com/rss'],
    futur:        ['https://es.euronews.com/rss', 'https://feeds.bbci.co.uk/mundo/rss.xml'],
    meteo:        ['https://es.euronews.com/rss'],
  },
  // ---------- DEUTSCH ----------
  de: {
    une:          ['https://www.tagesschau.de/index~rss2.xml'],
    geopolitique: ['https://www.tagesschau.de/ausland/index~rss2.xml', 'https://rss.dw.com/xml/rss-de-all'],
    europe:       ['https://de.euronews.com/rss', 'https://www.tagesschau.de/ausland/index~rss2.xml'],
    futur:        ['https://rss.dw.com/xml/rss-de-all', 'https://www.tagesschau.de/wissen/index~rss2.xml'],
    meteo:        ['https://www.tagesschau.de/wissen/index~rss2.xml'],
  },
  // ---------- العربية ----------
  ar: {
    une:          ['https://www.france24.com/ar/rss', 'https://feeds.bbci.co.uk/arabic/rss.xml'],
    geopolitique: ['https://feeds.bbci.co.uk/arabic/rss.xml', 'https://www.france24.com/ar/rss'],
    europe:       ['https://arabic.euronews.com/rss'],
    futur:        ['https://www.france24.com/ar/rss', 'https://arabic.euronews.com/rss'],
    meteo:        ['https://feeds.bbci.co.uk/arabic/rss.xml', 'https://arabic.euronews.com/rss'],
  },
};

// --- Villes affichées dans la météo (open-meteo, gratuit) ---
const WEATHER_CITIES = [
  { name: 'Bruxelles', lat: 50.85, lon: 4.35 },
  { name: 'Paris',     lat: 48.85, lon: 2.35 },
  { name: 'Londres',   lat: 51.51, lon: -0.13 },
  { name: 'Madrid',    lat: 40.42, lon: -3.70 },
  { name: 'Berlin',    lat: 52.52, lon: 13.41 },
  { name: 'Alger',     lat: 36.75, lon: 3.06 },
];

// --- Partenaires (section Annonces & Partenaires) ---
const PARTNERS: Partner[] = [
  {
    name: 'Mon Compagnon 2030', emoji: '🕌', link: 'https://systeme.io/',
    description: {
      fr: "Application d'apprentissage des bases de l'Islam pour débutants et convertis.",
      en: 'Learning app for the basics of Islam, for beginners and converts.',
      es: 'Aplicación para aprender las bases del Islam, para principiantes y conversos.',
      de: 'Lern-App für die Grundlagen des Islam, für Anfänger und Konvertiten.',
      ar: 'تطبيق لتعلّم أساسيات الإسلام للمبتدئين والمهتدين الجدد.',
    },
  },
  {
    name: 'Systeme.io', emoji: '🚀', link: 'https://systeme.io/',
    description: {
      fr: 'Plateforme tout-en-un pour créer et vendre des produits en ligne.',
      en: 'All-in-one platform to build and sell products online.',
      es: 'Plataforma todo en uno para crear y vender productos en línea.',
      de: 'All-in-one-Plattform zum Erstellen und Verkaufen von Online-Produkten.',
      ar: 'منصة متكاملة لإنشاء وبيع المنتجات عبر الإنترنت.',
    },
  },
  {
    name: 'Impact.com', emoji: '🤝', link: 'https://impact.com/',
    description: {
      fr: "Réseau de programmes d'affiliation pour partenaires et créateurs.",
      en: 'Affiliate marketing network for partners and creators.',
      es: 'Red de marketing de afiliados para socios y creadores.',
      de: 'Affiliate-Marketing-Netzwerk für Partner und Creator.',
      ar: 'شبكة تسويق بالعمولة للشركاء وصنّاع المحتوى.',
    },
  },
];

// --- Traductions de l'interface (i18n) ---
type UIStrings = {
  siteTitle: string; tagline: string; categories: Record<CategoryId, string>;
  listenJournal: string; listenArticle: string; stopAudio: string;
  readArticle: string; share: string; copyArticle: string; copied: string;
  loading: string; errorLoading: string; retry: string; noArticles: string;
  source: string; partnersIntro: string; visitPartner: string;
  archivesIntro: string; watchVideo: string; weatherIntro: string;
  weatherToday: string; footer: string;
};
const I18N: Record<LangCode, UIStrings> = {
  fr: {
    siteTitle: "L'Écho du Matin",
    tagline: "Le journal — l'actualité du monde, chaque matin",
    categories: {
      une: 'À la une', geopolitique: 'Géopolitique', europe: 'Belgique & Europe',
      futur: 'IA & Futur', meteo: 'Météo & Climat', archives: 'Archives vidéo',
      partenaires: 'Annonces & Partenaires',
    },
    listenJournal: '▶ Écouter le journal', listenArticle: '🔊 Écouter',
    stopAudio: '⏹ Arrêter', readArticle: "Lire l'article complet",
    share: 'Partager', copyArticle: "Copier l'article", copied: 'Copié ✓',
    loading: 'Chargement des actualités…',
    errorLoading: 'Impossible de charger les actualités pour le moment.',
    retry: 'Réessayer', noArticles: 'Aucun article disponible.', source: 'Source',
    partnersIntro: 'Nos partenaires et annonces du jour.', visitPartner: 'Découvrir',
    archivesIntro: "Toutes les éditions vidéo de L'Écho du Matin.", watchVideo: 'Regarder',
    weatherIntro: 'La météo du jour dans les grandes villes.', weatherToday: "Aujourd'hui",
    footer: "L'Écho du Matin — Journal d'information international. Sources vérifiées.",
  },
  en: {
    siteTitle: 'The Morning Echo',
    tagline: 'The newspaper — world news, every morning',
    categories: {
      une: 'Headlines', geopolitique: 'Geopolitics', europe: 'Belgium & Europe',
      futur: 'AI & Future', meteo: 'Weather & Climate', archives: 'Video Archive',
      partenaires: 'Announcements & Partners',
    },
    listenJournal: '▶ Listen to the news', listenArticle: '🔊 Listen',
    stopAudio: '⏹ Stop', readArticle: 'Read the full article',
    share: 'Share', copyArticle: 'Copy article', copied: 'Copied ✓',
    loading: 'Loading the news…',
    errorLoading: 'Unable to load the news right now.',
    retry: 'Try again', noArticles: 'No articles available.', source: 'Source',
    partnersIntro: "Our partners and today's announcements.", visitPartner: 'Discover',
    archivesIntro: 'All video editions of The Morning Echo.', watchVideo: 'Watch',
    weatherIntro: "Today's weather in major cities.", weatherToday: 'Today',
    footer: 'The Morning Echo — International news journal. Verified sources.',
  },
  es: {
    siteTitle: 'El Eco de la Mañana',
    tagline: 'El periódico — noticias del mundo, cada mañana',
    categories: {
      une: 'Titulares', geopolitique: 'Geopolítica', europe: 'Bélgica y Europa',
      futur: 'IA y Futuro', meteo: 'Clima y Tiempo', archives: 'Archivo de vídeos',
      partenaires: 'Anuncios y Socios',
    },
    listenJournal: '▶ Escuchar las noticias', listenArticle: '🔊 Escuchar',
    stopAudio: '⏹ Detener', readArticle: 'Leer el artículo completo',
    share: 'Compartir', copyArticle: 'Copiar artículo', copied: 'Copiado ✓',
    loading: 'Cargando las noticias…',
    errorLoading: 'No se pueden cargar las noticias en este momento.',
    retry: 'Reintentar', noArticles: 'No hay artículos disponibles.', source: 'Fuente',
    partnersIntro: 'Nuestros socios y los anuncios de hoy.', visitPartner: 'Descubrir',
    archivesIntro: 'Todas las ediciones en vídeo de El Eco de la Mañana.', watchVideo: 'Ver',
    weatherIntro: 'El tiempo de hoy en las grandes ciudades.', weatherToday: 'Hoy',
    footer: 'El Eco de la Mañana — Periódico de información internacional. Fuentes verificadas.',
  },
  de: {
    siteTitle: 'Das Morgen-Echo',
    tagline: 'Die Zeitung — Weltnachrichten, jeden Morgen',
    categories: {
      une: 'Schlagzeilen', geopolitique: 'Geopolitik', europe: 'Belgien & Europa',
      futur: 'KI & Zukunft', meteo: 'Wetter & Klima', archives: 'Video-Archiv',
      partenaires: 'Anzeigen & Partner',
    },
    listenJournal: '▶ Nachrichten anhören', listenArticle: '🔊 Anhören',
    stopAudio: '⏹ Stopp', readArticle: 'Den ganzen Artikel lesen',
    share: 'Teilen', copyArticle: 'Artikel kopieren', copied: 'Kopiert ✓',
    loading: 'Nachrichten werden geladen…',
    errorLoading: 'Nachrichten können derzeit nicht geladen werden.',
    retry: 'Erneut versuchen', noArticles: 'Keine Artikel verfügbar.', source: 'Quelle',
    partnersIntro: 'Unsere Partner und die heutigen Anzeigen.', visitPartner: 'Entdecken',
    archivesIntro: 'Alle Video-Ausgaben von Das Morgen-Echo.', watchVideo: 'Ansehen',
    weatherIntro: 'Das heutige Wetter in den großen Städten.', weatherToday: 'Heute',
    footer: 'Das Morgen-Echo — Internationale Nachrichtenzeitung. Geprüfte Quellen.',
  },
  ar: {
    siteTitle: 'صدى الصباح',
    tagline: 'الجريدة — أخبار العالم، كل صباح',
    categories: {
      une: 'العناوين الرئيسية', geopolitique: 'الجغرافيا السياسية', europe: 'بلجيكا وأوروبا',
      futur: 'الذكاء الاصطناعي والمستقبل', meteo: 'الطقس والمناخ', archives: 'أرشيف الفيديو',
      partenaires: 'إعلانات وشركاء',
    },
    listenJournal: '▶ استمع إلى الجريدة', listenArticle: '🔊 استمع',
    stopAudio: '⏹ إيقاف', readArticle: 'اقرأ المقال كاملاً',
    share: 'مشاركة', copyArticle: 'نسخ المقال', copied: 'تم النسخ ✓',
    loading: 'جارٍ تحميل الأخبار…',
    errorLoading: 'تعذّر تحميل الأخبار في الوقت الحالي.',
    retry: 'إعادة المحاولة', noArticles: 'لا توجد مقالات متاحة.', source: 'المصدر',
    partnersIntro: 'شركاؤنا وإعلانات اليوم.', visitPartner: 'اكتشف',
    archivesIntro: 'جميع إصدارات الفيديو لصدى الصباح.', watchVideo: 'مشاهدة',
    weatherIntro: 'طقس اليوم في المدن الكبرى.', weatherToday: 'اليوم',
    footer: 'صدى الصباح — جريدة إخبارية دولية. مصادر موثوقة.',
  },
};

// =====================================================================
//  3. SERVICE DE DONNÉES
// =====================================================================

// --- Proxies CORS gratuits (essayés dans l'ordre) ---
const CORS_PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
  (url: string) => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(url)}`,
];

async function fetchWithProxy(url: string): Promise<string> {
  for (const proxy of CORS_PROXIES) {
    try {
      const res = await fetch(proxy(url), { signal: AbortSignal.timeout(12000) });
      if (!res.ok) continue;
      const text = await res.text();
      if (text && text.length > 100) return text;
    } catch {
      /* proxy suivant */
    }
  }
  throw new Error('Proxies en échec : ' + url);
}

// --- Image libre de droits via Pollinations.ai ---
function imageFor(title: string, seed: number): string {
  const prompt = encodeURIComponent(
    'editorial press photo, newspaper illustration, ' + title.slice(0, 120)
  );
  return `https://image.pollinations.ai/prompt/${prompt}?width=640&height=400&seed=${seed}&nologo=true`;
}

// --- Nettoyage du HTML d'une description RSS ---
function cleanText(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || '').trim().replace(/\s+/g, ' ');
}

// --- Nom de source lisible depuis l'URL du flux ---
function sourceName(feedUrl: string): string {
  if (feedUrl.includes('lemonde')) return 'Le Monde';
  if (feedUrl.includes('bbc')) return 'BBC';
  if (feedUrl.includes('france24')) return 'France 24';
  if (feedUrl.includes('euronews')) return 'Euronews';
  if (feedUrl.includes('tagesschau')) return 'Tagesschau';
  if (feedUrl.includes('dw.com')) return 'Deutsche Welle';
  if (feedUrl.includes('aljazeera')) return 'Al Jazeera';
  return 'Presse';
}

// --- Parse un flux RSS/Atom (XML) en liste d'articles ---
function parseFeed(xml: string, src: string): Article[] {
  const doc = new DOMParser().parseFromString(xml, 'text/xml');
  const items = Array.from(doc.querySelectorAll('item, entry'));
  const articles: Article[] = [];
  items.forEach((item, i) => {
    const get = (tag: string) => item.querySelector(tag)?.textContent?.trim() || '';
    const title = get('title');
    if (!title) return;
    let link = get('link');
    if (!link) link = item.querySelector('link')?.getAttribute('href') || '';
    const rawSummary = get('description') || get('summary') || get('content');
    const summary = cleanText(rawSummary).slice(0, 260);
    const date = get('pubDate') || get('published') || get('updated') || new Date().toISOString();
    articles.push({
      id: `${src}-${i}-${Date.now()}`,
      title: cleanText(title),
      summary: summary || '…',
      link, source: src, date,
      image: imageFor(title, i + title.length),
    });
  });
  return articles;
}

// --- Cache localStorage léger (30 minutes) ---
const CACHE_MINUTES = 30;
function cacheGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { time, data } = JSON.parse(raw);
    if (Date.now() - time > CACHE_MINUTES * 60 * 1000) return null;
    return data as T;
  } catch { return null; }
}
function cacheSet(key: string, data: unknown): void {
  try { localStorage.setItem(key, JSON.stringify({ time: Date.now(), data })); }
  catch { /* localStorage indisponible : on ignore */ }
}

// --- Récupère les articles pour une langue + une catégorie ---
async function getArticles(lang: LangCode, category: CategoryId): Promise<Article[]> {
  const cacheKey = `echo-${lang}-${category}`;
  const cached = cacheGet<Article[]>(cacheKey);
  if (cached && cached.length) return cached;

  const feeds = RSS_FEEDS[lang]?.[category] || [];
  if (!feeds.length) return [];

  const results = await Promise.allSettled(
    feeds.map(async (feedUrl) => parseFeed(await fetchWithProxy(feedUrl), sourceName(feedUrl)))
  );

  let articles: Article[] = [];
  results.forEach((r) => { if (r.status === 'fulfilled') articles = articles.concat(r.value); });

  // Déduplication par titre
  const seen = new Set<string>();
  articles = articles.filter((a) => {
    const key = a.title.toLowerCase().slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  articles = articles.slice(0, 6);

  if (articles.length) cacheSet(cacheKey, articles);
  return articles;
}

// --- Vidéos YouTube (section Archives) — flux RSS public, sans clé ---
async function getVideos(): Promise<VideoItem[]> {
  const cacheKey = 'echo-videos';
  const cached = cacheGet<VideoItem[]>(cacheKey);
  if (cached && cached.length) return cached;

  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
  try {
    const xml = await fetchWithProxy(feedUrl);
    const doc = new DOMParser().parseFromString(xml, 'text/xml');
    const entries = Array.from(doc.querySelectorAll('entry'));
    const videos: VideoItem[] = entries.map((entry) => {
      const videoId =
        entry.getElementsByTagName('yt:videoId')[0]?.textContent ||
        entry.querySelector('videoId')?.textContent || '';
      const title = entry.querySelector('title')?.textContent || 'Vidéo';
      const date = entry.querySelector('published')?.textContent || new Date().toISOString();
      return {
        id: videoId, title, date,
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        link: `https://www.youtube.com/watch?v=${videoId}`,
      };
    });
    if (videos.length) cacheSet(cacheKey, videos);
    return videos;
  } catch { return []; }
}

// --- Météo (open-meteo.com — gratuit, sans clé) ---
async function getWeather(): Promise<CityWeather[]> {
  const cacheKey = 'echo-weather';
  const cached = cacheGet<CityWeather[]>(cacheKey);
  if (cached && cached.length) return cached;

  const results = await Promise.allSettled(
    WEATHER_CITIES.map(async (city) => {
      const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}` +
        `&longitude=${city.lon}&current=temperature_2m,weather_code` +
        `&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
      const data = await res.json();
      return {
        city: city.name,
        temp: Math.round(data.current.temperature_2m),
        tempMax: Math.round(data.daily.temperature_2m_max[0]),
        tempMin: Math.round(data.daily.temperature_2m_min[0]),
        code: data.current.weather_code,
      } as CityWeather;
    })
  );
  const weather: CityWeather[] = [];
  results.forEach((r) => { if (r.status === 'fulfilled') weather.push(r.value); });
  if (weather.length) cacheSet(cacheKey, weather);
  return weather;
}

// --- Emoji météo selon le code open-meteo ---
function weatherEmoji(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 2) return '🌤️';
  if (code === 3) return '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  if (code <= 86) return '🌨️';
  return '⛈️';
}

// =====================================================================
//  4. APPLICATION (interface React)
// =====================================================================
export default function App() {
  const [lang, setLang] = useState<LangCode>('fr');
  const [category, setCategory] = useState<CategoryId>('une');
  const [articles, setArticles] = useState<Article[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [weather, setWeather] = useState<CityWeather[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const t = I18N[lang];
  const langInfo = LANGUAGES.find((l) => l.code === lang)!;
  const isRTL = langInfo.dir === 'rtl';
  const reloadRef = useRef(0);

  // Direction du document (RTL pour l'arabe)
  useEffect(() => {
    document.documentElement.dir = langInfo.dir;
    document.documentElement.lang = lang;
    document.title = t.siteTitle;
  }, [lang, langInfo.dir, t.siteTitle]);

  // Charger les ARTICLES
  const loadArticles = useCallback(async () => {
    if (category === 'archives' || category === 'partenaires') return;
    setLoading(true); setError(false); setArticles([]);
    const myReload = ++reloadRef.current;
    try {
      const data = await getArticles(lang, category);
      if (myReload !== reloadRef.current) return;
      setArticles(data);
      setError(data.length === 0);
    } catch {
      if (myReload === reloadRef.current) setError(true);
    } finally {
      if (myReload === reloadRef.current) setLoading(false);
    }
  }, [lang, category]);

  useEffect(() => { loadArticles(); }, [loadArticles]);

  // Charger les VIDÉOS (Archives)
  useEffect(() => {
    if (category !== 'archives') return;
    setLoading(true);
    getVideos()
      .then((v) => { setVideos(v); setError(v.length === 0); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [category]);

  // Charger la MÉTÉO
  useEffect(() => {
    if (category !== 'meteo') return;
    getWeather().then(setWeather).catch(() => setWeather([]));
  }, [category]);

  // AUDIO — Web Speech API
  const stopAudio = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeakingId(null);
  }, []);

  const speak = useCallback((id: string, text: string) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langInfo.voice;
    utter.rate = 0.95;
    utter.onend = () => setSpeakingId(null);
    utter.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utter);
  }, [langInfo.voice]);

  const listenArticle = (a: Article) => {
    if (speakingId === a.id) stopAudio();
    else speak(a.id, `${a.title}. ${a.summary}`);
  };

  const listenJournal = () => {
    if (speakingId === 'journal') { stopAudio(); return; }
    const intro = `${t.siteTitle}. ${t.categories[category]}.`;
    const body = articles.map((a) => `${a.title}. ${a.summary}`).join(' ... ');
    speak('journal', `${intro} ${body}`);
  };

  useEffect(() => { stopAudio(); }, [lang, category, stopAudio]);

  // PARTAGE
  const shareArticle = async (a: Article) => {
    if (navigator.share) {
      try { await navigator.share({ title: a.title, text: a.title, url: a.link }); }
      catch { /* annulé */ }
    } else {
      navigator.clipboard?.writeText(a.link);
      setCopiedId(a.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };
  const copyArticle = (a: Article) => {
    const text = `${a.title}\n\n${a.summary}\n\n${t.source}: ${a.source}\n${a.link}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(a.id + '-copy');
    setTimeout(() => setCopiedId(null), 2000);
  };
  const shareFacebook = (a: Article) => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(a.link)}`,
      '_blank', 'noopener,noreferrer'
    );
  };

  // Dates
  const today = new Date().toLocaleDateString(lang, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(lang, {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
      });
    } catch { return ''; }
  };

  const isNewsCategory = !['archives', 'partenaires'].includes(category);

  // -------------------------------------------------------------------
  //  RENDU
  // -------------------------------------------------------------------
  return (
    <div className={`echo ${isRTL ? 'rtl' : ''}`}>
      {/* EN-TÊTE */}
      <header className="echo-header">
        <div className="echo-header-top">
          <span className="echo-date">{today}</span>
          <select
            className="echo-lang"
            value={lang}
            onChange={(e) => setLang(e.target.value as LangCode)}
            aria-label="Langue / Language"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
            ))}
          </select>
        </div>
        <h1 className="echo-title">{t.siteTitle}</h1>
        <p className="echo-tagline">{t.tagline}</p>
      </header>

      {/* NAVIGATION */}
      <nav className="echo-nav" aria-label="Catégories">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`echo-nav-btn ${category === c ? 'active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {t.categories[c]}
          </button>
        ))}
      </nav>

      <main className="echo-main">
        {/* BOUTON ÉCOUTER LE JOURNAL */}
        {isNewsCategory && articles.length > 0 && (
          <div className="echo-listen-bar">
            <button
              className={`echo-listen-journal ${speakingId === 'journal' ? 'playing' : ''}`}
              onClick={listenJournal}
            >
              {speakingId === 'journal' ? t.stopAudio : t.listenJournal}
            </button>
          </div>
        )}

        {/* TITRE DE SECTION */}
        <h2 className="echo-section-title">{t.categories[category]}</h2>

        {/* CHARGEMENT */}
        {loading && <p className="echo-info">{t.loading}</p>}

        {/* ERREUR */}
        {error && !loading && (
          <div className="echo-info">
            <p>{t.errorLoading}</p>
            <button className="echo-retry" onClick={loadArticles}>{t.retry}</button>
          </div>
        )}

        {/* CATÉGORIES NEWS : grille d'articles */}
        {isNewsCategory && !loading && !error && (
          <div className="echo-grid">
            {articles.map((a) => (
              <article key={a.id} className="echo-card">
                <a href={a.link} target="_blank" rel="noopener noreferrer">
                  <img
                    className="echo-card-img" src={a.image} alt="" loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </a>
                <div className="echo-card-body">
                  <div className="echo-card-meta">
                    <span className="echo-card-source">{a.source}</span>
                    <span className="echo-card-date">{formatDate(a.date)}</span>
                  </div>
                  <h3 className="echo-card-title">{a.title}</h3>
                  <p className="echo-card-summary">{a.summary}</p>
                  <div className="echo-card-actions">
                    <button
                      className={`echo-btn echo-btn-listen ${speakingId === a.id ? 'playing' : ''}`}
                      onClick={() => listenArticle(a)}
                    >
                      {speakingId === a.id ? t.stopAudio : t.listenArticle}
                    </button>
                    <a className="echo-btn echo-btn-read" href={a.link}
                       target="_blank" rel="noopener noreferrer">
                      {t.readArticle}
                    </a>
                  </div>
                  <div className="echo-card-share">
                    <button className="echo-share-btn" onClick={() => shareArticle(a)}>
                      ↗ {t.share}
                    </button>
                    <button className="echo-share-btn fb" onClick={() => shareFacebook(a)}>
                      f Facebook
                    </button>
                    <button className="echo-share-btn" onClick={() => copyArticle(a)}>
                      {copiedId === a.id + '-copy' ? t.copied : '⧉ ' + t.copyArticle}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* MÉTÉO */}
        {category === 'meteo' && (
          <div className="echo-weather-block">
            <p className="echo-info-text">{t.weatherIntro}</p>
            <div className="echo-weather-grid">
              {weather.map((w) => (
                <div key={w.city} className="echo-weather-card">
                  <span className="echo-weather-emoji">{weatherEmoji(w.code)}</span>
                  <span className="echo-weather-city">{w.city}</span>
                  <span className="echo-weather-temp">{w.temp}°</span>
                  <span className="echo-weather-minmax">{w.tempMax}° / {w.tempMin}°</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ARCHIVES VIDÉO */}
        {category === 'archives' && !loading && (
          <div>
            <p className="echo-info-text">{t.archivesIntro}</p>
            {error && <p className="echo-info">{t.noArticles}</p>}
            <div className="echo-grid">
              {videos.map((v) => (
                <article key={v.id} className="echo-card">
                  <a href={v.link} target="_blank" rel="noopener noreferrer">
                    <img className="echo-card-img" src={v.thumbnail} alt="" loading="lazy" />
                  </a>
                  <div className="echo-card-body">
                    <div className="echo-card-meta">
                      <span className="echo-card-source">YouTube</span>
                      <span className="echo-card-date">{formatDate(v.date)}</span>
                    </div>
                    <h3 className="echo-card-title">{v.title}</h3>
                    <div className="echo-card-actions">
                      <a className="echo-btn echo-btn-read" href={v.link}
                         target="_blank" rel="noopener noreferrer">
                        ▶ {t.watchVideo}
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* PARTENAIRES */}
        {category === 'partenaires' && (
          <div>
            <p className="echo-info-text">{t.partnersIntro}</p>
            <div className="echo-grid">
              {PARTNERS.map((p) => (
                <article key={p.name} className="echo-card echo-partner-card">
                  <div className="echo-partner-emoji">{p.emoji}</div>
                  <div className="echo-card-body">
                    <h3 className="echo-card-title">{p.name}</h3>
                    <p className="echo-card-summary">{p.description[lang]}</p>
                    <div className="echo-card-actions">
                      <a className="echo-btn echo-btn-read" href={p.link}
                         target="_blank" rel="noopener noreferrer">
                        {t.visitPartner} ↗
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* PIED DE PAGE */}
      <footer className="echo-footer">
        <p className="echo-footer-title">{t.siteTitle}</p>
        <p>{t.footer}</p>
        <p className="echo-footer-year">© {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
