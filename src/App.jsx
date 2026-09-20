import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import ConstellationBackground from './components/background/ConstellationBackground';

import AuthView from './components/auth/AuthView';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import SlidePanel from './components/layout/SlidePanel';

import HeroSection from './components/hero/HeroSection';
import VisualStoryTimeline from './components/story/VisualStoryTimeline';

import RoleExplorer from './components/jobs/RoleExplorer';
import JobIntelligenceView from './components/jobs/JobIntelligenceView';

import CandidateStream from './components/candidates/CandidateStream';
import CandidateProfileView from './components/candidates/CandidateProfileView';

import InterviewerWorkspace from './components/interview/InterviewerWorkspace';

import EvidenceDossierView from './components/evidence/EvidenceDossierView';

import FinalEvidenceReport from './components/report/FinalEvidenceReport';

import AISearchPage from './components/search/AISearchPage';

import HackathonTourOverlay from './components/tour/HackathonTourOverlay';

import {
  MOCK_CANDIDATES,
  MOCK_JOBS,
  MOCK_AUDIT_TRAIL,
  TOUR_STEPS
} from './data/mockData';


export default function App() {

  // =========================================================
  // AUTHENTICATION
  // =========================================================

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const [currentUser, setCurrentUser] = useState({
    name: 'Elena Rostova',
    email: 'elena.rostova@autonomous.ai',
    role: 'Lead Talent Partner',
    company: 'Autonomous Labs'
  });


  // =========================================================
  // NAVIGATION
  // =========================================================

  const [activeTab, setActiveTab] = useState('dashboard');

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);


  // =========================================================
  // JOB STATE
  // =========================================================

  const [selectedJob, setSelectedJob] = useState(
    MOCK_JOBS[0]
  );


  // =========================================================
  // CANDIDATE STATE
  // =========================================================
  //
  // IMPORTANT:
  // This is what allows newly added candidates to appear
  // immediately inside CandidateStream.
  //

  const [candidates, setCandidates] = useState(
    MOCK_CANDIDATES
  );

  const [selectedCandidate, setSelectedCandidate] = useState(
    MOCK_CANDIDATES[0] || null
  );


  // =========================================================
  // AUDIT TRAIL
  // =========================================================

  const [auditTrail, setAuditTrail] = useState(
    MOCK_AUDIT_TRAIL
  );


  // =========================================================
  // SLIDE PANEL
  // =========================================================

  const [slidePanelData, setSlidePanelData] = useState(null);

  const [isSlidePanelOpen, setIsSlidePanelOpen] =
    useState(false);


  const openSlidePanel = (data) => {
    setSlidePanelData(data);
    setIsSlidePanelOpen(true);
  };


  const closeSlidePanel = () => {
    setIsSlidePanelOpen(false);
  };


  // =========================================================
  // AUDIT TRAIL UPDATE
  // =========================================================

  const handleUpdateAuditTrail = (newEntry) => {
    setAuditTrail((previous) => [
      newEntry,
      ...previous
    ]);
  };


  // =========================================================
  // ADD CANDIDATE
  // =========================================================

  const handleAddCandidate = (newCandidate) => {

    setCandidates((previousCandidates) => [
      ...previousCandidates,
      newCandidate
    ]);

    // Automatically make the newly added candidate
    // the selected candidate.
    setSelectedCandidate(newCandidate);
  };


  // =========================================================
  // REMOVE CANDIDATE
  // =========================================================

  const handleRemoveCandidate = (candidateId) => {

    setCandidates((previousCandidates) => {

      const updatedCandidates =
        previousCandidates.filter(
          (candidate) => candidate.id !== candidateId
        );

      // If the deleted candidate was selected,
      // select another available candidate.
      setSelectedCandidate((currentSelected) => {

        if (
          currentSelected &&
          currentSelected.id === candidateId
        ) {
          return updatedCandidates[0] || null;
        }

        return currentSelected;
      });

      return updatedCandidates;
    });
  };


  // =========================================================
  // TOUR
  // =========================================================

  const [isTourActive, setIsTourActive] =
    useState(false);

  const [currentTourIndex, setCurrentTourIndex] =
    useState(0);


  const handleTourStepChange = (newStepIdx) => {

    setCurrentTourIndex(newStepIdx);

    const targetTour =
      TOUR_STEPS[newStepIdx];

    if (targetTour) {
      setActiveTab(targetTour.tab);
    }
  };


  const startTour = () => {

    setIsTourActive(true);

    setCurrentTourIndex(0);

    setActiveTab('dashboard');
  };


  // =========================================================
  // PAGE TRANSITIONS
  // =========================================================

  const pageVariants = {

    initial: {
      opacity: 0,
      y: 10
    },

    animate: {
      opacity: 1,
      y: 0
    },

    exit: {
      opacity: 0,
      y: -10
    }

  };


  // =========================================================
  // TOPBAR TITLE
  // =========================================================

  const getTabTitle = () => {

    switch (activeTab) {

      case 'dashboard':
        return 'Dashboard';

      case 'jobs':
        return 'Jobs';

      case 'jobs-detail':
        return selectedJob
          ? `Jobs // ${selectedJob.title}`
          : 'Jobs';

      case 'candidates':
        return 'Candidates';

      case 'profile':
        return selectedCandidate
          ? `Candidates // ${selectedCandidate.name}`
          : 'Candidates';

      case 'interviews':
        return 'Interviews';

      case 'evidence':
        return 'Evidence';

      case 'reports':
        return 'Reports';

      case 'search':
        return 'AI Search';

      default:
        return 'Dashboard';
    }
  };


  // =========================================================
  // APP
  // =========================================================

  return (

    <div
      className="
        relative
        min-h-screen
        bg-[#060810]
        text-[#f8fafc]
        font-sans
        antialiased
        overflow-x-hidden
        selection:bg-cyan-500/30
        selection:text-cyan-200
      "
    >

      {/* =====================================================
          GLOBAL CONSTELLATION BACKGROUND
          ===================================================== */}

      <ConstellationBackground />


      {/* =====================================================
          LOGIN / SIGNUP
          ===================================================== */}

      {!isAuthenticated ? (

        <AuthView

          onLoginSuccess={(userData) => {

            setCurrentUser(userData);

            setIsAuthenticated(true);

            setActiveTab('dashboard');

          }}

        />

      ) : (

        <>
          {/* =================================================
              SIDEBAR
              ================================================= */}

          <Sidebar

            activeTab={

              activeTab === 'jobs-detail'
                ? 'jobs'

                : activeTab === 'profile'
                ? 'candidates'

                : activeTab

            }

            onSelectTab={(tabId) => {

              setActiveTab(tabId);

            }}

            isMobileOpen={
              isMobileSidebarOpen
            }

            onCloseMobile={() => {

              setIsMobileSidebarOpen(false);

            }}

            user={currentUser}

            onLogout={() => {

              setIsAuthenticated(false);

            }}

          />


          {/* =================================================
              MAIN FRAME
              ================================================= */}

          <div
            className="
              lg:pl-64
              flex
              flex-col
              min-h-screen
              relative
              z-10
            "
          >

            {/* =================================================
                TOPBAR
                ================================================= */}

            <Topbar

              onOpenMobileMenu={() => {

                setIsMobileSidebarOpen(true);

              }}

              onOpenSearch={() => {

                setActiveTab('search');

              }}

              onStartTour={startTour}

              activeTabTitle={getTabTitle()}

            />


            {/* =================================================
                PAGE CONTENT
                ================================================= */}

            <main className="flex-1 pb-16">

              <AnimatePresence mode="wait">


                {/* =================================================
                    DASHBOARD
                    ================================================= */}

                {activeTab === 'dashboard' && (

                  <motion.div

                    key="dashboard"

                    variants={pageVariants}

                    initial="initial"

                    animate="animate"

                    exit="exit"

                    transition={{
                      duration: 0.35,
                      ease: 'easeInOut'
                    }}

                  >

                    <HeroSection

                      onExplore={() => {

                        setActiveTab('jobs');

                      }}

                      onStartDemo={startTour}

                      onSelectNode={openSlidePanel}

                    />


                    <VisualStoryTimeline

                      currentStage="JOB"

                      onSelectStage={(stageId) => {

                        if (stageId === 'JOB') {

                          setActiveTab('jobs');

                        }

                        else if (
                          stageId === 'RESUME' ||
                          stageId === 'EVIDENCE'
                        ) {

                          setActiveTab('candidates');

                        }

                        else if (
                          stageId === 'MATCH'
                        ) {

                          setActiveTab('profile');

                        }

                        else if (
                          stageId === 'INTERVIEW'
                        ) {

                          setActiveTab('interviews');

                        }

                        else if (
                          stageId === 'INSIGHT'
                        ) {

                          setActiveTab('evidence');

                        }

                        else if (
                          stageId === 'RECRUITER'
                        ) {

                          setActiveTab('reports');

                        }

                      }}

                    />

                  </motion.div>

                )}


                {/* =================================================
                    JOBS
                    ================================================= */}

                {activeTab === 'jobs' && (

                  <motion.div

                    key="jobs"

                    variants={pageVariants}

                    initial="initial"

                    animate="animate"

                    exit="exit"

                    transition={{
                      duration: 0.35,
                      ease: 'easeInOut'
                    }}

                  >

                    <RoleExplorer

                      selectedJobId={
                        selectedJob?.id
                      }

                      onSelectJob={(job) => {

                        setSelectedJob(job);

                        setActiveTab(
                          'jobs-detail'
                        );

                      }}

                    />

                  </motion.div>

                )}


                {/* =================================================
                    JOB DETAILS
                    ================================================= */}

                {activeTab === 'jobs-detail' && (

                  <motion.div

                    key="jobs-detail"

                    variants={pageVariants}

                    initial="initial"

                    animate="animate"

                    exit="exit"

                    transition={{
                      duration: 0.35,
                      ease: 'easeInOut'
                    }}

                  >

                    <JobIntelligenceView

                      job={selectedJob}

                      onBack={() => {

                        setActiveTab('jobs');

                      }}

                      onSelectCandidate={(candidate) => {

                        setSelectedCandidate(
                          candidate
                        );

                        setActiveTab(
                          'profile'
                        );

                      }}

                      onOpenSlidePanel={
                        openSlidePanel
                      }

                    />

                  </motion.div>

                )}


                {/* =================================================
                    CANDIDATES
                    ================================================= */}

                {activeTab === 'candidates' && (

                  <motion.div

                    key="candidates"

                    variants={pageVariants}

                    initial="initial"

                    animate="animate"

                    exit="exit"

                    transition={{
                      duration: 0.35,
                      ease: 'easeInOut'
                    }}

                  >

                    <CandidateStream

                      /*
                       * IMPORTANT:
                       * Pass the REAL candidate state.
                       */

                      candidates={
                        candidates
                      }


                      selectedCandidateId={
                        selectedCandidate?.id
                      }


                      /*
                       * Select candidate
                       */

                      onSelectCandidate={(candidate) => {

                        setSelectedCandidate(
                          candidate
                        );

                        setActiveTab(
                          'profile'
                        );

                      }}


                      /*
                       * Add candidate
                       */

                      onAddCandidate={
                        handleAddCandidate
                      }


                      /*
                       * Remove candidate
                       */

                      onRemoveCandidate={
                        handleRemoveCandidate
                      }

                    />

                  </motion.div>

                )}


                {/* =================================================
                    CANDIDATE PROFILE
                    ================================================= */}

                {activeTab === 'profile' && (

                  <motion.div

                    key="profile"

                    variants={pageVariants}

                    initial="initial"

                    animate="animate"

                    exit="exit"

                    transition={{
                      duration: 0.35,
                      ease: 'easeInOut'
                    }}

                  >

                    {selectedCandidate ? (

                      <CandidateProfileView

                        candidate={
                          selectedCandidate
                        }

                        onBack={() => {

                          setActiveTab(
                            'candidates'
                          );

                        }}

                        onOpenSlidePanel={
                          openSlidePanel
                        }

                        onNavigateInterview={(
                          candidate
                        ) => {

                          setSelectedCandidate(
                            candidate
                          );

                          setActiveTab(
                            'interviews'
                          );

                        }}

                      />

                    ) : (

                      <div className="min-h-[60vh] flex items-center justify-center">

                        <div className="text-center">

                          <p className="text-white/50 text-sm">
                            No candidate selected.
                          </p>

                          <button

                            onClick={() => {

                              setActiveTab(
                                'candidates'
                              );

                            }}

                            className="
                              mt-4
                              text-cyan-400
                              hover:text-cyan-300
                              text-sm
                            "
                          >
                            ← Back to Candidates
                          </button>

                        </div>

                      </div>

                    )}

                  </motion.div>

                )}


                {/* =================================================
                    INTERVIEWS
                    ================================================= */}

                {activeTab === 'interviews' && (

                  <motion.div

                    key="interviews"

                    variants={pageVariants}

                    initial="initial"

                    animate="animate"

                    exit="exit"

                    transition={{
                      duration: 0.35,
                      ease: 'easeInOut'
                    }}

                  >

                    {selectedCandidate && (

                      <InterviewerWorkspace

                        candidate={
                          selectedCandidate
                        }

                        onProceedToAnalysis={() => {

                          setActiveTab(
                            'evidence'
                          );

                        }}

                        onOpenSlidePanel={
                          openSlidePanel
                        }

                      />

                    )}

                  </motion.div>

                )}


                {/* =================================================
                    EVIDENCE
                    ================================================= */}

                {activeTab === 'evidence' && (

                  <motion.div

                    key="evidence"

                    variants={pageVariants}

                    initial="initial"

                    animate="animate"

                    exit="exit"

                    transition={{
                      duration: 0.35,
                      ease: 'easeInOut'
                    }}

                  >

                    {selectedCandidate && (

                      <EvidenceDossierView

                        candidate={
                          selectedCandidate
                        }

                        onOpenSlidePanel={
                          openSlidePanel
                        }

                        onProceedToReports={() => {

                          setActiveTab(
                            'reports'
                          );

                        }}

                      />

                    )}

                  </motion.div>

                )}


                {/* =================================================
                    REPORTS
                    ================================================= */}

                {activeTab === 'reports' && (

                  <motion.div

                    key="reports"

                    variants={pageVariants}

                    initial="initial"

                    animate="animate"

                    exit="exit"

                    transition={{
                      duration: 0.35,
                      ease: 'easeInOut'
                    }}

                  >

                    {selectedCandidate && (

                      <FinalEvidenceReport

                        candidate={
                          selectedCandidate
                        }

                        auditTrail={
                          auditTrail
                        }

                        onOpenSlidePanel={
                          openSlidePanel
                        }

                      />

                    )}

                  </motion.div>

                )}


                {/* =================================================
                    AI SEARCH
                    ================================================= */}

                {activeTab === 'search' && (

                  <motion.div

                    key="search"

                    variants={pageVariants}

                    initial="initial"

                    animate="animate"

                    exit="exit"

                    transition={{
                      duration: 0.35,
                      ease: 'easeInOut'
                    }}

                  >

                    <AISearchPage

                      onSelectCandidate={(candidate) => {

                        setSelectedCandidate(
                          candidate
                        );

                        setActiveTab(
                          'profile'
                        );

                      }}

                    />

                  </motion.div>

                )}

              </AnimatePresence>

            </main>

          </div>


          {/* =================================================
              UNIVERSAL SLIDE PANEL
              ================================================= */}

          <SlidePanel

            isOpen={
              isSlidePanelOpen
            }

            onClose={
              closeSlidePanel
            }

            data={
              slidePanelData
            }

          />


          {/* =================================================
              HACKATHON TOUR
              ================================================= */}

          {isTourActive && (

            <HackathonTourOverlay

              currentStepIndex={
                currentTourIndex
              }

              onStepChange={
                handleTourStepChange
              }

              onClose={() => {

                setIsTourActive(
                  false
                );

              }}

            />

          )}

        </>

      )}

    </div>

  );
}