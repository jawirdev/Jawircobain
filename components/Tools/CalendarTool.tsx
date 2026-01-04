
import React, { useState, useEffect } from 'react';
import { Calendar, History, Star, Users } from 'lucide-react';

interface WikiEvent {
  text: string;
  year: number;
}

const CalendarTool: React.FC = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [events, setEvents] = useState<WikiEvent[]>([]);
  const [births, setBirths] = useState<WikiEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'events' | 'births'>('events');

  const fetchHistory = async (selectedDate: string) => {
    setLoading(true);
    const [_, month, day] = selectedDate.split('-');
    
    try {
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/all/${month}/${day}`);
      const data = await res.json();
      
      setEvents(data.selected || data.events || []);
      setBirths(data.births || []);
    } catch (err) {
      console.error("Gagal mengambil data Wikipedia", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Otomatis muat data hari ini saat tool dibuka
    fetchHistory(date);
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDate(newDate);
    fetchHistory(newDate);
  };

  const renderCards = (items: WikiEvent[]) => {
    if (items.length === 0) return (
      <div className="py-20 text-center opacity-20">
        <History size={48} className="mx-auto mb-2" />
        <p className="text-xs italic">Data tidak ditemukan, Wir.</p>
      </div>
    );

    return (
      <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-500 pb-10">
        {items.slice(0, 40).map((item, idx) => (
          <div key={idx} className="bg-[#121212] border border-white/5 rounded-[28px] p-6 hover:border-[#5DFF8E]/30 transition-all group shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#5DFF8E]/10 px-4 py-1.5 rounded-full border border-[#5DFF8E]/20">
                <span className="text-[#5DFF8E] text-[10px] font-black italic tracking-widest">TAHUN {item.year}</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-300 font-medium">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="text-center">
        <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
          <History size={28} className="text-amber-500" />
        </div>
        <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Wiki-History</h2>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Sejarah Dunia Hari Ini</p>
      </header>

      <div className="bg-[#121212] p-4 rounded-[32px] border border-white/10 flex items-center gap-3 shadow-inner">
        <Calendar size={18} className="text-[#5DFF8E] ml-2" />
        <input 
          type="date" 
          value={date}
          onChange={handleDateChange}
          className="flex-1 bg-transparent text-white text-sm outline-none font-bold"
        />
      </div>

      <div className="flex gap-2 bg-[#121212] p-1.5 rounded-2xl border border-white/5">
        <button 
          onClick={() => setActiveCategory('events')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeCategory === 'events' ? 'bg-[#5DFF8E] text-black shadow-lg shadow-[#5DFF8E]/20 scale-[1.02]' : 'text-gray-500'}`}
        >
          <Star size={12} /> Peristiwa
        </button>
        <button 
          onClick={() => setActiveCategory('births')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeCategory === 'births' ? 'bg-[#5DFF8E] text-black shadow-lg shadow-[#5DFF8E]/20 scale-[1.02]' : 'text-gray-500'}`}
        >
          <Users size={12} /> Kelahiran
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-8 h-8 border-2 border-[#5DFF8E] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest animate-pulse italic">Menarik Data Wikipedia...</p>
        </div>
      ) : (
        <div className="space-y-4">
           {renderCards(activeCategory === 'events' ? events : births)}
        </div>
      )}
    </div>
  );
};

export default CalendarTool;
