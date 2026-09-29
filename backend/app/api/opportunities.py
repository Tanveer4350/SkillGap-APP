import json
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.models.user import User
from app.models.profile import StudentProfile
from app.models.skill import StudentSkill
from app.models.opportunity import JobOpportunity
from app.models.evidence import SkillEvidence
from app.schemas.opportunity import OpportunityOut, OpportunityMatchAnalysis
from app.api.auth import get_current_user

router = APIRouter(prefix="/opportunities", tags=["Opportunities"])

def calculate_opportunity_match(opp: JobOpportunity, student_skill_names: set, student_evidence_map: dict):
    req_skills = json.loads(opp.required_skills_json) if opp.required_skills_json else []
    pref_skills = json.loads(opp.preferred_skills_json) if opp.preferred_skills_json else []
    
    total = len(req_skills) * 2 + len(pref_skills)
    if total == 0:
        return 75, [], []

    matched = []
    missing = []
    score_points = 0

    for s in req_skills:
        s_low = s.lower()
        if s_low in student_skill_names:
            score_points += 2
            matched.append(s)
        else:
            missing.append(s)

    for s in pref_skills:
        s_low = s.lower()
        if s_low in student_skill_names:
            score_points += 1
            matched.append(s)
        else:
            missing.append(s)

    match_pct = int(round((score_points / total) * 100))
    return match_pct, matched, missing

@router.get("", response_model=List[OpportunityOut])
def get_opportunities(
    type: Optional[str] = None,
    workplace_type: Optional[str] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(JobOpportunity).filter(JobOpportunity.is_active == True)
    
    if type and type != "all":
        query = query.filter(JobOpportunity.type == type)
    if workplace_type and workplace_type != "all":
        query = query.filter(JobOpportunity.workplace_type == workplace_type)
    if search:
        query = query.filter(
            (JobOpportunity.title.ilike(f"%{search}%")) |
            (JobOpportunity.company.ilike(f"%{search}%")) |
            (JobOpportunity.required_skills_json.ilike(f"%{search}%"))
        )

    opps = query.order_by(JobOpportunity.id.desc()).all()

    # Get student skills & evidence
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    student_skills = db.query(StudentSkill).filter(StudentSkill.profile_id == profile.id).all() if profile else []
    student_skill_names = {s.skill.name.lower() for s in student_skills if s.skill}

    results = []
    for opp in opps:
        match_pct, matched, missing = calculate_opportunity_match(opp, student_skill_names, {})
        results.append(OpportunityOut(
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
            created_at=opp.created_at,
            match_percentage=match_pct,
            matched_skills=matched,
            missing_skills=missing
        ))
    return results

@router.get("/{id}", response_model=OpportunityOut)
def get_opportunity_detail(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    opp = db.query(JobOpportunity).filter(JobOpportunity.id == id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    student_skills = db.query(StudentSkill).filter(StudentSkill.profile_id == profile.id).all() if profile else []
    student_skill_names = {s.skill.name.lower() for s in student_skills if s.skill}

    match_pct, matched, missing = calculate_opportunity_match(opp, student_skill_names, {})

    return OpportunityOut(
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
        created_at=opp.created_at,
        match_percentage=match_pct,
        matched_skills=matched,
        missing_skills=missing
    )

@router.post("/{id}/analyze", response_model=OpportunityMatchAnalysis)
def analyze_opportunity_match(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    opp = db.query(JobOpportunity).filter(JobOpportunity.id == id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    student_skills = db.query(StudentSkill).filter(StudentSkill.profile_id == profile.id).all() if profile else []
    student_skill_names = {s.skill.name.lower() for s in student_skills if s.skill}

    evidences = db.query(SkillEvidence).filter(SkillEvidence.user_id == current_user.id).all()
    evidence_map = {e.skill_name.lower(): e for e in evidences}

    match_pct, matched, missing = calculate_opportunity_match(opp, student_skill_names, evidence_map)

    ev_found = []
    missing_ev = []
    for m in matched:
        if m.lower() in evidence_map:
            ev = evidence_map[m.lower()]
            ev_found.append({
                "skill": m,
                "evidence_type": ev.evidence_type,
                "title": ev.title,
                "strength": ev.evidence_strength
            })
        else:
            missing_ev.append(f"{m} (claimed on profile, but missing project/assessment proof)")

    for mis in missing:
        missing_ev.append(f"{mis} (skill missing from profile)")

    readiness_summary = f"You match {match_pct}% of the core technical requirements for {opp.title} at {opp.company}. "
    if match_pct >= 75:
        readiness_summary += "Your profile demonstrates strong alignment. Review the missing evidence items to strengthen your application."
    else:
        readiness_summary += "We recommend completing practice projects in the missing areas before applying to maximize interview readiness."

    suggested_focus = [f"Complete project demonstrating {m}" for m in missing[:3]] if missing else ["Review technical assessment questions for this role"]

    return OpportunityMatchAnalysis(
        opportunity_id=opp.id,
        title=opp.title,
        company=opp.company,
        match_percentage=match_pct,
        matching_skills=matched,
        missing_skills=missing,
        evidence_found=ev_found,
        missing_evidence=missing_ev,
        readiness_summary=readiness_summary,
        suggested_focus=suggested_focus
    )
