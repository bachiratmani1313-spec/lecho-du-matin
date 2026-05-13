import { NewsArticle, Category, Language } from '../types';

const RSS_FEEDS: Record<string, string[]> = {
  'À la une': [
    'https://www.france24.com/fr/rss',
    'https://feeds.bbci.co.uk/news/world/rss.xml'
  ],
  'Géopolitique & Conflits': [
    'https://feeds.reuters.com/Reuters/worldNews',
    'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml'
  ],
  'Finance & Crypto': [
    'https://feeds.bbci.co.uk/news/business/rss.xml',
    'https://www.coindesk.com/arc/outboundfeeds/rss/'
  ],
  'Météo & Alertes Sat': [
    'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml'
  ],
  'Belgique & Europe': [
    'https://www.rtbf.be/info/rss',
    'https://www.lalibre.be/arc/outboundfeeds/rss/?outputType=xml'
  ],
  'IA & Futur': [
    'https://feeds.bbci.co.uk/news/technology/rss.xml',
    'https://www.lemonde.fr/pixels/rss_full.xml'
  ],
  'Annonces & Partenaires': []
};

const PARTNER_VIDEOS: NewsArticle[] = [
  {
    id: 'partner-1',
    type: 'FACTUAL',
    title: "Mon Compagnon 2030 — Apprendre l'Islam de Zéro",
    summary: "Application d'apprentissage des bases de l'Islam pour débutants et convertis. 6 modules : Piliers, Shahada, Salat, Woudou, Dhikr, Gestes.",
    content: "Mon Compagnon 2030 est une application mobile éducative qui couvre les 6 piliers fondamentaux de l'apprentissage de l'Islam. Conçue par Atmani Bachir, elle s'adresse aux débutants et aux convertis cherchant une méthode pas à pas, claire et pédagogique. Découvrez l'application et soutenez le projet en visitant la chaîne YouTube partenaire.",
    truthContent: 'Partenaire officiel L\'Écho du Matin',
    physicalFacts: 'Application disponible · 6 modules · Méthode progressive',
    audioAnnounce: "Découvrez Mon Compagnon 2030, l'application pour apprendre l'Islam pas à pas",
    imagePrompt: 'islamic learning mobile app',
    strategicAdvice: { action: 'Découvrir l\'application', details: 'Disponible bientôt en téléchargement' },
    location: 'Atmani Bachir',
    timestamp: new Date().toLocaleDateString('fr-FR'),
    category: 'Annonces & Partenaires' as any,
    icon: '🤝',
    imageUrl: 'https://image.pollinations.ai/prompt/islamic%20education%20mobile%20app%20clean%20modern?width=800&height=450&nologo=true',
    sources: [{ title: 'Chaîne YouTube L\'Écho du Matin', uri: 'https://www.youtube.com/channel/UCMhZrqyvbruHrPgAcfTH05Q' }]
  } as NewsArticle
];

function isYoutubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('ytimg.com');
}

function getSafeImageUrl(articleImage: string | null | undefined, title: string): string {
  if (!articleImage || isYoutubeUrl(articleImage)) {
    return `https://image.pollinations.ai/prompt/${encodeURIComponent('news journalism ' + title)}?width=800&height=450&nologo=true`;
  }
  return articleImage;
}

export async function fetchNews(category: Category, lang: Language): Promise<NewsArticle[]> {
  // Section Partenaires = vidéos YouTube, pas RSS
  if (category === 'Annonces & Partenaires' as any) {
    return PARTNER_VIDEOS;
  }

  const feeds = RSS_FEEDS[category] || RSS_FEEDS['À la une'];
  const articles: NewsArticle[] = [];
  const seenTitles = new Set<string>();

  for (const feedUrl of feeds) {
    try {
      const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'ok' && data.items) {
        data.items.slice(0, 5).forEach((item: any, idx: number) => {
          const tit
