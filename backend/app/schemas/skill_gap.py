from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class SkillGapItem(BaseModel):
    skill: str
    category: str
    status: str # "strong", "developing", "needs_improvement", "missing"
    importance: str # "critical", "high", "medium", "preferred"
    why_it_matters: str
    current_evidence: List[str] = []
    what_is_missing: str
    recommendation: str

class CategoryScore(BaseModel):
    category: str
    score: int
    required_count: int
    matched_count: int

class RecommendationStep(BaseModel):
    step_number: int
    title: str
    description: str
    action_type: str # "learn", "project", "assessment", "resume"
    action_label: str
    action_link: str

class RecommendedProject(BaseModel):
    title: str
    description: str
    skills: List[str]
    difficulty: str
    duration: str
    impact: str

class SkillGapAnalysisOut(BaseModel):
    id: int
    user_id: int
    target_role_id: Optional[int] = None
    target_role_name: str
    
    overall_readiness_pct: float
    skill_coverage_pct: float
    evidence_coverage_pct: float
    project_score_pct: float
    resume_score_pct: float
    assessment_score_pct: float
    
    gaps: List[SkillGapItem] = []
    categories: List[CategoryScore] = []
    recommendations: List[RecommendationStep] = []
    recommended_projects: List[RecommendedProject] = []
    created_at: datetime

    class Config:
        from_attributes = True

class AnalyzeRoleRequest(BaseModel):
    target_role_id: Optional[int] = None
    target_role_name: Optional[str] = None
    custom_role_description: Optional[str] = None

class JobDescriptionAnalyzeRequest(BaseModel):
    job_title: str
    company_name: Optional[str] = None
    job_description_text: str
