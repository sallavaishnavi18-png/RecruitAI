import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, FileText, CheckCircle2, AlertTriangle, Cpu, Sparkles, 
  ArrowRight, ShieldCheck, RefreshCw, FileCode, Check 
} from 'lucide-react';
import EvidenceTimeline from '../candidates/EvidenceTimeline';
import SplitInterviewAnalysis from '../interview/SplitInterviewAnalysis';
import ValidationGapsTimeline from '../validation/ValidationGapsTimeline';

const UPLOAD_PIPELINE_STEPS = [
  { id: "read", label: "READING NOTES", desc: "Tokenizing verbatim interview notes & audio transcript..." },
  { id: "extract", label: "EXTRACTING EVIDENCE", desc: "Corroborating AWS, Python, and microservice entity statements..." },
  { id: "map", label: "MAPPING REQUIREMENTS", desc: "Correlating claims against Senior Software Engineer requirements..." },
  { id: "gaps", label: "IDENTIFYING GAPS", desc: "Flagging container orchestration & cache invalidation ambiguities..." }
];

export default function EvidenceDossierView({ candidate, onOpenSlidePanel, onProceedToReports }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState('graph'); // 'graph', 'timeline', 'gaps'

  const handleFileUpload = (fileName, fileSize = "24.6 KB") => {
    setIsProcessing(true);
    setStepIndex(0);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current < UPLOAD_PIPELINE_STEPS.length) {
        setStepIndex(current);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsProcessing(false);
          setUploadedFile({
            name: fileName || "Rahul_Sharma_Technical_Screening.pdf",
            size: fileSize,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        }, 350);
      }
    }, 420);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files && files[0]) {
      handleFileUpload(files[0].name, `${Math.round(files[0].size / 1024)} KB`);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target?.files;
    if (files && files[0]) {
      handleFileUpload(files[0].name, `${Math.round(files[0].size / 1024)} KB`);
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto py-8 px-4 select-none">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 mb-8 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
              EVIDENCE CORROBORATION DOSSIER
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold font-mono text-white tracking-tight">
            MEETING NOTES & EVIDENCE ANALYSIS
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Candidate: <strong className="text-slate-200">{candidate?.name || "Rahul Sharma"}</strong> • Role: <strong className="text-slate-200">{candidate?.jobTitle || "Senior Software Engineer"}</strong>
          </p>
        </div>

        {uploadedFile && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>{uploadedFile.name}</span>
              <span className="text-slate-500">({uploadedFile.size})</span>
            </div>

            <button
              onClick={() => setUploadedFile(null)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Upload New</span>
            </button>
          </div>
        )}
      </div>

      {/* STATE 1: Clean Empty State (Before Notes are Uploaded) */}
      {!uploadedFile && !isProcessing && (
        <div className="space-y-8">
          <div className="glass-panel-glow rounded-3xl p-8 md:p-14 border border-white/10 text-center max-w-3xl mx-auto shadow-[0_10px_50px_rgba(0,0,0,0.6)]">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600/20 to-indigo-600/20 border border-cyan-400/40 flex items-center justify-center mx-auto mb-5 shadow-[0_0_25px_rgba(6,182,212,0.25)]">
              <UploadCloud className="w-8 h-8 text-cyan-400" />
            </div>

            <h3 className="text-xl md:text-2xl font-bold font-mono text-white mb-2">
              No meeting notes uploaded yet.
            </h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed mb-8">
              Upload meeting notes to begin evidence analysis. RecruitAI will extract verified claims and map them directly against candidate requirements.
            </p>

            {/* Dropzone Container */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="relative p-8 rounded-2xl border-2 border-dashed border-cyan-500/30 hover:border-cyan-400/70 bg-black/40 hover:bg-cyan-950/20 transition-all cursor-pointer group mb-6"
            >
              <input
                type="file"
                accept=".txt,.pdf,.docx"
                onChange={handleFileInput}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider mb-1 group-hover:text-cyan-200">
                  Click to Browse or Drag & Drop Notes
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  Accepts .txt, .pdf, or .docx transcripts (max 25MB)
                </span>
              </div>
            </div>

            {/* Quick Demo Pre-Fill Button */}
            <div className="flex items-center justify-center gap-3">
              <span className="text-xs font-mono text-slate-500">Demo Fast-Track:</span>
              <button
                type="button"
                onClick={() => handleFileUpload("Rahul_Sharma_Technical_Screening.pdf", "18.4 KB")}
                className="px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-200 text-xs font-mono font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.15)]"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Load Sample Notes: Rahul_Sharma_Screening.pdf</span>
              </button>
            </div>
          </div>

          <div className="text-center text-xs font-mono text-slate-500 flex items-center justify-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-500/60" />
            <span>Verifiable audit trail generated only upon documentary upload</span>
          </div>
        </div>
      )}

      {/* STATE 2: AI Processing Animation (After Upload) */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="glass-panel-glow rounded-3xl p-10 md:p-14 border border-cyan-400/40 text-center max-w-2xl mx-auto my-6 relative overflow-hidden"
          >
            <div className="w-16 h-16 rounded-full bg-cyan-950/80 border-2 border-cyan-400/60 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(6,182,212,0.6)] animate-soft-pulse">
              <Cpu className="w-8 h-8 text-cyan-300 animate-spin" style={{ animationDuration: '4s' }} />
            </div>

            <div className="flex items-center justify-center gap-2 md:gap-3 mb-6 flex-wrap">
              {UPLOAD_PIPELINE_STEPS.map((step, idx) => {
                const isPassed = idx < stepIndex;
                const isCurrent = idx === stepIndex;

                return (
                  <div key={step.id} className="flex items-center gap-2">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all ${
                        isCurrent
                          ? 'bg-cyan-500 text-slate-950 border border-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.7)] scale-105'
                          : isPassed
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                          : 'bg-white/5 text-slate-500 border border-white/10'
                      }`}
                    >
                      {step.label}
                    </div>
                    {idx < UPLOAD_PIPELINE_STEPS.length - 1 && (
                      <span className="text-slate-600 text-xs">→</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="h-8 text-sm font-mono text-cyan-200">
              {UPLOAD_PIPELINE_STEPS[stepIndex]?.desc}
            </div>

            {/* Laser Progress Bar */}
            <div className="w-64 h-[2px] bg-slate-800 rounded-full mx-auto mt-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300"
                style={{ width: `${((stepIndex + 1) / UPLOAD_PIPELINE_STEPS.length) * 100}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STATE 3: Revealed AI Analysis (Only After Upload is Completed) */}
      {uploadedFile && !isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {/* Sub-view switcher tabs */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSubTab('graph')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                  activeSubTab === 'graph'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                Sentence Corroboration Graph
              </button>
              <button
                onClick={() => setActiveSubTab('timeline')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                  activeSubTab === 'timeline'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                Corroborated Evidence Timeline
              </button>
              <button
                onClick={() => setActiveSubTab('gaps')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                  activeSubTab === 'gaps'
                    ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                Validation Gaps ({candidate?.validationGaps?.length || 3})
              </button>
            </div>

            <button
              onClick={onProceedToReports}
              className="hidden sm:flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-200 underline underline-offset-4 cursor-pointer"
            >
              <span>Review Full Evidence Dossier Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sub Tab View 1: Sentence Corroboration Graph */}
          {activeSubTab === 'graph' && (
            <SplitInterviewAnalysis
              candidate={candidate}
              onProceedToGaps={() => setActiveSubTab('gaps')}
            />
          )}

          {/* Sub Tab View 2: Evidence Timeline */}
          {activeSubTab === 'timeline' && (
            <div className="space-y-6">
              <EvidenceTimeline onSelectStage={onOpenSlidePanel} />

              <div className="p-6 rounded-2xl glass-panel border border-white/10 text-xs font-mono">
                <span className="text-cyan-400 uppercase tracking-wider block mb-2 font-semibold">
                  Extracted Note Excerpt Linked to Portfolio
                </span>
                <p className="text-slate-200 font-sans text-sm italic leading-relaxed">
                  "Candidate described rewriting the core trade queue microservice using FastAPI and async SQLAlchemy. Confirmed handling of 2,500 RPS without connection pool exhaustion."
                </p>
              </div>
            </div>
          )}

          {/* Sub Tab View 3: Validation Gaps */}
          {activeSubTab === 'gaps' && (
            <ValidationGapsTimeline
              candidate={candidate}
              onOpenSlidePanel={onOpenSlidePanel}
              onProceedToReport={onProceedToReports}
            />
          )}
        </motion.div>
      )}
    </section>
  );
}
