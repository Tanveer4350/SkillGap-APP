from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class OpportunityOut(BaseModel):
    id: int
    title: str
    company: str
    company_logo: Optional[str] = None
    location: str
    type: str
    workplace_type: str
    experience_level: str
    stipend_or_salary: Optional[str] = None
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    responsibilities: List[str] = []
    qualifications: List[str] = []
    description: str
    deadline: Optional[str] = None
    apply_url: Optional[str] = None
    is_active: bool
    created_at: datetime
    
    # Calculated on-the-fly for current student
    match_percentage: Optional[int] = None
    matched_skills: Optional[List[str]] = None
    missing_skills: Optional[List[str]] = None

    class Config:
        from_attributes = True

class OpportunityMatchAnalysis(BaseModel):
    opportunity_id: int
    title: str
    company: str
    match_percentage: int
    matching_skills: List[str]
    missing_skills: List[str]
    evidence_found: List[Dict[str, Any]]
    missing_evidence: List[str]
    readiness_summary: str
    suggested_focus: List[str]
