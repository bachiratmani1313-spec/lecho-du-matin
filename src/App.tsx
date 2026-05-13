import React, { useState, useEffect } from 'react';
import { Category, NewsArticle, Language } from './types';
import { fetchNews, speakArticle } from './services/geminiService';

const LANG_LABELS: Record<Language, string> = {
  [Language.FR]: 'FR',
  [Language.EN]: 'EN',
  [Language.ES]: 'ES',
  [Language.DE]: 'DE',
  [Language.AR]: 'AR'
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.FR);
  const [category, setCategory] = useState<Category>(Category.UNES);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<NewsArticle | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [radioMode, setRadioMode] = useState(false);

  const todayStr = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchNews(category, lang);
        if (data && data.length > 0) setArticles(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    loadData();
  }, [category, lang]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "L'Écho du Matin", url: "https://lechodumatin.com" });
    } else {
      navigator.clipboard.writeText("https://lechodumatin.com");
      alert("Lien copié !");
    }
  };

  const handleRadio = async () => {
    if (radioMode) { window.speechSynthesis.cancel(); setRadioMode(false); return; }
    setRadioMode(true);
    const intro = "Bienvenue sur L'Écho du Matin, votre journal francophone IA. Voici l'actualité. ";
    const headlines = articles.slice(0, 5).map(a => a.title + ". " + a.summary).join(" ");
    await speakArticle(intro + headlines, lang);
    setRadioMode(false);
  };

  const handleSpeak = async (text: string, id: string) => {
    if (speakingId === id) { window.speechSynthesis.cancel(); setSpeakingId(null); return; }
    setSpeakingId(id);
    await speakArticle(text, lang);
    setSpeakingId(null);
  };

  return (
    <div className={`min-h-screen bg-[#FDFCF8] text-zinc-950 flex flex-col`} dir={lang === Language.AR ? 'rtl' : 'ltr'}>
      <header className="mx-4 md:mx-10 mt-4 pb-4 text-center">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-3">
          <span className="bg-red-600 text-white px-2 py-0.5 rounded">{category}</span>
          <div className="flex gap-3">
            {Object.values(Language).map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`text-[10px] transition-all ${lang === l ? 'font-black border-b-2 border-black' : 'text-zinc-300'}`}>
                {LANG_LABELS[l]}
              </button>
            ))}
          </div>
        </div>

        <h1 className="font-black italic tracking-tighter leading-none" style={{fontFamily:"'Playfair Display',serif", fontSize:'clamp(2.5rem,10vw,6rem)'}}>
          L'Écho du Matin
        </h1>
        <p className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-500 mt-2">6 HEURES, VU PAR L'IA</p>
        <p className="text-[11px] text-zinc-400 italic capitalize mt-1" style={{fontFamily:"'Playfair Display',serif"}}>{todayStr}</p>

        <div className="flex flex-col items-center gap-3 mt-5">
          <button onClick={handleShare} className="bg-zinc-900 text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-black">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>
            Partager le journal
          </button>

          <div className="flex items-center gap-2">
            {radioMode && <span className="bg-red-600 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest animate-pulse">● Direct</span>}
            <button onClick={handleRadio} className="bg-zinc-900 text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-black">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.89 2 2 2h16c1.11 0 2-.9 2-2V8c0-1.11-.89-2-2-2H8.3l8.26-3.34L15.88 1 3.24 6.15zM7 20c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-8h-2v-2h-2v2H4V8h16v4z"/></svg>
              {radioMode ? 'Arrêter la radio' : 'Écouter le journal (Radio)'}
            </button>
          </div>
        </div>

        <div className="border-b-4 border-zinc-900 mt-6"></div>
      </header>

      <div className="sticky top-0 bg-[#FDFCF8]/95 backdrop-blur z-50 border-b border-zinc-200">
        <nav className="flex overflow-x-auto gap-6 px-6 py-4" style={{scrollbarWidth:'none'}}>
          {Object.values(Category).map(cat => (
            <button key={cat} onClick={() => { setCategory(cat); window.scrollTo({top:0,behavior:'smooth'}); }}
              className={`whitespace-nowrap text-[10px] font-black uppercase tracking-widest flex-shrink-0 ${category === cat ? 'text-black border-b-2 border-black' : 'text-zinc-300'}`}>
              {cat}
            </button>
          ))}
        </nav>
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-6 py-8 w-full">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {[1,2,3].map(i => (
              <div key={i} className={`${i===1?'md:col-span-8':'md:col-span-4'} space-y-4`}>
                <div className="aspect-video bg-zinc-100 animate-pulse rounded"/>
                <div className="h-8 bg-zinc-100 animate-pulse w-3/4 rounded"/>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-400 italic">Aucun article disponible pour le moment.</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300 mt-3">Vérifiez votre clé GNews API</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            {articles.slice(0,6).map((art, idx) => (
              <article key={art.id} onClick={() => setSelected(art)}
                className={`${idx===0?'md:col-span-12 lg:col-span-8':'md:col-span-6 lg:col-span-4'} border-b border-zinc-100 pb-8 cursor-pointer group`}>
                <div className="aspect-video overflow-hidden bg-zinc-100 mb-4 rounded relative">
                  <img src={art.imageUrl} alt={art.title} loading="lazy"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://image.pollinations.ai/prompt/${encodeURIComponent(art.title)}?width=800&height=450&nologo=true`; }}/>
                  <div className="absolute top-3 left-3">
                    <span className="text-[8px] font-black px-3 py-1 uppercase tracking-widest bg-green-600 text-white shadow border-2 border-red-600">
                      Éditorial
                    </span>
                  </div>
                </div>
                <h2 className={`font-black italic tracking-tighter leading-tight mb-2 ${idx===0?'text-3xl md:text-5xl':'text-xl md:text-2xl'}`}
                  style={{fontFamily:"'Playfair Display',serif"}}>{art.title}</h2>
                <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2 italic">{art.summary}</p>
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
            <h2 className="text-4xl md:text-6xl font-black italic" style={{fontFamily:"'Playfair Display',serif"}}>{selected.title}</h2>
            <img src={selected.imageUrl} className="w-full aspect-video object-cover rounded shadow-xl" alt={selected.title}/>
            <div className="text-lg leading-relaxed italic text-zinc-800 whitespace-pre-line" style={{fontFamily:"'Playfair Display',serif"}}>{selected.content}</div>
            <button onClick={() => handleSpeak(selected.content, selected.id)}
              className={`w-full p-5 border-2 border-black font-black uppercase tracking-widest rounded-full text-[10px] ${speakingId===selected.id?'bg-red-600 text-white':'hover:bg-zinc-50'}`}>
              {speakingId===selected.id?'⏹ Arrêter':'▶ Écouter l\'article'}
            </button>
          </article>
        </div>
      )}
    </div>
  );
};

export default App;
