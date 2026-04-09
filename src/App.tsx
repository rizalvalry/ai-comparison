import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Sparkles, RefreshCw, Github, Info, Scale, Sun, Moon } from 'lucide-react';
import { MODELS, getModelResponse, getJudgeAnalysis } from './lib/gemini';
import { ChatPanel } from './components/ChatPanel';
import { JudgePanel } from './components/JudgePanel';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [modelA, setModelA] = useState(MODELS[0]);
  const [modelB, setModelB] = useState(MODELS[1]);
  
  const [promptA, setPromptA] = useState('');
  const [promptB, setPromptB] = useState('');
  
  const [responseA, setResponseA] = useState('');
  const [responseB, setResponseB] = useState('');
  
  const [isLoadingA, setIsLoadingA] = useState(false);
  const [isLoadingB, setIsLoadingB] = useState(false);
  
  const [responseTimeA, setResponseTimeA] = useState<number | null>(null);
  const [responseTimeB, setResponseTimeB] = useState<number | null>(null);
  
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleSendA = async () => {
    if (!promptA.trim()) return;
    const startTime = performance.now();
    setIsLoadingA(true);
    setResponseA('');
    setResponseTimeA(null);
    setAnalysis(null);
    const res = await getModelResponse(modelA.id, promptA);
    const endTime = performance.now();
    setResponseA(res);
    setResponseTimeA(endTime - startTime);
    setIsLoadingA(false);
  };

  const handleSendB = async () => {
    if (!promptB.trim()) return;
    const startTime = performance.now();
    setIsLoadingB(true);
    setResponseB('');
    setResponseTimeB(null);
    setAnalysis(null);
    const res = await getModelResponse(modelB.id, promptB);
    const endTime = performance.now();
    setResponseB(res);
    setResponseTimeB(endTime - startTime);
    setIsLoadingB(false);
  };

  const handleCompare = async () => {
    if (!responseA || !responseB) return;
    setIsAnalyzing(true);
    setAnalysis(null);
    const judgeResult = await getJudgeAnalysis(
      `Model A Prompt: ${promptA}\nModel B Prompt: ${promptB}`, 
      responseA, 
      responseB, 
      modelA.name, 
      modelB.name
    );
    setAnalysis(judgeResult);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center px-4 py-8 md:py-12 transition-colors duration-300">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 dark:bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 dark:bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-amber-600/5 dark:bg-amber-600/5 blur-[100px] rounded-full" />
      </div>

      {/* Header */}
      <header className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap className="text-white w-6 h-6 fill-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-text-primary">LLM DUEL</h1>
            <p className="text-text-secondary text-xs font-mono uppercase tracking-[0.2em]">Model Comparison Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-text-secondary text-xs mr-4">
            <Sparkles className="w-3 h-3 text-amber-500 dark:text-amber-400" />
            <span>Powered by Gemini AI</span>
          </div>
          
          <button 
            onClick={toggleTheme}
            className="p-2.5 bg-bg-secondary dark:bg-white/5 hover:bg-border-main dark:hover:bg-white/10 rounded-xl border border-border-main text-text-primary transition-all shadow-sm"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button className="p-2 text-text-secondary/40 dark:text-white/40 hover:text-text-primary dark:hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </button>
          <button className="p-2 text-text-secondary/40 dark:text-white/40 hover:text-text-primary dark:hover:text-white transition-colors">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="w-full max-w-7xl space-y-8">
        {/* Comparison Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChatPanel
            modelId={modelA.id}
            modelName={modelA.name}
            onModelChange={setModelA}
            prompt={promptA}
            onPromptChange={setPromptA}
            onSend={handleSendA}
            response={responseA}
            isLoading={isLoadingA}
            responseTime={responseTimeA}
            colorTheme="blue"
          />
          <ChatPanel
            modelId={modelB.id}
            modelName={modelB.name}
            onModelChange={setModelB}
            prompt={promptB}
            onPromptChange={setPromptB}
            onSend={handleSendB}
            response={responseB}
            isLoading={isLoadingB}
            responseTime={responseTimeB}
            colorTheme="purple"
          />
        </section>

        {/* Compare Button Section */}
        <div className="flex justify-center py-4">
          <button
            onClick={handleCompare}
            disabled={!responseA || !responseB || isAnalyzing}
            className="group relative px-12 py-4 bg-bg-secondary dark:bg-white/5 hover:bg-border-main dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-2xl border border-border-main transition-all overflow-hidden shadow-md"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-3 relative z-10">
              {isAnalyzing ? (
                <RefreshCw className="w-5 h-5 text-amber-500 dark:text-amber-400 animate-spin" />
              ) : (
                <Scale className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              )}
              <span className="text-text-primary font-bold uppercase tracking-widest text-sm">
                {isAnalyzing ? 'Analyzing...' : 'Compare Responses'}
              </span>
            </div>
          </button>
        </div>

        {/* Analysis Section */}
        <AnimatePresence>
          {(isAnalyzing || analysis) && (
            <JudgePanel
              data={analysis}
              isLoading={isAnalyzing}
              modelAName={modelA.name}
              modelBName={modelB.name}
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-20 pb-8 text-text-secondary text-[10px] uppercase tracking-[0.3em] font-mono opacity-40">
        &copy; 2026 LLM Duel &bull; Advanced Comparison Engine
      </footer>
    </div>
  );
}
