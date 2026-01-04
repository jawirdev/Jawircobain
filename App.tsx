
import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Sparkles, ChevronRight, AlertCircle
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

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool>(Tool.HOME);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToxicVisible, setIsToxicVisible] = useState(false);

  useEffect(() => {
    logVisitor();
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
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="relative overflow-hidden p-6 rounded-3xl glass-panel border border-[#5DFF8E]/20 group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Sparkles size={120} className="text-[#5DFF8E]" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#5DFF8E] mb-2">Welcome Back Wir</p>
              <h1 className="text-3xl font-bold text-white mb-2 leading-none">Jawir Tools</h1>
              <p className="text-sm text-gray-400 max-w-[200px]">Pusat alat bantu kreatif untuk komunitas Jawir Designer.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {TOOLS_CONFIG.filter(t => t.id !== Tool.HOME).map(t => (
                <button 
                  key={t.id}
                  onClick={() => switchTab(t.id)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#121212] hover:bg-[#1a1a1a] border border-white/5 transition-all text-left group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center transition-colors ${activeTool === t.id ? 'text-[#5DFF8E]' : 'text-gray-500 group-hover:text-[#5DFF8E]'}`}>
                    {t.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white">{t.label}</h3>
                    <p className="text-[10px] text-gray-500">{t.description}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-800 group-hover:text-[#5DFF8E] transition-colors" />
                </button>
              ))}
            </div>
          </div>
        );
      case Tool.FORUM: return <ForumTool onToxic={() => setIsToxicVisible(true)} />;
      case Tool.AI: return <AITool />;
      case Tool.GRID: return <GridTool />;
      case Tool.STATS: return <StatsTool />;
      case Tool.LEADERBOARD: return <LeaderboardTool />;
      default: return <div className="p-8 text-center text-gray-500">Segera hadir, Wir!</div>;
    }
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center p-0 md:p-4">
      <SafetyOverlay isVisible={isToxicVisible} onClose={() => setIsToxicVisible(false)} />
      
      <div className="relative w-full max-w-[480px] h-screen md:h-[850px] bg-black md:rounded-[40px] md:border-[1px] md:border-[#5DFF8E]/10 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="p-6 flex items-center justify-between shrink-0 bg-black/80 backdrop-blur-md z-40 border-b border-[#5DFF8E]/5">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTool(Tool.HOME)}>
            <div className="w-2 h-2 rounded-full bg-[#5DFF8E] animate-pulse"></div>
            <span className="text-sm font-black tracking-tighter text-white uppercase italic">Jawir.tools</span>
          </div>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#5DFF8E]/10 transition-colors"
          >
            {isMenuOpen ? <X size={20} className="text-[#5DFF8E]" /> : <Menu size={20} className="text-white" />}
          </button>
        </header>

        {/* Navigation Sidebar Overlay */}
        <nav className={`absolute inset-0 z-50 bg-black transition-transform duration-500 p-8 pt-24 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-6">Menu Utama</p>
            {TOOLS_CONFIG.map(t => (
              <button
                key={t.id}
                onClick={() => switchTab(t.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  activeTool === t.id ? 'bg-[#5DFF8E]/10 text-[#5DFF8E]' : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {t.icon}
                <span className="font-bold text-lg">{t.label}</span>
              </button>
            ))}
          </div>
          <div className="absolute bottom-12 left-8 right-8">
            <div className="flex items-center gap-3 p-4 bg-[#121212] rounded-2xl border border-[#5DFF8E]/10">
              <AlertCircle size={16} className="text-[#5DFF8E]" />
              <p className="text-[10px] text-gray-400">JAWIR V2.7 - KETAT EDITION</p>
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 pt-4 hide-scrollbar relative">
          {renderTool()}
        </main>

        {/* Bottom Navigation */}
        <footer className="h-20 bg-black/80 backdrop-blur-md border-t border-[#5DFF8E]/5 flex items-center justify-around px-4 shrink-0 z-30">
          {[Tool.HOME, Tool.FORUM, Tool.LEADERBOARD, Tool.STATS].map(toolId => {
            const config = TOOLS_CONFIG.find(t => t.id === toolId);
            return (
              <button
                key={toolId}
                onClick={() => switchTab(toolId)}
                className={`flex flex-col items-center gap-1 transition-all ${
                  activeTool === toolId ? 'text-[#5DFF8E] scale-110' : 'text-gray-700 hover:text-gray-500'
                }`}
              >
                {config?.icon}
                <span className="text-[8px] font-black uppercase tracking-tighter">{config?.label}</span>
              </button>
            );
          })}
        </footer>
      </div>
    </div>
  );
};

export default App;
