import React, { useState } from 'react';
import { Todo } from '../types';
import { Check, Trash2, Wand2, GripVertical } from 'lucide-react';
// 删除引用: import { generateSubtasks } from '../services/geminiService';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAddSubTasks: (todoId: string, subtasks: string[]) => void;
  onToggleSubTask: (todoId: string, subTaskId: string) => void;
  isLite?: boolean; // 新增
}

export const TodoItem: React.FC<TodoItemProps> = ({ 
  todo, onToggle, onDelete, onAddSubTasks, onToggleSubTask, isLite 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // dnd-kit logic
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: todo.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, zIndex: isDragging ? 999 : 'auto' };

  // === 改造点：点击魔棒不再调用 AI ===
  const handleAiBreakdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert("🪄 AI 智能拆解任务是 Pro 版功能。\n它可以帮你把大任务自动拆解为 3-5 个可执行步骤。");
  };

  const completedTextClass = todo.completed ? "text-slate-400 line-through decoration-slate-300" : "text-slate-800";
  const containerClass = todo.completed ? "bg-slate-50/50 border-slate-200 opacity-80" : "bg-white/80 border-white/60 shadow-sm hover:border-primary-300 hover:shadow-md hover:shadow-primary-500/5 hover:bg-white";

  return (
    <div ref={setNodeRef} style={style} className={`group mb-3 rounded-2xl border backdrop-blur-md transition-all duration-300 ${containerClass}`}>
      <div className="flex items-center p-4">
        <button {...attributes} {...listeners} className="mr-2 cursor-grab text-slate-300 hover:text-primary-400 active:cursor-grabbing touch-none">
          <GripVertical size={20} />
        </button>
        <button onClick={() => onToggle(todo.id)} className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border transition-all duration-300 focus:outline-none ${todo.completed ? "border-primary-500 bg-primary-500 text-white shadow-md shadow-primary-500/30" : "border-slate-300 bg-slate-50 text-transparent hover:border-primary-400 hover:bg-white"}`}>
          <Check size={14} strokeWidth={3} />
        </button>
        <div className="ml-4 flex-grow cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <span className={`block text-base font-semibold transition-all tracking-tight ${completedTextClass}`}>{todo.text}</span>
          <span className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-1">
            <span>{new Date(todo.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
            {todo.subTasks.length > 0 && <span>• {todo.subTasks.filter(st => st.completed).length}/{todo.subTasks.length} 子任务</span>}
          </span>
        </div>
        <div className="flex items-center space-x-1 opacity-100 transition-opacity sm:space-x-2 md:opacity-0 md:group-hover:opacity-100">
          {!todo.completed && todo.subTasks.length === 0 && (
             <button onClick={handleAiBreakdown} title="AI 智能拆分 (Pro)" className="rounded-lg p-2 text-slate-300 hover:bg-accent-purple/10 hover:text-accent-purple transition-all">
               <Wand2 size={18} />
             </button>
          )}
          <button onClick={() => onDelete(todo.id)} title="删除" className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      {(isExpanded || todo.subTasks.length > 0) && (
        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 border-t border-slate-100 bg-slate-50/50' : 'max-h-0'}`}>
           <div className="p-3 pl-14 pr-4">
              {todo.subTasks.map((st) => (
                <div key={st.id} className="mb-2 flex items-center last:mb-0 group/sub">
                  <button onClick={() => onToggleSubTask(todo.id, st.id)} className={`mr-3 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors ${st.completed ? "border-accent-purple bg-accent-purple text-white" : "border-slate-300 bg-white hover:border-accent-purple"}`}>
                     {st.completed && <Check size={10} />}
                  </button>
                  <span className={`text-sm transition-colors ${st.completed ? "text-slate-400 line-through" : "text-slate-600 group-hover/sub:text-slate-900"}`}>{st.text}</span>
                </div>
              ))}
              {todo.subTasks.length === 0 && (
                 <p className="text-xs italic text-slate-400 font-mono">暂无子任务</p>
              )}
           </div>
        </div>
      )}
    </div>
  );
};