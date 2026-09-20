import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Layers,
  Users,
  ArrowRight
} from 'lucide-react';

import JobRequirements3D from '../three/JobRequirements3D';

export default function JobIntelligenceView({
  job,
  onBack,
  onSelectCandidate,
  onOpenSlidePanel
}) {
  const [candidates, setCandidates] = useState([]);
  const [matchResults, setMatchResults] = useState({});
  const [matching, setMatching] = useState(false);

  const requirements = job?.requirements || [];

  // Get candidates and calculate AI matching
  useEffect(() => {
    if (!job) return;

    const loadCandidatesAndMatch = async () => {
      try {
        const response = await fetch(
          'http://127.0.0.1:8000/candidates'
        );

        const data = await response.json();

        const backendCandidates = data.candidates || [];

        setCandidates(backendCandidates);

        if (backendCandidates.length === 0) {
          setMatching(false);
          return;
        }

        setMatching(true);

        const results = {};

        for (const candidate of backendCandidates) {
          try {
            const matchResponse = await fetch(
              'http://127.0.0.1:8000/match',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  candidate: candidate,
                  requirements: requirements
                })
              }
            );

            if (!matchResponse.ok) {
              throw new Error(
                `Match request failed: ${matchResponse.status}`
              );
            }

            const matchData = await matchResponse.json();

            results[candidate.id] = matchData.match;

          } catch (error) {
            console.error(
              `Matching failed for ${candidate.name}:`,
              error
            );

            results[candidate.id] = null;
          }
        }

        setMatchResults(results);
        setMatching(false);

      } catch (error) {
        console.error(
          'Failed to load candidates:',
          error
        );

        setMatching(false);
      }
    };

    loadCandidatesAndMatch();

  }, [job, requirements]);

  if (!job) return null;

  // Convert backend candidate data to the format used by the UI
  const relevantCandidates = candidates.map((candidate) => {
    const initials = candidate.name
      ? candidate.name
          .split(' ')
          .map((word) => word[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()
      : 'NA';

    return {
      id: candidate.id,
      name: candidate.name,
      avatar: initials,

      experience:
        candidate.experience?.length > 0
          ? `${candidate.experience.length} experience entries`
          : 'No experience',

      title:
        candidate.experience?.[0]?.title ||
        'Candidate',

      location: 'Not provided',

      email: candidate.email,
      phone: candidate.phone,

      skills: candidate.skills || [],
      education: candidate.education || [],
      projects: candidate.projects || [],
      achievements: candidate.achievements || [],

      rawCandidate: candidate
    };
  });

  const openRequirement = (req) => {
    if (!onOpenSlidePanel) return;

    onOpenSlidePanel({
      title: `${req.name} Requirement`,
      status: 'Needs Validation',
      source: 'AI Job Description Analysis',
      excerpt: `This requirement was extracted from the job description for ${job.title}.`,
      suggestedQuestion: `Can the candidate demonstrate practical experience with ${req.name}?`,
      missing: 'Candidate evidence has not been evaluated yet.'
    });
  };

  return (
    <section className="w-full max-w-6xl mx-auto py-10 px-4 select-none">

      {/* TOP NAVIGATION */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />

          <span>
            BACK TO ROLE REPOSITORY
          </span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/30">

          <Sparkles className="w-3.5 h-3.5" />

          <span>
            SPEC MAPPING: {job.code} // {job.title}
          </span>

        </div>

      </div>


      {/* JOB INFORMATION + 3D REQUIREMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">

        {/* LEFT SIDE */}
        <div className="lg:col-span-6 space-y-4">

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider">

            <span>
              {job.department || 'Engineering'}
            </span>

            <span>•</span>

            <span>
              Level {job.level || 'AI ANALYZED'}
            </span>

          </div>


          <h1 className="text-3xl md:text-5xl font-black font-mono tracking-tight text-white">
            {job.title}
          </h1>


          <p className="text-sm text-slate-300 font-sans leading-relaxed">
            {job.description}
          </p>


          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300">

            <Sparkles className="w-3.5 h-3.5" />

            AI ANALYZED JOB

          </div>


          {/* REQUIREMENTS */}
          <div className="pt-2 flex flex-wrap gap-2">

            {requirements.length > 0 ? (

              requirements.map((req, index) => (

                <button
                  key={req.id || index}
                  onClick={() => openRequirement(req)}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-cyan-950/40 border border-white/10 hover:border-cyan-400/40 text-xs font-mono text-slate-200 flex items-center gap-2 cursor-pointer transition-all"
                >

                  <span>
                    {req.name}
                  </span>

                  <span className="text-[10px] text-cyan-400 font-bold">
                    {req.weight || 1}
                  </span>

                </button>

              ))

            ) : (

              <span className="text-xs font-mono text-slate-500">
                No requirements extracted.
              </span>

            )}

          </div>

        </div>


        {/* 3D REQUIREMENT SPHERE */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-3 border border-cyan-500/25 relative overflow-hidden shadow-[0_0_35px_rgba(0,0,0,0.6)]">

          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 text-[11px] font-mono text-cyan-300 bg-slate-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30">

            <Layers className="w-3 h-3 text-cyan-400" />

            <span>
              3D REQUIREMENT CONSTELLATION
            </span>

          </div>


          <JobRequirements3D
            jobTitle={job.title}
            requirements={requirements}
            onSelectRequirement={(reqName) => {

              if (!onOpenSlidePanel) return;

              onOpenSlidePanel({
                title: `${reqName} Requirement`,
                status: 'Needs Validation',
                source: 'AI Job Description Analysis',
                excerpt: `The requirement "${reqName}" was identified for ${job.title}.`,
                suggestedQuestion: `Can the candidate demonstrate practical experience with ${reqName}?`,
                missing: 'Candidate evidence has not been evaluated yet.'
              });

            }}
          />

        </div>

      </div>


      {/* MATCHED CANDIDATES */}
      <div className="pt-6 border-t border-white/10">

        <div className="flex items-center justify-between mb-6">

          <h3 className="text-xl font-bold font-mono text-white flex items-center gap-2">

            <Users className="w-5 h-5 text-cyan-400" />

            <span>
              MATCHED CANDIDATE STREAM ({relevantCandidates.length})
            </span>

          </h3>

          <span className="text-xs font-mono text-slate-400">

            {matching
              ? 'AI MATCHING IN PROGRESS...'
              : 'Candidates from RecruitAI database'}

          </span>

        </div>


        {/* CANDIDATES */}
        <div className="space-y-3">

          {relevantCandidates.length > 0 ? (

            relevantCandidates.map((cand) => {

              const match = matchResults[cand.id];

              return (

                <div
                  key={cand.id}
                  onClick={() =>
                    onSelectCandidate &&
                    onSelectCandidate({
                      ...cand,
                      match: match
                    })
                  }
                  className="p-5 rounded-2xl bg-white/[0.02] hover:bg-cyan-950/40 border border-white/10 hover:border-cyan-400/50 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all cursor-pointer group"
                >

                  {/* Candidate Info */}
                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600/30 to-indigo-600/30 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-white">

                      {cand.avatar}

                    </div>


                    <div>

                      <div className="flex items-center gap-2">

                        <span className="font-mono font-bold text-white text-base">

                          {cand.name}

                        </span>


                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">

                          {cand.experience}

                        </span>

                      </div>


                      <div className="text-xs text-slate-400 font-sans mt-0.5">

                        {cand.title}

                        {' • '}

                        {cand.location}

                      </div>

                    </div>

                  </div>


                  {/* Candidate Score */}
                  <div className="flex items-center gap-6">

                    <div className="text-right">

                      {matching && !match ? (

                        <>

                          <div className="text-sm font-mono font-bold text-cyan-400">

                            AI MATCHING...

                          </div>

                          <div className="text-[10px] font-mono text-slate-500">

                            Analyzing candidate

                          </div>

                        </>

                      ) : match ? (

                        <>

                          <div className="text-sm font-mono font-bold text-cyan-400">

                            {match.overall_match}% MATCH

                          </div>

                          <div className="text-[10px] font-mono text-slate-500">

                            {match.matched_skills?.length || 0} skills matched

                            {' • '}

                            {match.missing_skills?.length || 0} missing

                          </div>

                        </>

                      ) : (

                        <>

                          <div className="text-sm font-mono font-bold text-red-400">

                            MATCH FAILED

                          </div>

                          <div className="text-[10px] font-mono text-slate-500">

                            Could not analyze candidate

                          </div>

                        </>

                      )}

                    </div>


                    <div className="w-8 h-8 rounded-full flex items-center justify-center border border-white/15 text-slate-400 group-hover:border-cyan-400 group-hover:text-cyan-300 transition-colors">

                      <ArrowRight className="w-4 h-4" />

                    </div>

                  </div>

                </div>

              );

            })

          ) : (

            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center">

              <Users className="w-8 h-8 text-slate-600 mx-auto mb-3" />

              <p className="text-sm font-mono text-slate-400">

                No candidates found.

              </p>

              <p className="text-xs font-mono text-slate-600 mt-2">

                Upload candidate resumes to begin candidate matching.

              </p>

            </div>

          )}

        </div>

      </div>

    </section>
  );
}