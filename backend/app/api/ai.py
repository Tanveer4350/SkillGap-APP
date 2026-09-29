import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User
from app.models.profile import StudentProfile
from app.models.skill import StudentSkill
from app.models.project import Project
from app.models.skill_gap import SkillGapAnalysis
from app.schemas.ai import AIChatRequest, AIChatResponse, AIProfileAnalysisResponse
from app.services.ai_service import ai_service
from app.api.auth import get_current_user

router = APIRouter(prefix="/ai", tags=["AI Assistant"])

def build_student_context(db: Session, user_id: int) -> dict:
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    student_skills = db.query(StudentSkill).filter(StudentSkill.profile_id == profile.id).all() if profile else []
    projects = db.query(Project).filter(Project.profile_id == profile.id).all() if profile else []
    gap_analysis = db.query(SkillGapAnalysis).filter(SkillGapAnalysis.user_id == user_id).order_by(SkillGapAnalysis.id.desc()).first()

    target_role_name = "Full Stack Developer"
    if gap_analysis:
        target_role_name = gap_analysis.target_role_name
    elif profile and profile.target_role:
        target_role_name = profile.target_role.title

    skill_names = [s.skill.name for s in student_skills if s.skill]
    gaps_list = json.loads(gap_analysis.gaps_json) if gap_analysis and gap_analysis.gaps_json else []
    projects_list = [{"title": p.title, "techs": json.loads(p.technologies_json) if p.technologies_json else []} for p in projects]

    return {
        "target_role": target_role_name,
        "readiness": profile.profile_readiness_pct if profile else 0,
        "skills": skill_names,
        "gaps": gaps_list,
        "projects": projects_list
    }

@router.post("/chat", response_model=AIChatResponse)
async def chat_with_career_assistant(
    payload: AIChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    context = build_student_context(db, current_user.id)
    history_dicts = [{"role": h.role, "content": h.content} for h in payload.history]
    
    result = await ai_service.answer_career_question(payload.message, context, history_dicts)
    return AIChatResponse(**result)

@router.post("/analyze-profile", response_model=AIProfileAnalysisResponse)
async def analyze_full_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    context = build_student_context(db, current_user.id)
    role = context["target_role"]
    skills = context["skills"]
    gaps = [g.get("skill") for g in context["gaps"] if isinstance(g, dict) and g.get("status") in ["missing", "needs_improvement"]]

    summary = f"Profile evaluation for {role}: Currently at {context['readiness']}% readiness with solid core programming background."
    top_strengths = skills[:4] if skills else ["Programming fundamentals"]
    critical_gaps = gaps[:3] if gaps else ["Cloud Deployment", "Docker Containerization", "Automated Testing"]
    immediate_actions = [
        f"Build a production-grade application containerizing {top_strengths[0] if top_strengths else 'your backend'} with Docker",
        "Take the SkillGap technical assessment to add verified credential evidence",
        "Upload your resume to calibrate ATS optimization"
    ]
    suggested_projects = [
        {
            "title": f"Production {role} Microservice Service",
            "skills": critical_gaps[:2] + top_strengths[:1],
            "impact": "Bridges core deployment and cloud infrastructure gaps."
        }
    ]

    return AIProfileAnalysisResponse(
        summary=summary,
        top_strengths=top_strengths,
        critical_gaps=critical_gaps,
        immediate_actions=immediate_actions,
        suggested_projects=suggested_projects
    )
