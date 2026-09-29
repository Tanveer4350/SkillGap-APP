from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class EducationBase(BaseModel):
    institution: str
    degree: str
    field_of_study: Optional[str] = None
    start_year: Optional[int] = None
    end_year: Optional[int] = None
    grade: Optional[str] = None
    current: Optional[int] = 1

class EducationCreate(EducationBase):
    pass

class EducationOut(EducationBase):
    id: int
    profile_id: int
    class Config:
        from_attributes = True

class ExperienceBase(BaseModel):
    company: str
    role: str
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    current: Optional[int] = 0
    description: Optional[str] = None

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceOut(ExperienceBase):
    id: int
    profile_id: int
    class Config:
        from_attributes = True

class CertificationBase(BaseModel):
    name: str
    issuing_org: str
    issue_date: Optional[str] = None
    expiry_date: Optional[str] = None
    credential_url: Optional[str] = None

class CertificationCreate(CertificationBase):
    pass

class CertificationOut(CertificationBase):
    id: int
    profile_id: int
    class Config:
        from_attributes = True

class ProfileUpdate(BaseModel):
    bio: Optional[str] = None
    branch: Optional[str] = None
    location: Optional[str] = None
    target_role_id: Optional[int] = None
    custom_target_role: Optional[str] = None
    github_username: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    preferred_workplace_type: Optional[str] = None
    available_from: Optional[str] = None

class ProfileOut(BaseModel):
    id: int
    user_id: int
    bio: Optional[str] = None
    branch: Optional[str] = None
    location: Optional[str] = None
    target_role_id: Optional[int] = None
    custom_target_role: Optional[str] = None
    profile_completion_pct: float
    profile_readiness_pct: float
    github_username: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    preferred_workplace_type: Optional[str] = None
    available_from: Optional[str] = None
    earned_badges_json: Optional[str] = "[]"
    experience_points: int = 100
    created_at: datetime
    
    educations: List[EducationOut] = []
    experiences: List[ExperienceOut] = []
    certifications: List[CertificationOut] = []

    class Config:
        from_attributes = True
