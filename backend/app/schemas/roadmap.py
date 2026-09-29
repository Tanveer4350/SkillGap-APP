from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ResourceItem(BaseModel):
    title: str
    type: str # video, doc, course, interactive
    url: str
    duration: Optional[str] = "45 mins"

class MiniTask(BaseModel):
    title: str
    description: str
    test_criteria: str

class RoadmapProject(BaseModel):
    title: str
    description: str
    skills: List[str]
    estimated_hours: int = 10

class RoadmapItemOut(BaseModel):
    id: int
    phase_number: int
    title: str
    skill_name: str
    category: str
    why_learn: str
    prerequisites: List[str] = []
    learning_objectives: List[str] = []
    suggested_resources: List[ResourceItem] = []
    mini_task: Optional[MiniTask] = None
    project: Optional[RoadmapProject] = None
    assessment_skill: Optional[str] = None
    status: str # not_started, in_progress, completed
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class RoadmapItemUpdate(BaseModel):
    status: str # not_started, in_progress, completed

class RoadmapOut(BaseModel):
    id: int
    target_role_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    total_phases: int
    current_phase: int
    progress_pct: float
    items: List[RoadmapItemOut] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
