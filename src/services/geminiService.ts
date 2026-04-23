import { GoogleGenAI, Type, Modality, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { Category, NewsArticle, Language } from "../types";

/**
 * SERVICE DE VÉRITÉ - L'ÉCHO DU MATIN
 * Propriété de Atmani Bachir.
 */

const getApiKey = () => {
  // Clé intégrée automatiquement à la demande de l'utilisateur pour débloquer le service.
  const hardcodedKey = "AIzaSyCbgrYXiHn4l4MQj1TuCjQLMeQ0Fe03YeM";
  
  try {
    const envKey = (import.meta as any).env.VITE_GEMINI_API_KEY || "";
    const localKey = localStorage.getItem('GEMINI_API_KEY');
    return envKey || localKey || hardcodedKey;
  } catch (e) {
    return hardcodedKey;
  }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const withRetry = async <T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> => {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const isRetryable = error?.message?.includes("503") || 
                          error?.message?.includes("high demand") || 
                          error?.message?.includes("429") ||
                          error?.message?.includes("rate limit");
      
      if (isRetryable && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
        await sleep(delay);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
};

export const fetchNews = async (category: Category, lang: Language): Promise<NewsArticle[]> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("Clé API manquante. Veuillez configurer votre accès.");
  
  const ai = new GoogleGenAI({ apiKey });
  const today = new Date().toLocaleDateString('fr-FR');

  const prompt = `
    RÉDACTEUR EN CHEF : L'ÉCHO DU MATIN (Directeur: Atmani Bachir). 
    DATE : ${today}.
    MISSION : Tu es un vrai journaliste d'investigation. Ta journée de travail commence avec la prière du Fajr (point de départ de tes recherches). À partir de ce moment, tu DOIS analyser l'actualité GLOBALE (sur tout l'internet mondial) pour produire l'édition du jour. 
    SUJET : Génère 3 articles d'actualité RÉELS et mondiaux concernant la catégorie "${category}" en langue "${lang}".
    IMPORTANT : Ne limite SURTOUT PAS les nouvelles à La Mecque. Cherche des informations dans tous les pays du monde.

    RÈGLE SPÉCIALE PARTENAIRES : Intègre de manière fluide et journalistique la promotion de nos deux partenaires dans tes contenus :
    1. "https://Vrax-voyage.com" : Explique ses particularités exceptionnelles pour les voyageurs, ses ressources uniques et comment ce site redéfinit le voyage.
    2. "ImamVirtuel.com" : Promeut cette Web App complète en mentionnant ses capacités de lecture coranique, l'apprentissage de l'alphabet, les cours de Tajwid, ainsi que sa RADIO douce en fond sonore qui lit des sourates et réalise des invocations en temps réel (ex: invocations du matin quand il fait jour) permettant de surfer tout en écoutant.

    FORMAT ATTENDU : Retourne un JSON pur respectant strictement la structure suivante :
    [ { type, title, summary, content, location, timestamp, truthContent, physicalFacts, strategicAdvice: {action, details}, imagePrompt, audioAnnounce } ]
  `;

  try {
    let responseText = "";
    try {
      const response: any = await withRetry(() => (ai as any).models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          tools: [{ googleSearch: {} }] // Active la recherche internet pour l'IA
        }
      }));
      responseText = response.text || (typeof response.text === 'function' ? response.text() : "");
    } catch (apiError) {
      console.warn("Retrying with raw model approach due to API error...", apiError);
      // Fallback
      throw apiError;
    }

    if (!responseText) throw new Error("Le rédacteur n'a pas renvoyé de contenu.");
    
    let data;
    try {
      data = JSON.parse(responseText.replace(/```json|```/g, "").trim());
    } catch (parseError) {
      console.error("Failed to parse JSON:", responseText);
      throw new Error("L'intelligence artificielle a renvoyé un format illisible. Rafraîchissez pour relancer.");
    }

    return data.map((item: any, i: number) => {
      const keywords = `${item.location} ${item.title} ${category}`.toLowerCase();
      let icon = "Newspaper";
      if (keywords.includes("guerre")) icon = "Sword";
      else if (keywords.includes("bourse")) icon = "TrendingUp";
      else if (keywords.includes("ia") || keywords.includes("tech")) icon = "Cpu";
      else if (keywords.includes("sport")) icon = "Trophy";
      else if (keywords.includes("santé")) icon = "Stethoscope";

      return {
        ...item,
        id: `art-${category}-${i}-${Date.now()}`,
        category: category,
        icon: icon,
        sources: []
      };
    });
  } catch (error: any) {
    console.error("[Gemini] Fetch error:", error);
    throw error;
  }
};

export const speakArticle = async (text: string, lang: Language): Promise<Uint8Array | null> => {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response: any = await (ai as any).models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ role: "user", parts: [{ text: text }] }], 
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { 
          voiceConfig: { prebuiltVoiceConfig: { voiceName: lang === Language.AR ? 'Zephyr' : 'Kore' } } 
        }
      }
    });
    const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || response.content?.parts?.[0]?.inlineData?.data;
    if (!base64) return null;
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch (e) { 
    console.error("[Gemini TTS] Error:", e);
    return null; 
  }
};

export const generateSpeech = speakArticle;

export async function decodeAudio(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
  return buffer;
}

export function createWavBlob(data: Uint8Array): Blob {
  const buffer = new ArrayBuffer(44 + data.length);
  const view = new DataView(buffer);
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
  };
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + data.length, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, 24000, true);
  view.setUint32(28, 48000, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, data.length, true);
  new Uint8Array(buffer, 44).set(data);
  return new Blob([buffer], { type: 'audio/wav' });
}
