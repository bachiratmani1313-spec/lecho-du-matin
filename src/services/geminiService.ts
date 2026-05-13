import { NewsArticle, Category, Language } from '../types';

const GNEWS_API_KEY = localStorage.getItem('GNEWS_API_KEY') || import.meta.env.VITE_GNEWS_API_KEY;

const CATEGORY_MAP: Record<string, string> = {
  [Category.UNES]: 'general',
  [Category.GEOPOLITIQUE]: 'politics',
  [Category.FINANCE]: 'business',
  [Category.METEO]: 'science',
  [Category.SOCIETE]: 'health',
  [Category.TECH]: 'technology',
  [Category.ANNONCES]: 'general'
};

// ✅ Vérifie si une URL est une vidéo YouTube
function isYoutubeUrl(url: string): boolean {
  return url.includes('youtube.com') || 
         url.includes('youtu.be') || 
         url.includes('ytimg.com');
}

// ✅ Génère une image gratuite via Pollinations.ai (0€, illimité)
function getPollinationsImage(prompt: string): string {
  const encoded = encodeURIComponent(
    `professional news journalism photo ${prompt} cinematic realistic`
  );
  return `https://image.pollinations.ai/prompt/${encoded}?width=800&height=450&nologo=true&seed=${Date.now()}`;
}

// ✅ Retourne une image propre : jamais YouTube, toujours une vraie image
function getSafeImageUrl(articleImage: string | null | undefined, fallbackPrompt: string): string {
  if (!articleImage || isYoutubeUrl(articleImage)) {
    return getPollinationsImage(fallbackPrompt);
  }
  return articleImage;
}

export async function fetchNews(category: Category, lang: Language): Promise<NewsArticle[]> {
  if (!GNEWS_API_KEY) {
    const key = prompt('Entrez votre clé GNews API (https://gnews.io/)');
    if (key) {
      localStorage.setItem('GNEWS_API_KEY', key);
      location.reload();
    }
    return [];
  }

  try {
    const gnewsCategory = CATEGORY_MAP[category] || 'general';
    const langCode = lang === Language.EN ? 'en' : lang === Language.AR ? 'ar' : 'fr';
    
    const url = `https://gnews.io/api/v4/search?q=${gnewsCategory}&lang=${langCode}&token=${GNEWS_API_KEY}&max=10`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!data.articles) return [];

    return data.articles.map((article: any, idx: number) => ({
      id: `${Date.now()}-${idx}`,
      type: 'FACTUAL',
      title: article.title || 'Sans titre',
      summary: article.description || 'Aucun résumé',
      content: article.content || article.description || 'Contenu indisponible',
      truthContent: 'Vérifié',
      physicalFacts: new Date(article.publishedAt).toLocaleDateString('fr-FR'),
      audioAnnounce: article.title,
      imagePrompt: category,
      strategicAdvice: {
        action: 'Lire la suite',
        details: 'Article complet disponible sur la source officielle'
      },
      location: article.source?.name || 'Source',
      timestamp: article.publishedAt,
      category: category,
      icon: '📰',
      // ✅ CORRECTION BUG : jamais une URL YouTube comme image d'article
      imageUrl: getSafeImageUrl(article.image, article.title),
      sources: [{ 
        title: article.source?.name || 'Source', 
        uri: article.url 
      }]
    }));
  } catch (err) {
    console.error('Erreur GNews:', err);
    return [];
  }
}

// ✅ Articles partenaires - YouTube autorisé ICI uniquement
export interface PartnerVideo {
  id: string;
  title: string;
  youtubeId: string;
  description: string;
  type: 'partenaire' | 'annonce';
}

export const PARTNER_VIDEOS: PartnerVideo[] = [
  {
    id: 'partner-1',
    title: 'Mon Compagnon 2030 — Apprendre l\'Islam',
    youtubeId: 'UCMhZrqyvbruHrPgAcfTH05Q', // ← remplace par le vrai ID vidéo
    description: 'Application d\'apprentissage des bases de l\'Islam',
    type: 'partenaire'
  }
];

export async function speakArticle(text: string, lang: Language) {
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === Language.AR ? 'ar-SA' : lang === Language.EN ? 'en-US' : 'fr-FR';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
    return new Uint8Array([]);
  } catch (e) {
    return null;
  }
}

export async function decodeAudio(bytes: Uint8Array, audioCtx: AudioContext) {
  return audioCtx.createBuffer(1, 1, audioCtx.sampleRate);
}

export function createWavBlob(bytes: Uint8Array) {
  return new Blob([bytes], { type: 'audio/wav' });
}
