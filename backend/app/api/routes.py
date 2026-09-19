from fastapi import APIRouter, UploadFile, File

from app.schemas.job import Job
from app.extractors.pdf import extract_text_from_pdf
from app.ai.gemini import analyze_resume
from app.ai.job_analyzer import analyze_job
from app.ai.matcher import match_candidate
from app.ai.interview import generate_interview_questions


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

    match_result = match_candidate(candidate, requirements)

    return {
        "message": "Candidate matched successfully!",
        "match": match_result
    }


@router.post("/interview/questions")
def generate_questions(candidate: dict, requirements: dict):

    questions = generate_interview_questions(candidate, requirements)

    return {
        "message": "Interview questions generated successfully!",
        "questions": questions
    }