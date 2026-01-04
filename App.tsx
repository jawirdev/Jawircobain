
import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Sparkles, Home,
  MessageSquare, Bot, Trophy, BarChart3,
  Instagram, Heart, QrCode, Grid, Calendar
} from 'lucide-react';
import { Tool } from './types';
import { TOOLS_CONFIG } from './constants';
import { logVisitor, logFeature } from './services/firebase';
import SafetyOverlay from './components/SafetyOverlay';
import ForumTool from './components/Tools/ForumTool';
import AITool from './components/Tools/AITool';
import GridTool from './components/Tools/GridTool';
import StatsTool from './components/Tools/StatsTool';
import LeaderboardTool from './components/Tools/LeaderboardTool';
import QRTool from './components/Tools/QRTool';
import CalendarTool from './components/Tools/CalendarTool';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool>(Tool.HOME);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToxicVisible, setIsToxicVisible] = useState(false);
  const [promoIndex, setPromoIndex] = useState(0);
  const [showPromo, setShowPromo] = useState(false);

  const promos = [
    { text: "Dukung Jawir Designer!", icon: <Heart size={14} className="text-red-500" /> },
    { text: "Follow IG @jawirdesigner", icon: <Instagram size={14} className="text-blue-400" /> }
  ];

  useEffect(() => {
    logVisitor();
    
    // Sistem Promosi Melayang: Muncul tiap 10 detik selama 3 detik
    const promoTimer = setInterval(() => {
      setShowPromo(true);
      setPromoIndex((prev) => (prev + 1) % promos.length);
      
      setTimeout(() => {
        setShowPromo(false);
      }, 3000); 
    }, 10000);

    return () => clearInterval(promoTimer);
  }, []);

  const switchTab = (id: Tool) => {
    setActiveTool(id);
    setIsMenuOpen(false);
    logFeature(id);
  };

  const renderTool = () => {
    switch(activeTool) {
      case Tool.HOME:
        return (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="relative overflow-hidden p-10 rounded-[48px] glass-panel border border-white/5 group bg-zinc-900/20">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles size={120} className="text-blue-400" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[6px] text-blue-400 mb-4">The Next Generation</p>
              <h1 className="text-5xl font-extrabold text-white mb-4 leading-none tracking-tighter italic">Jawir Tools</h1>
              <p className="text-sm text-zinc-400 leading-relaxed font-medium max-w-[300px]">Modern, Minimalist, Clean. Eksplorasi kreativitas tanpa batas dengan asisten Jawir.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               {TOOLS_CONFIG.filter(t => t.id !== Tool.HOME).map(t => (
                 <button 
                  key={t.id}
                  onClick={() => switchTab(t.id)}
                  className="flex flex-col items-center justify-center gap-4 p-8 rounded-[40px] bg-zinc-900/40 border border-white/5 hover:border-blue-500/30 transition-all hover:bg-zinc-900/60 active:scale-95 group"
                >
                  <div className="p-4 rounded-2xl bg-zinc-800/50 group-hover:text-blue-400 transition-colors">
                    {t.icon}
                  </div>
                  <div className="text-center">
                    <span className="block text-sm font-bold text-white mb-1">{t.label}</span>
                    <span className="block text-[8px] text-zinc-600 uppercase tracking-widest font-bold">{t.description}</span>
                  </div>
                </button>
               ))}
            </div>
          </div>
        );
      case Tool.FORUM: return <ForumTool onToxic={() => setIsToxicVisible(true)} />;
      case Tool.AI: return <AITool />;
      case Tool.GRID: return <GridTool />;
      case Tool.QR: return <QRTool />;
      case Tool.STATS: return <StatsTool />;
      case Tool.LEADERBOARD: return <LeaderboardTool />;
      case Tool.CALENDAR: return <CalendarTool />;
      default: return null;
    }
  };

  const bottomNavItems = [
    { id: Tool.FORUM, icon: <MessageSquare size={22} />, label: 'Chat' },
    { id: Tool.AI, icon: <Bot size={22} />, label: 'AI' },
    { id: Tool.HOME, icon: <Home size={28} />, label: 'Home', isSpecial: true },
    { id: Tool.STATS, icon: <BarChart3 size={22} />, label: 'Stats' },
    { id: Tool.LEADERBOARD, icon: <Trophy size={22} />, label: 'Rank' },
  ];

  return (
    <div className="min-h-screen bg-black flex justify-center items-center p-0 md:p-6 overflow-hidden">
      <SafetyOverlay isVisible={isToxicVisible} onClose={() => setIsToxicVisible(false)} />
      
      {/* Floating Promo Pop-up */}
      <div className={`fixed bottom-28 right-6 z-[100] transition-all duration-1000 transform ${showPromo ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-90 pointer-events-none'}`}>
        <div className="bg-zinc-900 border border-white/10 px-5 py-3 rounded-full flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.8)] border-t-white/20">
          <div className="animate-pulse">{promos[promoIndex].icon}</div>
          <span className="text-[10px] font-extrabold text-white uppercase tracking-widest whitespace-nowrap">{promos[promoIndex].text}</span>
        </div>
      </div>

      <div className="relative w-full max-w-[480px] h-screen md:h-[880px] bg-black md:rounded-[60px] md:border md:border-white/10 shadow-2xl flex flex-col overflow-hidden">
        
        <header className="px-8 pt-8 pb-4 flex items-center justify-between shrink-0 z-50 bg-black/50 backdrop-blur-md">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setActiveTool(Tool.HOME)}>
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            <span className="text-sm font-black tracking-tighter text-white uppercase italic opacity-80 group-hover:opacity-100 transition-opacity">Jawir.Tools</span>
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors">
            {isMenuOpen ? <X size={20} className="text-blue-400" /> : <Menu size={20} className="text-white" />}
          </button>
        </header>

        <nav className={`absolute inset-0 z-[60] bg-black transition-all duration-500 p-10 pt-28 ${isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}>
           <div className="grid grid-cols-2 gap-4">
            {TOOLS_CONFIG.map(t => (
              <button key={t.id} onClick={() => switchTab(t.id)} className={`flex flex-col items-center gap-4 p-8 rounded-[40px] border transition-all ${activeTool === t.id ? 'bg-zinc-900 border-white/20 text-white' : 'bg-transparent border-white/5 text-zinc-500 hover:text-white'}`}>
                {t.icon}
                <span className="font-bold text-xs">{t.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <main className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 overflow-y-auto px-8 py-4 hide-scrollbar">
            {renderTool()}
          </div>
        </main>

        <footer className="h-24 bg-zinc-900/40 backdrop-blur-3xl border-t border-white/5 flex items-center justify-around px-4 shrink-0 z-50">
          {bottomNavItems.map((item) => {
            const isActive = activeTool === item.id;
            if (item.isSpecial) {
              return (
                <button key={item.id} onClick={() => switchTab(item.id)} className="relative -top-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${isActive ? 'bg-blue-500 text-white scale-110' : 'bg-zinc-800 text-zinc-400 border border-white/10'}`}>
                    {item.icon}
                  </div>
                </button>
              );
            }
            return (
              <button key={item.id} onClick={() => switchTab(item.id)} className={`flex flex-col items-center gap-1 transition-all w-12 ${isActive ? 'text-blue-400' : 'text-zinc-600'}`}>
                {item.icon}
                <span className="text-[8px] font-black uppercase tracking-tighter mt-1">{item.label}</span>
              </button>
            );
          })}
        </footer>
      </div>
    </div>
  );
};

export default App;
