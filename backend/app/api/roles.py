import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.target_role import TargetRole

router = APIRouter(prefix="/roles", tags=["Target Roles"])

@router.get("")
def get_target_roles(db: Session = Depends(get_db)):
    roles = db.query(TargetRole).all()
    results = []
    for r in roles:
        results.append({
            "id": r.id,
            "title": r.title,
            "category": r.category,
            "description": r.description,
            "average_salary": r.average_salary,
            "growth_rate": r.growth_rate,
            "icon": r.icon,
            "required_skills": json.loads(r.required_skills_json) if r.required_skills_json else [],
            "preferred_skills": json.loads(r.preferred_skills_json) if r.preferred_skills_json else [],
            "responsibilities": json.loads(r.responsibilities_json) if r.responsibilities_json else []
        })
    return results

@router.get("/{id}")
def get_target_role(id: int, db: Session = Depends(get_db)):
    r = db.query(TargetRole).filter(TargetRole.id == id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Target role not found")
    return {
        "id": r.id,
        "title": r.title,
        "category": r.category,
        "description": r.description,
        "average_salary": r.average_salary,
        "growth_rate": r.growth_rate,
        "icon": r.icon,
        "required_skills": json.loads(r.required_skills_json) if r.required_skills_json else [],
        "preferred_skills": json.loads(r.preferred_skills_json) if r.preferred_skills_json else [],
        "responsibilities": json.loads(r.responsibilities_json) if r.responsibilities_json else []
    }
