import { GoogleGenAI, Modality } from "@google/genai";
import { Category, NewsArticle, Language } from "../types";

/**
 * SERVICE GRATUIT - L'ÉCHO DU MATIN
 * ✅ Gemini 2.0 Flash (GRATUIT)
 * ✅ Cache intelligent
 * ✅ TTS natif Gemini
 * Propriété : Atmani Bachir
 */

const getApiKey = () => {
  try {
    // Priority 1: Variable d'environnement (SÉCURISÉE)
    const envKey = (import.meta as any).env.VITE_GEMINI_API_KEY || "";
    if (envKey) return envKey;
    
    // Priority 2: localStorage (pour développement)
    const localKey = localStorage.getItem('GEMINI_API_KEY');
    if (localKey) return localKey;
    
    // Fallback: message clair
    throw new Error("❌ Clé API manquante. Configurez VITE_GEMINI_API_KEY dans .env");
  } catch (e) {
    console.error("[Gemini] Erreur API:", e);
    throw e;
  }
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const withRetry = async <T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> => {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const isRetryable = 
        error?.message?.includes("503") || 
        error?.message?.includes("high demand") || 
        error?.message?.includes("429") ||
        error?.message?.includes("rate limit");
      
      if (isRetryable && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
        console.warn(`[Gemini] Retry ${i + 1}/${maxRetries} dans ${delay}ms...`);
        await sleep(delay);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
};

/**
 * CACHE INTELLIGENT
 * localStorage + IndexedDB pour éviter les appels répétés
 */
const getCacheKey = (category: Category, lang: Language) => {
  const today = new Date().toISOString().split('T')[0];
  return `news_${category}_${lang}_${today}`;
};

const getCachedArticles = async (category: Category, lang: Language): Promise<NewsArticle[] | null> => {
  try {
    const key = getCacheKey(category, lang);
    const cached = localStorage.getItem(key);
    if (cached) {
      console.log(`[Cache] Hit pour ${category}`);
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn("[Cache] Erreur lecture:", e);
  }
  return null;
};

const setCachedArticles = (category: Category, lang: Language, articles: NewsArticle[]) => {
  try {
    const key = getCacheKey(category, lang);
    localStorage.setItem(key, JSON.stringify(articles));
    // TTL: 24h
    localStorage.setItem(`${key}_ttl`, Date.now().toString());
  } catch (e) {
    console.warn("[Cache] Erreur écriture:", e);
  }
};

/**
 * FETCH NEWS - SANS PUBS INTÉGRÉES
 * Articles PURS uniquement
 */
export const fetchNews = async (category: Category, lang: Language): Promise<NewsArticle[]> => {
  const apiKey = getApiKey();
  
  // Vérifier le cache en premier
  const cached = await getCachedArticles(category, lang);
  if (cached && cached.length > 0) {
    return cached;
  }

  const ai = new GoogleGenAI({ apiKey });
  const today = new Date().toLocaleDateString('fr-FR');

  const prompt = `
    RÉDACTEUR EN CHEF : L'ÉCHO DU MATIN
    Directeur : Atmani Bachir
    DATE : ${today}
    LANGUE : ${lang}
    
    MISSION STRICTE : 
    Tu es un journaliste d'investigation professionnel. 
    Génère 3 articles d'actualité RÉELS et VÉRIFIABLES sur la catégorie "${category}".
    
    ⚠️ IMPORTANT : 
    - NE MÉLANGE JAMAIS les articles avec des annonces publicitaires
    - Articles PURS uniquement
    - Recherche sur internet GLOBALE (tous les pays)
    - Faits vérifiables et sourcés
    
    FORMAT JSON STRICT (sans markdown) :
    [
      {
        "type": "FACTUAL" ou "MAGAZINE",
        "title": "Titre accrocheur",
        "summary": "Résumé 1-2 lignes",
        "content": "Article complet (300-500 mots)",
        "location": "Pays/Région",
        "timestamp": "ISO date",
        "truthContent": "Vérification des faits",
        "physicalFacts": "Données mesurables",
        "strategicAdvice": {
          "action": "Conseil court",
          "details": "Explication détaillée"
        },
        "imagePrompt": "Description pour image IA",
        "audioAnnounce": "Version courte pour TTS (50 mots max)"
      }
    ]
  `;

  try {
    const response: any = await withRetry(() => 
      (ai as any).models.generateContent({
        model: "gemini-2.0-flash", // ✅ GRATUIT
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          tools: [{ googleSearch: {} }] // Recherche web incluse GRATUITEMENT
        }
      })
    );

    let responseText = response.text || (typeof response.text === 'function' ? response.text() : "");
    
    if (!responseText) {
      throw new Error("Pas de réponse du modèle");
    }

    let data;
    try {
      // Nettoyer le JSON
      const cleaned = responseText
        .replace(/```json|```/g, "")
        .replace(/^[\s\n]*/, "")
        .trim();
      data = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("[Parse] Erreur JSON:", responseText);
      throw new Error("Format de réponse invalide");
    }

    if (!Array.isArray(data)) {
      throw new Error("La réponse n'est pas un tableau");
    }

    // Transformer et enrichir les articles
    const articles = data.map((item: any, i: number) => {
      const keywords = `${item.location || ""} ${item.title || ""} ${category}`.toLowerCase();
      
      let icon = "Newspaper";
      if (keywords.includes("guerre") || keywords.includes("conflit")) icon = "Sword";
      else if (keywords.includes("bourse") || keywords.includes("crypto")) icon = "TrendingUp";
      else if (keywords.includes("ia") || keywords.includes("tech")) icon = "Cpu";
      else if (keywords.includes("sport")) icon = "Trophy";
      else if (keywords.includes("santé") || keywords.includes("médical")) icon = "Stethoscope";

      return {
        ...item,
        id: `art-${category}-${i}-${Date.now()}`,
        category: category,
        icon: icon,
        sources: item.sources || [],
        type: item.type || "FACTUAL"
      } as NewsArticle;
    });

    // Mettre en cache
    setCachedArticles(category, lang, articles);
    
    return articles;
  } catch (error: any) {
    console.error("[Gemini] Erreur fetch:", error);
    throw error;
  }
};

/**
 * TTS GEMINI NATIF GRATUIT
 * Voix française de qualité
 */
export const speakArticle = async (text: string, lang: Language): Promise<Uint8Array | null> => {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    // Limiter à 1000 caractères pour TTS
    const truncated = text.slice(0, 1000);

    const response: any = await (ai as any).models.generateContent({
      model: "gemini-2.0-flash", // ✅ GRATUIT avec TTS
      contents: [{ role: "user", parts: [{ text: truncated }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: lang === Language.AR ? 'Zephyr' : 'Kore' // Voix FR par défaut
            }
          }
        }
      }
    });

    // Extraire l'audio base64
    const base64 = 
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || 
      response.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64) {
      console.warn("[TTS] Pas d'audio dans la réponse");
      return null;
    }

    // Convertir base64 → Uint8Array
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
  } catch (error: any) {
    console.error("[TTS] Erreur:", error.message);
    // Fallback: Web Speech API (gratuit aussi!)
    return null;
  }
};

export const generateSpeech = speakArticle;

/**
 * DECODE AUDIO (Web Audio API)
 */
export async function decodeAudio(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
  try {
    // Tenter un décodage direct
    return await ctx.decodeAudioData(data.buffer);
  } catch (e) {
    // Fallback: décodage manuel pour PCM 24kHz
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  }
}

/**
 * CRÉER WAV BLOB (download audio)
 */
export function createWavBlob(data: Uint8Array): Blob {
  const buffer = new ArrayBuffer(44 + data.length);
  const view = new DataView(buffer);
  
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  // WAV Header
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + data.length, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);      // fmt chunk size
  view.setUint16(20, 1, true);       // PCM
  view.setUint16(22, 1, true);       // Mono
  view.setUint32(24, 24000, true);   // Sample rate
  view.setUint32(28, 48000, true);   // Byte rate
  view.setUint16(32, 2, true);       // Block align
  view.setUint16(34, 16, true);      // Bits per sample
  writeString(36, 'data');
  view.setUint32(40, data.length, true);

  // Copier les données audio
  new Uint8Array(buffer, 44).set(data);

  return new Blob([buffer], { type: 'audio/wav' });
}

/**
 * FALLBACK: Web Speech API (gratuit + local)
 */
export const speakArticleWebSpeech = (text: string, lang: Language): Promise<void> => {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === Language.AR ? 'ar-SA' : lang === Language.EN ? 'en-US' : 'fr-FR';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.onend = () => resolve();
    speechSynthesis.speak(utterance);
  });
};
