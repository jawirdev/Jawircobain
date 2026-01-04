
import React, { useState } from 'react';

const GridTool: React.FC = () => {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(1);
  const baseW = 1080;
  const baseH = 1350;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-xl font-semibold text-white">Instagram Grid Calc</h2>
        <p className="text-xs text-gray-400">Hitung resolusi feed Instagram Carousel secara akurat.</p>
      </header>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Kolom (Horizontal)</label>
          <input 
            type="number" 
            value={cols}
            onChange={(e) => setCols(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full bg-[#1e1f20] border border-white/5 rounded-2xl p-4 text-center text-white text-xl font-bold focus:border-[#4285f4] outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Baris (Vertikal)</label>
          <input 
            type="number" 
            value={rows}
            onChange={(e) => setRows(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full bg-[#1e1f20] border border-white/5 rounded-2xl p-4 text-center text-white text-xl font-bold focus:border-[#4285f4] outline-none"
          />
        </div>
      </div>

      <div className="bg-[#1e1f20] p-8 rounded-3xl border border-white/5 text-center">
        <p className="text-[10px] uppercase tracking-widest text-[#4285f4] font-bold mb-2">Resolusi Akhir Canvas</p>
        <div className="text-4xl font-bold text-white tracking-tighter">
          {cols * baseW} <span className="text-gray-600 text-2xl font-light">×</span> {rows * baseH}
        </div>
        <p className="text-sm text-gray-500 mt-2">Pixels (Portrait Aspect 4:5)</p>
      </div>

      <div className="p-4 bg-[#4285f4]/5 rounded-2xl border border-[#4285f4]/10">
        <p className="text-xs text-gray-400 italic">
          Tips: Gunakan ukuran ini pada software desain seperti Adobe Illustrator atau Photoshop untuk membuat feed menyambung.
        </p>
      </div>
    </div>
  );
};

export default GridTool;
