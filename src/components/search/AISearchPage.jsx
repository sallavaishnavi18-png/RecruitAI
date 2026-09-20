import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Sparkles,
  Cpu,
  User,
  ArrowRight,
  CornerDownLeft,
  Plus,
} from 'lucide-react';
import { MOCK_CANDIDATES } from '../../data/mockData';

const SEARCH_PIPELINE = [
  'UNDERSTANDING QUERY',
  'SEARCHING EVIDENCE',
  'MAPPING REQUIREMENTS',
  'FINDING CANDIDATES',
];

const SUGGESTED_PROMPTS = [
  'Find candidates with Python and React.',
  'Who needs AWS validation?',
  'Show candidates with strong ML projects.',
  'Which candidates have unanswered technical areas?',
];

export default function AISearchPage({ onSelectCandidate }) {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineIndex, setPipelineIndex] = useState(0);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      timestamp: 'Now',
      text:
        'Hello! I am RecruitAI. Ask me anything about candidate evidence, skills, experience, projects, requirements, or validation gaps across your talent pool.',
    },
  ]);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, isProcessing]);

  // Generate a simulated response from local mock data
  const generateResponse = (question) => {
    const lowerQ = question.toLowerCase();

    let matchedCandidates = [];
    let responseText = '';

    // Python + React
    if (
      lowerQ.includes('python') &&
      lowerQ.includes('react')
    ) {
      matchedCandidates = MOCK_CANDIDATES.filter((candidate) => {
        const skills = candidate.skills || [];

        return (
          skills.some((skill) => skill.name === 'Python') &&
          skills.some((skill) => skill.name === 'React')
        );
      });

      if (matchedCandidates.length > 0) {
        responseText =
          `I found ${matchedCandidates.length} candidate${
            matchedCandidates.length === 1 ? '' : 's'
          } with evidence of both Python and React experience. ` +
          'The matching candidate records are shown below.';
      } else {
        responseText =
          'I could not find a candidate with evidence for both Python and React in the current candidate pool.';
      }
    }

    // AWS / validation
    else if (
      lowerQ.includes('aws') ||
      lowerQ.includes('validation') ||
      lowerQ.includes('validate')
    ) {
      matchedCandidates = MOCK_CANDIDATES.filter(
        (candidate) =>
          candidate.validationGaps &&
          candidate.validationGaps.length > 0
      );

      if (matchedCandidates.length > 0) {
        responseText =
          `I found ${matchedCandidates.length} candidate${
            matchedCandidates.length === 1 ? '' : 's'
          } with recorded validation gaps. These areas may require additional recruiter or interview verification.`;
      } else {
        responseText =
          'I could not find any recorded AWS or validation gaps in the current candidate evidence.';
      }
    }

    // ML / AI
    else if (
      lowerQ.includes('ml') ||
      lowerQ.includes('machine learning') ||
      lowerQ.includes('machine-learning') ||
      lowerQ.includes('ai')
    ) {
      matchedCandidates = MOCK_CANDIDATES.filter((candidate) => {
        const skills = candidate.skills || [];

        return (
          candidate.jobTitle?.toLowerCase().includes('ai') ||
          candidate.title?.toLowerCase().includes('ai') ||
          candidate.name === 'Priya Reddy' ||
          skills.some((skill) => {
            const skillName = skill.name?.toLowerCase() || '';

            return (
              skillName.includes('machine') ||
              skillName.includes('tensor')
            );
          })
        );
      });

      if (matchedCandidates.length > 0) {
        responseText =
          `I found ${matchedCandidates.length} candidate${
            matchedCandidates.length === 1 ? '' : 's'
          } with relevant AI or machine-learning evidence.`;
      } else {
        responseText =
          'I could not find matching ML or AI evidence in the current candidate pool.';
      }
    }

    // Unanswered / technical gaps
    else if (
      lowerQ.includes('unanswered') ||
      lowerQ.includes('technical') ||
      lowerQ.includes('gap') ||
      lowerQ.includes('gaps')
    ) {
      matchedCandidates = MOCK_CANDIDATES.filter(
        (candidate) =>
          candidate.validationGaps &&
          candidate.validationGaps.length > 0
      );

      if (matchedCandidates.length > 0) {
        responseText =
          `${matchedCandidates.length} candidate${
            matchedCandidates.length === 1 ? '' : 's'
          } currently have recorded evidence gaps that may need further technical validation.`;
      } else {
        responseText =
          'I could not find any recorded technical evidence gaps in the current candidate pool.';
      }
    }

    // Experience / tenure
    else if (
      lowerQ.includes('experience') ||
      lowerQ.includes('years') ||
      lowerQ.includes('tenure')
    ) {
      matchedCandidates = [...MOCK_CANDIDATES];

      responseText =
        'I found experience and tenure information across the candidate pool. Open a candidate dossier below to inspect the available evidence.';
    }

    // Default response
    else {
      matchedCandidates = [...MOCK_CANDIDATES];

      responseText =
        `I searched the available candidate evidence for "${question}". ` +
        'The workspace contains resume, project, skill, requirement, and validation evidence. ' +
        'I have surfaced the available candidate records below for further inspection.';
    }

    return {
      text: responseText,
      candidates: matchedCandidates,
    };
  };

  // Send a question
  const handleSubmit = (overrideQuery = '') => {
    const textToSend =
      overrideQuery.trim() || query.trim();

    if (!textToSend || isProcessing) {
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      text: textToSend,
    };

    // Keep the previous conversation
    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setQuery('');
    setIsProcessing(true);
    setPipelineIndex(0);

    let step = 0;

    const interval = setInterval(() => {
      step += 1;

      if (step < SEARCH_PIPELINE.length) {
        setPipelineIndex(step);
        return;
      }

      clearInterval(interval);

      setTimeout(() => {
        const response = generateResponse(textToSend);

        const aiMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          text: response.text,
          candidates: response.candidates,
        };

        setMessages((previous) => [
          ...previous,
          aiMessage,
        ]);

        setIsProcessing(false);
        setPipelineIndex(0);
      }, 350);
    }, 280);
  };

  // Start a new conversation
  const handleNewChat = () => {
    if (isProcessing) {
      return;
    }

    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        timestamp: 'Now',
        text:
          'New conversation started. Ask me anything about your candidate evidence.',
      },
    ]);

    setQuery('');
    setPipelineIndex(0);
  };

  // Enter = send
  const handleKeyDown = (event) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <section className="w-full max-w-5xl mx-auto py-6 md:py-8 px-4 md:px-6 flex flex-col min-h-[82vh]">

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />

            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400/80">
              CANDIDATE INTELLIGENCE
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-medium tracking-tight text-white">
            AI Search
          </h1>

          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Ask RecruitAI anything about your candidate evidence.
          </p>
        </div>

        {/* NEW CHAT */}
        <button
          onClick={handleNewChat}
          disabled={isProcessing}
          className="flex items-center gap-2 text-[11px] font-mono text-slate-400 hover:text-cyan-300 disabled:opacity-30 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          NEW CHAT
        </button>

      </div>

      {/* CONVERSATION */}
      <div className="flex-1 overflow-y-auto pr-1 pb-8 space-y-9">

        {messages.map((message) => {
          const isUser = message.sender === 'user';

          return (
            <motion.div
              key={message.id}
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className={`flex flex-col ${
                isUser
                  ? 'items-end'
                  : 'items-start'
              }`}
            >

              {/* MESSAGE META */}
              <div
                className={`flex items-center gap-2 mb-2 text-[10px] font-mono ${
                  isUser
                    ? 'text-cyan-400/60'
                    : 'text-slate-500'
                }`}
              >

                {isUser ? (
                  <User className="w-3 h-3 text-cyan-400" />
                ) : (
                  <Cpu className="w-3 h-3 text-cyan-400" />
                )}

                <span>
                  {isUser ? 'YOU' : 'RECRUITAI'}
                </span>

                <span>•</span>

                <span>
                  {message.timestamp}
                </span>

              </div>

              {/* MESSAGE */}
              <div
                className={`max-w-[90%] md:max-w-[75%] text-sm md:text-[15px] leading-7 font-sans ${
                  isUser
                    ? 'text-cyan-100 text-right'
                    : 'text-slate-200 text-left'
                }`}
              >

                <div className="whitespace-pre-line">
                  {message.text}
                </div>

                {/* CANDIDATE RESULTS */}
                {message.candidates &&
                  message.candidates.length > 0 && (

                    <div className="mt-5 space-y-1">

                      {message.candidates.map(
                        (candidate) => (

                          <button
                            key={`${message.id}-${candidate.id}`}
                            onClick={() => {
                              if (onSelectCandidate) {
                                onSelectCandidate(candidate);
                              }
                            }}
                            className="group w-full flex items-center justify-between gap-4 py-3 border-b border-white/5 text-left hover:border-cyan-400/30 transition-colors"
                          >

                            <div className="flex items-center gap-3">

                              <div className="w-8 h-8 rounded-full border border-cyan-400/20 bg-cyan-400/5 flex items-center justify-center text-[9px] font-mono text-white">
                                {candidate.avatar}
                              </div>

                              <div>

                                <div className="text-xs font-medium text-white">
                                  {candidate.name}
                                </div>

                                <div className="text-[10px] text-white/35 mt-0.5">
                                  {candidate.title}
                                  {' • '}
                                  {candidate.coverageScore}%
                                  {' '}coverage
                                </div>

                              </div>

                            </div>

                            <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-cyan-300 transition-colors" />

                          </button>

                        )
                      )}

                    </div>
                  )}

              </div>

            </motion.div>
          );
        })}

        {/* AI PROCESSING */}
        {isProcessing && (

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="flex flex-col items-start gap-2"
          >

            <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400">

              <Cpu className="w-3.5 h-3.5 animate-spin" />

              <span>
                {SEARCH_PIPELINE[pipelineIndex]}
              </span>

            </div>

            <div className="flex items-center gap-1.5">

              {SEARCH_PIPELINE.map(
                (step, index) => (

                  <div
                    key={step}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index <= pipelineIndex
                        ? 'w-6 bg-cyan-400'
                        : 'w-2 bg-white/10'
                    }`}
                  />

                )
              )}

            </div>

            <span className="text-[10px] font-mono text-slate-600">
              Searching candidate evidence...
            </span>

          </motion.div>
        )}

        <div ref={messagesEndRef} />

      </div>

      {/* SUGGESTED QUESTIONS */}
      <div className="pt-4 border-t border-white/10 mb-3">

        <div className="flex items-center gap-2 mb-2">

          <Sparkles className="w-3 h-3 text-cyan-400/60" />

          <span className="text-[9px] font-mono uppercase tracking-wider text-slate-600">
            Suggested questions
          </span>

        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-1">

          {SUGGESTED_PROMPTS.map(
            (prompt) => (

              <button
                key={prompt}
                disabled={isProcessing}
                onClick={() => handleSubmit(prompt)}
                className="text-[10px] md:text-[11px] font-mono text-slate-500 hover:text-cyan-300 disabled:opacity-20 transition-colors text-left"
              >
                → {prompt}
              </button>

            )
          )}

        </div>

      </div>

      {/* INPUT */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
        className="flex items-center gap-3"
      >

        <div className="relative flex-1">

          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />

          <input
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            placeholder="Ask another question..."
            className="w-full pl-11 pr-4 py-3.5 bg-black/30 border border-white/10 focus:border-cyan-400/50 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none transition-colors"
          />

        </div>

        <button
          type="submit"
          disabled={
            !query.trim() ||
            isProcessing
          }
          className="px-4 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-20 disabled:cursor-not-allowed text-slate-950 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all shrink-0"
        >
          SEND

          <CornerDownLeft className="w-3 h-3" />
        </button>

      </form>

      {/* FOOTER */}
      <div className="text-center mt-3 text-[10px] font-mono text-slate-600">
        Continue asking questions until you choose to stop • Human recruiter review required for hiring decisions
      </div>

    </section>
  );
}