
import React, { useState } from 'react';
import { QrCode, Download, Share2, RefreshCcw, CheckCircle2 } from 'lucide-react';

const QRTool: React.FC = () => {
  const [text, setText] = useState('https://jawir.tools');
  const [qrUrl, setQrUrl] = useState(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent('https://jawir.tools')}`);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    if (!text.trim()) return;
    setGenerating(true);
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(text)}`);
    setTimeout(() => setGenerating(false), 800);
  };

  const downloadQR = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jawir-qr-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Gagal mengunduh gambar, Wir!");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="text-center">
        <div className="w-16 h-16 bg-[#5DFF8E]/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-[#5DFF8E]/20">
          <QrCode size={32} className="text-[#5DFF8E]" />
        </div>
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">QR Maker</h2>
        <p className="text-[10px] text-gray-500 uppercase tracking-[4px]">Generate Instan & Safe</p>
      </header>

      <div className="space-y-6">
        <div className="bg-[#121212] p-6 rounded-[32px] border border-white/5 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Konten QR (URL/Teks)</label>
            <input 
              type="text" 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Masukkan link atau teks..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-[#5DFF8E]/40 transition-all placeholder:text-gray-700"
            />
          </div>
          <button 
            onClick={handleGenerate}
            disabled={generating}
            className="w-full bg-[#5DFF8E] text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50"
          >
            {generating ? <RefreshCcw size={20} className="animate-spin" /> : <RefreshCcw size={20} />}
            BUAT KODE QR
          </button>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-[0_20px_60px_-15px_rgba(93,255,142,0.3)] flex flex-col items-center group">
          <div className="relative p-2 bg-white rounded-xl">
             <img 
              src={qrUrl} 
              alt="QR Code" 
              className={`w-64 h-64 transition-all duration-500 ${generating ? 'opacity-20 scale-90' : 'opacity-100 scale-100'}`}
            />
            {generating && <div className="absolute inset-0 flex items-center justify-center text-black font-black text-xs">LOADING...</div>}
          </div>
          
          <div className="flex gap-4 mt-8 w-full max-w-xs">
            <button 
              onClick={downloadQR}
              className="flex-1 bg-black text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
            >
              <Download size={18} />
              UNDUH
            </button>
            <button 
              onClick={() => navigator.share?.({ url: text }).catch(() => alert("Browser tidak mendukung share, Wir!"))}
              className="w-14 bg-zinc-100 text-black font-bold py-4 rounded-2xl flex items-center justify-center hover:bg-zinc-200 transition-colors"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 opacity-40">
           <CheckCircle2 size={12} className="text-[#5DFF8E]" />
           <p className="text-[10px] text-gray-400 italic">QR Code ini siap di-scan selamanya.</p>
        </div>
      </div>
    </div>
  );
};

export default QRTool;
