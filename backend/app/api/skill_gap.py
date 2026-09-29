import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User
from app.models.profile import StudentProfile
from app.models.target_role import TargetRole
from app.models.skill_gap import SkillGapAnalysis
from app.schemas.skill_gap import SkillGapAnalysisOut, AnalyzeRoleRequest, JobDescriptionAnalyzeRequest
from app.services.skill_gap_service import skill_gap_service
from app.services.ai_service import ai_service
from app.api.auth import get_current_user

router = APIRouter(prefix="/skill-gap", tags=["Skill Gap"])

@router.post("/analyze", response_model=SkillGapAnalysisOut)
def analyze_student_skill_gap(
    payload: AnalyzeRoleRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_role = None
    if payload.target_role_id:
        target_role = db.query(TargetRole).filter(TargetRole.id == payload.target_role_id).first()
    elif payload.target_role_name:
        target_role = db.query(TargetRole).filter(TargetRole.title.ilike(payload.target_role_name)).first()
        if not target_role:
            # Create custom role
            target_role = TargetRole(
                title=payload.target_role_name,
                category="Custom",
                description=payload.custom_role_description or "Custom career role",
                required_skills_json='["JavaScript", "Python", "React", "Docker", "PostgreSQL"]',
                preferred_skills_json='["AWS", "CI/CD", "Redis"]'
            )
            db.add(target_role)
            db.commit()
            db.refresh(target_role)

    if not target_role:
        target_role = db.query(TargetRole).first()
        if not target_role:
            raise HTTPException(status_code=404, detail="No target roles available in system")

    analysis = skill_gap_service.calculate_skill_gap(db, current_user.id, target_role)

    return SkillGapAnalysisOut(
        id=analysis.id,
        user_id=analysis.user_id,
        target_role_id=analysis.target_role_id,
        target_role_name=analysis.target_role_name,
        overall_readiness_pct=analysis.overall_readiness_pct,
        skill_coverage_pct=analysis.skill_coverage_pct,
        evidence_coverage_pct=analysis.evidence_coverage_pct,
        project_score_pct=analysis.project_score_pct,
        resume_score_pct=analysis.resume_score_pct,
        assessment_score_pct=analysis.assessment_score_pct,
        gaps=json.loads(analysis.gaps_json) if analysis.gaps_json else [],
        categories=json.loads(analysis.category_breakdown_json) if analysis.category_breakdown_json else [],
        recommendations=json.loads(analysis.recommendations_json) if analysis.recommendations_json else [],
        recommended_projects=json.loads(analysis.recommended_projects_json) if analysis.recommended_projects_json else [],
        created_at=analysis.created_at
    )

@router.get("", response_model=SkillGapAnalysisOut)
def get_latest_skill_gap(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analysis = db.query(SkillGapAnalysis).filter(SkillGapAnalysis.user_id == current_user.id).order_by(SkillGapAnalysis.id.desc()).first()
    if not analysis:
        # Generate default analysis with first target role
        role = db.query(TargetRole).first()
        if not role:
            raise HTTPException(status_code=404, detail="Please initialize target roles first.")
        analysis = skill_gap_service.calculate_skill_gap(db, current_user.id, role)

    return SkillGapAnalysisOut(
        id=analysis.id,
        user_id=analysis.user_id,
        target_role_id=analysis.target_role_id,
        target_role_name=analysis.target_role_name,
        overall_readiness_pct=analysis.overall_readiness_pct,
        skill_coverage_pct=analysis.skill_coverage_pct,
        evidence_coverage_pct=analysis.evidence_coverage_pct,
        project_score_pct=analysis.project_score_pct,
        resume_score_pct=analysis.resume_score_pct,
        assessment_score_pct=analysis.assessment_score_pct,
        gaps=json.loads(analysis.gaps_json) if analysis.gaps_json else [],
        categories=json.loads(analysis.category_breakdown_json) if analysis.category_breakdown_json else [],
        recommendations=json.loads(analysis.recommendations_json) if analysis.recommendations_json else [],
        recommended_projects=json.loads(analysis.recommended_projects_json) if analysis.recommended_projects_json else [],
        created_at=analysis.created_at
    )

@router.post("/analyze-job-description")
async def analyze_custom_job_description(
    payload: JobDescriptionAnalyzeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Extracts skills & requirements from pasted job description and performs real-time gap comparison.
    """
    extracted = await ai_service.analyze_job_description(payload.job_title, payload.job_description_text)
    
    # Create temporary virtual target role for calculation
    temp_role = TargetRole(
        title=f"{payload.job_title} ({payload.company_name or 'Custom Posting'})",
        category="Custom Job",
        description=payload.job_description_text[:300],
        required_skills_json=json.dumps(extracted.get("required_skills", [])),
        preferred_skills_json=json.dumps(extracted.get("preferred_skills", []))
    )
    db.add(temp_role)
    db.commit()
    db.refresh(temp_role)

    analysis = skill_gap_service.calculate_skill_gap(db, current_user.id, temp_role)

    return {
        "job_title": payload.job_title,
        "company_name": payload.company_name,
        "extracted_requirements": extracted,
        "readiness_pct": analysis.overall_readiness_pct,
        "skill_coverage_pct": analysis.skill_coverage_pct,
        "evidence_coverage_pct": analysis.evidence_coverage_pct,
        "gaps": json.loads(analysis.gaps_json),
        "recommendations": json.loads(analysis.recommendations_json)
    }
