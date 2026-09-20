import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, ShieldAlert, Cpu, Sparkles, Compass } from 'lucide-react';
import IntelligenceCore3D from '../three/IntelligenceCore3D';
import FloatingEvidencePills from './FloatingEvidencePills';

export default function HeroSection({ onExplore, onStartDemo, onSelectNode }) {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-8 pb-16 px-4 md:px-8 overflow-hidden">
      {/* Ambient Radial Lights behind Hero */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[350px] h-[350px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating Evidence Badges */}
      <FloatingEvidencePills
        onSelectPill={(pill) => {
          onSelectNode({
            title: pill.text,
            label: pill.text,
            status: pill.status === 'warning' ? 'Needs Validation' : 'Validated',
            source: pill.source,
            excerpt: `Signal captured during intake: ${pill.text}. Verified against candidate repository and parsed work history.`,
            suggestedQuestion: pill.status === 'warning' ? "Can you elaborate on your production infrastructure and deployment architecture?" : null,
            missing: pill.status === 'warning' ? "Production deployment details not verified." : null
          });
        }}
      />

      {/* Top Tag Pill */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
      >
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span className="text-xs font-mono text-cyan-300 font-medium tracking-wider uppercase">
          AI-Powered Candidate Intelligence • Hackathon Edition
        </span>
      </motion.div>

      {/* Main Title & Slogan */}
      <div className="text-center max-w-4xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative inline-block mb-3"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight font-mono text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400">
            RECRUITAI
          </h1>
          <span className="absolute -top-1 -right-6 text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 tracking-widest font-semibold uppercase">
            3D SPATIAL
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-2xl md:text-4xl font-semibold text-slate-100 tracking-tight mb-4"
        >
          Recruit smarter. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">Understand candidates deeper.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8"
        >
          Turn resumes, projects and interviews into structured candidate intelligence.
          Spatial evidence mapping with recruiter-in-the-loop decision integrity.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-8"
        >
          {/* Primary CTA */}
          <motion.button
            onClick={onExplore}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 text-white font-mono text-sm font-semibold tracking-wider flex items-center gap-3 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all cursor-pointer overflow-hidden"
          >
            <span className="relative z-10">EXPLORE INTELLIGENCE</span>
            <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1.5" />
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
          </motion.button>

          {/* Secondary CTA */}
          <motion.button
            onClick={onStartDemo}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 hover:border-cyan-400/40 text-slate-200 font-mono text-sm font-medium tracking-wider flex items-center gap-2.5 backdrop-blur-md transition-all cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.08)]"
          >
            <Play className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>VIEW DEMO (GUIDED TOUR)</span>
          </motion.button>
        </motion.div>
      </div>

      {/* 3D Candidate Intelligence Centerpiece */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="w-full max-w-5xl mx-auto relative z-10"
      >
        <IntelligenceCore3D
          onSelectNode={(nodeId) => {
            const sampleInfo = {
              RESUME: {
                title: "RESUME EVIDENCE",
                status: "Validated",
                source: "Multi-page PDF Parse",
                confidence: 98,
                excerpt: "2.8 years production software engineering at FinTech scale. Built real-time trade settlement queues.",
                suggestedQuestion: null
              },
              SKILLS: {
                title: "SKILLS COHORT",
                status: "Validated (6 Skills • 1 Gap)",
                source: "Semantic Verification",
                confidence: 94,
                excerpt: "Python (FastAPI), React, SQL, and Node.js validated with high repository commit frequency.",
                suggestedQuestion: "How do you approach database schema migrations with zero downtime?"
              },
              PROJECTS: {
                title: "PRODUCTION PROJECTS",
                status: "Validated",
                source: "GitHub & Live Demo Audit",
                confidence: 96,
                excerpt: "Built an e-commerce checkout platform processing 2,500 req/sec with optimistic state updates.",
                suggestedQuestion: null
              },
              EXPERIENCE: {
                title: "EXPERIENCE CONTINUITY",
                status: "Validated",
                source: "Tenure & Payroll Ledger Verification",
                confidence: 99,
                excerpt: "2.8 continuous years across software development and backend systems engineering.",
                suggestedQuestion: null
              },
              INTERVIEW: {
                title: "INTERVIEW TRANSCRIPT MAPPING",
                status: "Validated",
                source: "Spoken Word Audio Stream",
                confidence: 92,
                excerpt: "Clarified AWS EC2 auto-scaling groups and resolved previous production ambiguity.",
                suggestedQuestion: "What metric triggered your EC2 autoscaling scale-in policy?"
              },
              REQUIREMENTS: {
                title: "REQUIREMENT FIT MATRIX",
                status: "92% Fit Coverage",
                source: "Target Spec Matching",
                confidence: 92,
                excerpt: "Satisfies 5 of 6 essential Senior Software Engineer competencies.",
                suggestedQuestion: null
              },
              INSIGHTS: {
                title: "AI SYNTHESIS & RECRUITER ADVISORY",
                status: "Recruiter Review Required",
                source: "RecruitAI Core Engine",
                confidence: 90,
                excerpt: "Strong candidate fit. AI recommends recruiter probe on container orchestration autonomy.",
                missing: "Kubernetes cluster administration depth not substantiated in repository audit.",
                suggestedQuestion: "How have you managed Kubernetes ingress controllers or multi-region routing?"
              }
            };

            onSelectNode(sampleInfo[nodeId] || { title: nodeId, excerpt: "Selected evidence node" });
          }}
        />
      </motion.div>

      {/* Recruiter Guarantee Banner */}
      <div className="z-10 mt-2 flex items-center justify-center gap-2 text-xs font-mono text-slate-400 bg-white/[0.02] border border-white/10 px-4 py-2 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span>RECRUITER REVIEW REQUIRED • AI generates evidence, human makes the hiring decision</span>
      </div>
    </section>
  );
}
