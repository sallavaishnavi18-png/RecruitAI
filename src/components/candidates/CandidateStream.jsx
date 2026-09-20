import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  ArrowUpRight,
  Trash2,
  Plus,
  Check,
  X,
  Sparkles,
  Users,
  Loader2
} from 'lucide-react';

import { MOCK_CANDIDATES } from '../../data/mockData';


export default function CandidateStream({
  candidates = [],
  selectedCandidateId,
  onSelectCandidate,
  onAddCandidate,
  onRemoveCandidate,
  jobRequirements = []
}) {

  // ---------------------------------------------------------
  // LOCAL CANDIDATE STATE
  // ---------------------------------------------------------

  const [candidateList, setCandidateList] = useState(() => {

    if (
      Array.isArray(candidates) &&
      candidates.length > 0
    ) {
      return candidates;
    }

    return Array.isArray(MOCK_CANDIDATES)
      ? [...MOCK_CANDIDATES]
      : [];

  });


  const [hoveredCandidateId, setHoveredCandidateId] =
    useState(null);

  const [isAddModalOpen, setIsAddModalOpen] =
    useState(false);

  const [confirmDeleteId, setConfirmDeleteId] =
    useState(null);


  // ---------------------------------------------------------
  // GROUPING STATE
  // ---------------------------------------------------------

  const [grouping, setGrouping] =
    useState(false);

  const [groupedCandidates, setGroupedCandidates] =
    useState(null);

  const [groupingError, setGroupingError] =
    useState('');

  const [candidateStatuses, setCandidateStatuses] = useState({});


  const statusOptions = [
    "New",
    "Screening",
    "Interview",
    "Shortlisted",
    "Rejected"
  ];

  const handleStatusChange = (candidateId, status) => {
    setCandidateStatuses((prev) => ({
      ...prev,
      [candidateId]: status
    }));
  };
  // ---------------------------------------------------------
  // AI SKILL GAP ANALYSIS
  // ---------------------------------------------------------

  const analyzeCandidateSkillGap = async (candidate) => {
    try {
      const requirements = buildRequirementsPayload();

      const candidatePayload = {
        name: candidate?.name || "",
        skills: Array.isArray(candidate?.skills)
          ? candidate.skills.map((skill) =>
              typeof skill === "string" ? skill : skill?.name
            ).filter(Boolean)
          : [],
        education: candidate?.education
          ? [candidate.education]
          : [],
        experience: candidate?.experience
          ? [candidate.experience]
          : [],
        projects: Array.isArray(candidate?.projects)
          ? candidate.projects
          : [],
        achievements: Array.isArray(candidate?.achievements)
          ? candidate.achievements
          : []
      };

      const response = await fetch(
        "http://127.0.0.1:8000/skill-gap",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            candidate: candidatePayload,
            requirements
          })
        }
      );

      if (!response.ok) {
        throw new Error("Skill gap analysis failed");
      }

      const data = await response.json();
      const skillGap = data?.skill_gap || {};

      const missingSkills = Array.isArray(skillGap.missing_skills)
        ? skillGap.missing_skills
        : [];

      const questions = Array.isArray(skillGap.recommended_questions)
        ? skillGap.recommended_questions
        : [];

      const aiValidationGaps = missingSkills.map((skill, index) => ({
        id: `${candidate.id || "candidate"}-skill-gap-${index}`,
        requirement: skill,
        severity: "Needs Validation",
        issue:
          skillGap.skill_gap_summary ||
          `The candidate's resume does not provide enough evidence for ${skill}.`,
        detectedIn: "AI Skill Gap Analysis",
        suggestedQuestion:
          questions[index] ||
          questions[0] ||
          `Can you explain your practical experience with ${skill}?`,
        resolved: false
      }));

      return {
        ...candidate,
        skillGap: skillGap,
        validationGaps: aiValidationGaps
      };
    } catch (error) {
      console.error("Skill gap analysis error:", error);
      return candidate;
    }
  };
  // ---------------------------------------------------------
  // FORM STATE
  // ---------------------------------------------------------

  const [formData, setFormData] = useState({
    name: '',
    title: 'Software Engineer',
    experience: '3.0 years',
    education: 'B.Tech Computer Science',
    location: 'Remote / Hybrid',
    skills: 'Python, React, SQL, TypeScript',
    coverageScore: 88
  });


  // ---------------------------------------------------------
  // SYNC WITH PARENT
  // ---------------------------------------------------------

  useEffect(() => {

    if (
      Array.isArray(candidates) &&
      candidates.length > 0
    ) {
      setCandidateList(candidates);
    }

  }, [candidates]);


  // ---------------------------------------------------------
  // CONVERT REQUIREMENTS FOR BACKEND
  // ---------------------------------------------------------

  const buildRequirementsPayload = () => {

    const requirements = {

      required_skills: [],

      qualifications: [],

      experience_requirements: [],

      responsibilities: []

    };


    if (!Array.isArray(jobRequirements)) {
      return requirements;
    }


    jobRequirements.forEach((requirement) => {

      const name =
        typeof requirement === 'string'
          ? requirement
          : requirement?.name;


      if (!name) return;


      const category =
        requirement?.category
          ?.toLowerCase()
          ?.trim();


      if (category === 'skill') {

        requirements.required_skills.push(name);

      }

      else if (
        category === 'qualification'
      ) {

        requirements.qualifications.push(name);

      }

      else if (
        category === 'experience'
      ) {

        requirements.experience_requirements.push(name);

      }

      else if (
        category === 'responsibility'
      ) {

        requirements.responsibilities.push(name);

      }

      else {

        requirements.required_skills.push(name);

      }

    });


    return requirements;

  };


  // ---------------------------------------------------------
  // CONVERT CANDIDATE FOR BACKEND
  // ---------------------------------------------------------

  const prepareCandidateForGrouping = (candidate) => {

    const cleanSkills =
      Array.isArray(candidate.skills)
        ? candidate.skills.map((skill) => {

            if (typeof skill === 'string') {
              return skill;
            }

            return skill?.name || '';

          }).filter(Boolean)
        : [];


    const cleanEducation =
      Array.isArray(candidate.education)
        ? candidate.education.map((item) => {

            if (typeof item === 'string') {
              return item;
            }

            return (
              item?.degree ||
              item?.name ||
              item?.title ||
              JSON.stringify(item)
            );

          })
        : [];




Experience =
      Array.isArray(candidate.experience)
        ? candidate.experience.map((item) => {

            if (typeof item === 'string') {
              return item;
            }

            return (
              item?.title ||
              item?.role ||
              item?.description ||
              JSON.stringify(item)
            );

          })
        : [];


    const cleanProjects =
      Array.isArray(candidate.projects)
        ? candidate.projects.map((item) => {

            if (typeof item === 'string') {
              return item;
            }

            return (
              item?.title ||
              item?.name ||
              item?.description ||
              JSON.stringify(item)
            );

          })
        : [];


    const cleanAchievements =
      Array.isArray(candidate.achievements)
        ? candidate.achievements.map((item) => {

            if (typeof item === 'string') {
              return item;
            }

            return (
              item?.title ||
              item?.name ||
              item?.description ||
              JSON.stringify(item)
            );

          })
        : [];


    return {

      id: candidate.id,

      name: candidate.name || 'Unknown Candidate',

      skills: cleanSkills,

      education: cleanEducation,

      experience: cleanExperience,

      projects: cleanProjects,

      achievements: cleanAchievements

    };

  };


  // ---------------------------------------------------------
  // RUN AI CANDIDATE GROUPING
  // ---------------------------------------------------------

  const handleGroupCandidates = async () => {

    setGrouping(true);

    setGroupingError('');

    setGroupedCandidates(null);


    try {

      const payload = {

        candidates:
          candidateList.map(
            prepareCandidateForGrouping
          ),

        requirements:
          buildRequirementsPayload()

      };


      const response = await fetch(
        'http://127.0.0.1:8000/candidates/group',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify(payload)
        }
      );


      if (!response.ok) {

        throw new Error(
          `Grouping request failed: ${response.status}`
        );

      }


      const data =
        await response.json();


      setGroupedCandidates(
        data.groups || {
          strong_match: [],
          potential_match: [],
          needs_validation: []
        }
      );

    }

    catch (error) {

      console.error(
        'Candidate grouping failed:',
        error
      );

      setGroupingError(
        'AI grouping failed. Make sure the backend is running.'
      );

    }

    finally {

      setGrouping(false);

    }

  };


  // ---------------------------------------------------------
  // GET CANDIDATE NAME FROM GROUP RESULT
  // ---------------------------------------------------------

  const getGroupCandidateName = (item) => {

    if (!item) {
      return 'Unknown Candidate';
    }


    if (typeof item === 'string') {
      return item;
    }


    return (
      item.name ||
      item.candidate_name ||
      item.candidate?.name ||
      'Unknown Candidate'
    );

  };


  // ---------------------------------------------------------
  // FIND ORIGINAL CANDIDATE
  // ---------------------------------------------------------

  const findOriginalCandidate = (item) => {

    const name =
      getGroupCandidateName(item);


    return candidateList.find(
      (candidate) =>
        candidate.name === name ||
        candidate.id === item?.id ||
        candidate.id === item?.candidate?.id
    );

  };


  // ---------------------------------------------------------
  // RUN AI SKILL GAP ANALYSIS FOR CANDIDATES
  // ---------------------------------------------------------

  useEffect(() => {
    const runSkillGapAnalysis = async () => {
      if (!Array.isArray(candidateList) || candidateList.length === 0) {
        return;
      }

      if (!Array.isArray(jobRequirements) || jobRequirements.length === 0) {
        return;
      }

      const updatedCandidates = await Promise.all(
        candidateList.map((candidate) =>
          analyzeCandidateSkillGap(candidate)
        )
      );

      setCandidateList(updatedCandidates);
    };

    runSkillGapAnalysis();
  }, [jobRequirements]);
  // ---------------------------------------------------------
  // ADD CANDIDATE
  // ---------------------------------------------------------

  const handleFormSubmit = (e) => {

    e.preventDefault();


    if (!formData.name.trim()) {
      return;
    }


    const parsedSkills =
      formData.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean)
        .map((skillName, index) => ({

          name: skillName,

          status:
            index < 3
              ? 'validated'
              : 'unclear',

          level:
            index === 0
              ? 'Senior'
              : 'Proficient',

          confidence:
            85 +
            Math.floor(
              Math.random() * 12
            ),

          source:
            'Resume + Portfolio Audit'

        }));


    const initials =
      formData.name
        .split(' ')
        .map((name) => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'CD';


    const candidateId =
      `cand-${Date.now()}`;


    const newCandidate = {

      id: candidateId,

      name: formData.name.trim(),

      title: formData.title.trim(),

      experience:
        formData.experience.trim(),

      education:
        formData.education.trim(),

      location:
        formData.location.trim(),

      avatar: initials,

      coverageScore:
        Number(formData.coverageScore) || 85,

      jobId: 'job-01',

      jobTitle:
        formData.title.trim(),

      summary:
        `Software professional with ${formData.experience} experience specializing in modern development stacks.`,

      skills:
        parsedSkills.length > 0
          ? parsedSkills
          : [
              {
                name: 'Python',
                status: 'validated',
                level: 'Senior',
                confidence: 92,
                source: 'Resume + Code'
              },
              {
                name: 'React',
                status: 'validated',
                level: 'Proficient',
                confidence: 88,
                source: 'Portfolio'
              },
              {
                name: 'AWS',
                status: 'unclear',
                level: 'Needs Review',
                confidence: 55,
                source: 'Resume mention'
              }
            ],

      evidenceNodes: [
        {
          id: `${candidateId}-resume`,
          type: 'RESUME',
          label: 'Resume Verified',
          excerpt:
            `${formData.experience} verified in software engineering roles.`,
          source: 'PDF Parser',
          status: 'Validated',
          color: '#38bdf8'
        },
        {
          id: `${candidateId}-project`,
          type: 'PROJECTS',
          label: 'Primary Portfolio',
          excerpt:
            'Developed scalable web applications and modular microservices.',
          source: 'Portfolio Repo',
          status: 'Validated',
          color: '#818cf8'
        },
        {
          id: `${candidateId}-github`,
          type: 'GITHUB',
          label: 'Repository Audit',
          excerpt:
            'Verified public repositories with automated test suites.',
          source: 'GitHub Profile',
          status: 'Validated',
          color: '#10b981'
        },
        {
          id: `${candidateId}-interview`,
          type: 'INTERVIEW',
          label: 'Preliminary Screen',
          excerpt:
            'Demonstrated strong communication and foundational architecture knowledge.',
          source: 'Screening Notes',
          status: 'Validated',
          color: '#c084fc'
        },
        {
          id: `${candidateId}-requirements`,
          type: 'REQUIREMENTS',
          label: 'Role Spec Match',
          excerpt:
            `${formData.coverageScore}% requirement match against core engineering competencies.`,
          source: 'Semantic Engine',
          status: 'Validated',
          color: '#38bdf8'
        },
        {
          id: `${candidateId}-insights`,
          type: 'INSIGHTS',
          label: 'Recruiter Advisory',
          excerpt:
            'Verify hands-on production deployment depth during interview.',
          source: 'RecruitAI Core',
          status: 'Needs Human Review',
          color: '#fbbf24'
        }
      ],
      validationGaps: [],
interviewQuestions: [
        {
          id: `${candidateId}-q1`,
          number: '01',
          category:
            'Technical Architecture',
          question:
            `Tell me about a complex ${
              parsedSkills[0]?.name || 'system'
            } implementation you architected in production.`,
          whyThisQuestion:
            'Validates technical depth beyond basic library usage.',
          skillTarget:
            `${
              parsedSkills[0]?.name || 'Core Stack'
            } Architecture`,
          status:
            'Answered & Validated'
        },
        {
          id: `${candidateId}-q2`,
          number: '02',
          category:
            'Failure Recovery',
          question:
            'How do you detect and mitigate slow queries or network partitions under high concurrency?',
          whyThisQuestion:
            'Evaluates production reliability intuition.',
          skillTarget:
            'System Design & Resilience',
          status:
            'Pending Recruiter Probe'
        }
      ],

      transcriptSentences: [
        {
          id: `${candidateId}-ts1`,
          speaker: 'Candidate',
          timestamp: '03:15',
          text:
            `In my previous role, I designed high-throughput asynchronous services using ${
              parsedSkills[0]?.name || 'Python'
            }.`,
          connectedSkill:
            parsedSkills[0]?.name || 'Python',
          mappedNodes: [
            parsedSkills[0]?.name || 'Core Stack',
            'Async I/O',
            'Architecture',
            'VALIDATED'
          ],
          evidenceResult: 'VALIDATED',
          evidenceNote:
            'Candidate confirmed hands-on concurrency management and service tuning.',
          highlightColor: '#38bdf8'
        }
      ]

    };


    setCandidateList(
      (previousCandidates) => [
        ...previousCandidates,
        newCandidate
      ]
    );


    if (onAddCandidate) {
      onAddCandidate(newCandidate);
    }


    if (onSelectCandidate) {
      onSelectCandidate(newCandidate);
    }


    setFormData({
      name: '',
      title: 'Software Engineer',
      experience: '3.0 years',
      education: 'B.Tech Computer Science',
      location: 'Remote / Hybrid',
      skills:
        'Python, React, SQL, TypeScript',
      coverageScore: 88
    });


    setIsAddModalOpen(false);

  };


  // ---------------------------------------------------------
  // DELETE CANDIDATE
  // ---------------------------------------------------------

  const handleInitiateDelete = (
    e,
    candidateId
  ) => {

    e.stopPropagation();

    setConfirmDeleteId(candidateId);

    setTimeout(() => {
      setConfirmDeleteId(null);
    }, 4000);

  };


  const handleConfirmDelete = (
    e,
    candidateId
  ) => {

    e.stopPropagation();


    setCandidateList(
      (previousCandidates) =>
        previousCandidates.filter(
          (candidate) =>
            candidate.id !== candidateId
        )
    );


    if (onRemoveCandidate) {
      onRemoveCandidate(candidateId);
    }


    setConfirmDeleteId(null);

  };


  // ---------------------------------------------------------
  // SELECT CANDIDATE
  // ---------------------------------------------------------

  const handleCandidateClick = (
    candidate
  ) => {

    if (onSelectCandidate) {
      onSelectCandidate(candidate);
    }

  };


  // ---------------------------------------------------------
  // GROUP CARD
  // ---------------------------------------------------------

  const renderGroup = (
    title,
    description,
    groupKey,
    borderClass,
    titleClass
  ) => {

    const group =
      groupedCandidates?.[groupKey] || [];


    return (

      <div
        className={`rounded-2xl border p-5 ${borderClass} bg-white/[0.02]`}
      >

        <div className="flex items-center justify-between mb-4">

          <div>

            <h3
              className={`font-mono font-bold text-sm uppercase tracking-wider ${titleClass}`}
            >
              {title}
            </h3>

            <p className="text-[10px] font-mono text-slate-500 mt-1">
              {description}
            </p>

          </div>

          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white">
            {group.length}
          </div>

        </div>


        {group.length === 0 ? (

          <div className="py-5 text-center text-xs font-mono text-slate-600">
            No candidates in this group.
          </div>

        ) : (

          <div className="space-y-2">

            {group.map((item, index) => {

              const name =
                getGroupCandidateName(item);

              const original =
                findOriginalCandidate(item);


              return (

                <button
                  key={
                    item?.id ||
                    `${groupKey}-${index}`
                  }
                  onClick={() => {

                    if (
                      original &&
                      onSelectCandidate
                    ) {
                      onSelectCandidate(
                        original
                      );
                    }

                  }}
                  className="w-full text-left flex items-center justify-between gap-3 p-3 rounded-xl bg-black/20 hover:bg-cyan-950/40 border border-white/5 hover:border-cyan-400/30 transition-all cursor-pointer"
                >

                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-600/30 to-indigo-600/30 border border-cyan-500/30 flex items-center justify-center text-xs font-mono font-bold text-white">
                      {original?.avatar ||
                        name
                          .split(' ')
                          .map(
                            (word) =>
                              word[0]
                          )
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                    </div>

                    <div>

                      <div className="text-sm font-mono font-bold text-white">
                        {name}
                      </div>

                      <div className="text-[10px] font-mono text-slate-500">
                        {original?.title ||
                          'Candidate'}
                      </div>

                    </div>

                  </div>


                  <ArrowUpRight className="w-4 h-4 text-slate-500" />

                </button>

              );

            })}

          </div>

        )}

      </div>

    );

  };


  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------

  return (

    <section className="w-full max-w-6xl mx-auto py-10 px-4 select-none">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-5 border-b border-white/10 gap-4">

        <div>

          <div className="flex items-center gap-2 mb-1.5">

            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />

            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
              EVIDENCE-VERIFIED PIPELINE
            </span>

          </div>


          <h2 className="text-3xl md:text-5xl font-black font-mono tracking-tight text-white">
            CANDIDATE STREAM
          </h2>


          <div className="text-xs font-mono text-slate-400 mt-1">

            Active Candidates:{' '}

            <strong className="text-slate-200">
              {candidateList.length}
            </strong>

            {' • '}

            Ranked by Corroboration Depth

          </div>

        </div>


        <div className="flex items-center gap-3">

          {/* AI GROUP BUTTON */}

          <button
            onClick={handleGroupCandidates}
            disabled={
              grouping ||
              candidateList.length === 0
            }
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500/25 to-cyan-500/25 hover:from-indigo-500/35 hover:to-cyan-500/35 border border-indigo-400/50 text-indigo-200 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >

            {grouping ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Users className="w-4 h-4 text-cyan-400" />
            )}

            <span>
              {grouping
                ? 'AI GROUPING...'
                : 'AI Group Candidates'}
            </span>

          </button>


          {/* ADD BUTTON */}

          <button
            onClick={() =>
              setIsAddModalOpen(true)
            }
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/25 to-indigo-500/25 hover:from-cyan-500/35 hover:to-indigo-500/35 border border-cyan-400/50 text-cyan-200 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.25)]"
          >

            <Plus className="w-4 h-4 text-cyan-400" />

            <span>
              Add Candidate
            </span>

          </button>

        </div>

      </div>


      {/* =====================================================
          AI GROUPING RESULTS
      ====================================================== */}

      {(groupedCandidates || groupingError) && (

        <div className="mb-10">

          <div className="flex items-center justify-between mb-4">

            <div>

              <div className="flex items-center gap-2">

                <Sparkles className="w-4 h-4 text-cyan-400" />

                <h3 className="text-xl font-bold font-mono text-white">
                  AI CANDIDATE GROUPING
                </h3>

              </div>

              <p className="text-xs font-mono text-slate-500 mt-1">
                Candidates grouped against the active job requirements.
              </p>

            </div>

          </div>


          {groupingError ? (

            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 text-rose-300 text-xs font-mono">
              {groupingError}
            </div>

          ) : (

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

              {renderGroup(
                'Strong Match',
                'Candidates with strong alignment to the role.',
                'strong_match',
                'border-emerald-500/30',
                'text-emerald-300'
              )}


              {renderGroup(
                'Potential Match',
                'Candidates with relevant experience that may need review.',
                'potential_match',
                'border-cyan-500/30',
                'text-cyan-300'
              )}


              {renderGroup(
                'Needs Validation',
                'Candidates with information requiring recruiter validation.',
                'needs_validation',
                'border-amber-500/30',
                'text-amber-300'
              )}

            </div>

          )}

        </div>

      )}


      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {candidateList.length === 0 && (

        <div className="py-24 text-center border-t border-white/5">

          <div className="text-sm font-mono text-slate-500 mb-4">
            NO CANDIDATES IN STREAM
          </div>

          <button
            onClick={() =>
              setIsAddModalOpen(true)
            }
            className="px-5 py-3 rounded-xl border border-cyan-400/40 text-cyan-300 text-xs font-mono uppercase tracking-wider hover:bg-cyan-400/10 transition"
          >
            + Add First Candidate
          </button>

        </div>

      )}


      {/* =====================================================
          CANDIDATE STREAM
      ====================================================== */}

      <div className="space-y-4">

        {candidateList.map((cand) => {

          const isHovered =
            hoveredCandidateId === cand.id;

          const isSelected =
            selectedCandidateId === cand.id;

          const isConfirmingDelete =
            confirmDeleteId === cand.id;


          return (

            <motion.div
              key={cand.id}

              onMouseEnter={() =>
                setHoveredCandidateId(
                  cand.id
                )
              }

              onMouseLeave={() =>
                setHoveredCandidateId(null)
              }

              onClick={() =>
                handleCandidateClick(cand)
              }

              whileHover={{
                scale: 1.006
              }}

              transition={{
                duration: 0.2
              }}

              className={`relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer p-6 md:p-7 ${
                isSelected
                  ? 'bg-slate-900/95 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.25)]'
                  : isHovered
                  ? 'bg-[#0c142b]/90 border-cyan-500/40 shadow-[0_4px_30px_rgba(0,0,0,0.6)]'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20'
              }`}
            >

              {isHovered && (

                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-laser pointer-events-none" />

              )}


              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                {/* CANDIDATE INFO */}

                <div className="flex items-center gap-5">

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-600/30 to-indigo-600/30 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-white text-lg shadow-[0_0_15px_rgba(6,182,212,0.2)] shrink-0">

                    {cand.avatar ||
                      cand.name
                        ?.split(' ')
                        .map(
                          (n) => n[0]
                        )
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}

                  </div>


                  <div>

                    <div className="flex items-center gap-3">

                      <h3 className="text-xl md:text-2xl font-bold font-mono tracking-tight text-white">
                        {cand.name}
                      </h3>

                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                        {cand.experience}
                      </span>

                    </div>


                    <div className="text-xs font-mono text-slate-400 mt-0.5">

                      {cand.title}

                      {' • '}

                      {cand.location}

                      {' • '}

                      {Array.isArray(cand.education)
                        ? cand.education[0]
                        : cand.education}

                    </div>

                  </div>

                </div>


                {/* SKILLS / COVERAGE / DELETE */}

                <div className="flex flex-wrap items-center gap-5 md:gap-7">

                  {/* SKILLS */}

                  <div className="flex items-center gap-2 flex-wrap">

                    {cand.skills
                      ?.slice(0, 4)
                      .map((skill) => {

                        const skillName =
                          typeof skill === 'string'
                            ? skill
                            : skill?.name;


                        const isValidated =
                          typeof skill === 'object' &&
                          skill?.status === 'validated';


                        return (

                          <div
                            key={skillName}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border ${
                              isValidated
                                ? 'bg-slate-900/80 border-emerald-500/30 text-emerald-300'
                                : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                            }`}
                          >

                            <span className="text-slate-200">
                              {skillName}
                            </span>

                            <span className="font-bold">
                              {isValidated
                                ? '✓'
                                : '!'}
                            </span>

                          </div>

                        );

                      })}

                  </div>


                  {/* COVERAGE */}

                  <div className="flex items-center gap-3">

                    <div className="text-right">

                      <div className="text-base font-mono font-bold text-cyan-400">
                        {cand.coverageScore || 0}%
                      </div>

                      <div className="text-[10px] font-mono text-slate-400 uppercase">
                        Evidence Coverage
                      </div>

                    </div>


                    <div className="w-12 h-2 bg-slate-800 rounded-full overflow-hidden border border-white/10">

                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full"
                        style={{
                          width: `${
                            cand.coverageScore || 0
                          }%`
                        }}
                      />

                    </div>

                  </div>


                  {/* DELETE */}

                  <div
                    className="flex items-center gap-2"
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  >

                    {isConfirmingDelete ? (

                      <div className="flex items-center gap-1.5">

                        <button
                          onClick={(e) =>
                            handleConfirmDelete(
                              e,
                              cand.id
                            )
                          }
                          className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/50 text-rose-300 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
                        >

                          <Check className="w-3 h-3" />

                          Confirm

                        </button>


                        <button
                          onClick={() =>
                            setConfirmDeleteId(null)
                          }
                          className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                        >

                          <X className="w-3 h-3" />

                        </button>

                      </div>

                    ) : (

                      <button
                        onClick={(e) =>
                          handleInitiateDelete(
                            e,
                            cand.id
                          )
                        }
                        title="Remove candidate"
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-500/30 transition-all cursor-pointer"
                      >

                        <Trash2 className="w-4 h-4" />

                      </button>

                    )}


                    {/* ARROW */}

                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                        isHovered ||
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.5)] translate-x-1'
                          : 'border-white/15 text-slate-400'
                      }`}
                    >

                      <ArrowUpRight className="w-4 h-4" />

                    </div>

                  </div>

                </div>

              </div>


              {/* EXPANDED DETAILS */}

              <motion.div
                initial={false}

                animate={{
                  height:
                    isHovered ||
                    isSelected
                      ? 'auto'
                      : 0,

                  opacity:
                    isHovered ||
                    isSelected
                      ? 1
                      : 0
                }}

                className="overflow-hidden"
              >

                <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">

                  {/* PROJECT */}

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">

                    <span className="text-slate-400 uppercase text-[10px] tracking-wider block mb-1">
                      Key Validated Projects
                    </span>

                    <p className="text-slate-200 leading-snug">

                      {cand.projects?.[0]?.title ||
                        cand.projects?.[0]?.name ||
                        'Production microservices & automated pipelines'}

                    </p>

                  </div>


                  {/* GAPS */}

                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20">

                    <span className="text-amber-400 uppercase text-[10px] tracking-wider block mb-1">
                      Attention Gaps
                    </span>

                    <p className="text-amber-200/90 leading-snug">

                      {cand.validationGaps?.[0]?.issue ||
                        'Candidate requires targeted architectural probe.'}

                    </p>

                  </div>


                  {/* INTERVIEW */}

                  <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex flex-col justify-between">

                    <div>

                      <span className="text-cyan-400 uppercase text-[10px] tracking-wider block mb-0.5">
                        Interview Readiness
                      </span>

                      <span className="text-slate-200 font-medium">

                        {cand.interviewQuestions?.length || 2}

                        {' '}

                        AI Probes Ready

                      </span>

                    </div>


                    <span className="text-cyan-300 font-semibold flex items-center gap-1 mt-1 text-[11px]">

                      <Sparkles className="w-3.5 h-3.5" />

                      Open Candidate Intelligence

                    </span>

                  </div>

                </div>

              </motion.div>

            </motion.div>

          );

        })}

      </div>


      {/* =====================================================
          ADD CANDIDATE PANEL
      ====================================================== */}

      <AnimatePresence>

        {isAddModalOpen && (

          <div className="fixed inset-0 z-50 flex justify-end">

            {/* BACKDROP */}

            <motion.div
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              exit={{
                opacity: 0
              }}
              onClick={() =>
                setIsAddModalOpen(false)
              }
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />


            {/* PANEL */}

            <motion.aside
              initial={{
                x: '100%',
                opacity: 0.5
              }}
              animate={{
                x: 0,
                opacity: 1
              }}
              exit={{
                x: '100%',
                opacity: 0
              }}
              transition={{
                type: 'spring',
                damping: 28,
                stiffness: 280
              }}
              className="relative w-full max-w-md h-full bg-[#080d1e]/95 border-l border-cyan-500/30 shadow-[-15px_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto z-10"
            >

              <div>

                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">

                  <div className="flex items-center gap-2">

                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />

                    <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                      CANDIDATE INTAKE
                    </span>

                  </div>


                  <button
                    onClick={() =>
                      setIsAddModalOpen(false)
                    }
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  >

                    <X className="w-5 h-5" />

                  </button>

                </div>


                <h3 className="text-2xl font-bold font-mono text-white mb-1">
                  Add New Candidate
                </h3>


                <p className="text-xs font-mono text-slate-400 mb-6">
                  Input verified candidate profile into RecruitAI workspace.
                </p>


                <form
                  id="add-candidate-form"
                  onSubmit={handleFormSubmit}
                  className="space-y-4"
                >

                  {/* NAME */}

                  <div>

                    <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                      Candidate Name *
                    </label>

                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value
                        })
                      }
                      placeholder="e.g. Vedha Kumar"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-400 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none transition-colors"
                    />

                  </div>


                  {/* ROLE */}

                  <div>

                    <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                      Target Role / Title *
                    </label>

                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          title: e.target.value
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-400 text-sm text-slate-100 focus:outline-none"
                    />

                  </div>


                  {/* EXPERIENCE + COVERAGE */}

                  <div className="grid grid-cols-2 gap-3">

                    <div>

                      <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                        Experience *
                      </label>

                      <input
                        type="text"
                        required
                        value={formData.experience}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            experience: e.target.value
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-400 text-sm text-slate-100 focus:outline-none"
                      />

                    </div>


                    <div>

                      <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                        Evidence Coverage %
                      </label>

                      <input
                        type="number"
                        min="50"
                        max="100"
                        value={formData.coverageScore}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            coverageScore:
                              e.target.value
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-400 text-sm text-slate-100 focus:outline-none"
                      />

                    </div>

                  </div>


                  {/* SKILLS */}

                  <div>

                    <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                      Key Verified Skills *
                    </label>

                    <input
                      type="text"
                      required
                      value={formData.skills}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          skills: e.target.value
                        })
                      }
                      placeholder="Python, React, SQL, TypeScript"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-400 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none"
                    />

                  </div>


                  {/* LOCATION */}

                  <div>

                    <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                      Location & Degree
                    </label>

                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: e.target.value
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-400 text-sm text-slate-100 focus:outline-none"
                    />

                  </div>


                  {/* EDUCATION */}

                  <div>

                    <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                      Education
                    </label>

                    <input
                      type="text"
                      value={formData.education}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          education: e.target.value
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-400 text-sm text-slate-100 focus:outline-none"
                    />

                  </div>

                </form>

              </div>


              {/* ACTIONS */}

              <div className="pt-6 border-t border-white/10 flex items-center gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setIsAddModalOpen(false)
                  }
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono text-xs font-semibold uppercase tracking-wider transition-all"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  form="add-candidate-form"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  Add Candidate
                </button>

              </div>

            </motion.aside>

          </div>

        )}

      </AnimatePresence>

    </section>

  );

}







