import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles, Check, Play, ShieldCheck } from 'lucide-react';
import { TOUR_STEPS } from '../../data/mockData';

export default function HackathonTourOverlay({ currentStepIndex, onStepChange, onClose }) {
  const currentTour = TOUR_STEPS[currentStepIndex] || TOUR_STEPS[0];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === TOUR_STEPS.length - 1;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 select-none">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        className="glass-panel-active rounded-3xl p-6 border border-cyan-400/50 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold">
              HACKATHON DEMO WALKTHROUGH
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
              {currentTour.step} / {TOUR_STEPS.length}
            </span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <h4 className="text-base font-bold font-mono text-white mb-1.5 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{currentTour.title}</span>
          </h4>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {currentTour.desc}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full mb-5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300 rounded-full"
            style={{ width: `${((currentStepIndex + 1) / TOUR_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => onStepChange(Math.max(0, currentStepIndex - 1))}
            disabled={isFirst}
            className={`px-3 py-2 rounded-xl text-xs font-mono flex items-center gap-1 border transition-colors ${
              isFirst
                ? 'opacity-30 border-white/5 text-slate-500 cursor-not-allowed'
                : 'border-white/10 text-slate-300 hover:bg-white/5 cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => {
              if (isLast) {
                onClose();
              } else {
                onStepChange(currentStepIndex + 1);
              }
            }}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
          >
            <span>{isLast ? "Complete Tour" : "Next Step"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
