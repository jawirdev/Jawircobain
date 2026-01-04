
import React, { useState, useEffect, useRef } from 'react';
import { onValue, ref, push, remove, query, limitToLast } from 'firebase/database';
import { db } from '../../services/firebase';
import { ChatMessage } from '../../types';
import { Send, User, Crown, MessageSquare, Trash2, ShieldCheck, Lock, ExternalLink } from 'lucide-react';
import { BLOCKLIST, superNormalize } from '../../constants';

interface ForumToolProps {
  onToxic: () => void;
}

const ForumTool: React.FC<ForumToolProps> = ({ onToxic }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [user, setUser] = useState(localStorage.getItem('jawir_username') || '');
  const [msg, setMsg] = useState('');
  const [isAuth, setIsAuth] = useState(localStorage.getItem('jawir_is_dev') === 'true');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chatQuery = query(ref(db, 'chats'), limitToLast(1000));
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
    const cleanUser = user.trim().replace(/^@+/, ''); // Hapus @ manual kalau ada
    const cleanMsg = msg.trim();
    if (!cleanUser || !cleanMsg) return;

    // Verifikasi Akun Developer
    const isTryingDev = cleanUser.toLowerCase() === 'jawirdesigner' || cleanUser.toLowerCase() === 'jawirdesign';
    if (isTryingDev && !isAuth) {
      const pass = prompt("DITETAPKAN SEBAGAI DEVELOPER. Masukkan Password:");
      if (pass === 'jawirtobat') {
        setIsAuth(true);
        localStorage.setItem('jawir_is_dev', 'true');
      } else {
        alert("Password Salah! Gunakan username lain, Wir!");
        return;
      }
    }
    
    if (isStrictToxic(cleanMsg) || isStrictToxic(cleanUser)) {
      onToxic();
      return;
    }

    localStorage.setItem('jawir_username', cleanUser);
    
    await push(ref(db, 'chats'), {
      user: `@${cleanUser}`,
      msg: cleanMsg,
      time: Date.now(),
      role: isTryingDev ? 'developer' : 'user'
    });
    setMsg('');
  };

  const handleDelete = async (id: string) => {
    const pass = prompt("HAPUS PESAN? Masukkan Password Hapus:");
    if (pass === 'hapusgila') {
      await remove(ref(db, `chats/${id}`));
    } else if (pass !== null) {
      alert("Password Salah, Wir!");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] md:h-[calc(880px-180px)] relative">
      <div className="flex items-center justify-between mb-4 shrink-0 px-1">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} className="text-[#5DFF8E]" />
          <h2 className="text-lg font-black text-white uppercase italic tracking-tighter">Public Forum</h2>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#5DFF8E]/10 border border-[#5DFF8E]/20 rounded-full">
           <ShieldCheck size={12} className="text-[#5DFF8E]" />
           <span className="text-[9px] font-black text-[#5DFF8E] uppercase tracking-widest">Global Chat</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 hide-scrollbar pb-36">
        {messages.map((m) => {
          const isDev = m.role === 'developer';
          return (
            <div key={m.id} className="flex gap-4 group animate-in slide-in-from-bottom-2 relative">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-transform group-hover:scale-110 ${
                isDev ? 'bg-[#4285f4]/10 border-[#4285f4]/30 text-[#4285f4]' : 'bg-white/5 border-white/10 text-gray-500'
              }`}>
                {isDev ? <Crown size={18} /> : <User size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-1">
                  <div className="flex items-baseline gap-2">
                    <a 
                      href={getProfileLink(m.user)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`text-xs font-bold hover:underline flex items-center gap-1 ${isDev ? 'text-shiny' : 'text-[#5DFF8E]'}`}
                    >
                      {m.user} {isDev && "✓"}
                    </a>
                    <span className="text-[9px] text-gray-600 font-medium">
                      {new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <button 
                    onClick={() => m.id && handleDelete(m.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-700 hover:text-red-500 transition-all active:scale-90"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className={`inline-block px-4 py-2 rounded-2xl text-sm leading-relaxed break-words max-w-full shadow-lg ${
                  isDev ? 'bg-[#4285f4]/5 text-gray-200 border border-[#4285f4]/10' : 'bg-[#121212] text-gray-300 border border-white/5'
                }`}>
                  {m.msg}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input Chat Pinned At Bottom */}
      <div className="absolute bottom-4 left-0 right-0 z-30">
        <div className="bg-[#121212] p-4 rounded-[32px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-3 backdrop-blur-xl mx-1">
          <div className="flex items-center gap-2 px-1">
            <span className="text-[#5DFF8E] text-xs font-black italic">@</span>
            <input 
              type="text" placeholder="Username IG" value={user}
              onChange={(e) => setUser(e.target.value.replace(/^@+/, ''))}
              className={`flex-1 bg-transparent text-xs outline-none font-bold placeholder:text-gray-700 ${isAuth && (user.toLowerCase().includes('jawirdesign')) ? 'text-[#4285f4]' : 'text-[#5DFF8E]'}`}
            />
            {isAuth && (user.toLowerCase().includes('jawirdesign')) && <Lock size={10} className="text-[#4285f4]" />}
          </div>
          <div className="flex items-center gap-2 bg-black/40 rounded-2xl p-2 border border-white/5">
            <textarea 
              placeholder="Apa yang kamu pikirkan, Wir?" value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              rows={1}
              className="flex-1 bg-transparent px-2 text-sm text-white outline-none resize-none hide-scrollbar min-h-[40px] py-2"
            />
            <button 
              onClick={handleSend}
              className="w-10 h-10 bg-[#5DFF8E] text-black rounded-xl flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-[0_4px_15px_rgba(93,255,142,0.3)]"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumTool;
