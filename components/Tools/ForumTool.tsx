
import React, { useState, useEffect, useRef } from 'react';
import { onValue, ref, push, remove, query, limitToLast } from 'firebase/database';
import { db } from '../../services/firebase';
import { ChatMessage } from '../../types';
import { Send, User, Crown, Trash2, ShieldCheck, Lock, ExternalLink } from 'lucide-react';
import { BLOCKLIST, superNormalize } from '../../constants';

interface ForumToolProps {
  onToxic: () => void;
}

const ForumTool: React.FC<ForumToolProps> = ({ onToxic }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState(localStorage.getItem('jawir_username')?.replace('@', '') || '');
  const [msg, setMsg] = useState('');
  const [isAuth, setIsAuth] = useState(localStorage.getItem('jawir_is_dev') === 'true');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chatQuery = query(ref(db, 'chats'), limitToLast(100));
    const unsubscribe = onValue(chatQuery, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const fullList: ChatMessage[] = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .filter(m => !isStrictToxic(m.msg) && !isStrictToxic(m.user))
          .sort((a, b) => a.time - b.time);
        setMessages(fullList);
      } else {
        setMessages([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function isStrictToxic(text: string) {
    if (!text) return false;
    const normalized = superNormalize(text);
    return BLOCKLIST.some(word => normalized.includes(superNormalize(word)));
  };

  const getProfileLink = (username: string) => {
    const name = username.replace('@', '').toLowerCase();
    if (name === 'jawirdesigner' || name === 'jawirdesign') {
      return 'https://lynk.id/jawirdesigner';
    }
    return `https://instagram.com/${name}`;
  };

  const handleSend = async () => {
    const cleanUser = userInput.trim().replace(/^@+/, '');
    const cleanMsg = msg.trim();
    if (!cleanUser || !cleanMsg) return;

    const isTryingDev = cleanUser.toLowerCase() === 'jawirdesigner' || cleanUser.toLowerCase() === 'jawirdesign';
    
    // Verifikasi Akun Developer menggunakan window.prompt agar kompatibel di Vercel
    if (isTryingDev && !isAuth) {
      const pass = window.prompt("SISTEM KEAMANAN: Masukkan Password Developer:");
      if (pass === 'jawirtobat') {
        setIsAuth(true);
        localStorage.setItem('jawir_is_dev', 'true');
      } else {
        window.alert("Password Salah! Akses akun developer ditolak, Wir!");
        return;
      }
    }
    
    if (isStrictToxic(cleanMsg) || isStrictToxic(cleanUser)) {
      onToxic();
      return;
    }

    localStorage.setItem('jawir_username', `@${cleanUser}`);
    
    await push(ref(db, 'chats'), {
      user: `@${cleanUser}`,
      msg: cleanMsg,
      time: Date.now(),
      role: isTryingDev ? 'developer' : 'user'
    });
    setMsg('');
  };

  const handleDelete = async (id: string) => {
    const pass = window.prompt("SISTEM PENGHAPUSAN: Masukkan Password Hapus:");
    if (pass === 'hapusgila') {
      await remove(ref(db, `chats/${id}`));
    } else if (pass !== null) {
      window.alert("Password Salah, Wir!");
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Forum Diskusi</h2>
        <div className="flex items-center gap-1.5 text-[9px] font-bold text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">
          <ShieldCheck size={10} /> ENCRYPTED
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 hide-scrollbar pb-44">
        {messages.length === 0 && <div className="text-center py-20 text-zinc-700 text-xs italic font-bold">Belum ada obrolan, Wir...</div>}
        {messages.map((m) => {
          const isDev = m.role === 'developer';
          return (
            <div key={m.id} className="flex gap-4 group animate-in slide-in-from-bottom-2 duration-500">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${isDev ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-zinc-900 border-white/5 text-zinc-700'}`}>
                {isDev ? <Crown size={18} /> : <User size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <a href={getProfileLink(m.user)} target="_blank" rel="noreferrer" className={`text-[11px] font-black hover:underline flex items-center gap-1 ${isDev ? 'text-shiny' : 'text-blue-400'}`}>
                      {m.user} {isDev && "✓"}
                    </a>
                    <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-tighter">{new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <button onClick={() => m.id && handleDelete(m.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-800 hover:text-red-500 transition-all active:scale-90">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className={`inline-block px-5 py-3 rounded-[24px] text-sm leading-relaxed break-words max-w-full font-medium ${isDev ? 'bg-blue-500/5 text-zinc-200 border border-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.05)]' : 'bg-zinc-900/60 text-zinc-300 border border-white/5'}`}>
                  {m.msg}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input Chat - Pinned At Bottom ala Gemini */}
      <div className="absolute bottom-4 left-0 right-0 z-[70]">
        <div className="bg-[#121212] p-5 rounded-[36px] border border-white/10 shadow-2xl space-y-4 backdrop-blur-3xl">
          <div className="flex items-center gap-2 px-1">
            <span className="text-blue-400 text-xs font-black italic">@</span>
            <input 
              type="text" 
              placeholder="Username Instagram..." 
              value={userInput}
              onChange={(e) => setUserInput(e.target.value.replace(/^@+/, ''))}
              className={`flex-1 bg-transparent text-xs outline-none font-black placeholder:text-zinc-700 tracking-tight ${isAuth && (userInput.toLowerCase().includes('jawirdesign')) ? 'text-blue-400' : 'text-zinc-200'}`}
            />
            {isAuth && (userInput.toLowerCase().includes('jawirdesign')) && <Lock size={12} className="text-blue-400 opacity-50" />}
          </div>
          <div className="flex items-center gap-2 bg-black/40 rounded-[24px] p-2 border border-white/5">
            <textarea 
              placeholder="Apa yang ada di pikiranmu, Wir?" 
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              rows={1}
              className="flex-1 bg-transparent px-3 text-sm text-white outline-none resize-none hide-scrollbar py-3 font-medium"
            />
            <button onClick={handleSend} className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(59,130,246,0.3)]">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumTool;
