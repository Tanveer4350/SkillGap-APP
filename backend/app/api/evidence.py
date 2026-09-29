from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.user import User
from app.models.evidence import SkillEvidence
from app.api.auth import get_current_user

router = APIRouter(prefix="/evidence", tags=["Skill Evidence"])

@router.get("")
def get_student_evidence(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    evidences = db.query(SkillEvidence).filter(SkillEvidence.user_id == current_user.id).order_by(SkillEvidence.created_at.desc()).all()
    
    # Group by skill
    grouped = {}
    for ev in evidences:
        if ev.skill_name not in grouped:
            grouped[ev.skill_name] = []
        grouped[ev.skill_name].append({
            "id": ev.id,
            "type": ev.evidence_type,
            "title": ev.title,
            "description": ev.description,
            "source": ev.source_reference,
            "strength": ev.evidence_strength,
            "metric": ev.score_or_metric,
            "url": ev.url,
            "created_at": ev.created_at
        })

    return {
        "total_evidence_count": len(evidences),
        "verified_skills_count": len(grouped),
        "evidence_by_skill": grouped
    }
