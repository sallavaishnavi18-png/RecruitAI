from fastapi import APIRouter, UploadFile, File
from app.schemas.job import Job
from app.extractors.pdf import extract_text_from_pdf
from app.ai.gemini import analyze_resume


router = APIRouter()


@router.get("/health")
def health_check():
    return {"message": "RecruitAI API is working!"}


@router.post("/jobs")
def create_job(job: Job):
    return {
        "message": "Job created successfully!",
        "job": job
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