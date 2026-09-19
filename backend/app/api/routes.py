from fastapi import APIRouter
from app.schemas.job import Job

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