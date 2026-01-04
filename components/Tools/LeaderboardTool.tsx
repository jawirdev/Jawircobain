
import React, { useState, useEffect } from 'react';
import { onValue, ref } from 'firebase/database';
import { db } from '../../services/firebase';
import { Trophy, MessageCircle, ExternalLink } from 'lucide-react';

interface RankData {
  user: string;
  count: number;
  role: string;
}

const LeaderboardTool: React.FC = () => {
  const [ranks, setRanks] = useState<RankData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const chatRef = ref(db, 'chats');
    const unsubscribe = onValue(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const counts: { [key: string]: { count: number, role: string } } = {};
        
        Object.values(data).forEach((m: any) => {
          const userKey = m.user;
          if (!counts[userKey]) {
            counts[userKey] = { count: 0, role: m.role || 'user' };
          }
          counts[userKey].count += 1;
        });

        const sortedRanks = Object.entries(counts)
          .map(([user, info]) => ({
            user,
            count: info.count,
            role: info.role
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        setRanks(sortedRanks);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center p-8 text-gray-500">Menghitung peringkat...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="text-center">
        <Trophy size={40} className="mx-auto text-amber-500 mb-2" />
        <h2 className="text-xl font-bold text-white">Top Chat Global</h2>
        <p className="text-xs text-gray-500 uppercase tracking-widest">Peringkat Jawir Paling Aktif</p>
      </header>

      <div className="space-y-3">
        {ranks.map((r, i) => {
          const isDev = r.role === 'developer';
          const name = r.user.replace('@', '').toLowerCase();
          const profileUrl = (name === 'jawirdesigner' || name === 'jawirdesign') 
            ? 'https://lynk.id/jawirdesigner' 
            : `https://instagram.com/${name}`;

          return (
            <div 
              key={r.user} 
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                i === 0 ? 'bg-amber-500/10 border-amber-500/30' : 
                i === 1 ? 'bg-slate-300/10 border-slate-300/30' :
                i === 2 ? 'bg-orange-600/10 border-orange-600/30' :
                'bg-[#121212] border-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-lg font-black w-6 ${
                  i === 0 ? 'text-amber-500' : 
                  i === 1 ? 'text-slate-300' :
                  i === 2 ? 'text-orange-600' :
                  'text-gray-700'
                }`}>
                  {i + 1}
                </span>
                <div>
                  <a 
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm flex items-center gap-1 font-bold hover:underline ${isDev ? 'text-shiny' : 'text-[#5DFF8E]'}`}
                  >
                    {r.user}
                    <ExternalLink size={10} className="opacity-30" />
                  </a>
                  <p className="text-[10px] text-gray-500 uppercase">{r.role}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-white font-bold">{r.count}</span>
                <span className="text-[8px] text-gray-500 uppercase">Pesan</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaderboardTool;
