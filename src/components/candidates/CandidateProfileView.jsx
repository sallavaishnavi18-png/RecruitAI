import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  MapPin,
  GraduationCap,
  Clock,
  Award,
  Sparkles,
  MessageSquare,
  FileText,
  Brain,
  Target
} from 'lucide-react';
import CandidateProfile3D from '../three/CandidateProfile3D';
import EvidenceTimeline from './EvidenceTimeline';

export default function CandidateProfileView({
  candidate,
  onBack,
  onOpenSlidePanel,
  onNavigateInterview
}) {
  if (!candidate) return null;

  const match = candidate.match || null;

  return (
    <section className="w-full max-w-6xl mx-auto py-10 px-4 select-none">

      {/* Back button & Action */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>BACK TO CANDIDATE STREAM</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateInterview && onNavigateInterview(candidate)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 font-mono text-xs font-semibold tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI INTERVIEW GENERATOR</span>
          </button>
        </div>
      </div>

      {/* Profile Header Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">

        {/* Left Information Card */}
        <div className="lg:col-span-6 space-y-6">

          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />

              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
                CANDIDATE INTELLIGENCE DOSSIER
              </span>

              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-medium">
                {candidate.coverageScore ?? 0}% Coverage
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black font-mono tracking-tight text-white mb-2">
              {candidate.name}
            </h1>

            <p className="text-xl text-cyan-200/90 font-mono font-medium">
              {candidate.title || 'Candidate'}
            </p>
          </div>

          {/* Quick Demographics Bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 bg-white/[0.02] p-4 rounded-xl border border-white/10">

            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{candidate.experience || 'Experience not specified'}</span>
            </div>

            <span className="text-slate-600">•</span>

            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              <span>{candidate.education || 'Education not specified'}</span>
            </div>

            <span className="text-slate-600">•</span>

            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{candidate.location || 'Location not specified'}</span>
            </div>

          </div>

          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            {candidate.summary || 'AI-generated candidate profile information.'}
          </p>

          {/* Verified Skills stream */}
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-2">
              Corroborated Competencies
            </span>

            <div className="flex flex-wrap gap-2">
              {(candidate.skills || []).map((skill, index) => {

                const skillName =
                  typeof skill === 'string'
                    ? skill
                    : skill.name;

                const isValidated =
                  typeof skill === 'string'
                    ? true
                    : skill.status === 'validated';

                return (
                  <button
                    key={skillName || index}
                    onClick={() =>
                      onOpenSlidePanel({
                        title: `${skillName?.toUpperCase()} COMPETENCY`,
                        status: isValidated
                          ? 'Validated'
                          : 'Needs Validation',
                        source:
                          typeof skill === 'string'
                            ? 'Candidate Resume'
                            : skill.source,
                        confidence:
                          typeof skill === 'string'
                            ? 80
                            : skill.confidence,
                        excerpt: `Competency audit for ${skillName}.`,
                        missing: !isValidated
                          ? `Candidate mentions ${skillName}, but additional evidence may be required.`
                          : null,
                        suggestedQuestion: !isValidated
                          ? `Can you explain your experience with ${skillName} and provide an example of using it?`
                          : null
                      })
                    }
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                      isValidated
                        ? 'bg-slate-900/80 border-white/15 text-slate-200 hover:border-cyan-400'
                        : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    }`}
                  >
                    <span>{skillName}</span>

                    <span className="font-bold text-[10px]">
                      {isValidated ? '✓' : '!'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 3D Spatial Network */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-2 border border-cyan-500/25 relative overflow-hidden shadow-[0_0_35px_rgba(0,0,0,0.6)]">

          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 text-[11px] font-mono text-cyan-300 bg-slate-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>3D SPATIAL EVIDENCE MAP</span>
          </div>

          <CandidateProfile3D
            candidate={candidate}
            onSelectEvidence={(evidenceType) => {

              const matchedNode =
                candidate.evidenceNodes?.find(
                  (n) => n.type === evidenceType
                ) || {
                  title: `${evidenceType} SIGNAL`,
                  label: evidenceType,
                  status: 'Validated',
                  source: 'Multi-Modal Corroboration Engine',
                  excerpt: `Artifacts tied to ${evidenceType} verified against candidate records and public repositories.`
                };

              onOpenSlidePanel(matchedNode);
            }}
          />
        </div>
      </div>

      {/* ====================================================== */}
      {/* AI MATCH ANALYSIS                                      */}
      {/* ====================================================== */}

      {match && (
        <div className="mb-10">

          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-cyan-400" />

            <span className="text-xs font-mono uppercase tracking-widest text-cyan-300">
              AI MATCH ANALYSIS
            </span>

            <span className="text-[10px] font-mono text-slate-500">
              JOB REQUIREMENT ANALYSIS
            </span>
          </div>

          <div className="glass-panel rounded-2xl border border-cyan-500/25 p-6">

            {/* Overall Match */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">

              <div>
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                  Overall AI Match
                </p>

                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black font-mono text-cyan-300">
                    {match.overall_match ?? 0}%
                  </span>

                  <span className="text-xs font-mono text-slate-500 mb-2">
                    requirement alignment
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20">
                <Target className="w-5 h-5 text-cyan-400" />

                <div>
                  <p className="text-[10px] font-mono text-slate-500 uppercase">
                    AI Assessment
                  </p>

                  <p className="text-sm font-mono text-cyan-200">
                    {match.overall_match >= 70
                      ? 'Strong requirement alignment'
                      : match.overall_match >= 40
                      ? 'Partial requirement alignment'
                      : 'Limited requirement alignment'}
                  </p>
                </div>
              </div>
            </div>

            {/* Matched + Missing Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">

              {/* Matched Skills */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">

                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />

                  <span className="text-xs font-mono text-emerald-300 uppercase tracking-wider">
                    Matched Skills
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(match.matched_skills || []).length > 0 ? (
                    match.matched_skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs font-mono text-slate-500">
                      No matching skills identified.
                    </span>
                  )}
                </div>

              </div>

              {/* Missing Skills */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20">

                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />

                  <span className="text-xs font-mono text-amber-300 uppercase tracking-wider">
                    Missing / Unclear Skills
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(match.missing_skills || []).length > 0 ? (
                    match.missing_skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs font-mono text-slate-500">
                      No missing skills identified.
                    </span>
                  )}
                </div>

              </div>
            </div>

            {/* Qualification + Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-4 h-4 text-indigo-400" />

                  <span className="text-xs font-mono text-slate-400 uppercase">
                    Qualification Match
                  </span>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed">
                  {match.qualification_match || 'No qualification analysis available.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-cyan-400" />

                  <span className="text-xs font-mono text-slate-400 uppercase">
                    Experience Match
                  </span>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed">
                  {match.experience_match || 'No experience analysis available.'}
                </p>
              </div>

            </div>

            {/* AI Explanation */}
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20">

              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />

                <span className="text-xs font-mono text-cyan-300 uppercase tracking-wider">
                  AI MATCH EXPLANATION
                </span>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed">
                {match.explanation || 'No AI explanation available.'}
              </p>

            </div>

            {/* Human Review */}
            <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
              <span>
                AI analysis is evidence-based. Final hiring decision remains with the human recruiter.
              </span>
            </div>

          </div>
        </div>
      )}

      {/* Evidence Timeline */}
      <div className="mb-10">
        <EvidenceTimeline
          onSelectStage={(stage) => {
            onOpenSlidePanel(stage);
          }}
        />
      </div>

      {/* Human Review Reminder */}
      <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between flex-wrap gap-4 text-xs font-mono">

        <div className="flex items-center gap-2 text-cyan-300">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />

          <span>
            RECRUITER REVIEW REQUIRED: AI evidence synthesis compiled. Final hiring decision rests with human evaluator.
          </span>
        </div>

        <button
          onClick={() =>
            onNavigateInterview && onNavigateInterview(candidate)
          }
          className="text-cyan-400 hover:text-cyan-200 underline underline-offset-4 cursor-pointer"
        >
          Proceed to AI Interview Prep →
        </button>

      </div>

    </section>
  );
}