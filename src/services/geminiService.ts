export async function fetchNews(category: string, lang: string) {
  const articles = [
    {
      id: '1',
      type: 'FACTUAL',
      title: 'Les 5 Piliers de l\'Islam Expliqués',
      summary: 'Découvrez les fondamentaux de la pratique islamique',
      content: 'Les 5 piliers constituent le fondement de l\'Islam. Ils structurent la vie spirituelle du musulman et marquent son engagement envers Allah.',
      truthContent: 'Vérifié',
      physicalFacts: 'Pratiqué par 1.8 milliard de musulmans',
      audioAnnounce: 'Les piliers de l\'Islam',
      imagePrompt: 'mosque',
      strategicAdvice: { action: 'Pratiquer régulièrement', details: 'La constance dans la prière renforce la connexion spirituelle.' },
      location: 'Monde',
      timestamp: new Date().toISOString(),
      category: 'UNES',
      sources: [{ title: 'Source', uri: '#' }]
    },
    {
      id: '2',
      type: 'FACTUAL',
      title: 'L\'importance de la Salat',
      summary: 'La prière, pilier central de la foi',
      content: 'La Salat est bien plus qu\'une obligation. C\'est un moment de connexion directe avec Allah, un acte de soumission et de gratitude.',
      truthContent: 'Vérifié',
      physicalFacts: '5 fois par jour',
      audioAnnounce: 'La prière en Islam',
      imagePrompt: 'prayer',
      strategicAdvice: { action: 'Prier avec intention', details: 'Chaque prière doit être faite avec présence d\'esprit.' },
      location: 'Monde',
      timestamp: new Date().toISOString(),
      category: 'UNES',
      sources: [{ title: 'Source', uri: '#' }]
    },
    {
      id: '3',
      type: 'FACTUAL',
      title: 'Le Coran: Parole d\'Allah',
      summary: 'Le guide éternel pour les croyants',
      content: 'Le Coran est le texte sacré de l\'Islam, révélé au Prophète Muhammad. Il contient des enseignements spirituels, légaux et moraux.',
      truthContent: 'Vérifié',
      physicalFacts: '114 sourates, 6236 versets',
      audioAnnounce: 'Le Coran en Islam',
      imagePrompt: 'quran',
      strategicAdvice: { action: 'Lire le Coran régulièrement', details: 'La lecture quotidienne du Coran apaise le cœur et éclaire l\'esprit.' },
      location: 'Monde',
      timestamp: new Date().toISOString(),
      category: 'UNES',
      sources: [{ title: 'Source', uri: '#' }]
    }
  ];

  return articles;
}

export async function speakArticle(text: string, lang: string) {
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'AR' ? 'ar-SA' : lang === 'EN' ? 'en-US' : 'fr-FR';
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
