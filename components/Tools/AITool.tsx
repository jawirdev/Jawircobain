
import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Sparkles } from 'lucide-react';
import { getAIResponse } from '../../services/geminiService';

const AITool: React.FC = () => {
  const [history, setHistory] = useState<{ type: 'user' | 'bot', text: string }[]>([
    { type: 'bot', text: 'Halo Wir! Ada yang bisa Jawir bantu hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input.trim();
    setHistory(prev => [...prev, { type: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    const response = await getAIResponse(userMsg);
    setHistory(prev => [...prev, { type: 'bot', text: response }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 hide-scrollbar pb-4">
        {history.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.type === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4285f4] to-[#9b72cb] flex items-center justify-center shrink-0">
                <Bot size={16} className="text-white" />
              </div>
            )}
            <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
              msg.type === 'user' 
                ? 'bg-[#1e1f20] text-white rounded-tr-none' 
                : 'bg-transparent border border-white/5 text-gray-200'
            }`}>
              {msg.text}
            </div>
            {msg.type === 'user' && (
              <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center shrink-0">
                <User size={16} className="text-gray-400" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-4 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <Sparkles size={14} className="text-gray-500" />
            </div>
            <div className="bg-[#1e1f20] h-10 w-24 rounded-full"></div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="mt-auto relative">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Tanya Jawir AI..."
          className="w-full bg-[#1e1f20] rounded-full py-4 pl-6 pr-14 text-sm text-white outline-none border border-white/10 focus:border-[#4285f4]/50 transition-all"
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          className="absolute right-2 top-2 p-2 bg-gradient-to-tr from-[#4285f4] to-[#9b72cb] rounded-full text-white hover:scale-105 transition-transform disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default AITool;
