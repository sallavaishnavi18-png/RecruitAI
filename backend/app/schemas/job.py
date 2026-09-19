from pydantic import BaseModel


class Job(BaseModel):
    title: str
    description: str