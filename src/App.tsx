import React, { useState, useEffect } from 'react';
import { Category, NewsArticle, Language } from './types';
import { fetchNews, speakArticle } from './services/geminiService';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.FR);
  const [category, setCategory] = useState<Category>(Category.UNES);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selected, setSelected] = useState<NewsArticle | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const todayStr = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  useEffect(() => {
    const loadData = async () => {
      const cacheKey = `news_v9_${category}_${lang}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) { setArticles(JSON.parse(cached)); setLoading(false); }
      else { setLoading(true); }
      setIsUpdating(true);
      try {
        const data = await fetchNews(category, lang);
        if (data && data.length > 0) {
          setArticles(data);
          localStorage.setItem(cacheKey, JSON.stringify(data));
        }
      } catch (err) { console.error('Erreur:', err); }
      finally { setLoading(false); setIsUpdating(false); }
    };
    loadData();
  }, [category, lang]);

  const handleSpeak = async (text: string, id: string) => {
    if (speakingId === id) { window.speechSynthesis.cancel(); setSpeakingId(null); return; }
    setSpeakingId(id);
    await speakArticle(text, lang);
    setSpeakingId(null);
  };

  return (
    <div className={`min-h-screen bg-[#FDFCF8] text-zinc-950 flex flex-col`} style={{fontFamily:"'Inter',sans-serif"}}>
      <header className="border-b-4 border-zinc-900 mx-4 md:mx-10 mt-4 pb-4 text-center">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-3">
          <span className="bg-red-600 text-white px-2 py-0.5 rounded">{category}</span>
          <div className="text-zinc-400 hidden lg:block italic text-[9px]">DIRECTEUR : <span className="text-zinc-900 font-bold">ATMANI BACHIR</span></div>
          <div className="flex gap-3">
            {Object.values(Language).map(l => (
              <button key={l} onClick={() => setLang(l)} className={`text-[10px] transition-all ${lang === l ? 'font-black border-b-2 border-black' : 'text-zinc-300'}`}>
                {l.slice(0,2).toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <h1 className="font-black italic tracking-tighter leading-none" style={{fontFamily:"'Playfair Display',serif", fontSize:'clamp(2.5rem,10vw,6rem)'}}>
          L'Écho du Matin
        </h1>
        <div className="flex flex-col md:flex-row justify-center items-center gap-2 mt-2">
          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-500">6 HEURES, VU PAR L'IA</p>
          <span className="text-[10px] text-zinc-400 italic capitalize" style={{fontFamily:"'Playfair Display',serif"}}>{todayStr}</span>
        </div>
      </header>

      <div className="sticky top-0 bg-[#FDFCF8]/95 backdrop-blur z-50 border-b border-zinc-200">
        <nav className="flex overflow-x-auto gap-6 px-6 py-4" style={{scrollbarWidth:'none'}}>
          {Object.values(Category).map(cat => (
            <button key={cat} onClick={() => { setCategory(cat); window.scrollTo({top:0,behavior:'smooth'}); }}
              className={`whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all flex-shrink-0 ${category === cat ? 'text-black border-b-2 border-black' : 'text-zinc-300 hover:text-zinc-600'}`}>
              {cat}
            </button>
          ))}
        </nav>
        {isUpdating && <div className="h-0.5 bg-red-600 w-full animate-pulse"/>}
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-6 py-8 w-full">
        {loading && articles.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {[1,2,3].map(i => (
              <div key={i} className={`${i===1?'md:col-span-8':'md:col-span-4'} space-y-4`}>
                <div className="aspect-video bg-zinc-100 animate-pulse rounded"/>
                <div className="h-8 bg-zinc-100 animate-pulse w-3/4 rounded"/>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            {articles.slice(0,6).map((art, idx) => (
              <article key={art.id} onClick={() => setSelected(art)}
                className={`${idx===0?'md:col-span-12 lg:col-span-8':'md:col-span-6 lg:col-span-4'} border-b border-zinc-100 pb-8 cursor-pointer group`}>
                <div className="aspect-video overflow-hidden bg-zinc-100 mb-4 rounded relative">
                  <img src={art.imageUrl} alt={art.title} loading="lazy"
                    className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://image.pollinations.ai/prompt/${encodeURIComponent(art.title)}?width=800&height=450&nologo=true`; }}/>
                  <div className="absolute top-3 left-3">
                    <span className="text-[7px] font-black px-2 py-1 rounded uppercase tracking-widest bg-green-600 text-white shadow">
                      {art.location}
                    </span>
                  </div>
                </div>
                <h2 className={`font-black italic tracking-tighter leading-tight mb-2 transition-colors group-hover:text-zinc-600 ${idx===0?'text-3xl md:text-5xl':'text-xl md:text-2xl'}`}
                  style={{fontFamily:"'Playfair Display',serif"}}>
                  {art.title}
                </h2>
                <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2 italic">{art.summary}</p>
                <p className="text-zinc-400 text-[10px] mt-2 font-bold uppercase tracking-widest">{art.physicalFacts} · {art.location}</p>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-zinc-900 text-white py-12 px-10 text-center">
        <h2 className="text-3xl font-black italic mb-3" style={{fontFamily:"'Playfair Display',serif"}}>L'Écho du Matin</h2>
        <p className="text-[10px] tracking-[0.5em] text-zinc-500 uppercase">© 2026 Atmani Bachir · lechodumatin.com</p>
      </footer>

      {selected && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
          <div className="sticky top-0 bg-white/95 backdrop-blur border-b p-4 flex justify-between items-center">
            <span className="font-black italic text-lg" style={{fontFamily:"'Playfair Display',serif"}}>L'Écho du Matin</span>
            <button onClick={() => setSelected(null)} className="bg-black text-white px-5 py-2 rounded-full font-black text-[9px] uppercase tracking-widest">Fermer</button>
          </div>
          <article className="max-w-3xl mx-auto py-10 px-4 space-y-8 pb-24">
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none" style={{fontFamily:"'Playfair Display',serif"}}>{selected.title}</h2>
            <img src={selected.imageUrl} className="w-full aspect-video object-cover rounded shadow-xl" alt={selected.title}
              onError={(e) => { (e.target as HTMLImageElement).src = `https://image.pollinations.ai/prompt/${encodeURIComponent(selected.title)}?width=800&height=450&nologo=true`; }}/>
            <div className="text-lg leading-relaxed italic text-zinc-800 whitespace-pre-line" style={{fontFamily:"'Playfair Display',serif"}}>{selected.content}</div>
            {selected.sources?.length > 0 && (
              <a href={selected.sources[0].uri} target="_blank" rel="noopener noreferrer"
                className="inline-block text-[10px] font-black uppercase tracking-widest border border-zinc-200 px-4 py-2 rounded hover:bg-zinc-50">
                Lire la source → {selected.sources[0].title}
              </a>
            )}
            <button onClick={() => handleSpeak(selected.content, selected.id)}
              className={`w-full p-5 border-2 border-black font-black uppercase tracking-widest flex items-center justify-center gap-3 rounded-full text-[10px] transition-all ${speakingId===selected.id?'bg-red-600 text-white border-red-600':'hover:bg-zinc-50'}`}>
              {speakingId===selected.id?'⏹ Arrêter':'▶ Écouter l\'article'}
            </button>
          </article>
        </div>
      )}
    </div>
  );
};

export default App;
