import React from 'react';
import { X, Bot, Lock } from 'lucide-react';

interface DailyBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLiteVersion?: boolean; // 新增属性
}

export const DailyBriefingModal: React.FC<DailyBriefingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4">
      <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white border border-white/60 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center text-slate-400">
            <div className="bg-slate-100 p-1.5 rounded-lg mr-3 border border-slate-200">
                 <Bot size={20} />
            </div>
            <h3 className="font-bold tracking-wide text-slate-800">AI 每日简报</h3>
            <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-600">PRO</span>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Marketing Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-white/50 text-center">
            <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-slate-100 p-6 shadow-inner">
                    <Lock size={48} className="text-slate-300" />
                </div>
            </div>
            
            <h4 className="mb-2 text-lg font-bold text-slate-800">该功能仅在 Pro 版可用</h4>
            <p className="mb-6 text-sm text-slate-500 leading-relaxed">
                开源 Lite 版专注于<b>本地极速体验</b>与<b>隐私安全</b>。<br/>
                如果需要 AI 根据您的任务完成情况自动生成日报、建议和鼓励，请支持商业版。
            </p>

            <div className="rounded-xl bg-slate-50 p-4 text-left border border-slate-100 mb-6">
                <p className="text-xs font-bold text-slate-400 mb-2 uppercase">Pro 版简报预览：</p>
                <div className="space-y-2 text-sm text-slate-600 font-mono">
                    <p>👋 <span className="text-slate-800 font-bold">ZenBot:</span> 你今天完成了 5 个任务，效率惊人！</p>
                    <p>🎯 <span className="text-slate-800 font-bold">建议:</span> "写项目文档" 已经拖了 2 天，建议明天优先处理。</p>
                </div>
            </div>

            <button
                onClick={() => alert("请查看 README 获取联系方式")}
                className="w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all"
            >
                获取 Pro 版演示
            </button>
        </div>
      </div>
    </div>
  );
};