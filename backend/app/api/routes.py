from fastapi import APIRouter, UploadFile, File
from app.schemas.job import Job
from app.extractors.pdf import extract_text_from_pdf
from app.services.resume_parser import parse_resume_text


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

    candidate = parse_resume_text(text)

    return {
        "message": "Resume parsed successfully!",
        "filename": file.filename,
        "candidate": candidate
    }