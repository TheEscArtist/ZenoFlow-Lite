import React, { useState, useEffect } from 'react';
import { Todo, FilterType } from './types';
import { TodoItem } from './components/TodoItem';
import { AddTodo } from './components/AddTodo';
import { LoginScreen } from './components/LoginScreen';
import { DailyBriefingModal } from './components/DailyBriefingModal';
import { VoiceInput } from './components/VoiceInput';
// 删除引用: import { interpretVoiceCommand } from './services/geminiService';
import { Layout, Calendar, CheckCircle2, Circle, Sparkles, LogOut } from 'lucide-react';

import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

// 生成简单的 UUID
function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try { return crypto.randomUUID(); } catch (e) {}
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// === 统一的引流弹窗逻辑 ===
const showProFeatureAlert = (featureName: string) => {
  alert(
    `🔒 [${featureName}] 是 Pro 商业版功能\n\n` +
    `开源版主打：纯本地、零后端、绝对隐私。\n` +
    `商业版包含：AI 智能拆解、语音自然语言控制、多端云同步。\n\n` +
    `👉 请查看 README 联系作者获取商业版演示！`
  );
};

const App: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>(FilterType.ALL);
  const [mounted, setMounted] = useState(false);
  const [showBriefing, setShowBriefing] = useState(false);
  
  // Voice state (仅保留 UI 状态)
  const [isVoiceProcessing, setIsVoiceProcessing] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);

  // === 每日重置逻辑 ===
  const checkDailyReset = (currentUserId: string, currentTodos: Todo[]) => {
    const lastVisitDate = localStorage.getItem(`zen-last-date-${currentUserId}`);
    const today = new Date().toDateString();

    if (lastVisitDate !== today) {
      const newActiveTodos = currentTodos.filter(t => !t.completed);
      if (newActiveTodos.length !== currentTodos.length) {
        setTodos(newActiveTodos);
        setVoiceFeedback("新的一天！已自动清理昨日完成的任务。");
      }
      localStorage.setItem(`zen-last-date-${currentUserId}`, today);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('zen-current-user');
    if (storedUser) setUserId(storedUser);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!userId) return;
    const savedTodos = localStorage.getItem(`zen-todos-${userId}`);
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        setTodos(parsedTodos);
        checkDailyReset(userId, parsedTodos);
      } catch (e) { setTodos([]); }
    } else { setTodos([]); }
  }, [userId]);

  useEffect(() => {
    if (mounted && userId) {
      localStorage.setItem(`zen-todos-${userId}`, JSON.stringify(todos));
    }
  }, [todos, mounted, userId]);

  useEffect(() => {
    if (voiceFeedback) {
      const timer = setTimeout(() => setVoiceFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [voiceFeedback]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleLogin = (id: string) => {
    localStorage.setItem('zen-current-user', id);
    setUserId(id);
  };

  const handleLogout = () => {
    localStorage.removeItem('zen-current-user');
    setUserId('');
    setTodos([]);
  };

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: generateUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
      subTasks: []
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  // 仅保留基础的手动添加子任务逻辑，去掉 AI 生成的入口
  const addSubTasks = (todoId: string, subtasks: string[]) => {
    setTodos(prev => prev.map(todo => {
      if (todo.id !== todoId) return todo;
      const newSubTasks = subtasks.map(text => ({
        id: generateUUID(),
        text,
        completed: false
      }));
      return { ...todo, subTasks: [...todo.subTasks, ...newSubTasks] };
    }));
  };

  const toggleSubTask = (todoId: string, subTaskId: string) => {
    setTodos(prev => prev.map(todo => {
      if (todo.id !== todoId) return todo;
      const updatedSubTasks = todo.subTasks.map(st => 
        st.id === subTaskId ? { ...st, completed: !st.completed } : st
      );
      return { ...todo, subTasks: updatedSubTasks };
    }));
  };

  // === 改造点：语音输入不再处理逻辑，而是弹窗 ===
  const handleVoiceTranscript = (transcript: string) => {
    // 假装处理一下，提升体验感
    setIsVoiceProcessing(true);
    setVoiceFeedback("正在连接语音分析引擎...");
    
    setTimeout(() => {
      setIsVoiceProcessing(false);
      setVoiceFeedback(null);
      showProFeatureAlert("语音自然语言控制");
    }, 800);
  };

const showProFeatureAlert = (featureName: string) => {
  alert(
    `🔒 [${featureName}] 是 Pro 商业版功能\n\n` +
    `Lite 开源版主打纯净交互，无麦克风权限请求。\n\n` +
    `商业版支持：\n` +
    `🎙️ Whisper 模型语音转文字\n` +
    `🧠 自然语言意图识别 (如: "把周五的会挪到下周一")\n\n` +
    `👉 详情请查看 README`
  );
};

  const filteredTodos = todos.filter(todo => {
    if (filter === FilterType.ACTIVE) return !todo.completed;
    if (filter === FilterType.COMPLETED) return todo.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  const today = new Date().toLocaleDateString('zh-CN', {
    weekday: 'long', month: 'long', day: 'numeric'
  });

  if (!mounted) return null;
  if (!userId) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="flex h-screen w-full flex-col text-slate-800 md:flex-row bg-transparent">
      <DailyBriefingModal 
        isOpen={showBriefing} 
        onClose={() => setShowBriefing(false)} 
        // 传入一个标记，告诉 Modal 现在是离线模式
        isLiteVersion={true} 
      />

      <VoiceInput onClick={() => showProFeatureAlert("智能语音控制")} />
      
      {voiceFeedback && (
        <div className="fixed bottom-40 left-1/2 z-50 -translate-x-1/2 rounded-full border border-primary-200 bg-white/90 px-6 py-3 text-sm font-medium text-primary-600 shadow-xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-4 md:bottom-28 font-mono">
          <span className="mr-2 opacity-50">&gt;</span>{voiceFeedback}
        </div>
      )}

      {/* Sidebar - Desktop Light */}
      <aside className="hidden w-64 flex-col border-r border-white/60 bg-white/40 backdrop-blur-xl p-6 md:flex shadow-sm">
        <div className="mb-8 flex items-center space-x-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 shadow-lg shadow-primary-500/20 text-white">
            <Layout size={18} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">潮数 <span className="text-primary-500">Lite</span></h1>
        </div>

        {/* User Info */}
        <div className="mb-6 flex items-center justify-between rounded-xl border border-white/80 bg-white/50 p-3 shadow-sm">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">本地存储</span>
            <span className="text-sm font-medium text-slate-800 truncate max-w-[100px]">{userId}</span>
          </div>
          <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors" title="切换用户">
            <LogOut size={16} />
          </button>
        </div>

        <nav className="flex-1 space-y-1">
            {/* 保持原有的导航按钮不变 */}
           <button onClick={() => setFilter(FilterType.ALL)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${filter === FilterType.ALL ? 'bg-white shadow-sm text-primary-600 border border-slate-100' : 'text-slate-500 hover:bg-white/50 hover:text-slate-800 border border-transparent'}`}>
            <div className="flex items-center"><Calendar size={18} className="mr-3 opacity-70" />全部任务</div>
            <span className={`rounded px-1.5 py-0.5 text-xs font-mono ${filter === FilterType.ALL ? 'bg-primary-50 text-primary-600' : 'bg-slate-100 text-slate-500'}`}>{todos.length}</span>
          </button>
          <button onClick={() => setFilter(FilterType.ACTIVE)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${filter === FilterType.ACTIVE ? 'bg-white shadow-sm text-primary-600 border border-slate-100' : 'text-slate-500 hover:bg-white/50 hover:text-slate-800 border border-transparent'}`}>
            <div className="flex items-center"><Circle size={18} className="mr-3 opacity-70" />进行中</div>
            <span className={`rounded px-1.5 py-0.5 text-xs font-mono ${filter === FilterType.ACTIVE ? 'bg-primary-50 text-primary-600' : 'bg-slate-100 text-slate-500'}`}>{activeCount}</span>
          </button>
          <button onClick={() => setFilter(FilterType.COMPLETED)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${filter === FilterType.COMPLETED ? 'bg-white shadow-sm text-primary-600 border border-slate-100' : 'text-slate-500 hover:bg-white/50 hover:text-slate-800 border border-transparent'}`}>
            <div className="flex items-center"><CheckCircle2 size={18} className="mr-3 opacity-70" />已完成</div>
            <span className={`rounded px-1.5 py-0.5 text-xs font-mono ${filter === FilterType.COMPLETED ? 'bg-primary-50 text-primary-600' : 'bg-slate-100 text-slate-500'}`}>{completedCount}</span>
          </button>
        </nav>

        {/* AI Feature Button - 改造为 Pro 功能提示 */}
        <div className="mb-4">
           <button 
             onClick={() => setShowBriefing(true)}
             className="group flex w-full items-center justify-center space-x-2 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-transparent py-3 text-sm font-semibold text-slate-500 shadow-sm transition-all hover:border-accent-purple/40 hover:text-accent-purple hover:bg-accent-purple/5"
           >
             <Sparkles size={16} className="text-slate-400 group-hover:text-accent-purple transition-colors" />
             <span>AI 每日简报 (Pro)</span>
           </button>
        </div>

        <div className="mt-auto border-t border-slate-200/50 pt-6">
          <div className="rounded-xl border border-white/50 bg-gradient-to-br from-white/80 to-slate-50/80 p-4 shadow-sm backdrop-blur-sm">
            <h3 className="mb-1 text-sm font-semibold text-slate-800">当前版本: Lite</h3>
            <p className="text-xs text-slate-500 opacity-90 leading-relaxed">
              数据存储在您的浏览器本地。<br/>无任何服务器上传。<br/>
              <a href="#" className="underline decoration-dashed hover:text-primary-600">获取商业版支持云同步</a>
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content (保持大部分不变) */}
      <main className="flex flex-1 flex-col overflow-hidden relative">
        <header className="flex flex-shrink-0 items-center justify-between border-b border-white/60 bg-white/30 backdrop-blur-md px-4 py-4 sm:px-8 sm:py-6 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800 sm:text-2xl tracking-tight">控制台</h2>
            <p className="mt-1 text-xs text-slate-500 font-mono uppercase sm:text-sm">{today}</p>
          </div>
          <div className="flex items-center space-x-3 md:hidden">
             <button onClick={() => setShowBriefing(true)} className="rounded-full bg-white p-2 text-slate-400 shadow-sm border border-slate-100 active:bg-slate-50">
                <Sparkles size={20} />
             </button>
             <button onClick={handleLogout} className="rounded-full bg-white p-2 text-slate-500 shadow-sm border border-slate-100 active:bg-slate-50">
                <LogOut size={20} />
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 relative">
          <div className="mx-auto max-w-3xl pb-24 md:pb-0"> 
            <AddTodo onAdd={addTodo} />
            <div className="space-y-1">
              {filteredTodos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center opacity-60 sm:py-20">
                  <div className="mb-4 rounded-full bg-white border border-slate-100 p-6 shadow-sm">
                    <CheckCircle2 size={48} className="text-slate-300" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-600">暂无任务</h3>
                  <p className="text-slate-400 mt-2 font-mono text-sm">
                    {filter === FilterType.COMPLETED ? "> 还没有已完成的任务。" : "> 列表是空的，享受你的自由时间吧！"}
                  </p>
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={filteredTodos.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {filteredTodos.map(todo => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={toggleTodo}
                        onDelete={deleteTodo}
                        onAddSubTasks={addSubTasks}
                        onToggleSubTask={toggleSubTask}
                        // 传入一个标记，告诉组件现在是 Lite 版
                        isLite={true}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Mobile Bottom Nav (UI 不变) */}
      <div className="flex-shrink-0 border-t border-slate-200 bg-white/90 backdrop-blur-xl pb-safe pt-2 md:hidden">
         <div className="flex justify-around pb-2">
            <button onClick={() => setFilter(FilterType.ALL)} className={`flex flex-col items-center p-2 transition-colors ${filter === FilterType.ALL ? 'text-primary-600' : 'text-slate-400'}`}>
              <Layout size={24}/><span className="mt-1 text-[10px] font-medium">全部</span>
            </button>
            <button onClick={() => setFilter(FilterType.ACTIVE)} className={`flex flex-col items-center p-2 transition-colors ${filter === FilterType.ACTIVE ? 'text-primary-600' : 'text-slate-400'}`}>
              <Circle size={24}/><span className="mt-1 text-[10px] font-medium">进行中</span>
            </button>
            <button onClick={() => setFilter(FilterType.COMPLETED)} className={`flex flex-col items-center p-2 transition-colors ${filter === FilterType.COMPLETED ? 'text-primary-600' : 'text-slate-400'}`}>
              <CheckCircle2 size={24}/><span className="mt-1 text-[10px] font-medium">已完成</span>
            </button>
         </div>
      </div>
    </div>
  );
};
export default App;