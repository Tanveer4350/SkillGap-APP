from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.user import User
from app.models.profile import StudentProfile
from app.models.skill import Skill, StudentSkill
from app.models.evidence import SkillEvidence
from app.schemas.skill import SkillOut, StudentSkillCreate, BulkStudentSkillsCreate, StudentSkillOut
from app.api.auth import get_current_user

router = APIRouter(prefix="/skills", tags=["Skills"])

@router.get("", response_model=List[SkillOut])
def get_all_taxonomy_skills(db: Session = Depends(get_db)):
    """Returns the full master catalog of tech & soft skills."""
    return db.query(Skill).all()

@router.get("/my", response_model=List[StudentSkillOut])
def get_student_skills(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        return []

    student_skills = db.query(StudentSkill).filter(StudentSkill.profile_id == profile.id).all()
    results = []
    for ss in student_skills:
        # Count evidence items
        ev_count = db.query(SkillEvidence).filter(
            SkillEvidence.user_id == current_user.id,
            SkillEvidence.skill_name == ss.skill.name
        ).count() if ss.skill else 0

        results.append(StudentSkillOut(
            id=ss.id,
            skill_id=ss.skill_id,
            name=ss.skill.name if ss.skill else "Unknown",
            category=ss.skill.category if ss.skill else "General",
            proficiency_level=ss.proficiency_level,
            source=ss.source,
            verified=ss.verified,
            years_experience=ss.years_experience,
            evidence_count=ev_count
        ))
    return results

@router.post("/my", response_model=StudentSkillOut)
def add_student_skill(
    skill_in: StudentSkillCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    # Find or create skill in master catalog
    skill = db.query(Skill).filter(Skill.name.ilike(skill_in.name)).first()
    if not skill:
        skill = Skill(name=skill_in.name, category=skill_in.category or "Custom")
        db.add(skill)
        db.commit()
        db.refresh(skill)

    # Check if already added
    existing = db.query(StudentSkill).filter(
        StudentSkill.profile_id == profile.id,
        StudentSkill.skill_id == skill.id
    ).first()

    if existing:
        existing.proficiency_level = skill_in.proficiency_level or existing.proficiency_level
        existing.years_experience = skill_in.years_experience or existing.years_experience
        db.commit()
        db.refresh(existing)
        target = existing
    else:
        new_ss = StudentSkill(
            profile_id=profile.id,
            skill_id=skill.id,
            proficiency_level=skill_in.proficiency_level or "intermediate",
            source="self",
            years_experience=skill_in.years_experience or 1
        )
        db.add(new_ss)
        db.commit()
        db.refresh(new_ss)
        target = new_ss

    return StudentSkillOut(
        id=target.id,
        skill_id=skill.id,
        name=skill.name,
        category=skill.category,
        proficiency_level=target.proficiency_level,
        source=target.source,
        verified=target.verified,
        years_experience=target.years_experience,
        evidence_count=0
    )

@router.post("/my/bulk")
def bulk_add_student_skills(
    payload: BulkStudentSkillsCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()

    added_count = 0
    for s_item in payload.skills:
        skill = db.query(Skill).filter(Skill.name.ilike(s_item.name)).first()
        if not skill:
            skill = Skill(name=s_item.name, category=s_item.category or "General")
            db.add(skill)
            db.commit()
            db.refresh(skill)

        existing = db.query(StudentSkill).filter(
            StudentSkill.profile_id == profile.id,
            StudentSkill.skill_id == skill.id
        ).first()

        if not existing:
            new_ss = StudentSkill(
                profile_id=profile.id,
                skill_id=skill.id,
                proficiency_level=s_item.proficiency_level or "intermediate",
                source="self"
            )
            db.add(new_ss)
            added_count += 1

    db.commit()
    return {"message": f"Successfully synced {len(payload.skills)} skills."}

@router.delete("/my/{id}")
def delete_student_skill(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if profile:
        ss = db.query(StudentSkill).filter(StudentSkill.id == id, StudentSkill.profile_id == profile.id).first()
        if ss:
            db.delete(ss)
            db.commit()
    return {"message": "Skill removed from profile"}
