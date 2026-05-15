import { Category, NewsArticle, Language } from "../types";

/**
 * SERVICE DE VÉRITÉ - L'ÉCHO DU MATIN (Version Hybride Gratuite)
 * Fusion du design du 7 mai + Moteur RSS/Pollinations gratuit
 */

const RSS_FEEDS: Record<string, string[]> = {
  'À la une': ['https://www.france24.com/fr/rss', 'https://feeds.bbci.co.uk/news/world/rss.xml'],
  'Géopolitique & Conflits': ['https://feeds.reuters.com/Reuters/worldNews', 'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml'],
  'Finance & Crypto': ['https://feeds.bbci.co.uk/news/business/rss.xml', 'https://www.coindesk.com/arc/outboundfeeds/rss/'],
  'Météo & Alertes Sat': ['https://feeds.bbci.co.uk/news/science_and_environment/rss.xml'],
  'Belgique & Europe': ['https://www.rtbf.be/info/rss', 'https://www.lalibre.be/arc/outboundfeeds/rss/?outputType=xml'],
  'IA & Futur': ['https://feeds.bbci.co.uk/news/technology/rss.xml', 'https://www.lemonde.fr/pixels/rss_full.xml'],
  'Annonces & Partenaires': []
};

// Système d'images gratuites sans API Key (Pollinations)
function getSafeImageUrl(title: string): string {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent('professional journalism photo ' + title)}?width=800&height=450&nologo=true`;
}

export const fetchNews = async (category: Category, lang: Language): Promise<NewsArticle[]> => {
  const feeds = RSS_FEEDS[category as any] || RSS_FEEDS['À la une'];
  const articles: NewsArticle[] = [];
  const seenTitles = new Set<string>();

  for (const feedUrl of feeds) {
    try {
      // Utilisation du proxy rss2json pour éviter les erreurs CORS
      const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'ok' && data.items) {
        data.items.slice(0, 5).forEach((item: any, idx: number) => {
          const title = item.title || 'Sans titre';
          if (seenTitles.has(title)) return;
          seenTitles.add(title);

          const cleanContent = (item.content || item.description || '').replace(/<[^>]*>/g, '').substring(0, 1000);
          
          articles.push({
            id: `art-${Date.now()}-${idx}`,
            type: 'FACTUAL',
            title: title,
            summary: cleanContent.substring(0, 200) + '...',
            content: cleanContent,
            truthContent: `Source: ${data.feed?.title || 'Presse Internationale'}`,
            physicalFacts: new Date(item.pubDate || Date.now()).toLocaleDateString('fr-FR'),
            audioAnnounce: title,
            imagePrompt: title,
            imageUrl: getSafeImageUrl(title),
            location: 'International',
            timestamp: item.pubDate || new Date().toISOString(),
            category: category,
            icon: 'Newspaper',
            sources: [{ title: data.feed?.title || 'Lien source', uri: item.link }],
            strategicAdvice: { action: 'Analyse', details: 'Suivez l\'évolution de cette actualité dans nos prochaines éditions.' }
          } as NewsArticle);
        });
      }
    } catch (e) {
      console.error('Erreur flux:', feedUrl, e);
    }
  }
  return articles.slice(0, 8);
};

// --- AUDIO GRATUIT (Web Speech API au lieu de Google Cloud Payant) ---
export const speakArticle = (text: string, lang: Language, onEnded?: () => void): void => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel(); // Arrête la voix en cours

  const utterance = new SpeechSynthesisUtterance(text.substring(0, 3000));
  const langMap: Record<string, string> = { fr: 'fr-FR', en: 'en-US', es: 'es-ES', de: 'de-DE', ar: 'ar-SA' };
  utterance.lang = langMap[lang] || 'fr-FR';
  utterance.rate = 0.9;
  utterance.onend = () => onEnded?.();
  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = (): void => {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
};

// --- PARTIE VIDÉO (Adaptée pour rester compatible avec ton interface) ---
export const generateVideoPack = async (article: NewsArticle) => {
  // On simule le pack vidéo basé sur l'article RSS pour éviter les appels API payants
  return {
    title: article.title,
    script: article.content,
    description: `${article.title}\n\n${article.summary}\n\nRetrouvez l'Echo du Matin sur www.lechodumatin.com`,
    hashtags: ['actualité', 'journal', 'info'],
    imagePrompts: [article.title]
  };
};