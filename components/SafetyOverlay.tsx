
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface SafetyOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

const SafetyOverlay: React.FC<SafetyOverlayProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
      <div className="w-24 h-24 mb-6 text-red-500 bg-red-500/10 rounded-full flex items-center justify-center animate-bounce">
        <AlertTriangle size={48} />
      </div>
      <h1 className="text-4xl font-bold text-red-500 mb-4">TOXIC DETECTED!</h1>
      <p className="text-xl text-gray-400 mb-8 max-w-md">
        Jawir Designer tidak mentoleransi kata-kata kasar. Akun kamu dalam pengawasan developer!
      </p>
      <video 
        autoPlay 
        className="max-w-xs rounded-lg border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]"
        onEnded={onClose}
      >
        <source src="https://aliceecdn.vercel.app/file/9738ac300c.mp4" type="video/mp4" />
      </video>
      <button 
        onClick={onClose}
        className="mt-8 px-8 py-3 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition-colors"
      >
        SAYA BERTOBAT
      </button>
    </div>
  );
};

export default SafetyOverlay;
