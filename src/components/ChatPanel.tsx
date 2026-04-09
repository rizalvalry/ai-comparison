import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Loader2, CheckCircle2, AlertCircle, Send, ChevronDown, Clock } from 'lucide-react';
import { MODELS } from '../lib/gemini';

interface ChatPanelProps {
  modelId: string;
  modelName: string;
  onModelChange: (model: any) => void;
  prompt: string;
  onPromptChange: (val: string) => void;
  onSend: () => void;
  response: string;
  isLoading: boolean;
  responseTime?: number | null;
  error?: string;
  colorTheme: 'blue' | 'purple';
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ 
  modelId, 
  modelName, 
  onModelChange,
  prompt, 
  onPromptChange, 
  onSend,
  response, 
  isLoading, 
  responseTime,
  error,
  colorTheme
}) => {
  const themeClasses = colorTheme === 'blue' 
    ? 'text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-500/20' 
    : 'text-purple-600 dark:text-purple-400 bg-purple-500/10 dark:bg-purple-500/20';
  const ringClasses = colorTheme === 'blue' ? 'focus:ring-blue-500/50' : 'focus:ring-purple-500/50';

  return (
    <div className="flex flex-col h-[600px] glass-card rounded-2xl overflow-hidden transition-all duration-300">
      {/* Header with Model Selector */}
      <div className="px-6 py-4 bg-bg-secondary/50 dark:bg-white/5 border-b border-border-main flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${themeClasses}`}>
            <Bot className="w-5 h-5" />
          </div>
          <div className="relative">
            <select
              value={modelId}
              onChange={(e) => onModelChange(MODELS.find(m => m.id === e.target.value)!)}
              className="appearance-none bg-transparent border-none pr-8 text-sm font-bold text-text-primary focus:outline-none cursor-pointer hover:opacity-80 transition-all"
            >
              {MODELS.map(m => (
                <option key={m.id} value={m.id} className="bg-bg-secondary dark:bg-slate-900 text-text-primary">{m.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none opacity-40" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {responseTime !== null && responseTime !== undefined && !isLoading && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-md border border-border-main text-[10px] font-mono text-text-secondary">
              <Clock className="w-3 h-3" />
              <span>{(responseTime / 1000).toFixed(2)}s</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            {isLoading && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-4 h-4 text-text-secondary opacity-40" />
              </motion.div>
            )}
            {!isLoading && response && !error && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            {error && <AlertCircle className="w-4 h-4 text-rose-500" />}
          </div>
        </div>
      </div>

      {/* Response Area */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-bg-primary/30 dark:bg-black/20">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="h-4 bg-border-main rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-border-main rounded w-1/2 animate-pulse" />
              <div className="h-4 bg-border-main rounded w-5/6 animate-pulse" />
            </motion.div>
          ) : response ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="prose dark:prose-invert max-w-none"
            >
              <div className="text-text-primary leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                {response}
              </div>
            </motion.div>
          ) : (
            <div key="empty" className="h-full flex flex-col items-center justify-center text-text-secondary/30 space-y-2">
              <Bot className="w-12 h-12 opacity-20" />
              <p className="text-xs uppercase tracking-widest font-mono">Ready for input</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-bg-secondary/50 dark:bg-white/5 border-t border-border-main">
        <div className="relative group">
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder={`Ask ${modelName}...`}
            className={`w-full bg-bg-secondary dark:bg-black/40 border border-border-main rounded-xl px-4 py-3 pr-12 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 ${ringClasses} transition-all resize-none h-24 custom-scrollbar shadow-sm`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                onSend();
              }
            }}
          />
          <button
            onClick={onSend}
            disabled={isLoading || !prompt.trim()}
            className={`absolute bottom-3 right-3 p-2 rounded-lg transition-all ${
              prompt.trim() 
                ? 'bg-bg-primary dark:bg-white/10 text-text-primary hover:bg-border-main dark:hover:bg-white/20' 
                : 'text-text-secondary/20'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
