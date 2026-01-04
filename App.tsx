
import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Sparkles, AlertCircle, Home,
  MessageSquare, Bot, Trophy, BarChart3, Calendar, QrCode, Grid,
  Instagram, Heart
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
    { text: "Support Jawir Designer!", icon: <Heart size={14} className="text-red-500" /> },
    { text: "Follow IG @jawirdesigner", icon: <Instagram size={14} className="text-pink-500" /> }
  ];

  useEffect(() => {
    logVisitor();
    
    // Logic Floating Promo: Muncul setiap 10 detik, melayang selama 3 detik
    const timer = setInterval(() => {
      setShowPromo(true);
      setPromoIndex((prev) => (prev + 1) % promos.length);
      
      setTimeout(() => {
        setShowPromo(false);
      }, 3000); // Melayang selama 3 detik
    }, 10000); // Muncul setiap 10 detik

    return () => clearInterval(timer);
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
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="relative overflow-hidden p-8 rounded-[40px] glass-panel border border-[#5DFF8E]/20 group">
              <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sparkles size={240} className="text-[#5DFF8E]" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[5px] text-[#5DFF8E] mb-4 text-center">Dashboard Kreatif</p>
              <h1 className="text-4xl font-black text-white mb-2 leading-none tracking-tighter italic text-center">Jawir.Tools</h1>
              <p className="text-sm text-gray-500 leading-relaxed text-center font-medium">Modern, Minimalist, Clean UI. Akses semua fitur premium pilihan Jawir Designer dalam satu dashboard, Wir!</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               {TOOLS_CONFIG.filter(t => t.id !== Tool.HOME).map(t => (
                 <button 
                  key={t.id}
                  onClick={() => switchTab(t.id)}
                  className="flex flex-col items-center justify-center gap-3 p-6 rounded-[32px] bg-[#121212] border border-white/5 hover:border-[#5DFF8E]/30 transition-all group active:scale-95 shadow-xl"
                >
                  <div className="p-4 bg-white/5 rounded-2xl group-hover:text-[#5DFF8E] group-hover:bg-[#5DFF8E]/10 transition-all">
                    {t.icon}
                  </div>
                  <div className="text-center">
                    <span className="block text-sm font-bold text-white mb-1">{t.label}</span>
                    <span className="block text-[9px] text-gray-600 uppercase tracking-tighter">{t.description}</span>
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
      default: return <div className="p-8 text-center text-gray-500 font-bold italic">Fitur segera hadir, Wir!</div>;
    }
  };

  const bottomNavItems = [
    { id: Tool.FORUM, icon: <MessageSquare size={22} />, label: 'Forum' },
    { id: Tool.AI, icon: <Bot size={22} />, label: 'Jawir AI' },
    { id: Tool.HOME, icon: <Home size={28} />, label: 'Home', isSpecial: true },
    { id: Tool.LEADERBOARD, icon: <Trophy size={22} />, label: 'Rank' },
    { id: Tool.STATS, icon: <BarChart3 size={22} />, label: 'Stats' },
  ];

  return (
    <div className="min-h-screen bg-[#000000] flex justify-center items-center p-0 md:p-6 overflow-hidden">
      <SafetyOverlay isVisible={isToxicVisible} onClose={() => setIsToxicVisible(false)} />
      
      {/* Floating Promo */}
      <div className={`fixed bottom-28 right-6 z-[60] transition-all duration-700 transform ${showPromo ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-90 pointer-events-none'}`}>
        <div className="bg-[#121212] border border-[#5DFF8E]/30 px-4 py-2 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(93,255,142,0.2)]">
          {promos[promoIndex].icon}
          <span className="text-[10px] font-black text-[#5DFF8E] uppercase tracking-wider whitespace-nowrap">{promos[promoIndex].text}</span>
        </div>
      </div>

      <div className="relative w-full max-w-[480px] h-screen md:h-[880px] bg-[#000000] md:rounded-[50px] md:border-[1px] md:border-white/10 shadow-2xl flex flex-col overflow-hidden">
        
        <header className="p-6 pb-2 flex items-center justify-between shrink-0 bg-black/60 backdrop-blur-xl z-40">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setActiveTool(Tool.HOME)}>
            <div className="w-2.5 h-2.5 rounded-full bg-[#5DFF8E] animate-pulse"></div>
            <span className="text-base font-black tracking-tighter text-white uppercase italic">Jawir.Tools</span>
          </div>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:bg-white/5"
          >
            {isMenuOpen ? <X size={24} className="text-[#5DFF8E]" /> : <Menu size={24} className="text-white" />}
          </button>
        </header>

        <nav className={`absolute inset-0 z-50 bg-black transition-all duration-500 p-8 pt-24 ${isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}>
          <div className="grid grid-cols-2 gap-4">
            {TOOLS_CONFIG.map(t => (
              <button
                key={t.id}
                onClick={() => switchTab(t.id)}
                className={`flex flex-col items-center gap-3 p-6 rounded-[28px] transition-all ${
                  activeTool === t.id ? 'bg-[#5DFF8E]/10 border-[#5DFF8E]/20 text-[#5DFF8E]' : 'bg-[#121212] border-white/5 text-gray-600 hover:text-white'
                }`}
              >
                {t.icon}
                <span className="font-bold text-xs">{t.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <main className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 overflow-y-auto px-6 py-4 hide-scrollbar">
            {renderTool()}
          </div>
        </main>

        <footer className="h-24 bg-black/80 backdrop-blur-2xl border-t border-white/5 flex items-center justify-around px-2 shrink-0 z-30 relative">
          {bottomNavItems.map((item) => {
            const isActive = activeTool === item.id;
            
            if (item.isSpecial) {
              return (
                <button
                  key={item.id}
                  onClick={() => switchTab(item.id)}
                  className="relative -top-6 flex flex-col items-center group"
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_10px_30px_-5px_rgba(93,255,142,0.4)] ${
                    isActive 
                    ? 'bg-[#5DFF8E] text-black scale-110' 
                    : 'bg-[#1a1a1a] text-white border border-white/10'
                  }`}>
                    {item.icon}
                  </div>
                  <span className={`text-[9px] font-black uppercase mt-2 tracking-tighter ${isActive ? 'text-[#5DFF8E]' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => switchTab(item.id)}
                className={`flex flex-col items-center gap-1.5 transition-all w-16 ${
                  isActive ? 'text-[#5DFF8E]' : 'text-gray-700'
                }`}
              >
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                  {item.icon}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-tighter ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </footer>
      </div>
    </div>
  );
};

export default App;
