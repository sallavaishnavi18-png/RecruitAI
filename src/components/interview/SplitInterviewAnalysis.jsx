import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ArrowRight, CheckCircle2, AlertTriangle, Sparkles, Activity, FileText, Check, ChevronRight } from 'lucide-react';
import { MOCK_CANDIDATES } from '../../data/mockData';

export default function SplitInterviewAnalysis({ candidate = MOCK_CANDIDATES[0], onUpdateAuditTrail, onProceedToGaps }) {
  const sentences = candidate.transcriptSentences || [];
  const [selectedSentenceId, setSelectedSentenceId] = useState(sentences[0]?.id || "ts-01");
  const [isVerifying, setIsVerifying] = useState(false);

  const activeSentence = sentences.find((s) => s.id === selectedSentenceId) || sentences[0];

  const handleSelectSentence = (sentence) => {
    setSelectedSentenceId(sentence.id);
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (onUpdateAuditTrail) {
        onUpdateAuditTrail({
          time: new Date().toLocaleTimeString(),
          candidate: candidate.name,
          action: `Transcript Evidence Verified: ${sentence.connectedSkill}`,
          details: `Validated statement: "${sentence.text.slice(0, 60)}..." mapped to ${sentence.mappedNodes.join(' → ')}.`,
          confidence: "94.5%",
          type: "validation"
        });
      }
    }, 400);
  };

  return (
    <section className="w-full max-w-6xl mx-auto py-10 px-4 select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
              REAL-TIME REASONING ENGINE
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black font-mono tracking-tight text-white">
            INTERVIEW INTELLIGENCE
          </h2>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-white/[0.03] px-3.5 py-2 rounded-xl border border-white/10">
          Click any transcript sentence to trigger live spatial graph corroboration
        </div>
      </div>

      {/* Split Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
        {/* LEFT PANE: Interview Transcript Notes */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              VERBATIM INTERVIEW TRANSCRIPT
            </span>
            <span className="text-[11px] font-mono text-cyan-400">
              {sentences.length} Key Segments Indexed
            </span>
          </div>

          <div className="space-y-3">
            {sentences.map((sent) => {
              const isSelected = selectedSentenceId === sent.id;
              const isGap = sent.evidenceResult.includes("GAP");

              return (
                <motion.div
                  key={sent.id}
                  onClick={() => handleSelectSentence(sent)}
                  whileHover={{ scale: 1.01 }}
                  className={`p-4 md:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900/95 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)]'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-300">{sent.speaker}</span>
                      <span className="text-slate-500">[{sent.timestamp}]</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isGap
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {sent.connectedSkill} • {sent.evidenceResult}
                    </span>
                  </div>

                  <p className="text-sm md:text-base font-sans text-slate-100 leading-relaxed">
                    "{sent.text}"
                  </p>

                  {isSelected && (
                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center gap-2 text-[11px] font-mono text-cyan-300">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>Active Evidence Target: Mapped to 3D Neural Vector</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANE: Dynamic Evidence Graph Visualizer */}
        <div className="lg:col-span-6 glass-panel-glow rounded-3xl p-6 md:p-8 border border-cyan-500/30 sticky top-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold">
                DYNAMIC EVIDENCE GRAPH
              </span>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              Live Corroboration
            </span>
          </div>

          {/* Animated Connecting Chain: AWS -> EC2 -> Deployment -> VALIDATED */}
          <div className="mb-8">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-3">
              Synthesized Reasoning Vector
            </span>

            <div className="flex flex-wrap items-center gap-2">
              {activeSentence.mappedNodes.map((nodeName, idx) => (
                <React.Fragment key={nodeName}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 border border-cyan-400/50 text-xs font-mono font-bold text-slate-100 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                  >
                    {nodeName}
                  </motion.div>
                  {idx < activeSentence.mappedNodes.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-cyan-400 animate-pulse" />
                  )}
                </React.Fragment>
              ))}

              <ChevronRight className="w-4 h-4 text-slate-600" />

              {/* Status Outcome Node */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border ${
                  activeSentence.evidenceResult.includes("GAP")
                    ? 'bg-amber-950/80 text-amber-300 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                }`}
              >
                {activeSentence.evidenceResult.includes("GAP") ? (
                  <AlertTriangle className="w-3.5 h-3.5" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                <span>{activeSentence.evidenceResult}</span>
              </motion.div>
            </div>
          </div>

          {/* AI Evidence Annotation Note */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 mb-6">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              AI Verification Note
            </span>
            <p className="text-sm font-sans text-slate-200 leading-relaxed italic">
              "{activeSentence.evidenceNote}"
            </p>
          </div>

          {/* Real-time Requirement Impact */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono mb-6">
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <span className="text-slate-400 block mb-0.5">Target Requirement</span>
              <span className="text-white font-semibold">{activeSentence.connectedSkill}</span>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <span className="text-slate-400 block mb-0.5">Confidence Delta</span>
              <span className="text-cyan-400 font-semibold">+34% Post-Interview</span>
            </div>
          </div>

          <button
            onClick={onProceedToGaps}
            className="w-full py-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-200 font-mono text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          >
            <span>Proceed to Attention Gaps</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
