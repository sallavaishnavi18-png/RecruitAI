import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Code, GitBranch, MessageSquare, Lightbulb, ChevronRight, CheckCircle2, AlertTriangle } from 'lucide-react';

const TIMELINE_STAGES = [
  {
    id: "RESUME",
    label: "RESUME",
    icon: FileText,
    title: "Resume Work History",
    excerpt: "2.8 years at FinTech scale. Built real-time trade settlement queues and transaction ledger.",
    source: "Parsed PDF",
    requirement: "Python / Concurrency",
    status: "Validated",
    color: "#38bdf8"
  },
  {
    id: "PROJECT",
    label: "PROJECT",
    icon: Code,
    title: "OmniStore Checkout",
    excerpt: "Built an e-commerce platform using React and Node.js. Integrated live order book with Redis websockets.",
    source: "Portfolio Repo",
    requirement: "React / State Management",
    status: "Validated",
    color: "#6366f1"
  },
  {
    id: "GITHUB",
    label: "GITHUB",
    icon: GitBranch,
    title: "1,240 Commits Audited",
    excerpt: "Consistently maintained high unit test coverage (88%) across 18 public and shared repositories.",
    source: "GitHub API",
    requirement: "Git / CI Practices",
    status: "Validated",
    color: "#10b981"
  },
  {
    id: "INTERVIEW",
    label: "INTERVIEW",
    icon: MessageSquare,
    title: "Screening Audio Clarification",
    excerpt: "Candidate confirmed hands-on provision of EC2 auto-scaling launch templates and load balancers.",
    source: "Interview Transcript",
    requirement: "AWS Infrastructure",
    status: "Validated",
    color: "#a855f7"
  },
  {
    id: "INSIGHT",
    label: "INSIGHT",
    icon: Lightbulb,
    title: "Recruiter Synthesis",
    excerpt: "92% verified role fit. Excellent full-stack fluency. Recruiter probe advised on distributed failover.",
    source: "RecruitAI Core",
    requirement: "System Design",
    status: "Review Required",
    color: "#f59e0b"
  }
];

export default function EvidenceTimeline({ onSelectStage }) {
  return (
    <div className="w-full select-none">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          INTERACTIVE EVIDENCE TIMELINE
        </span>
        <span className="text-[11px] font-mono text-slate-400">
          Click any stage to inspect verified source artifacts
        </span>
      </div>

      <div className="glass-panel rounded-2xl p-4 md:p-6 border border-white/10">
        <div className="flex items-center justify-between overflow-x-auto pb-2 scrollbar-none gap-2">
          {TIMELINE_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isWarning = stage.status.toLowerCase().includes('review') || stage.status.toLowerCase().includes('unclear');

            return (
              <React.Fragment key={stage.id}>
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectStage && onSelectStage(stage)}
                  className="flex flex-col items-center min-w-[100px] md:min-w-[130px] p-3 rounded-xl bg-white/[0.03] hover:bg-cyan-950/40 border border-white/10 hover:border-cyan-400/50 transition-all cursor-pointer group text-left"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-transform group-hover:scale-110 shadow-sm"
                    style={{ backgroundColor: `${stage.color}20`, border: `1px solid ${stage.color}50` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: stage.color }} />
                  </div>

                  <span className="text-xs font-mono font-bold tracking-wider text-slate-100 group-hover:text-cyan-300">
                    {stage.label}
                  </span>

                  <div className="flex items-center gap-1 mt-1">
                    {isWarning ? (
                      <span className="text-[10px] font-mono text-amber-400 flex items-center gap-0.5">
                        <AlertTriangle className="w-2.5 h-2.5" /> Gap
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Valid
                      </span>
                    )}
                  </div>
                </motion.button>

                {idx < TIMELINE_STAGES.length - 1 && (
                  <div className="hidden sm:flex items-center text-slate-600 px-1">
                    <ChevronRight className="w-4 h-4 text-cyan-500/40" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
