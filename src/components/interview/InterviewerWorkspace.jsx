import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Cpu,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Activity,
  Plus,
} from 'lucide-react';

const AI_PIPELINE_STEPS = [
  {
    id: 'scan',
    label: 'SCAN',
    text: 'Scanning candidate repositories & resume signals...',
  },
  {
    id: 'understand',
    label: 'UNDERSTAND',
    text: 'Analyzing code complexity, architecture & tenure...',
  },
  {
    id: 'map',
    label: 'MAP',
    text: 'Mapping evidence against role requirements...',
  },
  {
    id: 'validate',
    label: 'VALIDATE',
    text: 'Isolating technical ambiguities and validation gaps...',
  },
  {
    id: 'insight',
    label: 'INSIGHT',
    text: 'Generating the next targeted interviewer probe...',
  },
];

/*
|--------------------------------------------------------------------------
| Unlimited Question Engine
|--------------------------------------------------------------------------
| These templates are used to continuously create new questions.
| No API or backend is required.
|--------------------------------------------------------------------------
*/

const QUESTION_TEMPLATES = [
  {
    category: 'Technical Architecture',
    skillTarget: 'Core Engineering',
    question:
      'Walk me through the most technically complex production feature you personally designed and implemented. What were the important trade-offs?',
    whyThisQuestion:
      'Tests whether the candidate can explain engineering decisions rather than only describing technologies used.',
    validation:
      'Listen for ownership, concrete constraints, trade-offs, failure handling, and measurable outcomes.',
  },
  {
    category: 'Python',
    skillTarget: 'Python',
    question:
      'Tell me about a production system where you used Python. How did you structure the application as it grew in complexity?',
    whyThisQuestion:
      'Validates whether Python experience extends beyond scripts or isolated development tasks.',
    validation:
      'Look for modular architecture, dependency management, testing, performance considerations, and maintainability.',
  },
  {
    category: 'Database',
    skillTarget: 'SQL / Data Layer',
    question:
      'Describe a database performance problem you encountered. How did you identify the bottleneck and what did you change?',
    whyThisQuestion:
      'Tests practical database troubleshooting and performance reasoning.',
    validation:
      'Listen for query plans, indexing, connection behavior, schema decisions, and measurable performance improvements.',
  },
  {
    category: 'Cloud',
    skillTarget: 'AWS / Cloud',
    question:
      'Describe a system you deployed to the cloud. What infrastructure decisions did you personally make?',
    whyThisQuestion:
      'Cloud appears frequently in engineering profiles, but deployment ownership needs direct validation.',
    validation:
      'Verify whether the candidate actually configured or operated infrastructure rather than only consuming a deployed service.',
  },
  {
    category: 'System Design',
    skillTarget: 'Scalability',
    question:
      'Suppose your application suddenly receives ten times its current traffic. What would you investigate first and what would you change?',
    whyThisQuestion:
      'Tests practical scalability reasoning under an unfamiliar but realistic scenario.',
    validation:
      'Look for bottleneck identification, caching, databases, queues, horizontal scaling, observability, and trade-offs.',
  },
  {
    category: 'Frontend',
    skillTarget: 'React',
    question:
      'Tell me about a React application that became difficult to maintain. What architectural changes did you make?',
    whyThisQuestion:
      'Validates whether frontend experience includes architecture and maintainability rather than only component creation.',
    validation:
      'Listen for state management, component boundaries, data flow, performance, testing, and maintainability.',
  },
  {
    category: 'Backend',
    skillTarget: 'Node.js / APIs',
    question:
      'Describe an API you designed. How did you handle validation, errors, authentication boundaries, and versioning?',
    whyThisQuestion:
      'Tests real backend API design experience.',
    validation:
      'Look for concrete endpoint design, validation strategy, error contracts, security boundaries, and backward compatibility.',
  },
  {
    category: 'Distributed Systems',
    skillTarget: 'Distributed Systems',
    question:
      'Tell me about a situation where two services or processes could disagree about the state of the same data. How did you handle it?',
    whyThisQuestion:
      'Explores understanding of consistency and distributed-state problems.',
    validation:
      'Listen for idempotency, transactions, retries, event ordering, locks, consistency models, or reconciliation.',
  },
  {
    category: 'Concurrency',
    skillTarget: 'Concurrency',
    question:
      'Describe a concurrency problem you have encountered. What caused it and how did you prevent it from happening again?',
    whyThisQuestion:
      'Validates whether the candidate has dealt with real concurrent workloads.',
    validation:
      'Look for race conditions, locks, connection pools, transactions, queues, async behavior, or synchronization strategies.',
  },
  {
    category: 'Testing',
    skillTarget: 'Testing',
    question:
      'How do you decide what should be covered by unit tests, integration tests, and end-to-end tests?',
    whyThisQuestion:
      'Tests engineering maturity around verification strategy.',
    validation:
      'Look for test boundaries, confidence, speed, isolation, regression prevention, and realistic examples.',
  },
  {
    category: 'Observability',
    skillTarget: 'Monitoring',
    question:
      'A production API suddenly becomes slow, but there are no obvious application errors. How would you investigate it?',
    whyThisQuestion:
      'Tests practical production debugging and observability knowledge.',
    validation:
      'Look for metrics, traces, logs, database latency, infrastructure signals, profiling, and controlled investigation.',
  },
  {
    category: 'Security',
    skillTarget: 'Application Security',
    question:
      'What security risks would you specifically look for when reviewing a new backend API before releasing it?',
    whyThisQuestion:
      'Validates whether security is considered during engineering rather than only after incidents.',
    validation:
      'Listen for authentication, authorization, injection, secrets, rate limiting, input validation, logging, and data exposure.',
  },
  {
    category: 'Architecture',
    skillTarget: 'Architecture',
    question:
      'Tell me about a time you had to choose between a simple architecture and a more distributed architecture. What influenced your decision?',
    whyThisQuestion:
      'Tests whether the candidate understands architectural trade-offs.',
    validation:
      'Look for complexity cost, team size, traffic, reliability, operational burden, and business requirements.',
  },
  {
    category: 'Caching',
    skillTarget: 'Caching',
    question:
      'Where would you introduce caching into a high-traffic application, and what problems could caching create?',
    whyThisQuestion:
      'Tests practical understanding of performance optimization and stale data.',
    validation:
      'Listen for cache invalidation, TTL, consistency, cache stampede, memory limits, and failure behavior.',
  },
  {
    category: 'Queues',
    skillTarget: 'Async Processing',
    question:
      'When would you move work from a synchronous API request into an asynchronous queue?',
    whyThisQuestion:
      'Validates understanding of latency, reliability, and workload isolation.',
    validation:
      'Look for long-running work, retries, backpressure, idempotency, delivery guarantees, and user experience.',
  },
  {
    category: 'DevOps',
    skillTarget: 'Deployment',
    question:
      'Walk me through what happens from merging code to having that change safely running in production.',
    whyThisQuestion:
      'Tests understanding of the software delivery lifecycle.',
    validation:
      'Look for CI/CD, automated tests, artifact creation, deployment strategy, rollback, monitoring, and approvals.',
  },
  {
    category: 'Incident Response',
    skillTarget: 'Production Operations',
    question:
      'Tell me about a production incident you were involved in. What happened, how did you respond, and what changed afterward?',
    whyThisQuestion:
      'Provides evidence of real production ownership and learning from failures.',
    validation:
      'Look for structured diagnosis, communication, mitigation, root cause, and preventative improvements.',
  },
  {
    category: 'Code Quality',
    skillTarget: 'Maintainability',
    question:
      'How do you recognize when a codebase is becoming difficult to maintain, and what do you do about it?',
    whyThisQuestion:
      'Tests long-term engineering thinking rather than feature-only delivery.',
    validation:
      'Listen for coupling, duplication, unclear boundaries, testing gaps, refactoring strategy, and incremental improvement.',
  },
  {
    category: 'Performance',
    skillTarget: 'Performance Engineering',
    question:
      'Describe a performance improvement you made. How did you measure that the change actually helped?',
    whyThisQuestion:
      'Distinguishes measurable performance engineering from assumptions.',
    validation:
      'Look for baseline measurements, profiling, controlled comparison, latency/throughput metrics, and regression monitoring.',
  },
  {
    category: 'Leadership',
    skillTarget: 'Technical Ownership',
    question:
      'Tell me about a technical decision where other engineers disagreed with your approach. How did you reach a decision?',
    whyThisQuestion:
      'Explores technical communication and decision-making within an engineering team.',
    validation:
      'Look for evidence-based discussion, alternatives, collaboration, documentation, and willingness to revise decisions.',
  },
  {
    category: 'Debugging',
    skillTarget: 'Problem Solving',
    question:
      'A bug only happens occasionally and cannot be reproduced locally. How would you approach the investigation?',
    whyThisQuestion:
      'Tests structured debugging under uncertainty.',
    validation:
      'Look for instrumentation, reproduction strategy, logs, traces, controlled experiments, and hypothesis-driven debugging.',
  },
  {
    category: 'Data Layer',
    skillTarget: 'Transactions',
    question:
      'Describe a situation where multiple database operations needed to succeed or fail together. How did you handle that?',
    whyThisQuestion:
      'Tests practical understanding of data consistency.',
    validation:
      'Listen for transactions, isolation, rollback, idempotency, locking, and failure handling.',
  },
  {
    category: 'Reliability',
    skillTarget: 'Fault Tolerance',
    question:
      'What should happen when a dependency your service relies on becomes unavailable?',
    whyThisQuestion:
      'Validates resilience thinking and dependency failure handling.',
    validation:
      'Look for timeouts, retries, circuit breakers, fallback behavior, queues, graceful degradation, and observability.',
  },
  {
    category: 'API Design',
    skillTarget: 'API Contracts',
    question:
      'How would you design an API contract so that multiple teams can safely depend on it over time?',
    whyThisQuestion:
      'Tests long-term API design and compatibility thinking.',
    validation:
      'Listen for versioning, schemas, backwards compatibility, documentation, validation, and deprecation strategy.',
  },
  {
    category: 'Architecture Review',
    skillTarget: 'Technical Trade-offs',
    question:
      'If you were reviewing your own most important project today, what architectural decision would you reconsider and why?',
    whyThisQuestion:
      'Tests reflection and ability to identify engineering trade-offs after gaining experience.',
    validation:
      'Look for specific evidence rather than generic hindsight statements.',
  },
];

/*
|--------------------------------------------------------------------------
| Question Factory
|--------------------------------------------------------------------------
*/

function createGeneratedQuestion(index, candidate) {
  const template =
    QUESTION_TEMPLATES[index % QUESTION_TEMPLATES.length];

  const cycle = Math.floor(index / QUESTION_TEMPLATES.length);

  const candidateName = candidate?.name || 'the candidate';

  /*
   * Slightly vary questions when the template bank loops.
   * This allows the interviewer to keep generating questions indefinitely.
   */
  const variations = [
    '',
    ' Focus specifically on your personal contribution.',
    ' Include a concrete example from your previous work.',
    ' Explain the decision-making process step by step.',
    ' Describe what you would do differently today.',
    ' Include how you measured the outcome.',
  ];

  const variation = variations[cycle % variations.length];

  return {
    id: `generated-${index}-${Date.now()}`,
    number: index + 1,
    category: template.category,
    skillTarget: template.skillTarget,
    question: `${template.question}${variation}`,
    whyThisQuestion: template.whyThisQuestion,
    validation: template.validation,
    candidateName,
    generated: true,
  };
}

/*
|--------------------------------------------------------------------------
| Build initial question set
|--------------------------------------------------------------------------
*/

function buildInitialQuestions(candidate) {
  const existing = candidate?.interviewQuestions || [];

  const normalizedExisting = existing.map((question, index) => ({
    ...question,
    number: index + 1,
    generated: false,
  }));

  /*
   * Start with the candidate's existing questions and add generated
   * questions immediately so the interviewer never sees a 4-question limit.
   */
  const generated = [];

  for (let i = normalizedExisting.length; i < 10; i++) {
    generated.push(
      createGeneratedQuestion(i, candidate)
    );
  }

  return [...normalizedExisting, ...generated];
}

export default function InterviewerWorkspace({
  candidate,
  onProceedToAnalysis,
  onOpenSlidePanel,
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [questions, setQuestions] = useState(() =>
    buildInitialQuestions(candidate)
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [interviewerNotes, setInterviewerNotes] = useState({});

  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewType, setInterviewType] = useState("Technical Interview");
  const [scheduleMessage, setScheduleMessage] = useState("");
  const [scheduling, setScheduling] = useState(false);

  const handleScheduleInterview = async () => {
    if (!interviewDate || !interviewTime) {
      setScheduleMessage("Please select a date and time.");
      return;
    }

    setScheduling(true);
    setScheduleMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/interviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          candidate_name: candidate?.name || "Unknown Candidate",
          job_title:
            candidate?.jobTitle ||
            candidate?.title ||
            "Unknown Role",
          interview_type: interviewType,
          interview_date: interviewDate,
          interview_time: interviewTime
        })
      });

      if (!response.ok) {
        throw new Error("Failed to schedule interview");
      }

      setScheduleMessage("Interview scheduled successfully.");
    } catch (error) {
      console.error(error);
      setScheduleMessage("Could not schedule interview.");
    } finally {
      setScheduling(false);
    }
  };

  const [validatedQuestions, setValidatedQuestions] = useState({
    'q-01': true,
  });

  const currentQ = questions[currentQuestionIndex];

  /*
  |--------------------------------------------------------------------------
  | Generate another question
  |--------------------------------------------------------------------------
  */

  const generateNextQuestion = () => {
    const newQuestion = createGeneratedQuestion(
      questions.length,
      candidate
    );

    setQuestions((previous) => [
      ...previous,
      newQuestion,
    ]);

    setCurrentQuestionIndex(questions.length);
  };

  /*
  |--------------------------------------------------------------------------
  | Generate more questions
  |--------------------------------------------------------------------------
  */

  const generateMoreQuestions = (amount = 5) => {
    setIsGenerating(true);
    setCurrentStepIndex(0);

    let step = 0;

    const interval = setInterval(() => {
      step++;

      if (step < AI_PIPELINE_STEPS.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);

        setTimeout(() => {
          setQuestions((previous) => {
            const newQuestions = [];

            for (let i = 0; i < amount; i++) {
              const nextIndex = previous.length + i;

              newQuestions.push(
                createGeneratedQuestion(
                  nextIndex,
                  candidate
                )
              );
            }

            return [
              ...previous,
              ...newQuestions,
            ];
          });

          setIsGenerating(false);
        }, 350);
      }
    }, 400);
  };

  /*
  |--------------------------------------------------------------------------
  | Re-generate / synthesize
  |--------------------------------------------------------------------------
  */

  const handleGenerate = () => {
    generateMoreQuestions(5);
  };

  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  const toggleValidated = (qId) => {
    setValidatedQuestions((previous) => ({
      ...previous,
      [qId]: !previous[qId],
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Interviewer notes
  |--------------------------------------------------------------------------
  */

  const handleNoteChange = (qId, text) => {
    setInterviewerNotes((previous) => ({
      ...previous,
      [qId]: text,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Next question
  |--------------------------------------------------------------------------
  */

  const handleNextQuestion = () => {
    /*
     * If interviewer is NOT at the final question,
     * simply move forward.
     */
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(
        (previous) => previous + 1
      );

      return;
    }

    /*
     * If interviewer reaches the final question,
     * automatically create another one.
     */
    generateNextQuestion();
  };

  /*
  |--------------------------------------------------------------------------
  | Previous question
  |--------------------------------------------------------------------------
  */

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((previous) =>
      Math.max(0, previous - 1)
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Jump directly to a question
  |--------------------------------------------------------------------------
  */

  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
  };

  return (
    <section className="w-full max-w-6xl mx-auto py-8 px-4 select-none">

      {/* ================================================================
          HEADER
      ================================================================= */}

      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 mb-8 border-b border-white/10 gap-4">

        <div>
          <div className="flex items-center gap-2 mb-1.5">

            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />

            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
              INTERVIEWER CO-PILOT WORKSPACE
            </span>

          </div>

          <h2 className="text-2xl md:text-4xl font-bold font-mono text-white tracking-tight">
            CANDIDATE INTERVIEW ASSESSMENT
          </h2>

          <div className="text-xs font-mono text-slate-400 mt-1 flex items-center gap-2 flex-wrap">

            <span>
              Candidate:{' '}
              <strong className="text-slate-200">
                {candidate?.name || 'Rahul Sharma'}
              </strong>
            </span>

            <span>•</span>

            <span>
              Role:{' '}
              <strong className="text-slate-200">
                {candidate?.jobTitle ||
                  candidate?.title ||
                  'Senior Software Engineer'}
              </strong>
            </span>

            <span>•</span>

            <span className="text-cyan-400 font-medium">
              {candidate?.coverageScore || 92}%
              {' '}Evidence Corroborated
            </span>

          </div>
        </div>

        {/* HEADER ACTIONS */}

        <div className="flex items-center gap-3 flex-wrap">

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono text-xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Cpu
              className={`w-3.5 h-3.5 text-cyan-400 ${
                isGenerating ? 'animate-spin' : ''
              }`}
            />

            <span>
              {isGenerating
                ? 'Generating...'
                : 'Generate 5 More'}
            </span>
          </button>

          <button
            onClick={onProceedToAnalysis}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 font-mono text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />

            <span>
              Live Analysis Graph
            </span>
          </button>

        </div>
      </div>

      {/* ================================================================
          AI GENERATION PIPELINE
      ================================================================= */}

      <AnimatePresence>

        {isGenerating && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
            }}
            className="glass-panel-glow rounded-3xl p-10 md:p-14 border border-cyan-400/40 text-center relative overflow-hidden mb-8"
          >

            <div className="w-16 h-16 rounded-full bg-cyan-950/70 border-2 border-cyan-400/60 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(6,182,212,0.5)] animate-soft-pulse">

              <Cpu
                className="w-8 h-8 text-cyan-300 animate-spin"
                style={{
                  animationDuration: '4s',
                }}
              />

            </div>

            <div className="flex items-center justify-center gap-2 md:gap-3 mb-5 flex-wrap">

              {AI_PIPELINE_STEPS.map(
                (step, idx) => {

                  const isPassed =
                    idx < currentStepIndex;

                  const isCurrent =
                    idx === currentStepIndex;

                  return (
                    <div
                      key={step.id}
                      className="flex items-center gap-2"
                    >

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

                      {idx <
                        AI_PIPELINE_STEPS.length -
                          1 && (
                        <span className="text-slate-600 text-xs">
                          →
                        </span>
                      )}

                    </div>
                  );
                }
              )}

            </div>

            <div className="h-8 text-sm font-mono text-cyan-200">
              {
                AI_PIPELINE_STEPS[
                  currentStepIndex
                ]?.text
              }
            </div>

          </motion.div>
        )}

      </AnimatePresence>

      {/* ================================================================
          QUESTION WORKSPACE
      ================================================================= */}

      {!isGenerating && currentQ && (
        <div className="space-y-6">

          {/* ============================================================
              QUESTION NAVIGATION
          ============================================================= */}

          <div className="border-b border-white/10 pb-4">

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

              {/* QUESTION STREAM */}

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none max-w-full">

                {questions.map(
                  (q, idx) => {

                    const isCurrent =
                      idx === currentQuestionIndex;

                    const isValidated =
                      validatedQuestions[q.id];

                    return (
                      <button
                        key={q.id}
                        onClick={() =>
                          handleQuestionSelect(
                            idx
                          )
                        }
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xs transition-all cursor-pointer whitespace-nowrap ${
                          isCurrent
                            ? 'bg-cyan-500/20 border border-cyan-400/60 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                            : 'bg-white/[0.03] border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
                        }`}
                      >

                        <span>
                          Q{q.number}
                        </span>

                        <span className="text-[10px] opacity-75">
                          {q.category
                            ?.split(' ')[0]
                            ?.toUpperCase()}
                        </span>

                        {isValidated && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        )}

                      </button>
                    );
                  }
                )}

              </div>

              {/* COUNTER */}

              <div className="flex items-center gap-3 self-end lg:self-auto shrink-0">

                <span className="text-xs font-mono text-slate-400">
                  Question{' '}
                  {currentQuestionIndex + 1}
                  {' '}of{' '}
                  {questions.length}
                </span>

                <div className="flex items-center gap-1">

                  <button
                    onClick={
                      handlePreviousQuestion
                    }
                    disabled={
                      currentQuestionIndex ===
                      0
                    }
                    className={`p-1.5 rounded-lg border transition-colors ${
                      currentQuestionIndex === 0
                        ? 'border-white/5 text-slate-600 cursor-not-allowed'
                        : 'border-white/10 text-slate-300 hover:bg-white/10 cursor-pointer'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={
                      handleNextQuestion
                    }
                    className="p-1.5 rounded-lg border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/10 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                </div>

              </div>

            </div>

            {/* UNLIMITED INDICATOR */}

            <div className="mt-3 flex items-center justify-between">

              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">

                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />

                <span>
                  CONTINUOUS QUESTION GENERATION ENABLED
                </span>

              </div>

              <button
                onClick={() =>
                  generateMoreQuestions(5)
                }
                className="text-[10px] font-mono text-cyan-400 hover:text-cyan-200 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                Generate 5 More
              </button>

            </div>

          </div>

          {/* ============================================================
              MAIN QUESTION AREA
          ============================================================= */}

          <motion.div
            key={currentQ.id}
            initial={{
              opacity: 0,
              x: 15,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.25,
            }}
            className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)] space-y-6"
          >

            {/* CATEGORY / STATUS */}

            <div className="flex flex-wrap items-center justify-between gap-3">

              <div className="flex items-center gap-2.5 flex-wrap">

                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                  QUESTION {currentQ.number}
                  {' // '}
                  {currentQ.category?.toUpperCase()}
                </span>

                <span className="text-xs font-mono text-slate-400">
                  Target:{' '}
                  <strong className="text-slate-200">
                    {currentQ.skillTarget}
                  </strong>
                </span>

                {currentQ.generated && (
                  <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 border border-indigo-400/20 px-2 py-1 rounded-lg">
                    AI GENERATED
                  </span>
                )}

              </div>

              <button
                onClick={() =>
                  toggleValidated(
                    currentQ.id
                  )
                }
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                  validatedQuestions[
                    currentQ.id
                  ]
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'
                }`}
              >

                <CheckCircle2 className="w-3.5 h-3.5" />

                <span>
                  {validatedQuestions[
                    currentQ.id
                  ]
                    ? 'Marked as Evaluated'
                    : 'Mark as Evaluated'}
                </span>

              </button>

            </div>

            {/* ========================================================
                QUESTION PROMPT
            ========================================================= */}

            <div className="p-5 rounded-2xl bg-black/40 border border-cyan-500/20">

              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block mb-2 font-semibold">
                INTERVIEW PROMPT TO READ OUT LOUD
              </span>

              <p className="text-lg md:text-2xl font-sans font-semibold text-white leading-relaxed">
                "{currentQ.question}"
              </p>

            </div>

            {/* ========================================================
                CONTEXT
            ========================================================= */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">

              {/* WHY */}

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-300 uppercase tracking-wider mb-2 font-semibold">

                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />

                  <span>
                    Why Ask This
                  </span>

                </div>

                <p className="text-slate-300 leading-relaxed">
                  {currentQ.whyThisQuestion}
                </p>

              </div>

              {/* EVIDENCE */}

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-indigo-300 uppercase tracking-wider mb-2 font-semibold">

                  <FileText className="w-3.5 h-3.5 text-indigo-400" />

                  <span>
                    Observed Evidence
                  </span>

                </div>

                <p className="text-slate-300 leading-relaxed">

                  {currentQ.skillTarget
                    ? `${currentQ.skillTarget} appears in the candidate evidence profile. This question is designed to validate depth and personal contribution.`
                    : 'Relevant candidate evidence has been mapped to this interview probe.'}

                </p>

              </div>

              {/* VALIDATION */}

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-300 uppercase tracking-wider mb-2 font-semibold">

                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />

                  <span>
                    Validation Context
                  </span>

                </div>

                <p className="text-amber-200/90 leading-relaxed">
                  {currentQ.validation}
                </p>

              </div>

            </div>

            {/* ========================================================
                INTERVIEWER NOTES
            ========================================================= */}

            <div>

              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">

                Interviewer Assessment Notes for Question{' '}
                {currentQ.number}:

              </label>

              <textarea
                rows={4}
                value={
                  interviewerNotes[
                    currentQ.id
                  ] || ''
                }
                onChange={(e) =>
                  handleNoteChange(
                    currentQ.id,
                    e.target.value
                  )
                }
                placeholder="Type candidate's verbal explanation, architectural depth, specific examples, concerns, and follow-up points..."
                className="w-full bg-black/40 border border-white/10 focus:border-cyan-400/80 rounded-xl p-3.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none transition-colors font-sans resize-y"
              />

            </div>

            {/* ========================================================
                NAVIGATION
            ========================================================= */}

            <div className="flex items-center justify-between pt-4 border-t border-white/10 gap-3">

              <button
                onClick={
                  handlePreviousQuestion
                }
                disabled={
                  currentQuestionIndex ===
                  0
                }
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-2 transition-colors cursor-pointer"
              >

                <ChevronLeft className="w-4 h-4" />

                <span>
                  Previous
                </span>

              </button>

              <button
                onClick={
                  handleNextQuestion
                }
                className="px-5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer"
              >

                <span>
                  {currentQuestionIndex ===
                  questions.length - 1
                    ? 'Generate Next Question'
                    : 'Next Question'}
                </span>

                {currentQuestionIndex ===
                questions.length - 1 ? (
                  <Sparkles className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}

              </button>

            </div>

          </motion.div>

          {/* ============================================================
              BOTTOM WORKSPACE ACTIONS
          ============================================================= */}

          <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">

            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">

              <ShieldCheck className="w-4 h-4 text-cyan-400" />

              <span>
                Recruiter-controlled interview assessment
              </span>

            </div>

            <div className="flex items-center gap-3">

              <button
                onClick={() =>
                  generateMoreQuestions(5)
                }
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono text-xs flex items-center gap-2 cursor-pointer"
              >

                <Plus className="w-3.5 h-3.5" />

                Generate 5 More

              </button>

              <button
                onClick={onProceedToAnalysis}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              >

                <span>
                  Proceed to Live Analysis Graph
                </span>

                <ArrowRight className="w-4 h-4" />

              </button>

            </div>

          </div>

        </div>
      )}

    </section>
  );
}
