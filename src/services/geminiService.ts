import { NewsArticle, Category, Language } from '../types';

// 📊 Source des articles : Google Sheets (système automatique de Bachir)
const GOOGLE_SHEETS_ID = '1CZyvkyK-wK_n0PDXb5pfEXoBrxs8AOasAwq0mVc61bs';
const GOOGLE_SHEETS_CSV_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_ID}/export?format=csv`;

// Mapping des codes catégorie du Google Sheets vers les rubriques du journal
const SHEET_CATEGORY_MAP: Record<string, Category> = {
  'une': Category.UNES,
  'unes': Category.UNES,
  'a la une': Category.UNES,
  'à la une': Category.UNES,
  'geopolitique': Category.GEOPOLITIQUE,
  'géopolitique': Category.GEOPOLITIQUE,
  'geopolitique & conflits': Category.GEOPOLITIQUE,
  'finance': Category.FINANCE,
  'crypto': Category.FINANCE,
  'finance & crypto': Category.FINANCE,
  'meteo': Category.METEO,
  'météo': Category.METEO,
  'meteo & alertes sat': Category.METEO,
  'europe': Category.SOCIETE,
  'belgique': Category.SOCIETE,
  'societe': Category.SOCIETE,
  'belgique & europe': Category.SOCIETE,
  'futur': Category.TECH,
  'tech': Category.TECH,
  'ia': Category.TECH,
  'ia & futur': Category.TECH,
  'partenaires': Category.ANNONCES,
  'annonces': Category.ANNONCES,
  'partenariats': Category.ANNONCES,
  'partenariats & annonces': Category.ANNONCES,
};

// Parseur CSV robuste : gère les virgules et sauts de ligne dans les champs entre guillemets
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  let i = 0;
  while (i < text.length) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      }
      field += char; i++; continue;
    }
    if (char === '"') { inQuotes = true; i++; continue; }
    if (char === ',') { row.push(field); field = ''; i++; continue; }
    if (char === '\r') { i++; continue; }
    if (char === '\n') { row.push(field); rows.push(row); row = []; field = ''; i++; continue; }
    field += char; i++;
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

// ✅ Image gratuite et illimitée via Pollinations.ai (0€)
function getPollinationsImage(prompt: string): string {
  const encoded = encodeURIComponent(
    `professional news journalism photo ${prompt} cinematic realistic`
  );
  const seed = Math.abs(prompt.split('').reduce((a, c) => a + c.charCodeAt(0), 0));
  return `https://image.pollinations.ai/prompt/${encoded}?width=800&height=450&nologo=true&seed=${seed}`;
}

// 📥 Source 1 (prioritaire) : articles.json généré par le pipeline automatique
// Contient les vidéos YouTube de la chaîne de Bachir
async function fetchFromPipeline(category: Category): Promise<NewsArticle[]> {
  try {
    const response = await fetch(`/articles.json?_=${Date.now()}`);
    if (!response.ok) return [];
    const data = await response.json();
    const list: any[] = (data && data.articles) || [];
    const articles: NewsArticle[] = [];

    list.forEach((a, idx) => {
      const catCode = (a.category || '').trim().toLowerCase();
      const mappedCat = SHEET_CATEGORY_MAP[catCode] || Category.UNES;
      if (mappedCat !== category) return;
      if (!a.title) return;

      articles.push({
        id: `pipe-${idx}-${a.date || ''}`,
        type: 'FACTUAL',
        title: a.title,
        summary: a.summary || a.title,
        content: a.content || a.summary || a.title,
        truthContent: 'Vérifié',
        physicalFacts: a.date || new Date().toLocaleDateString('fr-FR'),
        audioAnnounce: a.title,
        imagePrompt: a.title,
        strategicAdvice: {
          action: 'Lire la suite',
          details: 'Article complet disponible sur la source officielle'
        },
        location: 'Rédaction IA · L\'Écho du Matin',
        timestamp: a.date || new Date().toISOString(),
        category: mappedCat,
        icon: '📰',
        imageUrl: a.image || getPollinationsImage(a.title),
        youtubeId: a.youtubeId || '',
        sources: a.link ? [{ title: 'Source', uri: a.link }] : []
      });
    });

    return articles;
  } catch {
    return [];
  }
}

// 📥 Récupère les articles : pipeline d'abord, Google Sheets en secours
// Structure Sheets : Date | Catégorie | Titre | Résumé | Contenu | Lien | Statut
export async function fetchNews(category: Category, lang: Language): Promise<NewsArticle[]> {
  // 1️⃣ Priorité : articles générés automatiquement (avec vidéos YouTube)
  const pipelineArticles = await fetchFromPipeline(category);
  if (pipelineArticles.length > 0) {
    return pipelineArticles;
  }

  // 2️⃣ Secours : Google Sheets (rédaction manuelle)
  try {
    const response = await fetch(`${GOOGLE_SHEETS_CSV_URL}&_=${Date.now()}`);
    if (!response.ok) {
      console.error('Erreur Google Sheets (HTTP ' + response.status + ')');
      return [];
    }

    const csvText = await response.text();
    const rows = parseCSV(csvText);
    if (rows.length < 2) return [];

    // Ligne 1 = en-têtes, on saute
    const dataRows = rows.slice(1);
    const articles: NewsArticle[] = [];

    dataRows.forEach((cols, idx) => {
      const date = (cols[0] || '').trim();
      const catCode = (cols[1] || '').trim().toLowerCase();
      const title = (cols[2] || '').trim();
      const summary = (cols[3] || '').trim();
      const content = (cols[4] || '').trim();
      const link = (cols[5] || '').trim();

      if (!title) return;

      const mappedCat = SHEET_CATEGORY_MAP[catCode] || Category.UNES;
      if (mappedCat !== category) return;

      articles.push({
        id: `sheet-${idx}-${Date.now()}`,
        type: 'FACTUAL',
        title: title,
        summary: summary || title,
        content: content || summary || title,
        truthContent: 'Vérifié',
        physicalFacts: date || new Date().toLocaleDateString('fr-FR'),
        audioAnnounce: title,
        imagePrompt: title,
        strategicAdvice: {
          action: 'Lire la suite',
          details: 'Article complet disponible sur la source officielle'
        },
        location: 'Rédaction IA · L\'Écho du Matin',
        timestamp: date || new Date().toISOString(),
        category: mappedCat,
        icon: '📰',
        imageUrl: getPollinationsImage(title),
        sources: link ? [{ title: 'Source', uri: link }] : []
      });
    });

    return articles;
  } catch (err) {
    console.error('Erreur lecture Google Sheets:', err);
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
    youtubeId: 'UCMhZrqyvbruHrPgAcfTH05Q',
    description: 'Application d\'apprentissage des bases de l\'Islam',
    type: 'partenaire'
  }
];

export async function speakArticle(text: string, lang: Language) {
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === Language.AR ? 'ar-SA' : lang === Language.EN ? 'en-US' : lang === Language.ES ? 'es-ES' : lang === Language.DE ? 'de-DE' : 'fr-FR';
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
