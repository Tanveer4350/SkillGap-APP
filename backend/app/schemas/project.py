from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ProjectBase(BaseModel):
    title: str
    description: str
    role: Optional[str] = "Developer"
    duration: Optional[str] = "2 weeks"
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    technologies: List[str] = []
    difficulty: Optional[str] = "intermediate"
    impact_metrics: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    role: Optional[str] = None
    duration: Optional[str] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    technologies: Optional[List[str]] = None
    difficulty: Optional[str] = None
    impact_metrics: Optional[str] = None

class ProjectOut(BaseModel):
    id: int
    profile_id: int
    title: str
    description: str
    role: Optional[str] = None
    duration: Optional[str] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    technologies: List[str] = []
    verified_skills: List[str] = []
    difficulty: Optional[str] = "intermediate"
    impact_metrics: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
