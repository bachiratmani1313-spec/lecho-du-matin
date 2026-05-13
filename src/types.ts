export enum Category {
  UNES = "À la une",
  GEOPOLITIQUE = "Géopolitique & Conflits",
  FINANCE = "Finance & Crypto",
  METEO = "Météo & Alertes Sat",
  SOCIETE = "Belgique & Europe",
  TECH = "IA & Futur",
  ANNONCES = "Annonces & Partenaires"
}

export enum Language {
  FR = "fr",
  EN = "en",
  ES = "es",
  DE = "de",
  AR = "ar"
}

export type ArticleType = "FACTUAL" | "MAGAZINE_COMIC" | "MAGAZINE_FABLE" | "AI_REFLECTION";

export interface NewsArticle {
  id: string;
  type: ArticleType;
  title: string;
  summary: string;
  content: string;
  truthContent: string;
  physicalFacts: string;
  audioAnnounce: string;
  imagePrompt: string;
  strategicAdvice: {
    action: string;
    details: string;
  };
  location: string;
  timestamp: string;
  category: Category;
  imageUrl: string;
  sources: { title: string; uri: string }[];
}
