import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Sparkles,
  Cpu,
  ArrowRight,
  CornerDownLeft,
  Plus,
} from 'lucide-react';
import { MOCK_CANDIDATES } from '../../data/mockData';

const SEARCH_SUGGESTIONS = [
  "Find candidates with Python and React.",
  "Who needs AWS validation?",
  "Show candidates with strong ML projects.",
  "Which candidates have unanswered technical areas?"
];

const SEARCH_PIPELINE = [
  "UNDERSTANDING QUERY",
  "SEARCHING EVIDENCE",
  "MAPPING REQUIREMENTS",
  "FINDING CANDIDATES"
];

export default function AISearchModal({
  isOpen,
  onClose,
  onSelectCandidate
}) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [pipelineIndex, setPipelineIndex] = useState(0);

  const messagesEndRef = useRef(null);

  // Auto-scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages, isSearching]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();

        if (isOpen) {
          onClose();
        }
      }

      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Generate response from local mock evidence
  const generateResponse = (searchQuery) => {
    const lowerQ = searchQuery.toLowerCase();

    let matched = MOCK_CANDIDATES;

    if (lowerQ.includes("python") && lowerQ.includes("react")) {
      matched = MOCK_CANDIDATES.filter((cand) =>
        cand.skills?.some((s) => s.name === "Python") &&
        cand.skills?.some((s) => s.name === "React")
      );
    }

    else if (
      lowerQ.includes("aws") ||
      lowerQ.includes("unanswered") ||
      lowerQ.includes("validation")
    ) {
      matched = MOCK_CANDIDATES.filter(
        (cand) =>
          cand.validationGaps &&
          cand.validationGaps.length > 0
      );
    }

    else if (
      lowerQ.includes("ml") ||
      lowerQ.includes("machine learning") ||
      lowerQ.includes("ai")
    ) {
      matched = MOCK_CANDIDATES.filter(
        (cand) =>
          cand.jobTitle?.includes("AI") ||
          cand.title?.includes("AI") ||
          cand.skills?.some(
            (s) =>
              s.name?.includes("Machine") ||
              s.name?.includes("Tensor")
          )
      );
    }

    const responseText = getResponseText(searchQuery, matched);

    return {
      text: responseText,
      candidates: matched.length > 0 ? matched : MOCK_CANDIDATES
    };
  };

  const getResponseText = (searchQuery, matchedCandidates) => {
    const lowerQ = searchQuery.toLowerCase();

    if (
      lowerQ.includes("python") &&
      lowerQ.includes("react")
    ) {
      if (matchedCandidates.length === 0) {
        return "I couldn't find a candidate with evidence for both Python and React in the current candidate pool.";
      }

      return `I found ${matchedCandidates.length} candidate${
        matchedCandidates.length > 1 ? "s" : ""
      } with evidence of both Python and React experience. The matching candidates are shown below.`;
    }

    if (
      lowerQ.includes("aws") ||
      lowerQ.includes("validation")
    ) {
      if (matchedCandidates.length === 0) {
        return "I couldn't find candidates with recorded validation gaps in the current evidence.";
      }

      return `I found ${matchedCandidates.length} candidate${
        matchedCandidates.length > 1 ? "s" : ""
      } with evidence areas that require further validation.`;
    }

    if (
      lowerQ.includes("ml") ||
      lowerQ.includes("machine learning") ||
      lowerQ.includes("ai")
    ) {
      if (matchedCandidates.length === 0) {
        return "I couldn't find a matching ML or AI evidence trail in the current candidate pool.";
      }

      return `I found ${matchedCandidates.length} candidate${
        matchedCandidates.length > 1 ? "s" : ""
      } with relevant AI or machine-learning evidence.`;
    }

    if (
      lowerQ.includes("technical") ||
      lowerQ.includes("unanswered")
    ) {
      return "The current candidate evidence contains technical areas that still require validation, including deployment depth, system design, and other interview-level evidence.";
    }

    return `I searched the available candidate evidence for "${searchQuery}". Relevant evidence has been mapped across resumes, projects, requirements, and validation data.`;
  };

  // Main search function
  const executeSearch = (searchQuery = query) => {
    const q = searchQuery.trim();

    if (!q || isSearching) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: q
    };

    setMessages((previous) => [
      ...previous,
      userMessage
    ]);

    setQuery("");
    setIsSearching(true);
    setPipelineIndex(0);

    let idx = 0;

    const interval = setInterval(() => {
      idx++;

      if (idx < SEARCH_PIPELINE.length) {
        setPipelineIndex(idx);
      } else {
        clearInterval(interval);

        setTimeout(() => {
          const response = generateResponse(q);

          const aiMessage = {
            id: Date.now() + 1,
            role: 'assistant',
            content: response.text,
            candidates: response.candidates
          };

          setMessages((previous) => [
            ...previous,
            aiMessage
          ]);

          setIsSearching(false);
        }, 350);
      }
    }, 280);
  };

  // Enter key
  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      executeSearch();
    }
  };

  // Start completely new conversation
  const startNewChat = () => {
    setMessages([]);
    setQuery("");
    setIsSearching(false);
    setPipelineIndex(0);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">

        {/* Background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Full AI Search Workspace */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.98,
            y: 10
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            scale: 0.98,
            y: 10
          }}
          transition={{
            duration: 0.2
          }}
          className="
            relative z-10
            flex flex-col
            w-full h-full
            max-w-6xl
            md:h-[92vh]
            md:rounded-2xl
            overflow-hidden
            bg-[#070b17]/98
            border border-white/10
            shadow-[0_0_80px_rgba(0,0,0,0.7)]
          "
        >

          {/* HEADER */}
          <div className="
            flex items-center justify-between
            px-5 md:px-7
            py-4
            border-b border-white/10
            shrink-0
          ">

            <div className="flex items-center gap-3">

              <div className="
                w-9 h-9
                rounded-xl
                border border-cyan-400/20
                bg-cyan-400/5
                flex items-center justify-center
              ">
                <Sparkles className="w-4 h-4 text-cyan-300" />
              </div>

              <div>
                <div className="
                  text-sm
                  font-medium
                  text-white
                ">
                  AI Search
                </div>

                <div className="
                  text-[10px]
                  text-white/35
                  tracking-wide
                ">
                  Candidate evidence intelligence
                </div>
              </div>

            </div>

            <div className="flex items-center gap-4">

              {/* New Chat */}
              <button
                onClick={startNewChat}
                className="
                  flex items-center gap-1.5
                  text-[11px]
                  text-white/40
                  hover:text-cyan-300
                  transition-colors
                "
              >
                <Plus className="w-3.5 h-3.5" />
                New Chat
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                className="
                  text-white/35
                  hover:text-white
                  transition-colors
                "
              >
                <X className="w-5 h-5" />
              </button>

            </div>
          </div>


          {/* CHAT AREA */}
          <div className="
            flex-1
            overflow-y-auto
            px-5 md:px-8
            py-8
          ">

            <div className="
              mx-auto
              max-w-4xl
              space-y-8
            ">

              {/* Empty State */}
              {messages.length === 0 && !isSearching && (
                <div className="
                  min-h-[55vh]
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-center
                ">

                  <div className="
                    w-14 h-14
                    rounded-full
                    border border-cyan-400/20
                    bg-cyan-400/5
                    flex items-center justify-center
                    mb-5
                  ">
                    <Search className="w-6 h-6 text-cyan-300" />
                  </div>

                  <h2 className="
                    text-xl
                    md:text-2xl
                    text-white
                    font-medium
                    mb-2
                  ">
                    Ask RecruitAI
                  </h2>

                  <p className="
                    text-sm
                    text-white/35
                    max-w-md
                    leading-6
                    mb-8
                  ">
                    Ask unlimited questions about candidates,
                    skills, evidence, projects, requirements,
                    or validation gaps.
                  </p>

                  {/* Suggestions */}
                  <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-x-8
                    gap-y-3
                    w-full
                    max-w-2xl
                  ">
                    {SEARCH_SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => executeSearch(suggestion)}
                        className="
                          text-left
                          text-xs
                          text-white/45
                          hover:text-cyan-300
                          transition-colors
                          py-2
                          border-b
                          border-white/5
                          hover:border-cyan-400/20
                        "
                      >
                        <span className="mr-2 text-cyan-400/60">
                          →
                        </span>
                        {suggestion}
                      </button>
                    ))}
                  </div>

                </div>
              )}


              {/* CONVERSATION */}
              {messages.map((message) => (

                <motion.div
                  key={message.id}
                  initial={{
                    opacity: 0,
                    y: 8
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  className={`
                    flex
                    ${
                      message.role === 'user'
                        ? 'justify-end'
                        : 'justify-start'
                    }
                  `}
                >

                  <div className="
                    max-w-[85%]
                    md:max-w-[75%]
                  ">

                    {/* Speaker */}
                    <div className={`
                      mb-2
                      text-[9px]
                      uppercase
                      tracking-[0.2em]
                      ${
                        message.role === 'user'
                          ? 'text-right text-white/25'
                          : 'text-left text-cyan-400/45'
                      }
                    `}>
                      {message.role === 'user'
                        ? 'You'
                        : 'RecruitAI'
                      }
                    </div>

                    {/* Message */}
                    <p className={`
                      text-sm
                      leading-7
                      ${
                        message.role === 'user'
                          ? 'text-white/80 text-right'
                          : 'text-white/65 text-left'
                      }
                    `}>
                      {message.content}
                    </p>

                    {/* Candidate evidence */}
                    {message.role === 'assistant' &&
                      message.candidates?.length > 0 && (
                        <div className="
                          mt-5
                          space-y-2
                        ">

                          {message.candidates.map(
                            (cand, idx) => (

                              <motion.div
                                key={`${message.id}-${cand.id}`}
                                initial={{
                                  opacity: 0,
                                  y: 6
                                }}
                                animate={{
                                  opacity: 1,
                                  y: 0
                                }}
                                transition={{
                                  delay: idx * 0.06
                                }}
                                onClick={() => {
                                  onSelectCandidate(cand);
                                  onClose();
                                }}
                                className="
                                  group
                                  flex
                                  items-center
                                  justify-between
                                  gap-4
                                  py-3
                                  border-b
                                  border-white/5
                                  cursor-pointer
                                  hover:border-cyan-400/30
                                "
                              >

                                <div className="
                                  flex
                                  items-center
                                  gap-3
                                ">

                                  <div className="
                                    w-8 h-8
                                    rounded-full
                                    border
                                    border-cyan-400/20
                                    bg-cyan-400/5
                                    flex
                                    items-center
                                    justify-center
                                    text-[10px]
                                    font-mono
                                    text-white
                                  ">
                                    {cand.avatar}
                                  </div>

                                  <div>
                                    <div className="
                                      text-xs
                                      text-white
                                      font-medium
                                    ">
                                      {cand.name}
                                    </div>

                                    <div className="
                                      text-[10px]
                                      text-white/35
                                      mt-0.5
                                    ">
                                      {cand.title}
                                      {' • '}
                                      {cand.coverageScore}%
                                      {' '}coverage
                                    </div>
                                  </div>

                                </div>

                                <ArrowRight className="
                                  w-3.5 h-3.5
                                  text-white/20
                                  group-hover:text-cyan-300
                                  transition-colors
                                " />

                              </motion.div>

                            )
                          )}

                        </div>
                      )}

                  </div>

                </motion.div>

              ))}


              {/* SEARCHING */}
              {isSearching && (

                <motion.div
                  initial={{
                    opacity: 0
                  }}
                  animate={{
                    opacity: 1
                  }}
                  className="
                    flex
                    justify-start
                  "
                >

                  <div>

                    <div className="
                      mb-2
                      text-[9px]
                      uppercase
                      tracking-[0.2em]
                      text-cyan-400/45
                    ">
                      RecruitAI
                    </div>

                    <div className="
                      flex
                      items-center
                      gap-3
                    ">

                      <div className="
                        w-6 h-6
                        rounded-full
                        border
                        border-cyan-400/20
                        flex
                        items-center
                        justify-center
                      ">
                        <Cpu
                          className="
                            w-3.5 h-3.5
                            text-cyan-300
                            animate-spin
                          "
                          style={{
                            animationDuration: '3s'
                          }}
                        />
                      </div>

                      <div>
                        <div className="
                          text-[10px]
                          font-mono
                          text-cyan-300/70
                          tracking-wide
                        ">
                          {SEARCH_PIPELINE[pipelineIndex]}
                        </div>

                        <div className="
                          flex
                          gap-1
                          mt-2
                        ">
                          {SEARCH_PIPELINE.map(
                            (step, idx) => (
                              <span
                                key={step}
                                className={`
                                  w-1.5
                                  h-1.5
                                  rounded-full
                                  transition-all
                                  ${
                                    idx <= pipelineIndex
                                      ? 'bg-cyan-400'
                                      : 'bg-white/10'
                                  }
                                `}
                              />
                            )
                          )}
                        </div>
                      </div>

                    </div>

                  </div>

                </motion.div>

              )}

              <div ref={messagesEndRef} />

            </div>

          </div>


          {/* INPUT */}
          <div className="
            border-t
            border-white/10
            px-5 md:px-8
            py-4
            shrink-0
          ">

            <div className="
              mx-auto
              max-w-4xl
              flex
              items-center
              gap-3
            ">

              <Search className="
                w-4 h-4
                text-white/25
                shrink-0
              " />

              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                onKeyDown={handleInputKeyDown}
                placeholder="Ask another question..."
                disabled={isSearching}
                className="
                  flex-1
                  bg-transparent
                  text-sm
                  text-white
                  placeholder:text-white/20
                  focus:outline-none
                  disabled:opacity-40
                "
              />

              <button
                onClick={() => executeSearch()}
                disabled={!query.trim() || isSearching}
                className="
                  flex
                  items-center
                  gap-1.5
                  text-[10px]
                  uppercase
                  tracking-wider
                  text-cyan-300
                  hover:text-cyan-200
                  disabled:text-white/15
                  disabled:cursor-not-allowed
                  transition-colors
                "
              >
                Send
                <CornerDownLeft className="w-3 h-3" />
              </button>

            </div>

            <div className="
              max-w-4xl
              mx-auto
              mt-2
              text-[9px]
              text-white/20
            ">
              Press Enter to ask • Continue asking as long as you want
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}