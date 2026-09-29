import os
import json
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User
from app.models.resume import Resume, ResumeAnalysis
from app.models.evidence import SkillEvidence
from app.schemas.resume import ResumeOut, ResumeAnalysisOut
from app.services.resume_service import resume_service
from app.api.auth import get_current_user
from app.config import settings

router = APIRouter(prefix="/resume", tags=["Resume"])

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected")

    contents = await file.read()
    if len(contents) > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File exceeds maximum allowed size ({settings.MAX_FILE_SIZE_MB}MB)")

    # Save to disk
    user_upload_dir = os.path.join(settings.UPLOAD_DIR, f"user_{current_user.id}")
    os.makedirs(user_upload_dir, exist_ok=True)
    file_path = os.path.join(user_upload_dir, file.filename)
    with open(file_path, "wb") as f:
        f.write(contents)

    # Extract text
    parsed_text = resume_service.extract_text_from_file(contents, file.filename)

    # Save resume record
    resume = Resume(
        user_id=current_user.id,
        filename=file.filename,
        file_path=file_path,
        file_size=len(contents),
        parsed_text=parsed_text
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    # Run AI analysis
    analysis_data = await resume_service.process_resume_content(parsed_text)

    # Save analysis record
    evidence_breakdown_items = analysis_data.get("evidence_breakdown", [])
    analysis = ResumeAnalysis(
        resume_id=resume.id,
        user_id=current_user.id,
        extracted_name=analysis_data.get("name"),
        extracted_email=analysis_data.get("email"),
        extracted_skills_json=json.dumps(analysis_data.get("skills", [])),
        extracted_experience_json=json.dumps(analysis_data.get("experience", [])),
        extracted_projects_json=json.dumps(analysis_data.get("projects", [])),
        extracted_education_json=json.dumps(analysis_data.get("education", [])),
        skills_found_json=json.dumps(analysis_data.get("skills_found", [])),
        skills_missing_json=json.dumps(analysis_data.get("skills_missing", [])),
        weak_evidence_json=json.dumps(evidence_breakdown_items),
        missing_sections_json=json.dumps(analysis_data.get("missing_sections", [])),
        improvement_suggestions_json=json.dumps(analysis_data.get("improvement_suggestions", [])),
        ats_score=float(analysis_data.get("ats_score", 75.0))
    )
    db.add(analysis)

    # Add resume mentions to SkillEvidence
    for s in analysis_data.get("skills", []):
        existing_ev = db.query(SkillEvidence).filter(
            SkillEvidence.user_id == current_user.id,
            SkillEvidence.skill_name == s,
            SkillEvidence.evidence_type == "resume"
        ).first()
        if not existing_ev:
            ev = SkillEvidence(
                user_id=current_user.id,
                skill_name=s,
                evidence_type="resume",
                title="Resume Mention",
                description=f"Extracted from verified resume file ({file.filename})",
                source_reference=file.filename,
                evidence_strength="moderate",
                score_or_metric="ATS Verified"
            )
            db.add(ev)

    db.commit()
    db.refresh(analysis)

    return {
        "message": "Resume uploaded and analyzed successfully.",
        "resume_id": resume.id,
        "filename": resume.filename,
        "extracted_skills": analysis_data.get("skills", []),
        "ats_score": analysis.ats_score
    }

@router.get("/latest", response_model=ResumeAnalysisOut)
def get_latest_resume_analysis(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analysis = db.query(ResumeAnalysis).filter(ResumeAnalysis.user_id == current_user.id).order_by(ResumeAnalysis.id.desc()).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="No resume analysis found")

    weak_ev = json.loads(analysis.weak_evidence_json) if analysis.weak_evidence_json else []

    return ResumeAnalysisOut(
        id=analysis.id,
        resume_id=analysis.resume_id,
        extracted_name=analysis.extracted_name,
        extracted_email=analysis.extracted_email,
        extracted_skills=json.loads(analysis.extracted_skills_json) if analysis.extracted_skills_json else [],
        extracted_experience=json.loads(analysis.extracted_experience_json) if analysis.extracted_experience_json else [],
        extracted_projects=json.loads(analysis.extracted_projects_json) if analysis.extracted_projects_json else [],
        extracted_education=json.loads(analysis.extracted_education_json) if analysis.extracted_education_json else [],
        skills_found=json.loads(analysis.skills_found_json) if analysis.skills_found_json else [],
        skills_missing=json.loads(analysis.skills_missing_json) if analysis.skills_missing_json else [],
        evidence_breakdown=weak_ev,
        missing_sections=json.loads(analysis.missing_sections_json) if analysis.missing_sections_json else [],
        improvement_suggestions=json.loads(analysis.improvement_suggestions_json) if analysis.improvement_suggestions_json else [],
        ats_score=analysis.ats_score,
        analyzed_at=analysis.analyzed_at
    )
