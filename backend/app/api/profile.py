import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User
from app.models.profile import StudentProfile, Education, Experience, Certification
from app.schemas.profile import (
    ProfileOut, ProfileUpdate,
    EducationCreate, EducationOut,
    ExperienceCreate, ExperienceOut,
    CertificationCreate, CertificationOut
)
from app.api.auth import get_current_user

router = APIRouter(prefix="/profile", tags=["Profile"])

def calculate_completion(profile: StudentProfile, db: Session) -> float:
    score = 20.0
    if profile.bio and len(profile.bio) > 10:
        score += 10.0
    if profile.skills:
        score += 20.0
    if profile.projects:
        score += 20.0
    if profile.educations:
        score += 10.0
    if profile.experiences or profile.certifications:
        score += 10.0
    if profile.github_username or profile.linkedin_url:
        score += 10.0
    return min(100.0, score)

@router.get("", response_model=ProfileOut)
def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    profile.profile_completion_pct = calculate_completion(profile, db)
    db.commit()
    db.refresh(profile)
    return profile

@router.put("", response_model=ProfileOut)
def update_my_profile(
    profile_in: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)

    update_data = profile_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(profile, field, val)

    profile.profile_completion_pct = calculate_completion(profile, db)
    db.commit()
    db.refresh(profile)
    return profile

@router.get("/completion")
def get_profile_completion(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        return {"completion_percentage": 20.0, "missing_items": ["Skills", "Projects", "Resume"]}
    
    pct = calculate_completion(profile, db)
    missing = []
    if not profile.skills:
        missing.append("Add your technical skills")
    if not profile.projects:
        missing.append("Add at least one technical project")
    if not profile.github_username:
        missing.append("Connect your GitHub account")
    if not profile.educations:
        missing.append("Fill in your education details")
    
    return {
        "completion_percentage": pct,
        "readiness_percentage": profile.profile_readiness_pct,
        "missing_items": missing,
        "badges": json.loads(profile.earned_badges_json) if profile.earned_badges_json else []
    }

@router.post("/education", response_model=EducationOut)
def add_education(
    edu_in: EducationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    edu = Education(profile_id=profile.id, **edu_in.model_dump())
    db.add(edu)
    db.commit()
    db.refresh(edu)
    return edu

@router.delete("/education/{id}")
def delete_education(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    edu = db.query(Education).filter(Education.id == id, Education.profile_id == profile.id).first()
    if edu:
        db.delete(edu)
        db.commit()
    return {"message": "Education entry deleted"}

@router.post("/experience", response_model=ExperienceOut)
def add_experience(
    exp_in: ExperienceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    exp = Experience(profile_id=profile.id, **exp_in.model_dump())
    db.add(exp)
    db.commit()
    db.refresh(exp)
    return exp

@router.delete("/experience/{id}")
def delete_experience(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    exp = db.query(Experience).filter(Experience.id == id, Experience.profile_id == profile.id).first()
    if exp:
        db.delete(exp)
        db.commit()
    return {"message": "Experience entry deleted"}

@router.post("/certification", response_model=CertificationOut)
def add_certification(
    cert_in: CertificationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    cert = Certification(profile_id=profile.id, **cert_in.model_dump())
    db.add(cert)
    db.commit()
    db.refresh(cert)
    return cert
