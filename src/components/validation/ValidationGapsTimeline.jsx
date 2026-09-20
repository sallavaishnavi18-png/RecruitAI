import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ChevronDown, ChevronUp, HelpCircle, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { MOCK_CANDIDATES } from '../../data/mockData';

export default function ValidationGapsTimeline({ candidate = MOCK_CANDIDATES[0], onOpenSlidePanel, onProceedToReport }) {
  const gaps = candidate.validationGaps || [];
  const [expandedGapId, setExpandedGapId] = useState(gaps[0]?.id || "gap-aws");

  return (
    <section className="w-full max-w-5xl mx-auto py-10 px-4 select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold">
              CRITICAL HUMAN CHECKPOINT
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black font-mono tracking-tight text-white">
            ATTENTION NEEDED
          </h2>
        </div>
        <div className="text-xs font-mono text-amber-300 bg-amber-950/40 px-3.5 py-2 rounded-xl border border-amber-500/30 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>{gaps.length} Verification Gaps Require Recruiter Evaluation</span>
        </div>
      </div>

      <p className="text-slate-400 text-sm max-w-2xl mb-8 leading-relaxed">
        RecruitAI flags discrepancies, unverified claims, and gaps in production depth. Recruiters can probe these specific areas during final reviews.
      </p>

      {/* Warning Timeline (NO CARDS!) */}
      <div className="relative pl-6 md:pl-10 space-y-6 before:absolute before:left-3 md:before:left-5 before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-amber-500 before:via-amber-600/40 before:to-transparent">
        {gaps.map((gap, idx) => {
          const isExpanded = expandedGapId === gap.id;

          return (
            <div key={gap.id} className="relative">
              {/* Timeline Amber Node */}
              <div
                className={`absolute -left-6 md:-left-10 top-5 w-4 h-4 rounded-full border-2 transition-all ${
                  isExpanded
                    ? 'bg-amber-400 border-white shadow-[0_0_15px_rgba(245,158,11,0.8)] scale-125'
                    : 'bg-slate-900 border-amber-500/50'
                }`}
              />

              {/* Warning Item Container */}
              <motion.div
                onClick={() => setExpandedGapId(isExpanded ? null : gap.id)}
                whileHover={{ scale: 1.008 }}
                className={`rounded-2xl border p-6 transition-all duration-300 cursor-pointer ${
                  isExpanded
                    ? 'bg-amber-950/20 border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.2)]'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-base md:text-xl font-bold font-mono text-white">
                      {gap.requirement}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/40">
                      {gap.severity}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                      Source: {gap.detectedIn}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-amber-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                <motion.div
                  initial={false}
                  animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                  className="overflow-hidden transition-all duration-300"
                >
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-4 text-sm font-sans">
                    <p className="text-slate-200 leading-relaxed">
                      {gap.issue}
                    </p>

                    {gap.suggestedQuestion && (
                      <div className="p-4 rounded-xl bg-black/40 border border-amber-500/30">
                        <div className="flex items-center gap-1.5 text-xs font-mono text-amber-300 uppercase tracking-wider mb-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                          <span>Recommended Recruiter Follow-Up Probe</span>
                        </div>
                        <p className="text-sm font-medium text-slate-100 italic">
                          "{gap.suggestedQuestion}"
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenSlidePanel(gap);
                        }}
                        className="text-xs font-mono text-cyan-400 hover:text-cyan-200 flex items-center gap-1 underline underline-offset-4 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Inspect in Slide Panel</span>
                      </button>

                      <span className="text-[11px] font-mono text-slate-400">
                        Status: Recruiter Inquiry Pending
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Action to proceed to Final Report */}
      <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>All attention areas documented for human recruiter deliberation</span>
        </div>
        <button
          onClick={onProceedToReport}
          className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 font-mono text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.25)]"
        >
          <span>Generate Final Evidence Report</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
