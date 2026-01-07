import React, { useState } from 'react';
import { Layout, ArrowRight, Cpu } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (userId: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onLogin(input.trim());
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      {/* Light Gradient Background Blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-400/10 rounded-full blur-[80px] -z-10 animate-pulse"></div>

      {/* Glass Panel */}
      <div className="glass-panel p-10 rounded-3xl max-w-md w-full relative group">

        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white border border-slate-100 text-primary-600 shadow-xl shadow-blue-500/10">
            <img src="https://chaoshu-soft.oss-cn-qingdao.aliyuncs.com/Logo/todoListLogo.png" alt="" width="100" />
          </div>

          <h1 className="mb-2 text-4xl font-bold text-slate-800 tracking-tight">ZENO <span className="text-primary-600">AI</span> 待办 </h1>
          <p className="mb-10 text-slate-500 font-medium">
            专注当下，高效规划。<br />
            <span className="text-xs font-mono text-slate-400 mt-2 block">请输入 ID 以同步您的数据</span>
          </p>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative group/input">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="请输入您的名字或 ID..."
                className="w-full rounded-xl border border-slate-200 bg-white/50 py-4 pl-5 pr-14 text-lg text-slate-800 shadow-sm transition-all placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)] focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="absolute right-2 top-2 bottom-2 rounded-lg bg-primary-600 text-white p-2 shadow-lg shadow-primary-600/30 transition-all hover:bg-primary-700 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-primary-600 disabled:hover:scale-100"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="absolute bottom-8 text-xs text-slate-400 font-mono tracking-wider">
        系统状态：Lite 本地模式 | ☁️ 无云端连接 | 🛡️ 隐私已保护
      </div>
    </div>
  );
};