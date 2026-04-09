import React from 'react';
import { motion } from 'motion/react';
import { Scale, Trophy, ThumbsUp, ThumbsDown, Target } from 'lucide-react';

interface AnalysisData {
  summary: string;
  comparison: Array<{ aspect: string; winner: string; reason: string }>;
  scoring: {
    modelA: { score: number; pros: string[]; cons: string[] };
    modelB: { score: number; pros: string[]; cons: string[] };
  };
  finalVerdict: string;
}

interface JudgePanelProps {
  data: AnalysisData | null;
  isLoading: boolean;
  modelAName: string;
  modelBName: string;
}

export const JudgePanel: React.FC<JudgePanelProps> = ({ data, isLoading, modelAName, modelBName }) => {
  if (isLoading) {
    return (
      <div className="w-full glass-card rounded-3xl p-8 mt-8">
        <div className="flex items-center gap-4 mb-8">
          <Scale className="w-8 h-8 text-amber-500 dark:text-amber-400 animate-pulse" />
          <h2 className="text-2xl font-bold text-text-primary">AI Judge is analyzing...</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-48 bg-bg-primary/50 dark:bg-white/5 rounded-2xl animate-pulse" />
          <div className="h-48 bg-bg-primary/50 dark:bg-white/5 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full glass-card rounded-3xl p-8 mt-8 relative overflow-hidden transition-all duration-300"
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 dark:bg-amber-500/10 blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] -z-10" />

      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-amber-500/10 dark:bg-amber-500/20 rounded-2xl">
          <Scale className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text-primary">AI Verdict</h2>
          <p className="text-text-secondary text-sm opacity-60">Comprehensive Model Comparison</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Summary & Verdict */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-bg-primary/50 dark:bg-white/5 rounded-2xl p-6 border border-border-main">
            <h3 className="text-amber-700 dark:text-amber-400 font-semibold mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" /> Summary
            </h3>
            <p className="text-text-primary leading-relaxed">{data.summary}</p>
          </div>

          <div className="bg-amber-500/5 dark:bg-amber-500/10 rounded-2xl p-6 border border-amber-300 dark:border-amber-500/20">
            <h3 className="text-amber-700 dark:text-amber-400 font-semibold mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Final Verdict
            </h3>
            <p className="text-text-primary font-bold leading-relaxed">{data.finalVerdict}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.comparison.map((item, idx) => (
              <div key={idx} className="bg-bg-primary/50 dark:bg-white/5 rounded-xl p-4 border border-border-main">
                <span className="text-xs text-text-secondary uppercase tracking-widest font-bold block mb-1 opacity-60">{item.aspect}</span>
                <span className="text-amber-700 dark:text-amber-400 font-bold block mb-2">{item.winner}</span>
                <p className="text-xs text-text-primary leading-tight">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scores */}
        <div className="space-y-6">
          {[
            { name: modelAName, stats: data.scoring.modelA, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/5 dark:bg-blue-500/10" },
            { name: modelBName, stats: data.scoring.modelB, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/5 dark:bg-purple-500/10" }
          ].map((model, idx) => (
            <div key={idx} className={`${model.bg} rounded-2xl p-6 border border-border-main`}>
              <div className="flex justify-between items-center mb-4">
                <h4 className={`font-bold ${model.color}`}>{model.name}</h4>
                <div className="text-2xl font-black text-text-primary">{model.stats.score}/10</div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase mb-2">
                    <ThumbsUp className="w-3 h-3" /> Pros
                  </div>
                  <ul className="space-y-1">
                    {model.stats.pros.map((pro, i) => (
                      <li key={i} className="text-xs text-text-primary flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-500 dark:bg-emerald-400 shrink-0" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-400 uppercase mb-2">
                    <ThumbsDown className="w-3 h-3" /> Cons
                  </div>
                  <ul className="space-y-1">
                    {model.stats.cons.map((con, i) => (
                      <li key={i} className="text-xs text-text-primary flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-rose-500 dark:bg-rose-400 shrink-0" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
