import json
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.user import User
from app.models.application import Application
from app.models.opportunity import JobOpportunity
from app.schemas.application import ApplicationCreate, ApplicationUpdate, ApplicationOut
from app.schemas.opportunity import OpportunityOut
from app.api.auth import get_current_user

router = APIRouter(prefix="/applications", tags=["Applications Tracker"])

def format_app_out(app: Application) -> ApplicationOut:
    opp_out = None
    if app.opportunity:
        opp = app.opportunity
        opp_out = OpportunityOut(
            id=opp.id,
            title=opp.title,
            company=opp.company,
            company_logo=opp.company_logo,
            location=opp.location,
            type=opp.type,
            workplace_type=opp.workplace_type,
            experience_level=opp.experience_level,
            stipend_or_salary=opp.stipend_or_salary,
            required_skills=json.loads(opp.required_skills_json) if opp.required_skills_json else [],
            preferred_skills=json.loads(opp.preferred_skills_json) if opp.preferred_skills_json else [],
            responsibilities=json.loads(opp.responsibilities_json) if opp.responsibilities_json else [],
            qualifications=json.loads(opp.qualifications_json) if opp.qualifications_json else [],
            description=opp.description,
            deadline=opp.deadline,
            apply_url=opp.apply_url,
            is_active=opp.is_active,
            created_at=opp.created_at
        )

    return ApplicationOut(
        id=app.id,
        user_id=app.user_id,
        opportunity_id=app.opportunity_id,
        custom_title=app.custom_title,
        custom_company=app.custom_company,
        status=app.status,
        match_score=app.match_score,
        applied_date=app.applied_date,
        deadline_date=app.deadline_date,
        interview_date=app.interview_date,
        salary_offered=app.salary_offered,
        notes=app.notes,
        created_at=app.created_at,
        updated_at=app.updated_at,
        opportunity=opp_out
    )

@router.get("", response_model=List[ApplicationOut])
def get_my_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    apps = db.query(Application).filter(Application.user_id == current_user.id).order_by(Application.updated_at.desc()).all()
    return [format_app_out(a) for a in apps]

@router.post("", response_model=ApplicationOut)
def create_application(
    payload: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if opportunity exists
    match_score = 75
    if payload.opportunity_id:
        opp = db.query(JobOpportunity).filter(JobOpportunity.id == payload.opportunity_id).first()
        if opp:
            payload.custom_title = payload.custom_title or opp.title
            payload.custom_company = payload.custom_company or opp.company
            payload.deadline_date = payload.deadline_date or opp.deadline

    app = Application(
        user_id=current_user.id,
        opportunity_id=payload.opportunity_id,
        custom_title=payload.custom_title or "Software Developer Intern",
        custom_company=payload.custom_company or "Target Tech Company",
        status=payload.status or "saved",
        match_score=match_score,
        applied_date=payload.applied_date or (datetime.datetime.utcnow() if payload.status == "applied" else None),
        deadline_date=payload.deadline_date,
        notes=payload.notes
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    return format_app_out(app)

@router.put("/{id}", response_model=ApplicationOut)
def update_application(
    id: int,
    payload: ApplicationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(Application.id == id, Application.user_id == current_user.id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(app, field, val)

    if payload.status == "applied" and not app.applied_date:
        app.applied_date = datetime.datetime.utcnow()

    app.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(app)
    return format_app_out(app)

@router.delete("/{id}")
def delete_application(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(Application.id == id, Application.user_id == current_user.id).first()
    if app:
        db.delete(app)
        db.commit()
    return {"message": "Application removed"}
