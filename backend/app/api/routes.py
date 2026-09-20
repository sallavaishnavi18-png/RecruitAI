from app.database.supabase import supabase
from app.ai.portfolio.portfolio_analyzer import analyze_portfolio_data
from app.integrations.portfolio.portfolio_api import get_portfolio_data
from fastapi import APIRouter, UploadFile, File, Body

from app.ai.github.github_analyzer import analyze_github_data
from app.ai.gemini import analyze_resume
from app.ai.job_analyzer import analyze_job_description
from app.ai.matcher import match_candidate_to_job
from app.ai.interview import generate_interview_questions
from app.ai.verification import verify_resume_claims
from app.ai.transcript import analyze_transcript
from app.ai.search.candidate_search import search_candidates
from app.ai.skillgap.skill_gap import analyze_skill_gap
from app.ai.comparison.candidate_comparison import compare_candidates
from app.ai.evidence.evidence import generate_evidence
from app.ai.report.report import generate_evaluation_report

from app.extractors.pdf import extract_text_from_pdf

from app.integrations.github.github_api import analyze_github_profile

import os


router = APIRouter()


@router.get("/")
def home():
    return {
        "message": "RecruitAI Backend API is running!"
    }


@router.post("/resume")
async def upload_resume(file: UploadFile = File(...)):

    file_path = "resume.pdf"

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    resume_text = extract_text_from_pdf(file_path)

    candidate = analyze_resume(resume_text)

    # Save candidate to Supabase
    supabase.table("candidates").insert({
        "name": candidate.get("name"),
        "email": candidate.get("email"),
        "phone": candidate.get("phone"),
        "skills": candidate.get("skills", []),
        "education": candidate.get("education", []),
        "experience": candidate.get("experience", []),
        "achievements": candidate.get("achievements", [])
    }).execute()

    return {
        "message": "Resume analyzed and candidate saved successfully!",
        "candidate": candidate
    }


@router.post("/job")
def analyze_job(job: dict):

    result = analyze_job_description(
        job["title"],
        job["description"]
    )

    return {
        "message": "Job description analyzed successfully!",
        "requirements": result
    }


@router.post("/match")
def match_candidate(
    candidate: dict,
    requirements: dict
):

    result = match_candidate_to_job(
        candidate,
        requirements
    )

    return {
        "message": "Candidate matched successfully!",
        "match": result
    }


@router.post("/interview/questions")
def generate_questions(
    candidate: dict,
    requirements: dict
):

    questions = generate_interview_questions(
        candidate,
        requirements
    )

    return {
        "message": "Interview questions generated successfully!",
        "questions": questions
    }


@router.post("/interview/verify")
def verify_claims(
    candidate: dict,
    requirements: dict,
    interview_answers: dict
):

    result = verify_resume_claims(
        candidate,
        requirements,
        interview_answers
    )

    return {
        "message": "Resume claims verified successfully!",
        "verification": result
    }


@router.post("/interview/analyze")
def analyze_interview(
    transcript: str,
    candidate: dict,
    requirements: dict
):

    analysis = analyze_transcript(
        transcript,
        candidate,
        requirements
    )

    return {
        "message": "Interview transcript analyzed successfully!",
        "analysis": analysis
    }


@router.post("/candidates/search")
def search_candidate_pool(
    query: str,
    candidates: list = Body(...)
):

    results = search_candidates(
        query,
        candidates
    )

    return {
        "message": "Candidate search completed successfully!",
        "results": results
    }


@router.post("/skill-gap")
def skill_gap_analysis(
    candidate: dict,
    requirements: dict
):

    result = analyze_skill_gap(
        candidate,
        requirements
    )

    return {
        "message": "Skill gap analysis completed successfully!",
        "skill_gap": result
    }


@router.post("/candidates/compare")
def compare_candidate_pool(
    candidates: list = Body(...),
    requirements: dict = Body(...)
):

    comparison = compare_candidates(
        candidates,
        requirements
    )

    return {
        "message": "Candidate comparison completed successfully!",
        "comparison": comparison
    }


@router.post("/evidence")
def create_evidence(
    candidate: dict,
    requirements: dict,
    match_result: dict,
    verification: dict
):

    evidence = generate_evidence(
        candidate,
        requirements,
        match_result,
        verification
    )

    return {
        "message": "Evidence audit trail generated successfully!",
        "evidence": evidence
    }


@router.post("/evaluation-report")
def create_evaluation_report(
    candidate: dict,
    requirements: dict,
    match_result: dict,
    skill_gap: dict,
    evidence: dict,
    interview_analysis: dict = None
):

    report = generate_evaluation_report(
        candidate,
        requirements,
        match_result,
        skill_gap,
        evidence,
        interview_analysis
    )

    return {
        "message": "Evaluation report generated successfully!",
        "report": report
    }


@router.get("/github/{username}")
def github_profile(username: str):

    github_data = analyze_github_profile(username)

    ai_analysis = analyze_github_data(github_data)

    return {
        "message": "GitHub profile analyzed successfully!",
        "github": github_data,
        "ai_analysis": ai_analysis
    }

@router.get("/portfolio")
def portfolio_analysis(url: str):

    portfolio = get_portfolio_data(url)

    ai_analysis = analyze_portfolio_data(portfolio)

    return {
        "message": "Portfolio analysis completed successfully!",
        "portfolio": portfolio,
        "ai_analysis": ai_analysis
    }