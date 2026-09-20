import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, CheckCircle2, AlertTriangle, Layers, Users, ArrowRight } from 'lucide-react';
import JobRequirements3D from '../three/JobRequirements3D';
import { MOCK_CANDIDATES } from '../../data/mockData';

export default function JobIntelligenceView({ job, onBack, onSelectCandidate, onOpenSlidePanel }) {
  if (!job) return null;

  const relevantCandidates = MOCK_CANDIDATES.filter(c => c.jobId === job.id || job.id === "job-01");

  return (
    <section className="w-full max-w-6xl mx-auto py-10 px-4 select-none">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>BACK TO ROLE REPOSITORY</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SPEC MAPPING: {job.code} // {job.title}</span>
        </div>
      </div>

      {/* 3D Requirements Constellation Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider">
            <span>{job.department}</span>
            <span>•</span>
            <span>Level {job.level}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-mono tracking-tight text-white">
            {job.title}
          </h1>
          <p className="text-sm text-slate-300 font-sans leading-relaxed">
            {job.description}
          </p>

          <div className="pt-2 flex flex-wrap gap-2">
            {job.requirements.map((req) => (
              <button
                key={req.id}
                onClick={() =>
                  onOpenSlidePanel({
                    title: `${req.name} Requirement`,
                    status: req.name === "AWS" ? "Needs Validation" : "Validated",
                    source: "Target Specification Ledger",
                    excerpt: `Core evaluation criterion for ${job.title}. Category: ${req.category}. Assigned evaluation weight: ${req.weight}%.`,
                    missing: req.name === "AWS" ? "Candidate must demonstrate multi-service infrastructure deployment autonomy." : null,
                    suggestedQuestion: req.name === "AWS" ? "Which AWS services did you configure yourself in production?" : null
                  })
                }
                className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-cyan-950/40 border border-white/10 hover:border-cyan-400/40 text-xs font-mono text-slate-200 flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>{req.name}</span>
                <span className="text-[10px] text-cyan-400 font-bold">{req.weight}%</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3D Requirement Sphere */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-3 border border-cyan-500/25 relative overflow-hidden shadow-[0_0_35px_rgba(0,0,0,0.6)]">
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 text-[11px] font-mono text-cyan-300 bg-slate-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30">
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>3D REQUIREMENT CONSTELLATION</span>
          </div>

          <JobRequirements3D
            jobTitle={job.title}
            onSelectRequirement={(reqName) => {
              onOpenSlidePanel({
                title: `${reqName} Requirement`,
                status: reqName === "AWS" || reqName === "System Design" ? "Needs Validation" : "Validated",
                source: "Target Spec vs Candidate Corpus",
                excerpt: `Corroboration pathway: ${reqName} mapped across candidate code repositories and transcript notes.`,
                suggestedQuestion: reqName === "AWS" ? "Which AWS services did you use in production?" : null,
                missing: reqName === "AWS" ? "Production deployment details unclear in resume." : null
              });
            }}
          />
        </div>
      </div>

      {/* Matched Candidate Stream for this Job */}
      <div className="pt-6 border-t border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>MATCHED CANDIDATE STREAM ({relevantCandidates.length})</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Ranked by Evidence Corroboration
          </span>
        </div>

        <div className="space-y-3">
          {relevantCandidates.map((cand) => (
            <div
              key={cand.id}
              onClick={() => onSelectCandidate(cand)}
              className="p-5 rounded-2xl bg-white/[0.02] hover:bg-cyan-950/40 border border-white/10 hover:border-cyan-400/50 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600/30 to-indigo-600/30 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-white">
                  {cand.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-base">
                      {cand.name}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.2 rounded bg-white/5 text-slate-400">
                      {cand.experience}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-sans mt-0.5">
                    {cand.title} • {cand.location}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm font-mono font-bold text-cyan-400">
                    {cand.coverageScore}% Evidence Coverage
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    {cand.validationGaps?.length || 0} gaps flagged
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full flex items-center justify-center border border-white/15 text-slate-400 group-hover:border-cyan-400 group-hover:text-cyan-300 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
