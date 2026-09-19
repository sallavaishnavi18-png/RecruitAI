from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def health_check():
    return {"message": "RecruitAI API is working!"}


@router.post("/jobs")
def create_job(title: str, description: str):
    return {
        "message": "Job created successfully!",
        "title": title,
        "description": description
    }