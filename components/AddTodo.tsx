import React, { useState } from 'react';
import { Plus, Terminal } from 'lucide-react';

interface AddTodoProps {
  onAdd: (text: string) => void;
}

export const AddTodo: React.FC<AddTodoProps> = ({ onAdd }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 relative z-20">
      <div className="relative flex items-center group">
        {/* <div className="absolute text-[#1e1e1e] inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
            <Plus size={18} />
        </div> */}
        
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="接下来要做什么？(按回车添加)"
          className="w-full rounded-2xl border border-white/60 bg-white/70 py-4 pl-5 pr-14 text-lg text-slate-800 shadow-lg shadow-slate-200/50 backdrop-blur-md transition-all placeholder:text-slate-400 focus:border-primary-400 focus:bg-white focus:shadow-xl focus:shadow-primary-500/10 focus:outline-none"
          autoFocus
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="absolute right-2 top-2 bottom-2 rounded-xl bg-primary-600 p-2.5 text-white shadow-lg shadow-primary-600/20 transition-all hover:bg-primary-700 hover:scale-105 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
        >
          <Plus size={20} />
        </button>
      </div>
    </form>
  );
};