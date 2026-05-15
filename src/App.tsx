// =====================================================================
//  L'ÉCHO DU MATIN — Journal multilingue (FR / EN / ES / DE / AR)
//  Mission : INFORMER LE MONDE — analyses & décryptages de fond
//
//  100% ORIGINAL — les articles sont des analyses rédigées, pas des
//  reprises de médias. Aucun problème de droits d'auteur.
//  100% GRATUIT — aucune clé API exposée, aucun risque de facture.
//
//  Images  : Pollinations.ai (génération IA, gratuit)
//  Audio   : Web Speech API du navigateur (gratuit)
//  Météo   : open-meteo.com (gratuit, sans clé)
//  Vidéos  : flux RSS public de TA chaîne YouTube (la tienne)
// =====================================================================

import { useState, useEffect, useCallback } from 'react';
import './index.css';

// =====================================================================
//  1. TYPES
// =====================================================================
type LangCode = 'fr' | 'en' | 'es' | 'de' | 'ar';
type CategoryId =
  | 'une' | 'geopolitique' | 'europe' | 'futur'
  | 'meteo' | 'archives' | 'partenaires';

interface ArticleText { title: string; body: string; }
interface Article {
  id: string;
  category: CategoryId;
  image: string;
  text: Record<LangCode, ArticleText>;
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
const YOUTUBE_CHANNEL_ID = 'UCMhZrqyvbruHrPgAcfTH05Q';

const LANGUAGES: { code: LangCode; label: string; flag: string; dir: 'ltr' | 'rtl'; voice: string }[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷', dir: 'ltr', voice: 'fr-FR' },
  { code: 'en', label: 'English',  flag: '🇬🇧', dir: 'ltr', voice: 'en-US' },
  { code: 'es', label: 'Español',  flag: '🇪🇸', dir: 'ltr', voice: 'es-ES' },
  { code: 'de', label: 'Deutsch',  flag: '🇩🇪', dir: 'ltr', voice: 'de-DE' },
  { code: 'ar', label: 'العربية',  flag: '🇸🇦', dir: 'rtl', voice: 'ar-SA' },
];

const CATEGORIES: CategoryId[] = [
  'une', 'geopolitique', 'europe', 'futur', 'meteo', 'archives', 'partenaires',
];

// --- Traductions de l'interface (i18n) ---
type UIStrings = {
  siteTitle: string; tagline: string; categories: Record<CategoryId, string>;
  listenJournal: string; listenArticle: string; stopAudio: string;
  readMore: string; readLess: string; share: string; copyArticle: string;
  copied: string; loadingVideos: string; noVideos: string;
  partnersIntro: string; visitPartner: string; archivesIntro: string;
  watchVideo: string; weatherIntro: string; footer: string;
};
const I18N: Record<LangCode, UIStrings> = {
  fr: {
    siteTitle: "L'Écho du Matin", tagline: 'Informer le monde — analyses & décryptages, chaque matin',
    categories: {
      une: 'À la une', geopolitique: 'Géopolitique', europe: 'Belgique & Europe',
      futur: 'IA & Futur', meteo: 'Météo & Climat', archives: 'Archives vidéo',
      partenaires: 'Annonces & Partenaires',
    },
    listenJournal: '▶ Écouter le journal', listenArticle: '🔊 Écouter',
    stopAudio: '⏹ Arrêter', readMore: 'Lire la suite', readLess: 'Réduire',
    share: 'Partager', copyArticle: "Copier l'article", copied: 'Copié ✓',
    loadingVideos: 'Chargement des vidéos…', noVideos: 'Aucune vidéo pour le moment.',
    partnersIntro: 'Nos partenaires et annonces du jour.', visitPartner: 'Découvrir',
    archivesIntro: "Toutes les éditions vidéo de L'Écho du Matin.", watchVideo: 'Regarder',
    weatherIntro: 'La météo du jour dans les grandes villes.',
    footer: "L'Écho du Matin — Analyses & décryptages indépendants. Contenu original.",
  },
  en: {
    siteTitle: 'The Morning Echo', tagline: 'Informing the world — analysis & insight, every morning',
    categories: {
      une: 'Headlines', geopolitique: 'Geopolitics', europe: 'Belgium & Europe',
      futur: 'AI & Future', meteo: 'Weather & Climate', archives: 'Video Archive',
      partenaires: 'Announcements & Partners',
    },
    listenJournal: '▶ Listen to the journal', listenArticle: '🔊 Listen',
    stopAudio: '⏹ Stop', readMore: 'Read more', readLess: 'Show less',
    share: 'Share', copyArticle: 'Copy article', copied: 'Copied ✓',
    loadingVideos: 'Loading videos…', noVideos: 'No videos yet.',
    partnersIntro: "Our partners and today's announcements.", visitPartner: 'Discover',
    archivesIntro: 'All video editions of The Morning Echo.', watchVideo: 'Watch',
    weatherIntro: "Today's weather in major cities.",
    footer: 'The Morning Echo — Independent analysis & insight. Original content.',
  },
  es: {
    siteTitle: 'El Eco de la Mañana', tagline: 'Informar al mundo — análisis y claves, cada mañana',
    categories: {
      une: 'Titulares', geopolitique: 'Geopolítica', europe: 'Bélgica y Europa',
      futur: 'IA y Futuro', meteo: 'Clima y Tiempo', archives: 'Archivo de vídeos',
      partenaires: 'Anuncios y Socios',
    },
    listenJournal: '▶ Escuchar el diario', listenArticle: '🔊 Escuchar',
    stopAudio: '⏹ Detener', readMore: 'Leer más', readLess: 'Mostrar menos',
    share: 'Compartir', copyArticle: 'Copiar artículo', copied: 'Copiado ✓',
    loadingVideos: 'Cargando vídeos…', noVideos: 'Aún no hay vídeos.',
    partnersIntro: 'Nuestros socios y los anuncios de hoy.', visitPartner: 'Descubrir',
    archivesIntro: 'Todas las ediciones en vídeo de El Eco de la Mañana.', watchVideo: 'Ver',
    weatherIntro: 'El tiempo de hoy en las grandes ciudades.',
    footer: 'El Eco de la Mañana — Análisis independiente. Contenido original.',
  },
  de: {
    siteTitle: 'Das Morgen-Echo', tagline: 'Die Welt informieren — Analysen & Einordnung, jeden Morgen',
    categories: {
      une: 'Schlagzeilen', geopolitique: 'Geopolitik', europe: 'Belgien & Europa',
      futur: 'KI & Zukunft', meteo: 'Wetter & Klima', archives: 'Video-Archiv',
      partenaires: 'Anzeigen & Partner',
    },
    listenJournal: '▶ Das Journal anhören', listenArticle: '🔊 Anhören',
    stopAudio: '⏹ Stopp', readMore: 'Weiterlesen', readLess: 'Weniger anzeigen',
    share: 'Teilen', copyArticle: 'Artikel kopieren', copied: 'Kopiert ✓',
    loadingVideos: 'Videos werden geladen…', noVideos: 'Noch keine Videos.',
    partnersIntro: 'Unsere Partner und die heutigen Anzeigen.', visitPartner: 'Entdecken',
    archivesIntro: 'Alle Video-Ausgaben von Das Morgen-Echo.', watchVideo: 'Ansehen',
    weatherIntro: 'Das heutige Wetter in den großen Städten.',
    footer: 'Das Morgen-Echo — Unabhängige Analysen. Originalinhalte.',
  },
  ar: {
    siteTitle: 'صدى الصباح', tagline: 'إعلام العالم — تحليلات وقراءات، كل صباح',
    categories: {
      une: 'العناوين الرئيسية', geopolitique: 'الجغرافيا السياسية', europe: 'بلجيكا وأوروبا',
      futur: 'الذكاء الاصطناعي والمستقبل', meteo: 'الطقس والمناخ', archives: 'أرشيف الفيديو',
      partenaires: 'إعلانات وشركاء',
    },
    listenJournal: '▶ استمع إلى الجريدة', listenArticle: '🔊 استمع',
    stopAudio: '⏹ إيقاف', readMore: 'اقرأ المزيد', readLess: 'عرض أقل',
    share: 'مشاركة', copyArticle: 'نسخ المقال', copied: 'تم النسخ ✓',
    loadingVideos: 'جارٍ تحميل الفيديوهات…', noVideos: 'لا توجد فيديوهات بعد.',
    partnersIntro: 'شركاؤنا وإعلانات اليوم.', visitPartner: 'اكتشف',
    archivesIntro: 'جميع إصدارات الفيديو لصدى الصباح.', watchVideo: 'مشاهدة',
    weatherIntro: 'طقس اليوم في المدن الكبرى.',
    footer: 'صدى الصباح — تحليلات مستقلة. محتوى أصلي.',
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

// --- Partenaires ---
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

// =====================================================================
//  3. ARTICLES — contenu original rédigé, en 5 langues
//  (Ce sont des analyses de fond. Plus tard, l'IA les régénérera
//   automatiquement chaque matin via Groq.)
// =====================================================================
const IMG = (q: string, seed: number) =>
  `https://image.pollinations.ai/prompt/${encodeURIComponent(
    'editorial illustration, newspaper, ' + q
  )}?width=640&height=400&seed=${seed}&nologo=true`;

const ARTICLES: Article[] = [
  // ---------- À LA UNE ----------
  {
    id: 'a1', category: 'une', image: IMG('artificial intelligence at work, modern office, future', 11),
    text: {
      fr: { title: "L'intelligence artificielle transforme le monde du travail",
        body: "Partout, l'intelligence artificielle s'installe dans les entreprises. Elle automatise des tâches répétitives, assiste les médecins, les juristes ou les journalistes, et fait naître de nouveaux métiers. Loin de remplacer simplement l'humain, elle redéfinit la façon de travailler. Le défi des prochaines années : former chacun pour qu'il garde la maîtrise de ces outils." },
      en: { title: 'Artificial intelligence is reshaping the world of work',
        body: "Across every sector, artificial intelligence is settling into companies. It automates repetitive tasks, assists doctors, lawyers and journalists, and creates entirely new professions. Rather than simply replacing humans, it redefines how we work. The challenge of the coming years: training everyone to stay in control of these tools." },
      es: { title: 'La inteligencia artificial transforma el mundo laboral',
        body: 'En todos los sectores, la inteligencia artificial se instala en las empresas. Automatiza tareas repetitivas, asiste a médicos, juristas y periodistas, y crea nuevas profesiones. Más que sustituir al ser humano, redefine la forma de trabajar. El reto de los próximos años: formar a todos para que mantengan el control de estas herramientas.' },
      de: { title: 'Künstliche Intelligenz verändert die Arbeitswelt',
        body: 'In allen Branchen hält die künstliche Intelligenz Einzug in die Unternehmen. Sie automatisiert wiederkehrende Aufgaben, unterstützt Ärzte, Juristen und Journalisten und schafft neue Berufe. Statt den Menschen einfach zu ersetzen, verändert sie die Art zu arbeiten. Die Herausforderung der kommenden Jahre: alle so auszubilden, dass sie die Kontrolle über diese Werkzeuge behalten.' },
      ar: { title: 'الذكاء الاصطناعي يغيّر عالم العمل',
        body: 'في كل القطاعات، يدخل الذكاء الاصطناعي إلى الشركات. فهو يؤتمت المهام المتكررة، ويساعد الأطباء والحقوقيين والصحفيين، ويخلق مهنًا جديدة. وبدلًا من أن يحلّ محلّ الإنسان ببساطة، فإنه يعيد تعريف طريقة العمل. والتحدّي في السنوات المقبلة هو تدريب الجميع للحفاظ على السيطرة على هذه الأدوات.' },
    },
  },
  {
    id: 'a2', category: 'une', image: IMG('fresh water drop, river, reservoir, blue', 12),
    text: {
      fr: { title: "L'eau douce, ressource précieuse du XXIe siècle",
        body: "Moins de 1 % de l'eau de la planète est douce et facilement accessible. Avec la croissance de la population et le réchauffement climatique, de nombreuses régions connaissent déjà des pénuries. Mieux gérer l'irrigation, réparer les fuites, recycler les eaux usées : les solutions existent. L'eau devient un enjeu de paix et de coopération entre les peuples." },
      en: { title: 'Fresh water, the precious resource of the 21st century',
        body: "Less than 1% of the planet's water is fresh and easily accessible. With population growth and global warming, many regions already face shortages. Managing irrigation better, fixing leaks, recycling wastewater: solutions exist. Water is becoming a matter of peace and cooperation between peoples." },
      es: { title: 'El agua dulce, recurso valioso del siglo XXI',
        body: 'Menos del 1 % del agua del planeta es dulce y de fácil acceso. Con el crecimiento de la población y el calentamiento global, muchas regiones ya sufren escasez. Gestionar mejor el riego, reparar las fugas, reciclar las aguas residuales: las soluciones existen. El agua se convierte en una cuestión de paz y cooperación entre los pueblos.' },
      de: { title: 'Süßwasser, die kostbare Ressource des 21. Jahrhunderts',
        body: 'Weniger als 1 % des Wassers der Erde ist Süßwasser und leicht zugänglich. Mit dem Bevölkerungswachstum und der Erderwärmung leiden viele Regionen bereits unter Knappheit. Bewässerung besser steuern, Lecks reparieren, Abwasser wiederverwenden: Lösungen gibt es. Wasser wird zu einer Frage des Friedens und der Zusammenarbeit zwischen den Völkern.' },
      ar: { title: 'المياه العذبة، ثروة القرن الحادي والعشرين',
        body: 'أقل من 1٪ من مياه الكوكب عذبة وسهلة الوصول. ومع نمو السكان والاحتباس الحراري، تعاني مناطق كثيرة من الندرة بالفعل. إدارة الري بشكل أفضل، وإصلاح التسربات، وإعادة تدوير المياه المستعملة: الحلول موجودة. وتصبح المياه قضية سلام وتعاون بين الشعوب.' },
    },
  },
  // ---------- GÉOPOLITIQUE ----------
  {
    id: 'a3', category: 'geopolitique', image: IMG('South China Sea, ships, ocean, map', 13),
    text: {
      fr: { title: 'Comprendre les tensions en mer de Chine méridionale',
        body: "La mer de Chine méridionale est l'une des voies maritimes les plus fréquentées du monde. Plusieurs pays — Chine, Philippines, Vietnam — y revendiquent des îles et des zones de pêche. Sous ces eaux se trouvent aussi du gaz et du pétrole. Les tensions y restent vives, car le commerce mondial dépend en partie de cette région." },
      en: { title: 'Understanding tensions in the South China Sea',
        body: "The South China Sea is one of the busiest shipping routes in the world. Several countries — China, the Philippines, Vietnam — claim islands and fishing zones there. Beneath these waters lie gas and oil as well. Tensions remain high, because global trade depends in part on this region." },
      es: { title: 'Entender las tensiones en el mar de China Meridional',
        body: 'El mar de China Meridional es una de las rutas marítimas más transitadas del mundo. Varios países —China, Filipinas, Vietnam— reclaman islas y zonas de pesca. Bajo estas aguas también hay gas y petróleo. Las tensiones siguen siendo fuertes, porque el comercio mundial depende en parte de esta región.' },
      de: { title: 'Die Spannungen im Südchinesischen Meer verstehen',
        body: 'Das Südchinesische Meer ist eine der meistbefahrenen Schifffahrtsrouten der Welt. Mehrere Länder – China, die Philippinen, Vietnam – beanspruchen dort Inseln und Fischfanggebiete. Unter diesen Gewässern liegen außerdem Gas und Öl. Die Spannungen bleiben hoch, denn der Welthandel hängt zum Teil von dieser Region ab.' },
      ar: { title: 'فهم التوترات في بحر الصين الجنوبي',
        body: 'يُعدّ بحر الصين الجنوبي أحد أكثر الممرات البحرية ازدحامًا في العالم. وتطالب عدة دول — الصين والفلبين وفيتنام — بجزر ومناطق صيد فيه. كما يوجد تحت هذه المياه غاز ونفط. وتبقى التوترات قائمة لأن التجارة العالمية تعتمد جزئيًا على هذه المنطقة.' },
    },
  },
  {
    id: 'a4', category: 'geopolitique', image: IMG('Arctic ice melting, polar landscape, ships', 14),
    text: {
      fr: { title: "Pourquoi l'Arctique est devenu un enjeu mondial",
        body: "En fondant, la banquise arctique ouvre de nouvelles routes maritimes et donne accès à des ressources jusque-là gelées. Les grandes puissances y voient une opportunité économique et stratégique. Mais cette région fragile abrite aussi des peuples autochtones et un écosystème unique. L'Arctique illustre le lien étroit entre climat, économie et géopolitique." },
      en: { title: 'Why the Arctic has become a global issue',
        body: "As it melts, the Arctic ice opens new shipping routes and grants access to resources that were once frozen. The major powers see an economic and strategic opportunity there. But this fragile region is also home to Indigenous peoples and a unique ecosystem. The Arctic illustrates the close link between climate, economy and geopolitics." },
      es: { title: 'Por qué el Ártico se ha convertido en un asunto mundial',
        body: 'Al derretirse, el hielo ártico abre nuevas rutas marítimas y da acceso a recursos antes congelados. Las grandes potencias ven allí una oportunidad económica y estratégica. Pero esta región frágil también alberga pueblos indígenas y un ecosistema único. El Ártico ilustra el estrecho vínculo entre clima, economía y geopolítica.' },
      de: { title: 'Warum die Arktis zu einem globalen Thema wurde',
        body: 'Durch das Schmelzen öffnet das arktische Eis neue Schifffahrtsrouten und gibt Zugang zu zuvor gefrorenen Ressourcen. Die Großmächte sehen darin eine wirtschaftliche und strategische Chance. Doch diese fragile Region beherbergt auch indigene Völker und ein einzigartiges Ökosystem. Die Arktis zeigt die enge Verbindung von Klima, Wirtschaft und Geopolitik.' },
      ar: { title: 'لماذا أصبح القطب الشمالي قضية عالمية',
        body: 'بذوبانه، يفتح جليد القطب الشمالي طرقًا بحرية جديدة ويتيح الوصول إلى موارد كانت متجمدة. وترى القوى الكبرى في ذلك فرصة اقتصادية واستراتيجية. لكن هذه المنطقة الهشّة موطن أيضًا لشعوب أصلية ونظام بيئي فريد. ويجسّد القطب الشمالي الصلة الوثيقة بين المناخ والاقتصاد والجغرافيا السياسية.' },
    },
  },
  // ---------- BELGIQUE & EUROPE ----------
  {
    id: 'a5', category: 'europe', image: IMG('European Union flags, parliament building', 15),
    text: {
      fr: { title: "Comment fonctionne l'Union européenne",
        body: "L'Union européenne réunit 27 pays qui décident ensemble de règles communes. La Commission propose les lois ; le Parlement, élu par les citoyens, les vote avec le Conseil, qui représente les États. Ce système d'équilibre permet à des nations très différentes de coopérer sur l'économie, l'environnement ou les droits, tout en gardant leur identité." },
      en: { title: 'How the European Union works',
        body: "The European Union brings together 27 countries that decide common rules together. The Commission proposes laws; the Parliament, elected by citizens, votes on them with the Council, which represents the states. This system of balance allows very different nations to cooperate on the economy, the environment or rights, while keeping their identity." },
      es: { title: 'Cómo funciona la Unión Europea',
        body: 'La Unión Europea reúne a 27 países que deciden juntos normas comunes. La Comisión propone las leyes; el Parlamento, elegido por los ciudadanos, las vota con el Consejo, que representa a los Estados. Este sistema de equilibrio permite que naciones muy distintas cooperen en economía, medio ambiente o derechos, conservando su identidad.' },
      de: { title: 'Wie die Europäische Union funktioniert',
        body: 'Die Europäische Union vereint 27 Länder, die gemeinsam gemeinsame Regeln beschließen. Die Kommission schlägt Gesetze vor; das von den Bürgern gewählte Parlament stimmt mit dem Rat darüber ab, der die Staaten vertritt. Dieses Gleichgewicht erlaubt sehr unterschiedlichen Nationen, bei Wirtschaft, Umwelt oder Rechten zusammenzuarbeiten und dabei ihre Identität zu bewahren.' },
      ar: { title: 'كيف يعمل الاتحاد الأوروبي',
        body: 'يجمع الاتحاد الأوروبي 27 دولة تقرّر معًا قواعد مشتركة. تقترح المفوضية القوانين، ويصوّت عليها البرلمان المنتخَب من المواطنين مع المجلس الذي يمثّل الدول. ويتيح نظام التوازن هذا لأمم مختلفة جدًّا أن تتعاون في الاقتصاد والبيئة والحقوق مع الحفاظ على هويتها.' },
    },
  },
  {
    id: 'a6', category: 'europe', image: IMG('Brussels city, European institutions, architecture', 16),
    text: {
      fr: { title: 'Bruxelles, cœur politique de l\'Europe',
        body: "Capitale de la Belgique, Bruxelles accueille les principales institutions européennes. Chaque jour, des élus, des fonctionnaires et des diplomates de tout le continent y préparent les décisions qui concernent des centaines de millions d'habitants. Ville bilingue et cosmopolite, elle est devenue le symbole d'une Europe qui cherche à parler d'une seule voix." },
      en: { title: 'Brussels, the political heart of Europe',
        body: "The capital of Belgium, Brussels hosts the main European institutions. Every day, elected officials, civil servants and diplomats from across the continent prepare the decisions that affect hundreds of millions of people. A bilingual and cosmopolitan city, it has become the symbol of a Europe trying to speak with one voice." },
      es: { title: 'Bruselas, corazón político de Europa',
        body: 'Capital de Bélgica, Bruselas acoge las principales instituciones europeas. Cada día, cargos electos, funcionarios y diplomáticos de todo el continente preparan allí las decisiones que afectan a cientos de millones de personas. Ciudad bilingüe y cosmopolita, se ha convertido en el símbolo de una Europa que busca hablar con una sola voz.' },
      de: { title: 'Brüssel, das politische Herz Europas',
        body: 'Brüssel, die Hauptstadt Belgiens, beherbergt die wichtigsten europäischen Institutionen. Jeden Tag bereiten dort gewählte Vertreter, Beamte und Diplomaten aus ganz Europa die Entscheidungen vor, die Hunderte Millionen Menschen betreffen. Als zweisprachige und weltoffene Stadt ist sie zum Symbol eines Europas geworden, das mit einer Stimme sprechen will.' },
      ar: { title: 'بروكسل، القلب السياسي لأوروبا',
        body: 'تستضيف بروكسل، عاصمة بلجيكا، أهم المؤسسات الأوروبية. وكل يوم، يُعِدّ فيها منتخَبون وموظفون ودبلوماسيون من كل القارة القرارات التي تخصّ مئات الملايين من السكان. وقد أصبحت هذه المدينة المزدوجة اللغة والمنفتحة رمزًا لأوروبا تسعى إلى التحدّث بصوت واحد.' },
    },
  },
  // ---------- IA & FUTUR ----------
  {
    id: 'a7', category: 'futur', image: IMG('artificial intelligence in medicine, doctor, scan', 17),
    text: {
      fr: { title: "L'intelligence artificielle au service de la médecine",
        body: "Détecter un cancer plus tôt sur une radio, repérer une maladie rare, accélérer la recherche de médicaments : l'intelligence artificielle aide déjà les soignants. Elle ne remplace pas le médecin, mais lui offre un second regard très précis. Le vrai défi reste la confiance : ces outils doivent être transparents, vérifiés et respectueux des données des patients." },
      en: { title: 'Artificial intelligence in the service of medicine',
        body: "Detecting cancer earlier on a scan, spotting a rare disease, speeding up drug research: artificial intelligence already helps caregivers. It does not replace the doctor, but offers a very precise second opinion. The real challenge remains trust: these tools must be transparent, verified and respectful of patients' data." },
      es: { title: 'La inteligencia artificial al servicio de la medicina',
        body: 'Detectar un cáncer antes en una radiografía, identificar una enfermedad rara, acelerar la búsqueda de medicamentos: la inteligencia artificial ya ayuda al personal sanitario. No sustituye al médico, pero le ofrece una segunda mirada muy precisa. El verdadero reto sigue siendo la confianza: estas herramientas deben ser transparentes, verificadas y respetuosas con los datos de los pacientes.' },
      de: { title: 'Künstliche Intelligenz im Dienst der Medizin',
        body: 'Krebs früher auf einer Aufnahme erkennen, eine seltene Krankheit aufspüren, die Arzneimittelforschung beschleunigen: Künstliche Intelligenz hilft dem Pflegepersonal bereits. Sie ersetzt den Arzt nicht, bietet aber eine sehr präzise zweite Meinung. Die wahre Herausforderung bleibt das Vertrauen: Diese Werkzeuge müssen transparent, geprüft und im Umgang mit Patientendaten respektvoll sein.' },
      ar: { title: 'الذكاء الاصطناعي في خدمة الطب',
        body: 'اكتشاف السرطان مبكرًا في صورة أشعة، وتحديد مرض نادر، وتسريع البحث عن الأدوية: يساعد الذكاء الاصطناعي العاملين في الرعاية الصحية بالفعل. وهو لا يحلّ محلّ الطبيب، لكنه يقدّم رأيًا ثانيًا دقيقًا جدًّا. ويبقى التحدّي الحقيقي هو الثقة: يجب أن تكون هذه الأدوات شفافة ومُتحقَّقًا منها وتحترم بيانات المرضى.' },
    },
  },
  {
    id: 'a8', category: 'futur', image: IMG('self driving autonomous car, city street, sensors', 18),
    text: {
      fr: { title: 'Voitures autonomes : où en est-on vraiment ?',
        body: "Les voitures capables de rouler seules existent déjà, mais surtout dans des zones limitées et bien cartographiées. Les capteurs et l'intelligence artificielle progressent vite, pourtant la conduite en ville reste difficile à maîtriser entièrement. Avant une généralisation, il faudra répondre à des questions de sécurité, de loi et de responsabilité en cas d'accident." },
      en: { title: 'Self-driving cars: where do we really stand?',
        body: "Cars able to drive themselves already exist, but mainly in limited, well-mapped areas. Sensors and artificial intelligence are advancing fast, yet city driving remains hard to fully master. Before any widespread use, questions of safety, law and liability in the event of an accident will have to be answered." },
      es: { title: 'Coches autónomos: ¿en qué punto estamos realmente?',
        body: 'Los coches capaces de conducir solos ya existen, pero sobre todo en zonas limitadas y bien cartografiadas. Los sensores y la inteligencia artificial avanzan rápido, aunque la conducción en ciudad sigue siendo difícil de dominar por completo. Antes de una generalización, habrá que responder a preguntas de seguridad, ley y responsabilidad en caso de accidente.' },
      de: { title: 'Selbstfahrende Autos: Wo stehen wir wirklich?',
        body: 'Autos, die selbst fahren können, gibt es bereits, aber vor allem in begrenzten, gut kartierten Gebieten. Sensoren und künstliche Intelligenz machen schnelle Fortschritte, doch das Fahren in der Stadt bleibt schwer vollständig zu beherrschen. Vor einer breiten Einführung müssen Fragen der Sicherheit, des Rechts und der Haftung bei Unfällen geklärt werden.' },
      ar: { title: 'السيارات ذاتية القيادة: أين وصلنا فعلًا؟',
        body: 'السيارات القادرة على القيادة بنفسها موجودة بالفعل، لكن خاصة في مناطق محدودة ومرسومة جيدًا. وتتقدّم أجهزة الاستشعار والذكاء الاصطناعي بسرعة، ومع ذلك تبقى القيادة في المدينة صعبة الإتقان تمامًا. وقبل انتشارها على نطاق واسع، يجب الإجابة عن أسئلة تتعلق بالسلامة والقانون والمسؤولية عند وقوع حادث.' },
    },
  },
  // ---------- MÉTÉO & CLIMAT ----------
  {
    id: 'a9', category: 'meteo', image: IMG('European city summer heat wave, hot sun', 19),
    text: {
      fr: { title: 'Pourquoi les étés européens deviennent plus chauds',
        body: "Les vagues de chaleur sont plus fréquentes, plus longues et plus intenses en Europe. En cause : l'accumulation de gaz à effet de serre, qui retient davantage la chaleur du soleil. Les villes, couvertes de béton, amplifient le phénomène. Planter des arbres, isoler les bâtiments et réduire les émissions sont autant de réponses possibles." },
      en: { title: 'Why European summers are getting hotter',
        body: "Heat waves are more frequent, longer and more intense in Europe. The cause: the build-up of greenhouse gases, which traps more of the sun's heat. Cities, covered in concrete, amplify the phenomenon. Planting trees, insulating buildings and cutting emissions are all possible responses." },
      es: { title: 'Por qué los veranos europeos son cada vez más calurosos',
        body: 'Las olas de calor son más frecuentes, más largas y más intensas en Europa. La causa: la acumulación de gases de efecto invernadero, que retiene más el calor del sol. Las ciudades, cubiertas de hormigón, amplifican el fenómeno. Plantar árboles, aislar los edificios y reducir las emisiones son respuestas posibles.' },
      de: { title: 'Warum die europäischen Sommer heißer werden',
        body: 'Hitzewellen sind in Europa häufiger, länger und intensiver. Die Ursache: die Ansammlung von Treibhausgasen, die mehr Sonnenwärme zurückhält. Städte, von Beton bedeckt, verstärken das Phänomen. Bäume pflanzen, Gebäude dämmen und Emissionen senken sind mögliche Antworten.' },
      ar: { title: 'لماذا تزداد حرارة الصيف في أوروبا',
        body: 'موجات الحرّ أكثر تواترًا وأطول وأشدّ في أوروبا. والسبب: تراكم غازات الاحتباس الحراري التي تحبس مزيدًا من حرارة الشمس. والمدن المغطّاة بالخرسانة تضخّم الظاهرة. وزراعة الأشجار وعزل المباني وخفض الانبعاثات كلها حلول ممكنة.' },
    },
  },
  {
    id: 'a10', category: 'meteo', image: IMG('Gulf Stream ocean current, Atlantic, warm water map', 20),
    text: {
      fr: { title: 'Le Gulf Stream, ce courant qui réchauffe l\'Europe',
        body: "Le Gulf Stream est un immense courant marin qui transporte de l'eau chaude depuis le golfe du Mexique jusqu'aux côtes européennes. C'est en partie grâce à lui que l'Europe de l'Ouest a un climat doux. Les scientifiques surveillent son ralentissement, car un changement de ce courant aurait des effets importants sur la météo du continent." },
      en: { title: 'The Gulf Stream, the current that warms Europe',
        body: "The Gulf Stream is a vast ocean current that carries warm water from the Gulf of Mexico to the European coasts. It is partly thanks to it that Western Europe has a mild climate. Scientists are monitoring its slowdown, because a change in this current would have major effects on the continent's weather." },
      es: { title: 'La corriente del Golfo, ese flujo que templa Europa',
        body: 'La corriente del Golfo es una enorme corriente marina que transporta agua cálida desde el golfo de México hasta las costas europeas. En parte gracias a ella, Europa Occidental tiene un clima suave. Los científicos vigilan su ralentización, porque un cambio en esta corriente tendría efectos importantes en el clima del continente.' },
      de: { title: 'Der Golfstrom, die Strömung, die Europa wärmt',
        body: 'Der Golfstrom ist eine gewaltige Meeresströmung, die warmes Wasser vom Golf von Mexiko bis zu den europäischen Küsten transportiert. Auch dank ihm hat Westeuropa ein mildes Klima. Wissenschaftler beobachten seine Verlangsamung, denn eine Veränderung dieser Strömung hätte erhebliche Folgen für das Wetter des Kontinents.' },
      ar: { title: 'تيار الخليج، التيار الذي يدفّئ أوروبا',
        body: 'تيار الخليج تيار بحري ضخم ينقل المياه الدافئة من خليج المكسيك إلى السواحل الأوروبية. وبفضله جزئيًّا يتمتّع غرب أوروبا بمناخ معتدل. ويراقب العلماء تباطؤه، لأن أيّ تغيّر في هذا التيار ستكون له آثار كبيرة على طقس القارة.' },
    },
  },
];

// =====================================================================
//  4. SERVICE — météo + vidéos de TA chaîne YouTube
// =====================================================================
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
    } catch { /* proxy suivant */ }
  }
  throw new Error('Proxies en échec');
}

const CACHE_MIN = 30;
function cacheGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { time, data } = JSON.parse(raw);
    if (Date.now() - time > CACHE_MIN * 60 * 1000) return null;
    return data as T;
  } catch { return null; }
}
function cacheSet(key: string, data: unknown): void {
  try { localStorage.setItem(key, JSON.stringify({ time: Date.now(), data })); }
  catch { /* ignore */ }
}

async function getVideos(): Promise<VideoItem[]> {
  const cached = cacheGet<VideoItem[]>('echo-videos');
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
    if (videos.length) cacheSet('echo-videos', videos);
    return videos;
  } catch { return []; }
}

async function getWeather(): Promise<CityWeather[]> {
  const cached = cacheGet<CityWeather[]>('echo-weather');
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
  if (weather.length) cacheSet('echo-weather', weather);
  return weather;
}

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
//  5. APPLICATION
// =====================================================================
export default function App() {
  const [lang, setLang] = useState<LangCode>('fr');
  const [category, setCategory] = useState<CategoryId>('une');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [weather, setWeather] = useState<CityWeather[]>([]);

  const t = I18N[lang];
  const langInfo = LANGUAGES.find((l) => l.code === lang)!;
  const isRTL = langInfo.dir === 'rtl';

  // Direction du document (RTL pour l'arabe)
  useEffect(() => {
    document.documentElement.dir = langInfo.dir;
    document.documentElement.lang = lang;
    document.title = t.siteTitle;
  }, [lang, langInfo.dir, t.siteTitle]);

  // Articles de la catégorie courante
  const articles = ARTICLES.filter((a) => a.category === category);

  // Charger les VIDÉOS (section Archives)
  useEffect(() => {
    if (category !== 'archives') return;
    setLoadingVideos(true);
    getVideos()
      .then(setVideos)
      .catch(() => setVideos([]))
      .finally(() => setLoadingVideos(false));
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
    if (speakingId === a.id) { stopAudio(); return; }
    const txt = a.text[lang];
    speak(a.id, `${txt.title}. ${txt.body}`);
  };
  const listenJournal = () => {
    if (speakingId === 'journal') { stopAudio(); return; }
    const intro = `${t.siteTitle}. ${t.categories[category]}.`;
    const body = articles.map((a) => `${a.text[lang].title}. ${a.text[lang].body}`).join(' ... ');
    speak('journal', `${intro} ${body}`);
  };
  useEffect(() => { stopAudio(); }, [lang, category, stopAudio]);

  // PARTAGE (le journal a une seule adresse : on partage le site)
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareArticle = async (a: Article) => {
    const txt = a.text[lang];
    if (navigator.share) {
      try { await navigator.share({ title: txt.title, text: txt.title, url: siteUrl }); }
      catch { /* annulé */ }
    } else {
      navigator.clipboard?.writeText(`${txt.title} — ${siteUrl}`);
      setCopiedId(a.id); setTimeout(() => setCopiedId(null), 2000);
    }
  };
  const copyArticle = (a: Article) => {
    const txt = a.text[lang];
    navigator.clipboard?.writeText(`${txt.title}\n\n${txt.body}\n\n${t.siteTitle} — ${siteUrl}`);
    setCopiedId(a.id + '-copy'); setTimeout(() => setCopiedId(null), 2000);
  };
  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`,
      '_blank', 'noopener,noreferrer'
    );
  };

  // Dates
  const today = new Date().toLocaleDateString(lang, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(lang, { day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return ''; }
  };

  const isArticleCategory = !['archives', 'partenaires'].includes(category);

  // -------------------------------------------------------------------
  return (
    <div className={`echo ${isRTL ? 'rtl' : ''}`}>
      {/* EN-TÊTE */}
      <header className="echo-header">
        <div className="echo-header-top">
          <span className="echo-date">{today}</span>
          <select
            className="echo-lang" value={lang}
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
        {isArticleCategory && articles.length > 0 && (
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

        {/* ARTICLES */}
        {isArticleCategory && (
          <div className="echo-grid">
            {articles.map((a) => {
              const txt = a.text[lang];
              const open = expandedId === a.id;
              return (
                <article key={a.id} className="echo-card">
                  <img
                    className="echo-card-img" src={a.image} alt="" loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }}
                  />
                  <div className="echo-card-body">
                    <div className="echo-card-meta">
                      <span className="echo-card-tag">{t.categories[category]}</span>
                      <span className="echo-card-date">{today}</span>
                    </div>
                    <h3 className="echo-card-title">{txt.title}</h3>
                    <p className={`echo-card-text ${open ? 'open' : ''}`}>{txt.body}</p>

                    <div className="echo-card-actions">
                      <button
                        className={`echo-btn echo-btn-listen ${speakingId === a.id ? 'playing' : ''}`}
                        onClick={() => listenArticle(a)}
                      >
                        {speakingId === a.id ? t.stopAudio : t.listenArticle}
                      </button>
                      <button
                        className="echo-btn echo-btn-read"
                        onClick={() => setExpandedId(open ? null : a.id)}
                      >
                        {open ? t.readLess : t.readMore}
                      </button>
                    </div>

                    <div className="echo-card-share">
                      <button className="echo-share-btn" onClick={() => shareArticle(a)}>
                        ↗ {t.share}
                      </button>
                      <button className="echo-share-btn fb" onClick={shareFacebook}>
                        f Facebook
                      </button>
                      <button className="echo-share-btn" onClick={() => copyArticle(a)}>
                        {copiedId === a.id + '-copy' ? t.copied : '⧉ ' + t.copyArticle}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
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
        {category === 'archives' && (
          <div>
            <p className="echo-info-text">{t.archivesIntro}</p>
            {loadingVideos && <p className="echo-info">{t.loadingVideos}</p>}
            {!loadingVideos && videos.length === 0 && (
              <p className="echo-info">{t.noVideos}</p>
            )}
            <div className="echo-grid">
              {videos.map((v) => (
                <article key={v.id} className="echo-card">
                  <a href={v.link} target="_blank" rel="noopener noreferrer">
                    <img className="echo-card-img" src={v.thumbnail} alt="" loading="lazy" />
                  </a>
                  <div className="echo-card-body">
                    <div className="echo-card-meta">
                      <span className="echo-card-tag">YouTube</span>
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
                    <p className="echo-card-text open">{p.description[lang]}</p>
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
