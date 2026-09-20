// RECRUITAI Mock Data Store
// Realistic candidate intelligence, job requirements, interactive transcripts, and audit trails

export const MOCK_JOBS = [
  {
    id: "job-01",
    code: "01",
    title: "SENIOR SOFTWARE ENGINEER",
    department: "Core Engineering",
    level: "L5",
    totalCandidates: 12,
    reviewedCandidates: 8,
    matchThreshold: "85%",
    description: "Architect distributed microservices, scale real-time reactive user interfaces, and establish robust cloud infrastructure.",
    requirements: [
      { id: "req-py", name: "Python", category: "Backend", weight: 25, status: "Critical" },
      { id: "req-react", name: "React", category: "Frontend", weight: 25, status: "Critical" },
      { id: "req-sql", name: "SQL", category: "Data", weight: 15, status: "Required" },
      { id: "req-aws", name: "AWS", category: "Cloud", weight: 15, status: "Required" },
      { id: "req-sys", name: "System Design", category: "Architecture", weight: 10, status: "Required" },
      { id: "req-comm", name: "Communication", category: "Soft Skills", weight: 10, status: "Evaluated" }
    ]
  },
  {
    id: "job-02",
    code: "02",
    title: "AI ENGINEER",
    department: "Applied AI Research",
    level: "L4",
    totalCandidates: 9,
    reviewedCandidates: 5,
    matchThreshold: "80%",
    description: "Train foundational models, implement vector retrieval pipelines, and optimize real-time inference latency.",
    requirements: [
      { id: "req-py2", name: "Python", category: "Core", weight: 30, status: "Critical" },
      { id: "req-ml", name: "Machine Learning", category: "AI", weight: 25, status: "Critical" },
      { id: "req-tf", name: "TensorFlow / PyTorch", category: "Frameworks", weight: 20, status: "Required" },
      { id: "req-sql2", name: "SQL", category: "Data", weight: 15, status: "Required" },
      { id: "req-dep", name: "Model Deployment", category: "MLOps", weight: 10, status: "Required" }
    ]
  },
  {
    id: "job-03",
    code: "03",
    title: "FRONTEND ENGINEER",
    department: "Product Experience",
    level: "L4",
    totalCandidates: 17,
    reviewedCandidates: 10,
    matchThreshold: "88%",
    description: "Craft high-performance 3D spatial user experiences, micro-frontends, and accessible design system components.",
    requirements: [
      { id: "req-react2", name: "React / Next.js", category: "Frontend", weight: 35, status: "Critical" },
      { id: "req-ts", name: "TypeScript", category: "Language", weight: 20, status: "Critical" },
      { id: "req-perf", name: "Performance / CWV", category: "Optimization", weight: 15, status: "Required" },
      { id: "req-state", name: "State Architecture", category: "Architecture", weight: 15, status: "Required" },
      { id: "req-css", name: "Modern CSS / 3D", category: "Visuals", weight: 15, status: "Evaluated" }
    ]
  },
  {
    id: "job-04",
    code: "04",
    title: "FULL STACK ARCHITECT",
    department: "Enterprise Solutions",
    level: "L6",
    totalCandidates: 14,
    reviewedCandidates: 11,
    matchThreshold: "90%",
    description: "Drive multi-region cloud topology, lead architectural reviews, and maintain zero-downtime deployment pipelines.",
    requirements: [
      { id: "req-node", name: "Node.js & Go", category: "Backend", weight: 25, status: "Critical" },
      { id: "req-react3", name: "React", category: "Frontend", weight: 20, status: "Critical" },
      { id: "req-dist", name: "Distributed Systems", category: "Architecture", weight: 25, status: "Critical" },
      { id: "req-cloud", name: "Cloud Architecture", category: "DevOps", weight: 20, status: "Required" },
      { id: "req-db", name: "Database Sharding", category: "Data", weight: 10, status: "Required" }
    ]
  }
];

export const MOCK_CANDIDATES = [
  {
    id: "cand-rahul",
    name: "Rahul Sharma",
    title: "Software Engineer",
    experience: "2.8 years",
    education: "B.Tech Computer Science",
    location: "Hyderabad, IN",
    avatar: "RS",
    coverageScore: 92,
    jobId: "job-01",
    jobTitle: "Senior Software Engineer",
    summary: "Full-stack engineer specializing in Python backends, reactive React interfaces, and high-volume database queries.",
    
    // Skills with validation flags
    skills: [
      { name: "Python", status: "validated", level: "Senior", confidence: 96, source: "Resume + GitHub + Interview" },
      { name: "React", status: "validated", level: "Advanced", confidence: 94, source: "Portfolio + Production" },
      { name: "SQL", status: "validated", level: "Advanced", confidence: 89, source: "Resume + Schema commits" },
      { name: "Node.js", status: "validated", level: "Proficient", confidence: 85, source: "API services" },
      { name: "Git", status: "validated", level: "Expert", confidence: 98, source: "GitHub audit" },
      { name: "AWS", status: "unclear", level: "Unclear Depth", confidence: 48, source: "Resume mention only" }
    ],

    // Evidence Graph Nodes for 3D visualization
    evidenceNodes: [
      {
        id: "ev-resume",
        type: "RESUME",
        label: "Resume Verified",
        excerpt: "2.8 years at FinTech scale. Built real-time trade settlement queues and customer transaction ledger.",
        source: "PDF Parser v4.2",
        status: "Validated",
        timestamp: "10:42 AM",
        color: "#38bdf8"
      },
      {
        id: "ev-project",
        type: "PROJECTS",
        label: "E-Commerce & Trading UI",
        excerpt: "Built an e-commerce platform using React and Node.js. Integrated live order book with Redis websockets.",
        source: "Portfolio Repo",
        status: "Validated",
        timestamp: "10:44 AM",
        color: "#6366f1"
      },
      {
        id: "ev-github",
        type: "GITHUB",
        label: "Repository Audit",
        excerpt: "1,240 commits across 18 repositories. High test coverage in Python FastAPI services and Jest tests.",
        source: "GitHub Public Profile",
        status: "Validated",
        timestamp: "10:46 AM",
        color: "#10b981"
      },
      {
        id: "ev-interview",
        type: "INTERVIEW",
        label: "Screening Transcript",
        excerpt: "Directly explained EC2 auto-scaling groups and PostgreSQL compound indexing. Clarified production cloud usage.",
        source: "RecruitAI Audio Stream",
        status: "Validated",
        timestamp: "11:05 AM",
        color: "#8b5cf6"
      },
      {
        id: "ev-requirements",
        type: "REQUIREMENTS",
        label: "Role Fit Index",
        excerpt: "5 of 6 primary requirements validated with strong documentary and conversational evidence.",
        source: "Semantic Match Engine",
        status: "Validated",
        timestamp: "11:10 AM",
        color: "#06b6d4"
      },
      {
        id: "ev-insights",
        type: "INSIGHTS",
        label: "AI Reasoning Summary",
        excerpt: "High engineering velocity and deep frontend/backend fluency. Production DevOps autonomy requires brief probe.",
        source: "Candidate Intelligence Core",
        status: "Needs Human Review",
        timestamp: "11:15 AM",
        color: "#f59e0b"
      }
    ],

    // Projects breakdown
    projects: [
      {
        title: "OmniStore Distributed Checkout",
        stack: ["React", "Node.js", "Redis", "PostgreSQL"],
        description: "Built an e-commerce checkout platform processing 2,500 requests/sec with optimistic UI updates.",
        evidenceStatus: "Validated",
        link: "github.com/rahul/omnistore"
      },
      {
        title: "FastAPI Trade Analytics Service",
        stack: ["Python", "FastAPI", "Pandas", "TimescaleDB"],
        description: "Financial ticker streaming microservice generating sub-second volume-weighted moving averages.",
        evidenceStatus: "Validated",
        link: "github.com/rahul/trade-analytics"
      }
    ],

    // Attention Needed / Validation Gaps
    validationGaps: [
      {
        id: "gap-aws",
        requirement: "AWS Infrastructure",
        severity: "Medium Attention",
        issue: "Candidate mentions AWS in resume summary. Missing production deployment details or Infrastructure-as-Code (Terraform/CloudFormation).",
        detectedIn: "Resume + GitHub Repos",
        suggestedQuestion: "Which AWS services did you use in production, and how did you manage automated rollback during failed deployments?",
        resolved: false
      },
      {
        id: "gap-sys",
        requirement: "System Design",
        severity: "Advisory",
        issue: "High-level architecture mentioned but cache invalidation strategies under split-brain scenarios were not detailed.",
        detectedIn: "Preliminary Screen",
        suggestedQuestion: "How would you design a distributed caching layer when handling write-heavy relational spikes?",
        resolved: false
      },
      {
        id: "gap-deploy",
        requirement: "CI/CD & Monitoring",
        severity: "Low Attention",
        issue: "Telemetry, distributed tracing (OpenTelemetry/Datadog) evidence is sparse across public portfolio.",
        detectedIn: "Repo Analysis",
        suggestedQuestion: "What metrics and dashboards do you monitor after pushing a breaking migration to production?",
        resolved: false
      }
    ],

    // AI Generated Interview Questions
    interviewQuestions: [
      {
        id: "q-01",
        number: "01",
        category: "Technical Architecture",
        question: "Tell me about the production system where you used Python and how you handled concurrent database connections.",
        whyThisQuestion: "Python experience is present in resume and projects, but concurrency limits and connection pooling require validation.",
        skillTarget: "Python / Data Layer",
        status: "Answered & Validated"
      },
      {
        id: "q-02",
        number: "02",
        category: "Cloud Deployment",
        question: "Which AWS services did you configure yourself in production, and what caused your last infrastructure incident?",
        whyThisQuestion: "AWS evidence was marked unclear in initial screening; candidate needs to substantiate hands-on cloud responsibility.",
        skillTarget: "AWS Cloud",
        status: "Answered & Validated"
      },
      {
        id: "q-03",
        number: "03",
        category: "Frontend Performance",
        question: "In your React e-commerce application, how did you measure and optimize First Input Delay and re-render cycles?",
        whyThisQuestion: "Validates depth beyond standard component scaffolding to verify senior-level client performance rigor.",
        skillTarget: "React / Web Performance",
        status: "Answered & Validated"
      },
      {
        id: "q-04",
        number: "04",
        category: "System Design & Resilience",
        question: "If your primary relational database replica falls 10 seconds behind during a flash sale, how does your system fail gracefully?",
        whyThisQuestion: "Probes system resilience and distributed failure modes as required for Senior Software Engineer grade.",
        skillTarget: "System Design",
        status: "Pending Recruiter Probe"
      }
    ],

    // Interactive Transcript Sentences for Split Analysis
    transcriptSentences: [
      {
        id: "ts-01",
        speaker: "Candidate",
        timestamp: "02:14",
        text: "I deployed the application using AWS EC2 with auto-scaling groups and an Application Load Balancer.",
        connectedSkill: "AWS",
        mappedNodes: ["AWS", "EC2", "Auto-Scaling", "Deployment"],
        evidenceResult: "VALIDATED",
        evidenceNote: "Candidate confirmed hands-on provision of EC2 launch templates, health checks, and ALB routing.",
        highlightColor: "#38bdf8"
      },
      {
        id: "ts-02",
        speaker: "Candidate",
        timestamp: "04:35",
        text: "We rewrote our transaction microservice in Python using FastAPI with async SQLAlchemy, cutting p99 latency to 42ms.",
        connectedSkill: "Python",
        mappedNodes: ["Python", "FastAPI", "Async I/O", "Microservices"],
        evidenceResult: "VALIDATED",
        evidenceNote: "High-confidence proof of asynchronous Python concurrency and production microservice tuning.",
        highlightColor: "#6366f1"
      },
      {
        id: "ts-03",
        speaker: "Candidate",
        timestamp: "07:18",
        text: "On the frontend, we built complex state machines using React Context, TanStack Query, and virtualized tables.",
        connectedSkill: "React",
        mappedNodes: ["React", "State Management", "TanStack Query", "Virtualization"],
        evidenceResult: "VALIDATED",
        evidenceNote: "Demonstrates advanced reactive architecture and client rendering optimization.",
        highlightColor: "#10b981"
      },
      {
        id: "ts-04",
        speaker: "Candidate",
        timestamp: "09:42",
        text: "For database queries, we utilized PostgreSQL EXPLAIN ANALYZE to create compound indexes and eliminate sequential scans.",
        connectedSkill: "SQL",
        mappedNodes: ["SQL", "PostgreSQL", "Query Plans", "Indexing"],
        evidenceResult: "VALIDATED",
        evidenceNote: "Verified deep query optimization and relational schema knowledge.",
        highlightColor: "#06b6d4"
      },
      {
        id: "ts-05",
        speaker: "Candidate",
        timestamp: "12:05",
        text: "We wanted to adopt Kubernetes, but due to sprint deadlines we kept orchestration strictly on Docker Compose and bash scripts.",
        connectedSkill: "System Design",
        mappedNodes: ["Kubernetes", "Container Orchestration", "Adoption Gap"],
        evidenceResult: "GAPS CONFIRMED",
        evidenceNote: "Candidate honestly acknowledged lack of production Kubernetes cluster management experience.",
        highlightColor: "#f59e0b"
      }
    ]
  },

  {
    id: "cand-priya",
    name: "Priya Reddy",
    title: "AI Engineer",
    experience: "2.2 years",
    education: "M.Tech Data Science & AI",
    location: "Bengaluru, IN",
    avatar: "PR",
    coverageScore: 88,
    jobId: "job-02",
    jobTitle: "AI Engineer",
    summary: "ML researcher turned applied engineer with strong transformer fine-tuning, embeddings, and vector search experience.",
    skills: [
      { name: "Python", status: "validated", level: "Expert", confidence: 97, source: "PyTorch commits + Kaggle Master" },
      { name: "Machine Learning", status: "validated", level: "Senior", confidence: 93, source: "Published papers + Models" },
      { name: "TensorFlow", status: "validated", level: "Advanced", confidence: 88, source: "Production pipelines" },
      { name: "SQL", status: "validated", level: "Proficient", confidence: 84, source: "Data extraction queries" },
      { name: "Deployment", status: "unclear", level: "Unclear Depth", confidence: 52, source: "Missing Triton/vLLM logs" }
    ],
    evidenceNodes: [
      { id: "ev-p1", type: "RESUME", label: "M.Tech Distinction", excerpt: "Specialized in Low-Rank Adaptation (LoRA) and semantic retrieval architectures.", source: "Degree Audit", status: "Validated", color: "#38bdf8" },
      { id: "ev-p2", type: "PROJECTS", label: "Legal RAG Search", excerpt: "Built an embedding indexing pipeline across 50,000 legal contracts using Qdrant and LangChain.", source: "GitHub Repo", status: "Validated", color: "#6366f1" },
      { id: "ev-p3", type: "INSIGHTS", label: "Inference Deployment Gap", excerpt: "Model training is validated; containerized GPU serving (vLLM / Triton) requires probe.", source: "AI Reasoning", status: "Needs Human Review", color: "#f59e0b" }
    ],
    validationGaps: [
      {
        id: "gap-p-deploy",
        requirement: "Model Deployment & Serving",
        severity: "High Attention",
        issue: "Strong algorithmic background, but production serving throughput (tokens/sec, tensor parallelism) lacks verification.",
        detectedIn: "GitHub Repos",
        suggestedQuestion: "How have you deployed LLMs or neural models in production, and how did you minimize KV-cache memory pressure?",
        resolved: false
      }
    ]
  },

  {
    id: "cand-arjun",
    name: "Arjun Kumar",
    title: "Full Stack Developer",
    experience: "3.5 years",
    education: "B.E Information Technology",
    location: "Pune, IN",
    avatar: "AK",
    coverageScore: 95,
    jobId: "job-03",
    jobTitle: "Frontend Engineer",
    summary: "Versatile product engineer with an extensive portfolio of production React, Node.js, and complex interactive web interfaces.",
    skills: [
      { name: "React", status: "validated", level: "Lead", confidence: 96, source: "Design system core author" },
      { name: "Node.js", status: "validated", level: "Senior", confidence: 92, source: "GraphQL federation gateway" },
      { name: "MongoDB", status: "validated", level: "Advanced", confidence: 90, source: "High throughput indexing" },
      { name: "JavaScript", status: "validated", level: "Expert", confidence: 98, source: "Open source contributions" },
      { name: "Git", status: "validated", level: "Expert", confidence: 95, source: "PR review leader" }
    ],
    evidenceNodes: [
      { id: "ev-a1", type: "RESUME", label: "SaaS Scale Experience", excerpt: "Architected real-time collaboration canvas with multi-cursor CRDTs.", source: "Resume Audit", status: "Validated", color: "#38bdf8" },
      { id: "ev-a2", type: "PROJECTS", label: "Open Canvas UI", excerpt: "Over 2,400 GitHub stars for custom canvas rendering engine using WebGL and Canvas API.", source: "Public Repo", status: "Validated", color: "#10b981" }
    ],
    validationGaps: [
      {
        id: "gap-a-test",
        requirement: "End-to-End Test Automation",
        severity: "Low Attention",
        issue: "Unit tests are well represented, but automated visual regression or Playwright E2E suites were not referenced.",
        detectedIn: "Portfolio Review",
        suggestedQuestion: "What is your strategy for catching visual layout regressions across different browser viewports before shipping?",
        resolved: false
      }
    ]
  },

  {
    id: "cand-sneha",
    name: "Sneha Patel",
    title: "Data Analyst",
    experience: "1.9 years",
    education: "B.Sc Statistics & Computing",
    location: "Mumbai, IN",
    avatar: "SP",
    coverageScore: 78,
    jobId: "job-01",
    jobTitle: "Senior Software Engineer",
    summary: "Quantitative data specialist transitioning into backend analytical engineering, with strong SQL and business dashboards.",
    skills: [
      { name: "Python", status: "unclear", level: "Scripting Only", confidence: 60, source: "Jupyter notebooks only" },
      { name: "SQL", status: "validated", level: "Expert", confidence: 95, source: "Complex CTEs and window funcs" },
      { name: "Power BI", status: "validated", level: "Lead", confidence: 94, source: "Executive dashboard suite" },
      { name: "Excel", status: "validated", level: "Expert", confidence: 96, source: "Financial modeling" }
    ],
    evidenceNodes: [
      { id: "ev-s1", type: "RESUME", label: "Statistical Modeling", excerpt: "Developed cohort retention curves and customer lifetime value predictive spreadsheets.", source: "Resume Audit", status: "Validated", color: "#38bdf8" },
      { id: "ev-s2", type: "INSIGHTS", label: "Software Engineering Depth Gap", excerpt: "Python experience is restricted to ad-hoc Jupyter exploratory data analysis rather than production microservices.", source: "Semantic Analysis", status: "Needs Human Review", color: "#f59e0b" }
    ],
    validationGaps: [
      {
        id: "gap-s-oop",
        requirement: "Production Python & OOP",
        severity: "High Attention",
        issue: "Candidate demonstrates strong data analysis in notebooks, but lacks evidence of modular object-oriented code, unit testing, or git branches.",
        detectedIn: "Repository Scan",
        suggestedQuestion: "Can you walk through how you structure Python packages, manage dependencies with pyproject.toml, and write automated tests?",
        resolved: false
      }
    ]
  }
];

export const MOCK_AUDIT_TRAIL = [
  {
    time: "10:42:10",
    candidate: "Rahul Sharma",
    action: "Resume Ingestion & Entity Parsing",
    details: "Extracted 2.8y experience, B.Tech CSE, 6 core technology tags, 2 prior employment records.",
    confidence: "99.4%",
    type: "system"
  },
  {
    time: "10:44:28",
    candidate: "Rahul Sharma",
    action: "Python Requirement Validated",
    details: "Corroborated across 3 sources: Resume work history, GitHub repository `trade-analytics`, and live interview response.",
    confidence: "96.2%",
    type: "validation"
  },
  {
    time: "10:47:04",
    candidate: "Rahul Sharma",
    action: "AWS Evidence Flagged as Unclear",
    details: "Found single keyword citation in resume summary without architectural or VPC context.",
    confidence: "48.0%",
    type: "attention"
  },
  {
    time: "10:51:19",
    candidate: "Rahul Sharma",
    action: "Targeted Interview Questions Synthesized",
    details: "4 dynamic probes generated targeting concurrency, AWS production deployment, and failover design.",
    confidence: "94.8%",
    type: "generation"
  },
  {
    time: "11:05:42",
    candidate: "Rahul Sharma",
    action: "Interview Transcript Sentence Verified",
    details: "Candidate stated: 'I deployed the application using AWS EC2 with auto-scaling groups'. AWS status promoted to VALIDATED.",
    confidence: "92.0%",
    type: "validation"
  },
  {
    time: "11:15:00",
    candidate: "Rahul Sharma",
    action: "Recruiter Review Session Initiated",
    details: "Structured Evidence Report compiled. Human recruiter decision required per AI ethics guidelines.",
    confidence: "100%",
    type: "human-checkpoint"
  }
];

export const FLOATING_EVIDENCE_BADGES = [
  { text: "✦ Python detected", color: "text-cyan-400 border-cyan-500/30 bg-cyan-950/40" },
  { text: "✦ React project found", color: "text-blue-400 border-blue-500/30 bg-blue-950/40" },
  { text: "+ 2.8 years experience", color: "text-emerald-400 border-emerald-500/30 bg-emerald-950/40" },
  { text: "✦ SQL validated", color: "text-indigo-400 border-indigo-500/30 bg-indigo-950/40" },
  { text: "⚠ AWS evidence unclear", color: "text-amber-400 border-amber-500/30 bg-amber-950/40" },
  { text: "✦ Node.js project detected", color: "text-sky-400 border-sky-500/30 bg-sky-950/40" },
  { text: "✦ 92% evidence coverage", color: "text-violet-400 border-violet-500/30 bg-violet-950/40" },
  { text: "✦ Fast-path interview mapped", color: "text-teal-400 border-teal-500/30 bg-teal-950/40" }
];

export const TOUR_STEPS = [
  {
    step: 1,
    tab: "dashboard",
    title: "1. Recruiter Opens RecruitAI",
    desc: "RecruitAI introduces a spatial 3D intelligence workspace rather than a generic SaaS dashboard."
  },
  {
    step: 2,
    tab: "dashboard",
    title: "2. Clean 3D Intelligence Core",
    desc: "Observe the clean 3D neural sphere with non-overlapping evidence nodes (Resume, Skills, Projects, Experience, Interview, Requirements, Insights) responding with subtle parallax."
  },
  {
    step: 3,
    tab: "jobs",
    title: "3. Recruiter Selects a Job Role",
    desc: "Horizontal role explorer replaces table grids. Hover to expand roles; select '01 SENIOR SOFTWARE ENGINEER'."
  },
  {
    step: 4,
    tab: "jobs-detail",
    title: "4. Requirements Mapped to Role Spec",
    desc: "The 3D requirement constellation arranges Python, React, SQL, AWS, System Design, and Communication into an interactive spec."
  },
  {
    step: 5,
    tab: "candidates",
    title: "5. Candidate Evidence Stream",
    desc: "Candidate stream displays Rahul Sharma (92% coverage) with validated skill dots (●) and flagged ambiguities (!)."
  },
  {
    step: 6,
    tab: "profile",
    title: "6. Evidence Connects to Requirements",
    desc: "In Rahul Sharma's 3D dossier, orbiting evidence nodes connect to the central candidate profile with animated lines."
  },
  {
    step: 7,
    tab: "profile",
    title: "7. Missing Evidence Highlighted",
    desc: "AWS is highlighted with an amber indicator ('Evidence Unclear'), prompting recruiter validation."
  },
  {
    step: 8,
    tab: "profile",
    title: "8. Interactive Evidence Timeline",
    desc: "Click along RESUME → PROJECT → GITHUB → INTERVIEW → INSIGHT to inspect corroborated source citations."
  },
  {
    step: 9,
    tab: "interviews",
    title: "9. Interviewer Co-Pilot Workspace",
    desc: "RecruitAI prepares targeted technical and behavioral probes targeting unverified claims."
  },
  {
    step: 10,
    tab: "interviews",
    title: "10. Cinematic AI Pipeline Processing",
    desc: "Watch the multi-stage AI reasoning sequence execute: SCAN → UNDERSTAND → MAP → VALIDATE → INSIGHT."
  },
  {
    step: 11,
    tab: "interviews",
    title: "11. Interview Questions & Rationale Revealed",
    desc: "Explore the structured interviewer layout with verbatim questions to ask, why we ask it, observed evidence, and validation gaps."
  },
  {
    step: 12,
    tab: "evidence",
    title: "12. Upload Meeting Notes to Begin",
    desc: "Evidence Dossier requires uploaded notes before analysis. Upload notes to trigger the 4-stage extraction pipeline."
  },
  {
    step: 13,
    tab: "evidence",
    title: "13. Dynamic Evidence Graph Corroboration",
    desc: "Select transcript sentences to see live connections: AWS → EC2 → Auto-Scaling → Deployment → VALIDATED!"
  },
  {
    step: 14,
    tab: "evidence",
    title: "14. Validation Gaps & Warning Radar",
    desc: "The 'ATTENTION NEEDED' section displays remaining nuances with recommended probe questions."
  },
  {
    step: 15,
    tab: "reports",
    title: "15. Final Evidence Report Generated",
    desc: "Publication-grade dossier with animated completion rate, detailed audit trail, and zero algorithmic bias."
  },
  {
    step: 16,
    tab: "reports",
    title: "16. Recruiter Evaluates & Signs Off",
    desc: "IMPORTANT: The AI does NOT decide hires. The recruiter reviews evidence, inputs notes, and authorizes the final hiring decision!"
  }
];

