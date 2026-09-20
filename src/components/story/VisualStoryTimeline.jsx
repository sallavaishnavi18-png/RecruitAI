import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, FileText, CheckCircle2, GitMerge, MessageSquare, Lightbulb, UserCheck, ChevronRight } from 'lucide-react';

const STORY_STAGES = [
  {
    id: "JOB",
    label: "JOB",
    title: "Define Target Spec",
    desc: "3D role breakdown into structured requirements, weights, and non-negotiables.",
    icon: Briefcase,
    color: "#38bdf8",
    activeText: "Analyzing 6 Role Requirements"
  },
  {
    id: "RESUME",
    label: "RESUME",
    title: "Multi-Modal Parsing",
    desc: "Ingests PDF resumes, repos, and portfolios without keyword-stuffing exploits.",
    icon: FileText,
    color: "#6366f1",
    activeText: "2.8 Yrs Experience Extracted"
  },
  {
    id: "EVIDENCE",
    label: "EVIDENCE",
    title: "Signal Corroboration",
    desc: "Every skill mapped against real code commits, production scale, and project records.",
    icon: CheckCircle2,
    color: "#10b981",
    activeText: "5 Validated • 1 Gap Detected"
  },
  {
    id: "MATCH",
    label: "MATCH",
    title: "Spatial Fit Scoring",
    desc: "Real-time semantic constellation linking candidate artifacts directly to job needs.",
    icon: GitMerge,
    color: "#06b6d4",
    activeText: "92% Evidence Coverage"
  },
  {
    id: "INTERVIEW",
    label: "INTERVIEW",
    title: "Dynamic AI Probes",
    desc: "Synthesizes tailored questions designed specifically to resolve discovered ambiguities.",
    icon: MessageSquare,
    color: "#a855f7",
    activeText: "4 Targeted Probes Generated"
  },
  {
    id: "INSIGHT",
    label: "INSIGHT",
    title: "Real-Time Sentence Mapping",
    desc: "Spoken answers during live interview update the evidence graph second-by-second.",
    icon: Lightbulb,
    color: "#f59e0b",
    activeText: "Transcript Resolves AWS Gap"
  },
  {
    id: "RECRUITER",
    label: "RECRUITER",
    title: "Human Evaluation Authority",
    desc: "Recruiter reviews verified facts. AI provides intelligence; human makes the hire.",
    icon: UserCheck,
    color: "#38bdf8",
    activeText: "Recruiter Signs Off Final Decision"
  }
];

export default function VisualStoryTimeline({ currentStage = "JOB", onSelectStage }) {
  const [activeStageId, setActiveStageId] = useState(currentStage);
  const activeStage = STORY_STAGES.find((s) => s.id === activeStageId) || STORY_STAGES[0];

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 select-none">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400 font-semibold bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/30">
          THE RECRUITAI PIPELINE
        </span>
        <h3 className="text-2xl md:text-3xl font-bold font-mono text-white mt-2">
          From Raw Signal to Verified Human Judgment
        </h3>
        <p className="text-slate-400 text-sm max-w-xl mx-auto mt-1">
          Click any stage along the evidence vector to observe how candidate data transforms into structured intelligence.
        </p>
      </div>

      {/* Interactive Horizontal Progression Bar */}
      <div className="relative glass-panel rounded-2xl p-4 md:p-6 border border-white/10 mb-6">
        <div className="flex items-center justify-between overflow-x-auto pb-2 scrollbar-none gap-2">
          {STORY_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isSelected = activeStageId === stage.id;

            return (
              <React.Fragment key={stage.id}>
                <button
                  onClick={() => {
                    setActiveStageId(stage.id);
                    onSelectStage && onSelectStage(stage.id);
                  }}
                  className={`flex flex-col items-center min-w-[85px] md:min-w-[110px] p-2.5 rounded-xl transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-cyan-950/70 border border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-105'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.7)]'
                        : 'bg-white/5 text-slate-400 group-hover:text-white group-hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`mt-2 text-xs font-mono font-bold tracking-wider ${
                      isSelected ? 'text-cyan-300' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {stage.label}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">0{idx + 1}</span>
                </button>

                {/* Animated Connection Arrow between stages */}
                {idx < STORY_STAGES.length - 1 && (
                  <div className="hidden sm:flex items-center text-slate-600 px-1">
                    <ChevronRight className="w-4 h-4 text-cyan-500/40" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Detail Showcase */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="glass-panel-glow rounded-2xl p-6 md:p-8 border border-cyan-500/30 grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
        >
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-500/40">
                STAGE {activeStage.id}
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {activeStage.activeText}
              </span>
            </div>
            <h4 className="text-xl md:text-2xl font-bold font-mono text-white mb-2">
              {activeStage.title}
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              {activeStage.desc}
            </p>
          </div>

          <div className="flex flex-col gap-2 p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-xs">
            <span className="text-slate-400 uppercase text-[10px] tracking-wider">AI Transparency Protocol</span>
            <div className="text-cyan-300 font-semibold">Audit Checkpoint: Active</div>
            <div className="text-slate-400 text-[11px] leading-tight">
              Deterministic evidence verification cross-checks candidate claims against code repositories and verifiable source citations.
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
