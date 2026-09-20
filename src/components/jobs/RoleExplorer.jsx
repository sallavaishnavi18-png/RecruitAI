import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Users,
  CheckCircle,
  Sparkles,
  Filter
} from 'lucide-react';
import { MOCK_JOBS } from '../../data/mockData';

export default function RoleExplorer({ onSelectJob, selectedJobId }) {

  const [hoveredJobId, setHoveredJobId] = useState(null);

  const [jobs, setJobs] = useState([]);

  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // ==========================================
  // LOAD SAVED JOBS FROM BACKEND
  // ==========================================

  useEffect(() => {

    const loadJobs = async () => {

      try {

        const response = await fetch(
          "http://127.0.0.1:8000/jobs"
        );

        if (!response.ok) {
          throw new Error("Failed to load jobs");
        }

        const data = await response.json();

        const backendJobs = data.jobs || [];

        // Convert backend jobs into frontend format
        const formattedJobs = backendJobs.map((job) => {

          const requirements = [];

          // Skills
          (job.required_skills || []).forEach(
            (skill, index) => {

              requirements.push({
                id: `skill-${job.id}-${index}`,
                name: skill,
                category: "Skill",
                weight: 1,
                status: "required"
              });

            }
          );


          // Qualifications
          (job.qualifications || []).forEach(
            (qualification, index) => {

              requirements.push({
                id: `qualification-${job.id}-${index}`,
                name: qualification,
                category: "Qualification",
                weight: 1,
                status: "required"
              });

            }
          );


          // Experience
          (job.experience_requirements || []).forEach(
            (experience, index) => {

              requirements.push({
                id: `experience-${job.id}-${index}`,
                name: experience,
                category: "Experience",
                weight: 1,
                status: "required"
              });

            }
          );


          return {

            id: `backend-${job.id}`,

            backendId: job.id,

            code: `JOB-${job.id}`,

            title: job.title,

            department: "Engineering",

            level: "AI ANALYZED",

            totalCandidates: 0,

            reviewedCandidates: 0,

            matchThreshold: "AI",

            description: job.description,

            requirements: requirements,

            isBackendJob: true

          };

        });


        // Backend jobs first, then existing demo jobs
        setJobs(formattedJobs);

      } catch (error) {

        console.error(
          "Failed to load jobs:",
          error
        );

        // Keep mock jobs if backend fails
        setJobs(MOCK_JOBS);

      } finally {

        setLoadingJobs(false);

      }

    };


    loadJobs();

  }, []);


  // ==========================================
  // ANALYZE NEW JOB
  // ==========================================

  const analyzeJob = async () => {

    if (!jobTitle || !jobDescription) {

      alert(
        "Please enter job title and description."
      );

      return;

    }


    setLoading(true);


    try {

      const response = await fetch(
        "http://127.0.0.1:8000/job",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            title: jobTitle,
            description: jobDescription
          })
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.detail ||
          "Failed to analyze job"
        );

      }


      console.log(
        "Job analyzed:",
        data
      );


      // Convert newly created job
      // into frontend format

      const requirements = [];


      (data.requirements?.required_skills || [])
        .forEach((skill, index) => {

          requirements.push({
            id: `skill-new-${index}`,
            name: skill,
            category: "Skill",
            weight: 1,
            status: "required"
          });

        });


      (data.requirements?.qualifications || [])
        .forEach((qualification, index) => {

          requirements.push({
            id: `qualification-new-${index}`,
            name: qualification,
            category: "Qualification",
            weight: 1,
            status: "required"
          });

        });


      (data.requirements?.experience_requirements || [])
        .forEach((experience, index) => {

          requirements.push({
            id: `experience-new-${index}`,
            name: experience,
            category: "Experience",
            weight: 1,
            status: "required"
          });

        });


      const newJob = {

        id: `backend-${data.job_id}`,

        backendId: data.job_id,

        code: `JOB-${data.job_id}`,

        title:
          data.requirements?.job_title ||
          jobTitle,

        department: "Engineering",

        level: "AI ANALYZED",

        totalCandidates: 0,

        reviewedCandidates: 0,

        matchThreshold: "AI",

        description: jobDescription,

        requirements: requirements,

        isBackendJob: true

      };


      // Add new job to top
      setJobs((previousJobs) => [

        newJob,

        ...previousJobs.filter(
          (job) =>
            job.backendId !== data.job_id
        )

      ]);


      // Clear form
      setJobTitle("");
      setJobDescription("");


      alert(
        "Job analyzed and saved successfully!"
      );


    } catch (error) {

      console.error(
        "Job analysis error:",
        error
      );

      alert(
        error.message ||
        "Failed to connect to RecruitAI backend."
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <section className="w-full max-w-6xl mx-auto py-12 px-4 select-none">


      {/* ========================================== */}
      {/* HEADER */}
      {/* ========================================== */}

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-white/10 gap-4">

        <div>

          <div className="flex items-center gap-2 mb-2">

            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />

            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
              ROLE REPOSITORY
            </span>

          </div>


          <h2 className="text-3xl md:text-5xl font-black font-mono tracking-tight text-white">
            SPATIAL ROLE EXPLORER
          </h2>

        </div>


        <div className="text-xs font-mono text-slate-400 flex items-center gap-2 bg-white/[0.03] px-3.5 py-2 rounded-xl border border-white/10">

          <Filter className="w-3.5 h-3.5 text-cyan-400" />

          <span>

            {loadingJobs
              ? "Loading jobs..."
              : `Showing ${jobs.length} Active Engineering Pipelines`
            }

          </span>

        </div>

      </div>


      {/* ========================================== */}
      {/* ANALYZE NEW JOB */}
      {/* ========================================== */}

      <div className="mb-8 p-6 rounded-2xl border border-cyan-500/20 bg-cyan-950/10">

        <div className="flex items-center gap-2 mb-4">

          <Sparkles className="w-4 h-4 text-cyan-400" />

          <h3 className="text-sm font-mono text-cyan-400 uppercase tracking-widest">
            Analyze New Job
          </h3>

        </div>


        <div className="space-y-4">

          <input
            type="text"
            value={jobTitle}
            onChange={(e) =>
              setJobTitle(e.target.value)
            }
            placeholder="Enter job title"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-cyan-400"
          />


          <textarea
            value={jobDescription}
            onChange={(e) =>
              setJobDescription(e.target.value)
            }
            placeholder="Paste the job description here..."
            rows="5"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-cyan-400 resize-none"
          />


          <button
            onClick={analyzeJob}
            disabled={loading}
            className="px-5 py-3 rounded-xl bg-cyan-500 text-black font-mono font-bold hover:bg-cyan-400 transition disabled:opacity-50"
          >

            {loading
              ? "ANALYZING..."
              : "ANALYZE JOB"
            }

          </button>

        </div>

      </div>


      {/* ========================================== */}
      {/* JOB LIST */}
      {/* ========================================== */}

      <div className="space-y-4">

        {jobs.map((job) => {

          const isHovered =
            hoveredJobId === job.id;

          const isSelected =
            selectedJobId === job.id;


          return (

            <motion.div
              key={job.id}

              onMouseEnter={() =>
                setHoveredJobId(job.id)
              }

              onMouseLeave={() =>
                setHoveredJobId(null)
              }

              onClick={() =>
                onSelectJob &&
                onSelectJob(job)
              }

              whileHover={{
                scale: 1.01
              }}

              transition={{
                duration: 0.2
              }}

              className={`relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer p-6 md:p-8 ${
                isSelected
                  ? "bg-slate-900/90 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.25)]"
                  : isHovered
                  ? "bg-[#0c1228]/80 border-cyan-500/40 shadow-[0_4px_25px_rgba(0,0,0,0.5)]"
                  : "bg-white/[0.02] border-white/10 hover:border-white/20"
              }`}
            >


              {/* Laser line */}

              {isHovered && (

                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-laser pointer-events-none" />

              )}


              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">


                {/* JOB TITLE */}

                <div className="flex items-start md:items-center gap-6">

                  <span className="text-3xl md:text-4xl font-mono font-bold text-slate-400/40">

                    {job.code}

                  </span>


                  <div>

                    <div className="flex items-center gap-3 mb-1">

                      <h3 className="text-xl md:text-3xl font-bold font-mono tracking-tight text-white">

                        {job.title}

                      </h3>


                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">

                        {job.level}

                      </span>

                    </div>


                    <div className="text-xs font-mono text-slate-400">

                      {job.department}

                      {" • "}

                      Match Threshold:

                      {" "}

                      {job.matchThreshold}

                    </div>

                  </div>

                </div>


                {/* STATS */}

                <div className="flex flex-wrap items-center gap-4 md:gap-8">

                  <div className="flex items-center gap-6 text-sm font-mono">

                    <div className="flex items-center gap-2">

                      <Users className="w-4 h-4 text-cyan-400" />

                      <span className="text-slate-200 font-semibold">

                        {job.totalCandidates}

                      </span>

                      <span className="text-slate-400 text-xs">

                        candidates

                      </span>

                    </div>


                    <div className="flex items-center gap-2">

                      <CheckCircle className="w-4 h-4 text-emerald-400" />

                      <span className="text-slate-200 font-semibold">

                        {job.reviewedCandidates}

                      </span>

                      <span className="text-slate-400 text-xs">

                        reviewed

                      </span>

                    </div>

                  </div>


                  {/* REQUIREMENTS */}

                  <div className="hidden sm:flex items-center gap-1.5 flex-wrap">

                    {job.requirements
                      .slice(0, 4)
                      .map((req) => (

                        <span
                          key={req.id}
                          className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10"
                        >

                          {req.name}

                        </span>

                      ))}


                    {job.requirements.length > 4 && (

                      <span className="text-[11px] font-mono text-slate-400">

                        +{job.requirements.length - 4} more

                      </span>

                    )}

                  </div>


                  {/* ARROW */}

                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                      isHovered || isSelected
                        ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.5)] translate-x-1"
                        : "border-white/15 text-slate-400"
                    }`}
                  >

                    <ArrowUpRight className="w-5 h-5" />

                  </div>

                </div>

              </div>


              {/* DESCRIPTION */}

              <motion.div
                initial={false}

                animate={{
                  height:
                    isHovered || isSelected
                      ? "auto"
                      : 0,

                  opacity:
                    isHovered || isSelected
                      ? 1
                      : 0
                }}

                className="overflow-hidden transition-all duration-300"
              >

                <div className="mt-4 pt-4 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between text-xs font-mono text-slate-300 gap-4">

                  <p className="max-w-2xl text-slate-400 text-xs">

                    {job.description}

                  </p>


                  <div className="flex items-center gap-3">

                    <span className="text-cyan-400 font-semibold flex items-center gap-1">

                      <Sparkles className="w-3.5 h-3.5" />

                      Open 3D Intelligence View

                    </span>

                  </div>

                </div>

              </motion.div>

            </motion.div>

          );

        })}

      </div>

    </section>

  );
}