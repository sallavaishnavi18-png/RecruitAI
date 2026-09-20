import React from 'react';
import { Menu, Search, Play, ShieldCheck, Sparkles, Cpu } from 'lucide-react';

export default function Topbar({ onOpenMobileMenu, onOpenSearch, onStartTour, activeTabTitle }) {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#060810]/80 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="text-cyan-400 font-bold hidden sm:inline">RECRUITAI</span>
          <span className="text-slate-600 hidden sm:inline">/</span>
          <span className="text-slate-200 font-semibold uppercase">{activeTabTitle || "SPATIAL INTELLIGENCE"}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Command Search Trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-white/[0.03] hover:bg-cyan-950/40 border border-white/10 hover:border-cyan-400/40 text-xs font-mono text-slate-300 transition-all cursor-pointer group"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="hidden md:inline">Ask RecruitAI...</span>
          <kbd className="hidden md:inline px-1.5 py-0.5 rounded bg-black/40 text-[10px] text-slate-400 border border-white/10">
            ⌘K
          </kbd>
        </button>

        {/* Guided Hackathon Tour Button */}
        <button
          onClick={onStartTour}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 border border-cyan-400/40 text-xs font-mono font-bold text-cyan-300 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
          <span className="hidden sm:inline">GUIDED TOUR</span>
        </button>

        {/* Recruiter Review Required Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Human Evaluator Active</span>
        </div>
      </div>
    </header>
  );
}
