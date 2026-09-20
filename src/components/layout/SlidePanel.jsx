import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, HelpCircle, FileCode, ArrowUpRight, Copy, Check } from 'lucide-react';

export default function SlidePanel({ isOpen, onClose, data }) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !data) return null;

  const handleCopyQuestion = (text) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isWarning = data.status?.toLowerCase().includes('unclear') || 
                    data.status?.toLowerCase().includes('needs') || 
                    data.status?.toLowerCase().includes('gap') ||
                    data.severity;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all"
          />

          {/* Sliding Panel */}
          <motion.aside
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative w-full max-w-lg h-full bg-[#080d1e]/95 border-l border-cyan-500/25 shadow-[-10px_0_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto z-10"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                    EVIDENCE INSPECTOR
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title & Status */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold font-mono tracking-tight text-white mb-2">
                  {data.title || data.label || data.name || "EVIDENCE NODE"}
                </h3>
                <div className="flex items-center gap-3 flex-wrap">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border ${
                      isWarning
                        ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {isWarning ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    <span>{data.status || (isWarning ? 'Needs Validation' : 'Validated')}</span>
                  </div>

                  {data.source && (
                    <span className="text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded border border-white/10">
                      Source: {data.source}
                    </span>
                  )}
                  {data.confidence && (
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                      {data.confidence}% confidence
                    </span>
                  )}
                </div>
              </div>

              {/* Detailed Evidence Blocks */}
              <div className="space-y-5">
                {/* Evidence description */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    Extracted Evidence
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed italic">
                    "{data.excerpt || data.description || data.issue || data.details || 'Evidence details logged during automated intake.'}"
                  </p>
                </div>

                {/* Missing Details if Unclear */}
                {(data.missing || isWarning) && (
                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Missing / Attention Required</span>
                    </div>
                    <p className="text-xs text-amber-200/90 leading-relaxed">
                      {data.missing || data.issue || "Production depth or hands-on implementation specifics are unconfirmed in documentary portfolio."}
                    </p>
                  </div>
                )}

                {/* AI Suggested Probe Question */}
                {data.suggestedQuestion && (
                  <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 uppercase tracking-wider">
                        <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                        <span>AI-Recommended Recruiter Probe</span>
                      </div>
                      <button
                        onClick={() => handleCopyQuestion(data.suggestedQuestion)}
                        className="flex items-center gap-1 text-[11px] font-mono text-cyan-300 hover:text-cyan-100 bg-cyan-900/40 hover:bg-cyan-800/60 px-2 py-0.5 rounded border border-cyan-400/30 transition-colors cursor-pointer"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-sm text-slate-100 font-medium leading-relaxed bg-black/40 p-3 rounded-lg border border-cyan-500/20">
                      "{data.suggestedQuestion}"
                    </p>
                  </div>
                )}

                {/* Metadata details */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-slate-400 block mb-0.5">Verification Method</span>
                    <span className="text-slate-200 font-medium">{data.verificationMethod || "Multi-Modal Parsing"}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-slate-400 block mb-0.5">Audit Timestamp</span>
                    <span className="text-slate-200 font-medium">{data.timestamp || "10:44:28 EST"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Recruiter Action Notice */}
            <div className="mt-8 pt-4 border-t border-white/10 flex flex-col gap-3">
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>RECRUITER DECISION CHECKPOINT: AI provides evidence; human verifies.</span>
              </div>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-200 font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
