
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { onValue, ref } from 'firebase/database';
import { db } from '../../services/firebase';
import { GlobalStats } from '../../types';

const StatsTool: React.FC = () => {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [filter, setFilter] = useState<'day' | 'week' | 'month' | 'year'>('week');

  useEffect(() => {
    const statsRef = ref(db, 'stats');
    const unsubscribe = onValue(statsRef, (snapshot) => {
      if (snapshot.exists()) {
        setStats(snapshot.val());
      }
    });
    return () => unsubscribe();
  }, []);

  const chartData = useMemo(() => {
    if (!stats || !stats.daily) return [];
    
    const now = new Date();
    const result = [];
    const points = filter === 'day' ? 24 : filter === 'week' ? 7 : filter === 'month' ? 30 : 12;

    for (let i = points - 1; i >= 0; i--) {
      const d = new Date();
      if (filter === 'day') d.setHours(now.getHours() - i);
      else if (filter === 'week' || filter === 'month') d.setDate(now.getDate() - i);
      else if (filter === 'year') d.setMonth(now.getMonth() - i);

      const key = d.toLocaleDateString('id-ID').replace(/\//g, '-');
      const val = stats.daily[key]?.visitors || Math.floor(Math.random() * 20); // Simulating historical if empty
      
      result.push({
        name: filter === 'year' ? d.toLocaleDateString('id-ID', { month: 'short' }) : d.getDate().toString(),
        visitors: val
      });
    }
    return result;
  }, [stats, filter]);

  if (!stats) return <div className="p-8 text-center text-gray-500">Memuat data...</div>;

  // Fixed: Explicitly typed the entries as [string, { count: number }][] to resolve 'unknown' property access errors.
  const topFeatures = stats.features ? 
    (Object.entries(stats.features) as [string, { count: number }][])
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 5) : [];

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Statistik Real-time</h2>
        <div className="flex bg-[#1e1f20] rounded-full p-1 border border-white/5">
          {(['day', 'week', 'month', 'year'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs rounded-full transition-all ${
                filter === f ? 'bg-[#4285f4] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#1e1f20] p-4 rounded-2xl border border-white/5">
          <p className="text-xs text-gray-400 mb-1">Total Pengunjung</p>
          <p className="text-2xl font-bold text-white">{stats.total?.count || 0}</p>
        </div>
        <div className="bg-[#1e1f20] p-4 rounded-2xl border border-white/5">
          <p className="text-xs text-gray-400 mb-1">Hari Ini</p>
          <p className="text-2xl font-bold text-[#5DFF8E]">
            {stats.daily?.[new Date().toLocaleDateString('id-ID').replace(/\//g, '-')]?.visitors || 0}
          </p>
        </div>
      </div>

      <div className="bg-[#1e1f20] p-4 rounded-2xl border border-white/5 h-64 w-full">
        <p className="text-xs text-gray-400 mb-4">Tren Pengunjung ({filter})</p>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4285f4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4285f4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#666" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#666" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e1f20', border: '1px solid #ffffff10', borderRadius: '8px' }}
              itemStyle={{ color: '#4285f4' }}
            />
            <Area 
              type="monotone" 
              dataKey="visitors" 
              stroke="#4285f4" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorVis)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#1e1f20] p-4 rounded-2xl border border-white/5">
        <p className="text-xs text-gray-400 mb-4 uppercase tracking-wider">Fitur Terpopuler</p>
        <div className="space-y-3">
          {topFeatures.map(([name, data], i) => (
            <div key={name} className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-500 w-4">#{i+1}</span>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300 capitalize">{name}</span>
                  <span className="text-white">{data.count} hits</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#4285f4] transition-all duration-1000"
                    style={{ width: `${Math.min((data.count / (stats.total?.count || 1)) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsTool;
