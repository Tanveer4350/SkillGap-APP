import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.user import User
from app.models.profile import StudentProfile
from app.models.project import Project
from app.models.evidence import SkillEvidence
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectOut
from app.api.auth import get_current_user

router = APIRouter(prefix="/projects", tags=["Projects"])

def link_project_evidence(db: Session, user_id: int, project: Project, techs: List[str]):
    for t in techs:
        existing = db.query(SkillEvidence).filter(
            SkillEvidence.user_id == user_id,
            SkillEvidence.skill_name == t,
            SkillEvidence.evidence_type == "project",
            SkillEvidence.title == f"Project: {project.title}"
        ).first()

        if not existing:
            ev = SkillEvidence(
                user_id=user_id,
                skill_name=t,
                evidence_type="project",
                title=f"Project: {project.title}",
                description=f"Demonstrated in practical project '{project.title}': {project.description[:120]}...",
                source_reference=f"Project #{project.id}",
                evidence_strength="strong" if project.github_url or project.live_url else "moderate",
                score_or_metric="Production Project" if project.live_url else "GitHub Repository",
                url=project.live_url or project.github_url
            )
            db.add(ev)
    db.commit()

@router.get("", response_model=List[ProjectOut])
def get_my_projects(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        return []

    projects = db.query(Project).filter(Project.profile_id == profile.id).all()
    results = []
    for p in projects:
        results.append(ProjectOut(
            id=p.id,
            profile_id=p.profile_id,
            title=p.title,
            description=p.description,
            role=p.role,
            duration=p.duration,
            github_url=p.github_url,
            live_url=p.live_url,
            technologies=json.loads(p.technologies_json) if p.technologies_json else [],
            verified_skills=json.loads(p.verified_skills_json) if p.verified_skills_json else [],
            difficulty=p.difficulty,
            impact_metrics=p.impact_metrics,
            created_at=p.created_at
        ))
    return results

@router.post("", response_model=ProjectOut)
def create_project(
    proj_in: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    new_proj = Project(
        profile_id=profile.id,
        title=proj_in.title,
        description=proj_in.description,
        role=proj_in.role or "Developer",
        duration=proj_in.duration or "2 weeks",
        github_url=proj_in.github_url,
        live_url=proj_in.live_url,
        technologies_json=json.dumps(proj_in.technologies),
        verified_skills_json=json.dumps(proj_in.technologies),
        difficulty=proj_in.difficulty or "intermediate",
        impact_metrics=proj_in.impact_metrics
    )
    db.add(new_proj)
    db.commit()
    db.refresh(new_proj)

    # Link evidence
    link_project_evidence(db, current_user.id, new_proj, proj_in.technologies)

    return ProjectOut(
        id=new_proj.id,
        profile_id=new_proj.profile_id,
        title=new_proj.title,
        description=new_proj.description,
        role=new_proj.role,
        duration=new_proj.duration,
        github_url=new_proj.github_url,
        live_url=new_proj.live_url,
        technologies=proj_in.technologies,
        verified_skills=proj_in.technologies,
        difficulty=new_proj.difficulty,
        impact_metrics=new_proj.impact_metrics,
        created_at=new_proj.created_at
    )

@router.put("/{id}", response_model=ProjectOut)
def update_project(
    id: int,
    proj_in: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    proj = db.query(Project).filter(Project.id == id, Project.profile_id == profile.id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    update_data = proj_in.model_dump(exclude_unset=True)
    if "technologies" in update_data:
        techs = update_data.pop("technologies")
        proj.technologies_json = json.dumps(techs)
        proj.verified_skills_json = json.dumps(techs)
        link_project_evidence(db, current_user.id, proj, techs)

    for field, val in update_data.items():
        setattr(proj, field, val)

    db.commit()
    db.refresh(proj)

    return ProjectOut(
        id=proj.id,
        profile_id=proj.profile_id,
        title=proj.title,
        description=proj.description,
        role=proj.role,
        duration=proj.duration,
        github_url=proj.github_url,
        live_url=proj.live_url,
        technologies=json.loads(proj.technologies_json) if proj.technologies_json else [],
        verified_skills=json.loads(proj.verified_skills_json) if proj.verified_skills_json else [],
        difficulty=proj.difficulty,
        impact_metrics=proj.impact_metrics,
        created_at=proj.created_at
    )

@router.delete("/{id}")
def delete_project(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    proj = db.query(Project).filter(Project.id == id, Project.profile_id == profile.id).first()
    if proj:
        db.delete(proj)
        db.commit()
    return {"message": "Project deleted"}
