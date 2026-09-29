from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class AIChatMessage(BaseModel):
    role: str # user, assistant, system
    content: str

class AIChatRequest(BaseModel):
    message: str
    history: Optional[List[AIChatMessage]] = []

class AIChatResponse(BaseModel):
    reply: str
    referenced_skills: List[str] = []
    referenced_projects: List[str] = []
    recommended_action: Optional[Dict[str, str]] = None

class AIProfileAnalysisResponse(BaseModel):
    summary: str
    top_strengths: List[str]
    critical_gaps: List[str]
    immediate_actions: List[str]
    suggested_projects: List[Dict[str, Any]]
