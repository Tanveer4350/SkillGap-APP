from pydantic import BaseModel
from typing import Optional, List

class SkillBase(BaseModel):
    name: str
    category: str
    description: Optional[str] = None
    icon: Optional[str] = None

class SkillCreate(SkillBase):
    pass

class SkillOut(SkillBase):
    id: int
    class Config:
        from_attributes = True

class StudentSkillCreate(BaseModel):
    name: str
    category: Optional[str] = "core"
    proficiency_level: Optional[str] = "intermediate" # beginner, intermediate, advanced, expert
    years_experience: Optional[int] = 1

class BulkStudentSkillsCreate(BaseModel):
    skills: List[StudentSkillCreate]

class StudentSkillOut(BaseModel):
    id: int
    skill_id: int
    name: str
    category: str
    proficiency_level: str
    source: str
    verified: bool
    years_experience: int
    evidence_count: Optional[int] = 0

    class Config:
        from_attributes = True
