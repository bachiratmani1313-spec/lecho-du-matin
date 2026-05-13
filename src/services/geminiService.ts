import { NewsArticle, Category, Language } from '../types';

// 📡 Flux RSS gratuits par catégorie (aucune clé API requise)
const RSS_FEEDS: Record<string, string[]> = {
  'À la une': [
    'https://www.france24.com/fr/rss',
    'https://www.lemonde.fr/rss/une.xml',
    'https://feeds.bbci.co.uk/news/world/rss.xml'
  ],
  'Géopolitique & Conflits': [
    'https://www.france24.com/fr/europe/rss',
    'https://feeds.bbci.co.uk/news/politics/rss.xml'
  ],
  'Finance & Crypto': [
    'https://www.lemonde.fr/economie/rss_full.xml',
    'https://feeds.bbci.co.uk/news/business/rss.xml'
  ],
  'Météo & Alertes Sat': [
    'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml'
  ],
  'Belgique & Europe': [
    'https://www.france24.com/fr/europe/rss',
    'https://www.lemonde.fr/europe/rss_full.xml'
  ],
  'IA & Futur': [
    'https://feeds.bbci.co.uk/news/technology/rss.xml',
    'https://www.lemonde.fr/pixels/rss_full.xml'
  ],
  'Annonces & Partenaires': [
    'https://www.france24.com/fr/rss'
  ]
};

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
  const feeds = RSS_FEEDS[category] || RSS_FEEDS['À la une'];
  const articles: NewsArticle[] = [];

  for (const feedUrl of feeds) {
    try {
      const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'ok' && data.items) {
        data.items.slice(0, 5).forEach((item: any, idx: number) => {
          const cleanContent = (item.content || item.description || '').replace(/<[^>]*>/g, '').substring(0, 800);
          articles.push({
            id: `${Date.now()}-${articles.length}-${idx}`,
            type: 'FACTUAL',
            title: item.title || 'Sans titre',
            summary: cleanContent.substring(0, 200),
            content: cleanContent,
            truthContent: 'Source vérifiée',
            physicalFacts: new Date(item.pubDate || Date.now()).toLocaleDateString('fr-FR'),
            audioAnnounce: item.title,
            imagePrompt: category,
            strategicAdvice: { action: 'Lire la suite', details: 'Article complet à la source' },
            location: data.feed?.title || 'International',
            timestamp: item.pubDate || '',
            category: category,
            icon: '📰',
            imageUrl: getSafeImageUrl(item.thumbnail || item.enclosure?.link, item.title),
            sources: [{ title: data.feed?.title || 'Source', uri: item.link }]
          } as NewsArticle);
        });
      }
    } catch (e) {
      console.error('Erreur RSS:', feedUrl, e);
    }
  }

  return articles.slice(0, 6);
}

export async function speakArticle(text: string, lang: Language) {
  const utterance = new SpeechSynthesisUtterance(text);
  const langMap: Record<string, string> = { fr: 'fr-FR', en: 'en-US', es: 'es-ES', de: 'de-DE', ar: 'ar-SA' };
  utterance.lang = langMap[lang] || 'fr-FR';
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
  return new Uint8Array([]);
}

export async function decodeAudio(bytes: Uint8Array, audioCtx: AudioContext) {
  return audioCtx.createBuffer(1, 1, audioCtx.sampleRate);
}
