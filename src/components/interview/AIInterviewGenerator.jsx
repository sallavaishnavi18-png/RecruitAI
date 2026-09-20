import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Cpu,
  ChevronRight,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Plus,
  RefreshCw,
} from 'lucide-react';

const AI_PIPELINE_STEPS = [
  {
    id: "scan",
    label: "SCAN",
    text: "Scanning candidate repositories & resume signals...",
  },
  {
    id: "understand",
    label: "UNDERSTAND",
    text: "Analyzing code complexity, architecture & tenure...",
  },
  {
    id: "map",
    label: "MAP",
    text: "Mapping evidence against job requirements...",
  },
  {
    id: "validate",
    label: "VALIDATE",
    text: "Isolating technical ambiguities and validation gaps...",
  },
  {
    id: "insight",
    label: "INSIGHT",
    text: "Generating targeted interviewer probes...",
  },
];

/*
|--------------------------------------------------------------------------
| LARGE QUESTION GENERATOR
|--------------------------------------------------------------------------
| These are frontend-only mock interview probes.
| No API / backend is required.
|
| The generator combines:
| - different categories
| - different depths
| - different candidate skills
| - different question structures
|
| Therefore the interviewer can keep generating additional questions.
|--------------------------------------------------------------------------
*/

const QUESTION_TEMPLATES = [
  {
    category: "Technical",
    target: "Core Engineering",
    question:
      "Walk me through the most technically difficult production problem you solved recently. What was happening, how did you isolate the root cause, and what changed after your fix?",
    why:
      "Tests whether the candidate can move from symptoms to root cause instead of describing only the final solution.",
  },
  {
    category: "Architecture",
    target: "System Architecture",
    question:
      "Describe a system you designed or significantly changed. What were the major components, how did data move between them, and why did you choose that architecture?",
    why:
      "Validates whether the candidate understands architectural trade-offs rather than only individual implementation tasks.",
  },
  {
    category: "System Design",
    target: "Scalability",
    question:
      "Suppose the system you previously worked on suddenly receives ten times its current traffic. What would you inspect first and what would you change?",
    why:
      "Probes practical scalability reasoning and whether the candidate can prioritize bottlenecks.",
  },
  {
    category: "Database",
    target: "Data Layer",
    question:
      "Tell me about a database performance problem you encountered. How did you identify the bottleneck and what evidence convinced you that your solution worked?",
    why:
      "Checks whether database optimization decisions were based on measurable evidence.",
  },
  {
    category: "Python",
    target: "Python Engineering",
    question:
      "Describe a Python service or application where code structure became difficult to maintain. What did you change to improve it?",
    why:
      "Separates basic Python familiarity from experience maintaining larger Python codebases.",
  },
  {
    category: "Python",
    target: "Concurrency",
    question:
      "If a Python service had to process thousands of concurrent requests, how would you approach concurrency, connection management, and resource limits?",
    why:
      "Tests practical understanding of concurrency and resource management.",
  },
  {
    category: "React",
    target: "Frontend Architecture",
    question:
      "Tell me about the most complex React interface you built. How did you structure state, components, and data flow as the application grew?",
    why:
      "Checks whether frontend architecture decisions were deliberate and scalable.",
  },
  {
    category: "Frontend",
    target: "Performance",
    question:
      "A React application becomes noticeably slower as the amount of data increases. How would you investigate the problem?",
    why:
      "Evaluates debugging methodology for frontend performance issues.",
  },
  {
    category: "Cloud",
    target: "AWS",
    question:
      "Describe your hands-on experience deploying an application to AWS. Which services did you use and what responsibilities did you personally own?",
    why:
      "Separates direct cloud experience from tools or services mentioned only on a resume.",
  },
  {
    category: "Cloud",
    target: "Infrastructure",
    question:
      "If an application running in the cloud started experiencing intermittent failures, what infrastructure signals would you investigate first?",
    why:
      "Tests practical production troubleshooting across infrastructure layers.",
  },
  {
    category: "Cloud",
    target: "Reliability",
    question:
      "How would you design a service so that a failure in one dependency does not immediately bring down the entire application?",
    why:
      "Explores fault isolation, graceful degradation, retries, and resilience thinking.",
  },
  {
    category: "Security",
    target: "Application Security",
    question:
      "What security risks would you specifically look for before putting a backend service into production?",
    why:
      "Checks whether security is considered during engineering rather than only after deployment.",
  },
  {
    category: "Security",
    target: "Authentication",
    question:
      "How would you design authentication and authorization for an application with multiple user roles?",
    why:
      "Tests practical understanding of access control and authorization boundaries.",
  },
  {
    category: "Testing",
    target: "Engineering Quality",
    question:
      "What testing strategy would you use for a critical backend service, and how would you decide what belongs in unit, integration, and end-to-end tests?",
    why:
      "Evaluates whether the candidate can create a layered testing strategy.",
  },
  {
    category: "Testing",
    target: "Failure Handling",
    question:
      "Tell me about a bug that escaped testing and reached users. What did you change afterward?",
    why:
      "Reveals how the candidate learns from production failures and improves engineering processes.",
  },
  {
    category: "API",
    target: "API Design",
    question:
      "What makes an API maintainable when multiple teams depend on it? Give an example from your experience.",
    why:
      "Tests API design maturity and awareness of long-term compatibility.",
  },
  {
    category: "API",
    target: "Distributed Systems",
    question:
      "How would you handle retries when an API request can safely be executed only once?",
    why:
      "Probes understanding of idempotency and distributed-system failure modes.",
  },
  {
    category: "Performance",
    target: "Optimization",
    question:
      "Tell me about a performance optimization you personally implemented. What was slow, what did you change, and how did you measure the improvement?",
    why:
      "Requires the candidate to connect an optimization with measurable evidence.",
  },
  {
    category: "Performance",
    target: "Caching",
    question:
      "When would you introduce caching into a system, and what problems can caching create?",
    why:
      "Tests whether the candidate understands both the benefits and consistency risks of caching.",
  },
  {
    category: "DevOps",
    target: "Deployment",
    question:
      "Walk me through the deployment process for a service you have worked on. Which parts were automated and which parts required manual intervention?",
    why:
      "Clarifies the candidate's actual ownership of deployment workflows.",
  },
  {
    category: "DevOps",
    target: "CI/CD",
    question:
      "What would you include in a CI/CD pipeline for a production application?",
    why:
      "Tests practical understanding of automated software delivery.",
  },
  {
    category: "Observability",
    target: "Monitoring",
    question:
      "A production service is returning errors but CPU and memory look normal. What would you investigate next?",
    why:
      "Checks whether the candidate can debug beyond basic infrastructure metrics.",
  },
  {
    category: "Observability",
    target: "Logging",
    question:
      "What information should a production application log, and what information should never be logged?",
    why:
      "Evaluates production observability and security awareness.",
  },
  {
    category: "Distributed Systems",
    target: "Consistency",
    question:
      "Imagine two services update related pieces of data at nearly the same time. How would you reason about consistency and failure recovery?",
    why:
      "Tests understanding of distributed state and race conditions.",
  },
  {
    category: "Distributed Systems",
    target: "Failure Recovery",
    question:
      "How would you design a system to recover when one downstream service becomes unavailable for several minutes?",
    why:
      "Explores retries, queues, timeouts, circuit breakers, and graceful degradation.",
  },
  {
    category: "Leadership",
    target: "Technical Ownership",
    question:
      "Tell me about a technical decision where you disagreed with another engineer. How did you resolve the disagreement?",
    why:
      "Assesses technical communication and decision-making under disagreement.",
  },
  {
    category: "Leadership",
    target: "Mentoring",
    question:
      "Describe a time you helped another engineer solve a difficult technical problem. What did you do?",
    why:
      "Explores senior-level collaboration and knowledge sharing.",
  },
  {
    category: "Debugging",
    target: "Root Cause Analysis",
    question:
      "Tell me about a production issue where your first hypothesis was wrong. How did you eventually find the real cause?",
    why:
      "Tests debugging discipline and willingness to update assumptions based on evidence.",
  },
  {
    category: "Debugging",
    target: "Incident Response",
    question:
      "You receive a production alert at 2 AM with incomplete information. Walk me through your first ten minutes.",
    why:
      "Evaluates incident prioritization and practical troubleshooting behavior.",
  },
  {
    category: "Code Quality",
    target: "Maintainability",
    question:
      "How do you decide when code should be refactored instead of simply adding another feature on top of it?",
    why:
      "Tests engineering judgment around technical debt.",
  },
  {
    category: "Architecture",
    target: "Trade-offs",
    question:
      "Give me an example where you deliberately chose a simpler technical solution even though a more sophisticated solution was available.",
    why:
      "Reveals whether the candidate can balance complexity, delivery speed, and long-term maintenance.",
  },
  {
    category: "Data",
    target: "Data Processing",
    question:
      "Describe a data-processing workflow you have built. Where were the largest bottlenecks and how did you handle them?",
    why:
      "Checks practical experience with data movement and processing workloads.",
  },
  {
    category: "AI / ML",
    target: "Machine Learning",
    question:
      "Describe an ML project you worked on from data preparation through evaluation. Which part required the most engineering effort?",
    why:
      "Separates project-level ML exposure from deeper end-to-end experience.",
  },
  {
    category: "AI / ML",
    target: "Production ML",
    question:
      "What additional challenges appear when moving an ML model from experimentation into production?",
    why:
      "Tests awareness of deployment, monitoring, drift, latency, and reproducibility.",
  },
  {
    category: "AI / ML",
    target: "Model Evaluation",
    question:
      "How would you determine whether an ML model is actually improving a product rather than only improving an offline metric?",
    why:
      "Evaluates practical ML measurement and product thinking.",
  },
  {
    category: "Product Engineering",
    target: "Engineering Judgment",
    question:
      "Tell me about a situation where product requirements were unclear. How did you turn ambiguity into an implementable technical plan?",
    why:
      "Tests communication and engineering judgment when requirements are incomplete.",
  },
  {
    category: "Ownership",
    target: "Production Ownership",
    question:
      "What part of a production system have you personally owned end to end?",
    why:
      "Clarifies actual ownership versus participation in a larger team effort.",
  },
  {
    category: "Ownership",
    target: "Decision Making",
    question:
      "What is one technical decision you made that you would make differently today?",
    why:
      "Explores reflection, learning, and ability to evaluate past technical decisions.",
  },
];

/*
|--------------------------------------------------------------------------
| Dynamic question modifiers
|--------------------------------------------------------------------------
*/

const QUESTION_MODIFIERS = [
  "Now answer specifically using an example from your most recent project.",
  "Focus on what you personally implemented rather than what the team did.",
  "Explain the trade-offs you considered before choosing the final approach.",
  "Describe how you would verify that your approach worked in production.",
  "Explain what could go wrong with your proposed approach.",
  "Describe how this decision would change at ten times the current scale.",
  "Tell me what evidence or metrics you would use to validate your answer.",
  "Explain what you would do differently if the original solution failed.",
];

/*
|--------------------------------------------------------------------------
| Create additional questions
|--------------------------------------------------------------------------
*/

function createDynamicQuestion(index, candidate) {
  const base = QUESTION_TEMPLATES[index % QUESTION_TEMPLATES.length];

  const cycle = Math.floor(index / QUESTION_TEMPLATES.length);
  const modifier = QUESTION_MODIFIERS[cycle % QUESTION_MODIFIERS.length];

  const candidateSkills =
    candidate?.skills
      ?.slice(0, 3)
      ?.map((skill) => skill.name)
      ?.join(", ") || "their core technical stack";

  let question = base.question;

  /*
   * Every cycle after the first one changes the question.
   * This means there is no fixed 4-question limit.
   */
  if (cycle > 0) {
    question = `${base.question} ${modifier}`;
  }

  if (cycle > 1) {
    question = `${question} Consider this in the context of ${candidateSkills}.`;
  }

  return {
    id: `generated-q-${index}-${cycle}`,
    number: index + 1,
    category: base.category,
    skillTarget: base.target,
    question,
    whyThisQuestion: base.why,
  };
}

/*
|--------------------------------------------------------------------------
| Normalize existing candidate questions
|--------------------------------------------------------------------------
*/

function normalizeExistingQuestions(candidate) {
  if (!candidate?.interviewQuestions?.length) {
    return [];
  }

  return candidate.interviewQuestions.map((q, index) => ({
    ...q,
    id: q.id || `existing-q-${index}`,
    number: index + 1,
  }));
}

export default function AIInterviewGenerator({
  candidate,
  onProceedToAnalysis,
  onOpenSlidePanel,
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [questionsGenerated, setQuestionsGenerated] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [questions, setQuestions] = useState(() =>
    normalizeExistingQuestions(candidate)
  );

  const candidateName = candidate?.name || "Rahul Sharma";

  /*
  |--------------------------------------------------------------------------
  | Candidate skills shown in the interface
  |--------------------------------------------------------------------------
  */

  const candidateSkillText = useMemo(() => {
    if (!candidate?.skills?.length) {
      return "Core Engineering";
    }

    return candidate.skills
      .slice(0, 5)
      .map((skill) => skill.name)
      .join(" • ");
  }, [candidate]);

  /*
  |--------------------------------------------------------------------------
  | Generate unlimited questions
  |--------------------------------------------------------------------------
  */

  const handleGenerate = (generateMore = false) => {
    if (isGenerating) return;

    setIsGenerating(true);

    /*
     * When generating the first time:
     * use existing candidate questions first.
     *
     * When generating again:
     * append NEW generated questions.
     */
    setCurrentStepIndex(0);

    let step = 0;

    const interval = setInterval(() => {
      step++;

      if (step < AI_PIPELINE_STEPS.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);

        setTimeout(() => {
          setIsGenerating(false);

          setQuestions((previousQuestions) => {
            /*
             * First generation:
             * If candidate already has questions, keep them.
             * Otherwise create the first batch.
             */
            if (!generateMore && previousQuestions.length === 0) {
              const initialQuestions = Array.from(
                { length: 6 },
                (_, index) => createDynamicQuestion(index, candidate)
              );

              setActiveQuestionId(initialQuestions[0]?.id || null);

              return initialQuestions;
            }

            /*
             * Every "Generate More Questions" click
             * creates another 6 NEW questions.
             */
            const startIndex = previousQuestions.length;

            const newQuestions = Array.from(
              { length: 6 },
              (_, index) =>
                createDynamicQuestion(startIndex + index, candidate)
            );

            const combined = [...previousQuestions, ...newQuestions];

            setActiveQuestionId(newQuestions[0]?.id || null);

            return combined;
          });

          setQuestionsGenerated(true);
        }, 400);
      }
    }, 450);
  };

  /*
  |--------------------------------------------------------------------------
  | Generate first questions automatically from candidate data
  |--------------------------------------------------------------------------
  */

  const handleInitialGenerate = () => {
    handleGenerate(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Generate another batch
  |--------------------------------------------------------------------------
  */

  const handleGenerateMore = () => {
    handleGenerate(true);
  };

  return (
    <section className="w-full max-w-5xl mx-auto py-10 px-4 select-none">

      {/* ================================================================ */}
      {/* HEADER                                                           */}
      {/* ================================================================ */}

      <div className="text-center mb-8">

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 uppercase tracking-widest font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />

          <span>AI INTERVIEW COPILOT</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-black font-mono tracking-tight text-white mb-3">
          LET'S PREPARE THE INTERVIEW.
        </h2>

        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          RecruitAI continuously generates targeted interviewer probes from
          candidate evidence, technical depth, projects, and validation gaps.
        </p>

      </div>


      {/* ================================================================ */}
      {/* GENERATION SCREEN                                                */}
      {/* ================================================================ */}

      {!questionsGenerated && !isGenerating && (

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-3xl p-8 md:p-12 border border-cyan-500/25 bg-slate-950/70 text-center overflow-hidden"
        >

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Evidence badges */}

          <div className="flex flex-wrap justify-center gap-3 mb-8 max-w-2xl mx-auto">

            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-300">
              ✦ Evidence mapped
            </span>

            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-indigo-300">
              ✦ Projects analyzed
            </span>

            <span className="px-3 py-1 rounded-full bg-amber-950/40 border border-amber-500/40 text-xs font-mono text-amber-300">
              ⚠ Validation gaps detected
            </span>

            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-emerald-300">
              ✦ Skills mapped
            </span>

          </div>


          {/* Candidate */}

          <div className="max-w-xl mx-auto mb-8">

            <div className="text-slate-200 font-mono text-sm mb-2 font-semibold">
              Candidate: {candidateName}
            </div>

            <div className="text-xs text-slate-400 font-mono mb-3">
              Target: Senior Software Engineer
            </div>

            <div className="text-[11px] text-cyan-300/70 font-mono">
              {candidateSkillText}
            </div>

          </div>


          {/* Generate */}

          <motion.button
            onClick={handleInitialGenerate}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 text-white font-mono text-sm font-bold tracking-wider flex items-center gap-3 mx-auto shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_45px_rgba(6,182,212,0.8)] transition-all cursor-pointer"
          >

            <Cpu
              className="w-5 h-5 text-white"
              style={{ animationDuration: "6s" }}
            />

            <span>GENERATE INTERVIEW QUESTIONS</span>

            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />

          </motion.button>

        </motion.div>
      )}


      {/* ================================================================ */}
      {/* AI GENERATION ANIMATION                                          */}
      {/* ================================================================ */}

      <AnimatePresence>

        {isGenerating && (

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-3xl p-10 md:p-14 border border-cyan-400/40 bg-slate-950/80 text-center relative overflow-hidden"
          >

            <div className="w-20 h-20 rounded-full bg-cyan-950/70 border-2 border-cyan-400/60 flex items-center justify-center mx-auto mb-6 shadow-[0_0_35px_rgba(6,182,212,0.6)] animate-soft-pulse">

              <Cpu
                className="w-10 h-10 text-cyan-300 animate-spin"
                style={{ animationDuration: "4s" }}
              />

            </div>


            {/* Pipeline */}

            <div className="flex items-center justify-center gap-2 md:gap-4 mb-6 flex-wrap">

              {AI_PIPELINE_STEPS.map((step, idx) => {

                const isPassed = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div
                    key={step.id}
                    className="flex items-center gap-2"
                  >

                    <div
                      className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all ${
                        isCurrent
                          ? "bg-cyan-500 text-slate-950 border border-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.7)] scale-110"
                          : isPassed
                          ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                          : "bg-white/5 text-slate-500 border border-white/10"
                      }`}
                    >
                      {step.label}
                    </div>

                    {idx < AI_PIPELINE_STEPS.length - 1 && (
                      <span className="text-slate-600 text-xs">
                        →
                      </span>
                    )}

                  </div>
                );
              })}

            </div>


            <div className="h-10 text-base font-mono text-cyan-200">
              {AI_PIPELINE_STEPS[currentStepIndex]?.text}
            </div>


            <div className="w-64 h-[2px] bg-slate-800 rounded-full mx-auto mt-4 overflow-hidden">

              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300"
                style={{
                  width: `${
                    ((currentStepIndex + 1) /
                      AI_PIPELINE_STEPS.length) *
                    100
                  }%`,
                }}
              />

            </div>

          </motion.div>
        )}

      </AnimatePresence>


      {/* ================================================================ */}
      {/* QUESTION WORKSPACE                                               */}
      {/* ================================================================ */}

      {questionsGenerated && !isGenerating && (

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >

          {/* ============================================================ */}
          {/* ACTION BAR                                                    */}
          {/* ============================================================ */}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">

            <div>

              <div className="text-xs font-mono text-cyan-400 flex items-center gap-2">

                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

                <span>
                  {questions.length} QUESTIONS READY
                </span>

              </div>

              <div className="text-[11px] font-mono text-slate-500 mt-1">
                Generate more whenever you need additional interviewer probes.
              </div>

            </div>


            {/* Generate more */}

            <motion.button
              onClick={handleGenerateMore}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 hover:border-cyan-400/60 text-cyan-300 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
            >

              <Plus className="w-4 h-4" />

              <span>Generate More Questions</span>

            </motion.button>

          </div>


          {/* ============================================================ */}
          {/* UNLIMITED QUESTION TIMELINE                                  */}
          {/* ============================================================ */}

          <div className="relative pl-6 md:pl-10 space-y-6 before:absolute before:left-3 md:before:left-5 before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-cyan-500 before:via-indigo-500 before:to-transparent">

            {questions.map((q, index) => {

              const isActive = activeQuestionId === q.id;

              return (

                <motion.div
                  key={q.id}
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: Math.min(index * 0.03, 0.3),
                  }}
                  className="relative"
                >

                  {/* Timeline node */}

                  <div
                    className={`absolute -left-6 md:-left-10 top-5 w-4 h-4 rounded-full border-2 transition-all ${
                      isActive
                        ? "bg-cyan-400 border-white shadow-[0_0_15px_rgba(56,189,248,0.8)] scale-125"
                        : "bg-slate-900 border-slate-600"
                    }`}
                  />


                  {/* Question */}

                  <motion.div
                    onClick={() => setActiveQuestionId(q.id)}
                    whileHover={{ scale: 1.005 }}
                    className={`rounded-2xl border p-6 transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-slate-900/90 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)]"
                        : "bg-white/[0.02] border-white/10 hover:border-white/20"
                    }`}
                  >

                    {/* Question metadata */}

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">

                      <div className="flex items-center gap-2.5 flex-wrap">

                        <span className="text-xs font-mono font-bold text-cyan-400">
                          QUESTION {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                          {q.category}
                        </span>

                      </div>

                      <span className="text-xs font-mono text-slate-400">
                        Target: {q.skillTarget}
                      </span>

                    </div>


                    {/* Question text */}

                    <p className="text-base md:text-lg font-medium text-slate-100 mb-5 font-sans leading-relaxed">
                      "{q.question}"
                    </p>


                    {/* Why */}

                    <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/25 flex items-start gap-2.5">

                      <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />

                      <div>

                        <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-semibold block mb-0.5">
                          WHY THIS QUESTION?
                        </span>

                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          {q.whyThisQuestion}
                        </p>

                      </div>

                    </div>

                  </motion.div>

                </motion.div>
              );
            })}

          </div>


          {/* ============================================================ */}
          {/* GENERATE MORE CTA                                             */}
          {/* ============================================================ */}

          <div className="py-8 border-y border-white/10 text-center">

            <div className="text-xs font-mono text-slate-400 mb-4">
              Need more depth? Generate another set of targeted questions.
            </div>

            <motion.button
              onClick={handleGenerateMore}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-200 font-mono text-xs uppercase tracking-wider font-semibold inline-flex items-center gap-2 transition-all cursor-pointer"
            >

              <RefreshCw className="w-4 h-4" />

              Generate 6 More Questions

            </motion.button>

          </div>


          {/* ============================================================ */}
          {/* NEXT STAGE                                                    */}
          {/* ============================================================ */}

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">

            <div className="text-xs font-mono text-slate-400 flex items-center gap-2">

              <ShieldAlert className="w-4 h-4 text-cyan-400" />

              <span>
                Questions prepared for live interviewer use
              </span>

            </div>


            <button
              onClick={onProceedToAnalysis}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 font-mono text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.25)]"
            >

              <span>
                Launch Live Transcript Analysis
              </span>

              <ArrowRight className="w-4 h-4" />

            </button>

          </div>

        </motion.div>
      )}

    </section>
  );
}