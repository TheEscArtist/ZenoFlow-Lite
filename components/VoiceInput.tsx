import React from 'react';
import { Mic, Lock } from 'lucide-react';

interface VoiceInputProps {
  onClick: () => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 focus:outline-none md:bottom-10 md:right-10 border border-white/50 backdrop-blur-md bg-white/80 text-slate-400 hover:bg-slate-900 hover:text-white hover:shadow-[0_15px_35px_rgba(30,41,59,0.3)] hover:-translate-y-1 group"
      title="语音控制 (Pro功能)"
    >
      <div className="relative">
        <Mic size={28} className="group-hover:opacity-20 transition-opacity" />
        <Lock size={16} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      {/* 这里的 badge 提示用户这是 Pro 功能 */}
      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-sm">
        P
      </span>
    </button>
  );
};