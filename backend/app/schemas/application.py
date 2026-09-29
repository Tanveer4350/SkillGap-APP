from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.schemas.opportunity import OpportunityOut

class ApplicationCreate(BaseModel):
    opportunity_id: Optional[int] = None
    custom_title: Optional[str] = None
    custom_company: Optional[str] = None
    status: Optional[str] = "saved" # saved, applied, assessment, interview, offer, rejected, withdrawn
    applied_date: Optional[datetime] = None
    deadline_date: Optional[str] = None
    notes: Optional[str] = None

class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    interview_date: Optional[str] = None
    salary_offered: Optional[str] = None
    deadline_date: Optional[str] = None

class ApplicationOut(BaseModel):
    id: int
    user_id: int
    opportunity_id: Optional[int] = None
    custom_title: Optional[str] = None
    custom_company: Optional[str] = None
    status: str
    match_score: int
    applied_date: Optional[datetime] = None
    deadline_date: Optional[str] = None
    interview_date: Optional[str] = None
    salary_offered: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    opportunity: Optional[OpportunityOut] = None

    class Config:
        from_attributes = True
