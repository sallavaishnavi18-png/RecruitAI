import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Briefcase, Users, MessageSquare, FileSearch, FileText, Search, LogOut, ShieldCheck, X, Cpu } from 'lucide-react';

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "jobs", label: "Jobs", icon: Briefcase },
  { id: "candidates", label: "Candidates", icon: Users },
  { id: "interviews", label: "Interviews", icon: MessageSquare },
  { id: "evidence", label: "Evidence", icon: FileSearch },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "search", label: "AI Search", icon: Search, shortcut: "⌘K" }
];

export default function Sidebar({ activeTab, onSelectTab, isMobileOpen, onCloseMobile, user, onLogout }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-[#070a16]/95 border-r border-white/10 z-40 flex flex-col justify-between backdrop-blur-2xl transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div
              onClick={() => {
                onSelectTab("dashboard");
                if (onCloseMobile) onCloseMobile();
              }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1.5px] shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <div className="w-full h-full rounded-xl bg-[#060810] flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-cyan-400 group-hover:rotate-45 transition-transform" />
                </div>
              </div>
              <div>
                <span className="font-mono font-black text-lg tracking-wider text-white">
                  RECRUIT<span className="text-cyan-400">AI</span>
                </span>
                <span className="block text-[9px] font-mono text-slate-400 tracking-widest uppercase">
                  Candidate Intelligence
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Simple Navigation Links */}
          <nav className="p-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs transition-all cursor-pointer group relative ${
                    isActive
                      ? 'bg-cyan-950/60 text-cyan-200 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.2)] font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.shortcut && (
                    <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-1.5 py-0.2 rounded border border-white/5">
                      {item.shortcut}
                    </span>
                  )}

                  {/* Active Indicator Line */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActiveMarker"
                      className="absolute left-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-r-full shadow-[0_0_10px_#38bdf8]"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User & System Bar */}
        <div className="p-4 border-t border-white/10 space-y-3">
          {/* Active User Card */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 to-indigo-600 flex items-center justify-center font-mono font-bold text-xs text-white shrink-0">
                {user?.name?.[0] || 'R'}
              </div>
              <div className="truncate">
                <div className="text-xs font-mono font-semibold text-slate-200 truncate">
                  {user?.name || 'Lead Recruiter'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {user?.company || 'Enterprise AI'}
                </div>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-1">
            <span className="flex items-center gap-1.5 text-cyan-400/80">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Human Evaluator</span>
            </span>
            <span className="text-emerald-400 font-semibold">Ready</span>
          </div>
        </div>
      </aside>
    </>
  );
}
