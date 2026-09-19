from fastapi import APIRouter, UploadFile, File, Body

from app.schemas.job import Job
from app.extractors.pdf import extract_text_from_pdf

from app.ai.gemini import analyze_resume
from app.ai.job_analyzer import analyze_job
from app.ai.matcher import match_candidate
from app.ai.interview import generate_interview_questions
from app.ai.transcript import analyze_transcript
from app.ai.verification import verify_resume_claims
from app.ai.search.candidate_search import search_candidates
from app.ai.skillgap.skill_gap import analyze_skill_gap
from app.ai.comparison.candidate_comparison import compare_candidates


router = APIRouter()


@router.get("/health")
def health_check():

    return {
        "message": "RecruitAI API is working!"
    }


@router.post("/jobs")
def create_job(job: Job):

    job_analysis = analyze_job(job.description)

    return {
        "message": "Job analyzed successfully!",
        "job": {
            "title": job.title,
            "description": job.description
        },
        "requirements": job_analysis
    }


@router.post("/resume")
async def upload_resume(file: UploadFile = File(...)):

    file_path = "resume.pdf"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    text = extract_text_from_pdf(file_path)

    candidate = analyze_resume(text)

    return {
        "message": "Resume analyzed successfully!",
        "filename": file.filename,
        "candidate": candidate
    }


@router.post("/match")
def match_candidate_to_job(candidate: dict, requirements: dict):

    match_result = match_candidate(
        candidate,
        requirements
    )

    return {
        "message": "Candidate matched successfully!",
        "match": match_result
    }


@router.post("/interview/questions")
def generate_questions(candidate: dict, requirements: dict):

    questions = generate_interview_questions(
        candidate,
        requirements
    )

    return {
        "message": "Interview questions generated successfully!",
        "questions": questions
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


@router.post("/interview/verify")
def verify_claims(
    candidate: dict,
    transcript: str
):

    verification = verify_resume_claims(
        candidate,
        transcript
    )

    return {
        "message": "Resume claims verified successfully!",
        "verification": verification
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