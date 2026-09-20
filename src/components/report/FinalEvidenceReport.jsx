import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, CheckCircle2, AlertTriangle, Clock, Printer, Sparkles, Check, Send, ChevronRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MOCK_AUDIT_TRAIL, MOCK_CANDIDATES } from '../../data/mockData';

export default function FinalEvidenceReport({ 
  candidate = MOCK_CANDIDATES[0], 
  auditTrail = MOCK_AUDIT_TRAIL, 
  onOpenSlidePanel 
}) {
  const [recruiterNotes, setRecruiterNotes] = useState("");
  const [checkedItems, setCheckedItems] = useState({
    codeAudit: true,
    interviewVerified: true,
    gapsProbed: false
  });
  const [isSignedOff, setIsSignedOff] = useState(false);

  const handleSignOff = () => {
    setIsSignedOff(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#818cf8', '#10b981']
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="w-full max-w-5xl mx-auto py-8 px-4 select-none print:py-0 print:px-0 print:max-w-none">
      {/* 4. Clear Hierarchical Report Header with Visible Top [ PRINT DOSSIER ] Action */}
      <div className="border-b border-white/10 pb-6 mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-6 print:border-b-2 print:border-black print:pb-4">
        <div>
          {/* Brand & Document Type */}
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 print:hidden" />
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400 font-bold print:text-black">
              RECRUITAI
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-white print:text-black mb-3">
            Evidence Dossier
          </h1>

          {/* Candidate Name & Target Role Hierarchy */}
          <div className="space-y-0.5">
            <div className="text-xl sm:text-2xl font-bold font-mono text-slate-100 print:text-black">
              {candidate.name}
            </div>
            <div className="text-xs sm:text-sm font-mono text-slate-300 print:text-slate-700">
              {candidate.title || candidate.jobTitle} • {candidate.experience} Verified Tenure
            </div>
          </div>
        </div>

        {/* Top Action & Recruiter Callout */}
        <div className="flex flex-col sm:items-end gap-3 print:hidden">
          {/* 2. Prominent but Minimal [ PRINT DOSSIER ] Button */}
          <button
            onClick={handlePrint}
            className="group px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.35)] cursor-pointer self-start sm:self-auto"
          >
            <Printer className="w-4 h-4 text-slate-900 group-hover:scale-110 transition-transform" />
            <span>Print Dossier</span>
          </button>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-300 bg-cyan-950/40 px-3 py-1 rounded-lg border border-cyan-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Human Evaluator Authority Active</span>
          </div>
        </div>
      </div>

      {/* Recruiter Review Required Notice */}
      <div className="mb-8 p-4 rounded-xl bg-white/[0.03] border border-cyan-500/30 flex items-start gap-3 print:border-slate-300 print:bg-slate-50">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5 print:text-black" />
        <div className="text-xs font-mono">
          <span className="text-white font-bold uppercase tracking-wider block mb-0.5 print:text-black">
            RECRUITER REVIEW REQUIRED
          </span>
          <p className="text-slate-300 font-sans print:text-slate-700 leading-relaxed">
            AI-generated evidence supports human evaluation. Final candidate selection or rejection remains strictly with the authorized hiring committee.
          </p>
        </div>
      </div>

      {/* Animated Evidence Completion Rate Line */}
      <div className="mb-10 p-5 rounded-2xl glass-panel border border-white/10 print:border-slate-300 print:bg-transparent">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="uppercase text-slate-300 tracking-wider font-semibold print:text-black">
            Corroborated Evidence Coverage
          </span>
          <span className="text-cyan-400 font-bold text-base print:text-black">
            {candidate.coverageScore}% Verified
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/10 print:border-slate-400 print:bg-slate-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${candidate.coverageScore}%` }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full print:bg-black"
          />
        </div>
        <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1.5 print:text-slate-600">
          <span>Minimum Spec Threshold: 80%</span>
          <span>Verified against public repositories and transcripts</span>
        </div>
      </div>

      {/* Section 1: Candidate Overview */}
      <div className="mb-10">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-400 font-bold mb-3.5 flex items-center gap-2 print:text-black">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 print:bg-black" />
          01 // CANDIDATE OVERVIEW
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/10 font-mono text-xs print:border-slate-300 print:bg-transparent">
          <div>
            <span className="text-slate-400 block mb-1 text-[11px] print:text-slate-600">CANDIDATE NAME</span>
            <span className="text-base text-white font-bold block print:text-black">{candidate.name}</span>
            <span className="text-slate-300 text-[11px] print:text-slate-700">{candidate.title}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1 text-[11px] print:text-slate-600">TENURE & DEGREE</span>
            <span className="text-white font-semibold block text-sm print:text-black">{candidate.experience}</span>
            <span className="text-slate-300 text-[11px] print:text-slate-700">{candidate.education}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1 text-[11px] print:text-slate-600">LOCATION & STATUS</span>
            <span className="text-white font-semibold block text-sm print:text-black">{candidate.location}</span>
            <span className="text-slate-300 text-[11px] print:text-slate-700">Right to Work Confirmed</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1 text-[11px] print:text-slate-600">EVALUATION CONFIDENCE</span>
            <span className="text-emerald-400 font-bold block text-sm print:text-emerald-700">Strong Signal</span>
            <span className="text-slate-300 text-[11px] print:text-slate-700">Pending Recruiter Sign-Off</span>
          </div>
        </div>
      </div>

      {/* Section 2: Requirement Coverage & Technical Evidence */}
      <div className="mb-10">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-400 font-bold mb-3.5 flex items-center gap-2 print:text-black">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 print:bg-black" />
          02 // REQUIREMENT COVERAGE & TECHNICAL EVIDENCE
        </h2>
        <div className="divide-y divide-white/10 border-y border-white/10 print:border-slate-300 print:divide-slate-200">
          {candidate.skills?.map((skill) => {
            const isValid = skill.status === 'validated';
            return (
              <div
                key={skill.name}
                onClick={() =>
                  onOpenSlidePanel && onOpenSlidePanel({
                    title: skill.name,
                    status: isValid ? 'Validated' : 'Needs Validation',
                    source: skill.source,
                    confidence: skill.confidence,
                    excerpt: `Documented signal for ${skill.name}. Assessed level: ${skill.level}.`,
                    missing: !isValid ? "Candidate mentions skill in summary but lacks production commit depth." : null
                  })
                }
                className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-white/[0.02] px-2 rounded-lg transition-colors cursor-pointer print:cursor-default"
              >
                <div className="flex items-center gap-4">
                  <div className="font-mono font-bold text-white text-base min-w-[140px] print:text-black">
                    {skill.name}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono border ${
                      isValid
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 print:bg-slate-100 print:text-emerald-800'
                        : 'bg-amber-950/60 text-amber-300 border-amber-500/40 print:bg-slate-100 print:text-amber-800'
                    }`}
                  >
                    {isValid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    <span>{isValid ? 'Validated' : 'Needs Validation'}</span>
                  </span>
                </div>

                <div className="text-xs font-mono text-slate-300 flex items-center gap-6 print:text-slate-700">
                  <span>Source: {skill.source}</span>
                  <span className="text-cyan-300 font-semibold print:text-slate-900">{skill.confidence}% confidence</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Interview Evidence Corroboration */}
      <div className="mb-10">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-400 font-bold mb-3.5 flex items-center gap-2 print:text-black">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 print:bg-black" />
          03 // INTERVIEW EVIDENCE CORROBORATION
        </h2>
        <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3 print:border-slate-300 print:bg-transparent">
          <p className="text-xs font-mono text-slate-300 print:text-slate-700">
            Recorded transcript verified hands-on infrastructure deployment and clarified preliminary resume ambiguities:
          </p>
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-sm font-sans text-slate-100 italic leading-relaxed print:bg-slate-50 print:text-black print:border-slate-300">
            "I deployed the application using AWS EC2 with auto-scaling groups and an Application Load Balancer."
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 print:text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 print:text-emerald-800" />
            <span>AWS Infrastructure verified with 92% confidence score.</span>
          </div>
        </div>
      </div>

      {/* Section 4: Validation Gaps & Unanswered Areas */}
      <div className="mb-10">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-amber-400 font-bold mb-3.5 flex items-center gap-2 print:text-black">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 print:bg-black" />
          04 // VALIDATION GAPS & ATTENTION AREAS
        </h2>
        <div className="space-y-3">
          {candidate.validationGaps?.map((gap) => (
            <div
              key={gap.id}
              className="p-4 sm:p-5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 print:border-slate-300 print:bg-slate-50"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold font-mono text-white print:text-black">{gap.requirement}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-900/60 text-amber-200 border border-amber-500/30 print:bg-slate-200 print:text-black">
                    {gap.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-200 font-sans print:text-slate-800 leading-relaxed">{gap.issue}</p>
              </div>
              <span className="text-xs font-mono text-amber-300 shrink-0 print:text-amber-800">
                Action: Recruiter Final Query
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Cinematic Audit Trail */}
      <div className="mb-10">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-400 font-bold mb-3.5 flex items-center gap-2 print:text-black">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 print:bg-black" />
          05 // AUDIT TRAIL
        </h2>
        <div className="relative pl-6 md:pl-8 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10 print:before:bg-slate-300">
          {auditTrail.map((item, idx) => (
            <div
              key={idx}
              className="relative p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-400/40 transition-colors print:border-slate-200"
            >
              <div className="absolute -left-[27px] md:-left-[35px] top-4 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-4 ring-[#060810] print:ring-white print:bg-black" />
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-cyan-300 font-semibold print:text-black">
                  {item.action}
                </span>
                <span className="text-slate-400 flex items-center gap-1 print:text-slate-600">
                  <Clock className="w-3 h-3" />
                  {item.time}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans print:text-slate-700">
                {item.details}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 6: Recruiter Human Evaluation Workspace (print:hidden) */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel-glow border border-cyan-500/40 print:hidden">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg md:text-xl font-bold font-mono text-white">
            RECRUITER EVALUATION WORKSPACE
          </h3>
        </div>
        <p className="text-xs text-slate-400 font-mono mb-6">
          Record qualitative feedback and sign off on candidate findings.
        </p>

        {/* Verification Checkboxes */}
        <div className="space-y-3 mb-6 font-mono text-xs">
          <label className="flex items-center gap-3 cursor-pointer text-slate-200 hover:text-white">
            <input
              type="checkbox"
              checked={checkedItems.codeAudit}
              onChange={(e) => setCheckedItems({ ...checkedItems, codeAudit: e.target.checked })}
              className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
            />
            <span>I have inspected the verified GitHub repositories and code commits.</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer text-slate-200 hover:text-white">
            <input
              type="checkbox"
              checked={checkedItems.interviewVerified}
              onChange={(e) => setCheckedItems({ ...checkedItems, interviewVerified: e.target.checked })}
              className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
            />
            <span>I have verified the live transcript answers and architectural explanations.</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer text-slate-200 hover:text-white">
            <input
              type="checkbox"
              checked={checkedItems.gapsProbed}
              onChange={(e) => setCheckedItems({ ...checkedItems, gapsProbed: e.target.checked })}
              className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
            />
            <span>I have acknowledged or resolved the flagged validation gaps.</span>
          </label>
        </div>

        {/* Notes Textarea */}
        <div className="mb-6">
          <label className="text-xs font-mono text-slate-300 block mb-2 font-semibold">
            Recruiter Qualitative Assessment Notes:
          </label>
          <textarea
            value={recruiterNotes}
            onChange={(e) => setRecruiterNotes(e.target.value)}
            placeholder="Add qualitative recruiter feedback regarding culture fit, communication poise, or salary expectations..."
            rows={3}
            className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-sm text-slate-100 font-sans focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
          />
        </div>

        {/* Sign-off Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="text-xs font-mono text-slate-300">
            {isSignedOff ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Recruiter Evaluation Completed & Signed Off
              </span>
            ) : (
              <span>Ready for human reviewer authorization</span>
            )}
          </div>

          <button
            onClick={handleSignOff}
            disabled={isSignedOff}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isSignedOff
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
            }`}
          >
            {isSignedOff ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            <span>{isSignedOff ? 'Dossier Authorized' : 'Sign Off Evaluation'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
