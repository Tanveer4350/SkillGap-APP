from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class ResumeOut(BaseModel):
    id: int
    filename: str
    file_size: int
    upload_date: datetime
    class Config:
        from_attributes = True

class ResumeSkillEvidence(BaseModel):
    skill: str
    evidence: str
    status: str # "Strong evidence", "Moderate evidence", "Missing evidence"

class ResumeAnalysisOut(BaseModel):
    id: int
    resume_id: int
    extracted_name: Optional[str] = None
    extracted_email: Optional[str] = None
    extracted_skills: List[str] = []
    extracted_experience: List[Any] = []
    extracted_projects: List[Any] = []
    extracted_education: List[Any] = []
    
    skills_found: List[str] = []
    skills_missing: List[str] = []
    evidence_breakdown: List[ResumeSkillEvidence] = []
    missing_sections: List[str] = []
    improvement_suggestions: List[str] = []
    ats_score: float = 75.0
    analyzed_at: datetime

    class Config:
        from_attributes = True
