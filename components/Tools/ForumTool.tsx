
import React, { useState, useEffect, useRef } from 'react';
import { onValue, ref, push, remove, query, limitToLast } from 'firebase/database';
import { db } from '../../services/firebase';
import { ChatMessage } from '../../types';
import { Send, User, Crown, MessageSquare, Trash2, ShieldCheck, Lock } from 'lucide-react';
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
    
    // Verifikasi Akun Developer
    if (isTryingDev && !isAuth) {
      const pass = window.prompt("AKUN DEVELOPER TERDETEKSI. Masukkan Password:");
      if (pass === 'jawirtobat') {
        setIsAuth(true);
        localStorage.setItem('jawir_is_dev', 'true');
      } else {
        alert("Password Salah! Gunakan nama lain, Wir!");
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
    const pass = window.prompt("HAPUS PESAN? Masukkan Password:");
    if (pass === 'hapusgila') {
      await remove(ref(db, `chats/${id}`));
    } else if (pass !== null) {
      alert("Password Salah!");
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h2 className="text-lg font-black text-white uppercase italic tracking-tighter">Public Forum</h2>
        <div className="flex items-center gap-1 text-[9px] font-bold text-[#5DFF8E] bg-[#5DFF8E]/10 px-2 py-0.5 rounded-full border border-[#5DFF8E]/20">
          <ShieldCheck size={10} /> GLOBAL
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 hide-scrollbar pb-40">
        {messages.map((m) => {
          const isDev = m.role === 'developer';
          return (
            <div key={m.id} className="flex gap-3 group animate-in slide-in-from-bottom-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${isDev ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-white/5 border-white/5 text-zinc-600'}`}>
                {isDev ? <Crown size={14} /> : <User size={14} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <a href={getProfileLink(m.user)} target="_blank" rel="noreferrer" className={`text-[11px] font-bold hover:underline ${isDev ? 'text-shiny' : 'text-[#5DFF8E]'}`}>
                      {m.user} {isDev && "✓"}
                    </a>
                    <span className="text-[8px] text-zinc-600 font-bold uppercase">{new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <button onClick={() => m.id && handleDelete(m.id)} className="opacity-0 group-hover:opacity-100 p-1 text-zinc-700 hover:text-red-500 transition-all">
                    <Trash2 size={12} />
                  </button>
                </div>
                <div className={`inline-block px-4 py-2 rounded-2xl text-sm leading-relaxed break-words max-w-full ${isDev ? 'bg-blue-500/5 text-zinc-200 border border-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-[#121212] text-zinc-300 border border-white/5'}`}>
                  {m.msg}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input Chat - Pinned At Bottom (Seperti AI) */}
      <div className="absolute bottom-4 left-0 right-0 z-30">
        <div className="bg-[#121212] p-4 rounded-3xl border border-white/10 shadow-2xl space-y-3 backdrop-blur-2xl">
          <div className="flex items-center gap-2 px-1">
            <span className="text-[#5DFF8E] text-xs font-black italic">@</span>
            <input 
              type="text" 
              placeholder="Username IG" 
              value={userInput}
              onChange={(e) => setUserInput(e.target.value.replace(/^@+/, ''))}
              className={`flex-1 bg-transparent text-xs outline-none font-bold placeholder:text-zinc-700 ${isAuth && (userInput.toLowerCase().includes('jawirdesign')) ? 'text-blue-400' : 'text-[#5DFF8E]'}`}
            />
            {isAuth && (userInput.toLowerCase().includes('jawirdesign')) && <Lock size={10} className="text-blue-400" />}
          </div>
          <div className="flex items-center gap-2 bg-black/40 rounded-2xl p-2 border border-white/5">
            <textarea 
              placeholder="Ketik pesan, Wir..." 
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              rows={1}
              className="flex-1 bg-transparent px-2 text-sm text-white outline-none resize-none hide-scrollbar py-2"
            />
            <button onClick={handleSend} className="w-10 h-10 bg-[#5DFF8E] text-black rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_4px_15px_rgba(93,255,142,0.3)]">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumTool;
