import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Users, CheckCircle, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { MOCK_JOBS } from '../../data/mockData';

export default function RoleExplorer({ onSelectJob, selectedJobId }) {
  const [hoveredJobId, setHoveredJobId] = useState(null);

  return (
    <section className="w-full max-w-6xl mx-auto py-12 px-4 select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
              ROLE REPOSITORY
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black font-mono tracking-tight text-white">
            SPATIAL ROLE EXPLORER
          </h2>
        </div>
        <div className="text-xs font-mono text-slate-400 flex items-center gap-2 bg-white/[0.03] px-3.5 py-2 rounded-xl border border-white/10">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span>Showing 4 Active Engineering Pipelines</span>
        </div>
      </div>

      {/* Horizontal Role Explorer Stream (NOT standard cards!) */}
      <div className="space-y-4">
        {MOCK_JOBS.map((job) => {
          const isHovered = hoveredJobId === job.id;
          const isSelected = selectedJobId === job.id;

          return (
            <motion.div
              key={job.id}
              onMouseEnter={() => setHoveredJobId(job.id)}
              onMouseLeave={() => setHoveredJobId(null)}
              onClick={() => onSelectJob && onSelectJob(job)}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className={`relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer p-6 md:p-8 ${
                isSelected
                  ? 'bg-slate-900/90 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.25)]'
                  : isHovered
                  ? 'bg-[#0c1228]/80 border-cyan-500/40 shadow-[0_4px_25px_rgba(0,0,0,0.5)]'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20'
              }`}
            >
              {/* Laser line animation on hover */}
              {isHovered && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-laser pointer-events-none" />
              )}

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Code & Title */}
                <div className="flex items-start md:items-center gap-6">
                  <span className="text-3xl md:text-4xl font-mono font-bold text-slate-400/40 group-hover:text-cyan-400 transition-colors">
                    {job.code}
                  </span>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl md:text-3xl font-bold font-mono tracking-tight text-white">
                        {job.title}
                      </h3>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                        {job.level}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-400">
                      {job.department} • Match Threshold: {job.matchThreshold}
                    </div>
                  </div>
                </div>

                {/* Candidate Stats & Requirements Badges */}
                <div className="flex flex-wrap items-center gap-4 md:gap-8">
                  {/* Candidate Metrics */}
                  <div className="flex items-center gap-6 text-sm font-mono">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-cyan-400" />
                      <span className="text-slate-200 font-semibold">{job.totalCandidates}</span>
                      <span className="text-slate-400 text-xs">candidates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-200 font-semibold">{job.reviewedCandidates}</span>
                      <span className="text-slate-400 text-xs">reviewed</span>
                    </div>
                  </div>

                  {/* Requirements Pills */}
                  <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
                    {job.requirements.slice(0, 4).map((req) => (
                      <span
                        key={req.id}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10"
                      >
                        {req.name}
                      </span>
                    ))}
                    {job.requirements.length > 4 && (
                      <span className="text-[11px] font-mono text-slate-400">
                        +{job.requirements.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Launch Arrow */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                      isHovered || isSelected
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.5)] translate-x-1'
                        : 'border-white/15 text-slate-400'
                    }`}
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Expanding Details on Hover */}
              <motion.div
                initial={false}
                animate={{
                  height: isHovered || isSelected ? 'auto' : 0,
                  opacity: isHovered || isSelected ? 1 : 0
                }}
                className="overflow-hidden transition-all duration-300"
              >
                <div className="mt-4 pt-4 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between text-xs font-mono text-slate-300 gap-4">
                  <p className="max-w-2xl text-slate-400 text-xs">
                    {job.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-400 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Open 3D Intelligence View
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
