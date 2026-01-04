
import React, { useState, useEffect, useRef } from 'react';
import { onValue, ref, push } from 'firebase/database';
import { db } from '../../services/firebase';
import { ChatMessage } from '../../types';
import { Send, User, Crown, ExternalLink } from 'lucide-react';
import { BLOCKLIST } from '../../constants';

interface ForumToolProps {
  onToxic: () => void;
}

const ForumTool: React.FC<ForumToolProps> = ({ onToxic }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [user, setUser] = useState(localStorage.getItem('jawir_username') || '');
  const [msg, setMsg] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chatRef = ref(db, 'chats');
    const unsubscribe = onValue(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const msgList: ChatMessage[] = Object.keys(data)
          .map(key => ({
            id: key,
            ...data[key]
          }))
          // FILTER CHAT TOXIC LAMA AGAR TIDAK MUNCUL
          .filter(m => !isToxic(m.msg) && !isToxic(m.user))
          .sort((a, b) => a.time - b.time);
        setMessages(msgList);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function isToxic(text: string) {
    if (!text) return false;
    const lower = text.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''); // Super strict normalization
    return BLOCKLIST.some(word => lower.includes(word.toLowerCase()));
  };

  const handleSend = async () => {
    const cleanUser = user.trim().toLowerCase();
    const cleanMsg = msg.trim();

    if (!cleanUser || !cleanMsg) return;
    
    // SUPER STRICT ANTI-TOXIC CHECK
    if (isToxic(cleanMsg) || isToxic(cleanUser)) {
      onToxic();
      return;
    }

    // LOGIKA PASSWORD DEVELOPER
    if (cleanUser === 'jawirdesigner' || cleanUser === 'jawirdesign') {
      const storedPass = localStorage.getItem('jawir_pass');
      if (storedPass !== 'jawirgila') {
        const pass = prompt("Masukkan Password Developer:");
        if (pass !== 'jawirgila') {
          alert("Akses Ditolak! Gunakan username lain.");
          return;
        }
        localStorage.setItem('jawir_pass', 'jawirgila');
      }
    }

    localStorage.setItem('jawir_username', user);
    
    await push(ref(db, 'chats'), {
      user: user.startsWith('@') ? user : `@${user}`,
      msg: cleanMsg,
      time: Date.now(),
      role: (cleanUser === 'jawirdesigner' || cleanUser === 'jawirdesign') ? 'developer' : 'user'
    });
    
    setMsg('');
  };

  const getProfileLink = (username: string) => {
    const name = username.replace('@', '').toLowerCase();
    if (name === 'jawirdesigner' || name === 'jawirdesign') {
      return 'https://lynk.id/jawirdesigner';
    }
    return `https://instagram.com/${name}`;
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 hide-scrollbar">
        {messages.map((m, i) => {
          const isDev = m.role === 'developer';
          const profileUrl = getProfileLink(m.user);
          
          return (
            <div key={m.id} className="flex gap-3 group animate-in slide-in-from-bottom-2">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${isDev ? 'border-[#4285f4] bg-[#4285f4]/10' : 'border-[#5DFF8E]/20 bg-[#1e1f20]'}`}>
                {isDev ? <Crown size={14} className="text-[#4285f4]" /> : <User size={14} className="text-gray-400" />}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <a 
                    href={profileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`text-xs flex items-center gap-1 hover:underline ${isDev ? 'text-shiny' : 'text-[#5DFF8E] font-semibold'}`}
                  >
                    {m.user}
                    <ExternalLink size={10} className="opacity-50" />
                  </a>
                  <span className="text-[10px] text-gray-500">
                    {new Date(m.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{m.msg}</p>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      <div className="bg-[#121212] rounded-3xl p-3 border border-[#5DFF8E]/10 space-y-2">
        <input 
          type="text" 
          placeholder="Username IG"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="w-full bg-transparent px-3 text-xs text-[#5DFF8E] outline-none font-bold"
        />
        <div className="flex items-end gap-2 px-1">
          <textarea 
            placeholder="Tulis pesan..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            rows={1}
            className="flex-1 bg-transparent px-2 py-1 text-sm text-white outline-none resize-none hide-scrollbar"
          />
          <button 
            onClick={handleSend}
            className="p-2 bg-[#5DFF8E] text-black rounded-full hover:scale-105 transition-transform shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForumTool;
