import json
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.user import User
from app.models.assessment import Assessment, Question, AssessmentAttempt
from app.models.evidence import SkillEvidence
from app.schemas.assessment import AssessmentOut, QuestionOut, SubmitAssessmentRequest, AssessmentResultOut, QuestionFeedback
from app.api.auth import get_current_user

router = APIRouter(prefix="/assessments", tags=["Assessments"])

@router.get("", response_model=List[AssessmentOut])
def get_assessments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    assessments = db.query(Assessment).all()
    results = []
    for a in assessments:
        # Check if user has attempted
        attempts = db.query(AssessmentAttempt).filter(
            AssessmentAttempt.user_id == current_user.id,
            AssessmentAttempt.assessment_id == a.id
        ).order_by(AssessmentAttempt.score_percentage.desc()).all()

        best_score = attempts[0].score_percentage if attempts else None
        passed = any(att.passed for att in attempts) if attempts else False

        results.append(AssessmentOut(
            id=a.id,
            title=a.title,
            skill_name=a.skill_name,
            category=a.category,
            difficulty=a.difficulty,
            time_limit_mins=a.time_limit_mins,
            pass_score=a.pass_score,
            questions_count=len(a.questions) or a.questions_count,
            description=a.description,
            user_best_score=best_score,
            user_passed=passed
        ))
    return results

@router.get("/{id}", response_model=AssessmentOut)
def get_assessment_detail(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    a = db.query(Assessment).filter(Assessment.id == id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Assessment not found")

    questions_out = []
    for q in a.questions:
        questions_out.append(QuestionOut(
            id=q.id,
            question_text=q.question_text,
            question_type=q.question_type,
            code_snippet=q.code_snippet,
            options=json.loads(q.options_json) if q.options_json else [],
            explanation=None # Hide until submission
        ))

    attempts = db.query(AssessmentAttempt).filter(
        AssessmentAttempt.user_id == current_user.id,
        AssessmentAttempt.assessment_id == a.id
    ).order_by(AssessmentAttempt.score_percentage.desc()).all()

    best_score = attempts[0].score_percentage if attempts else None
    passed = any(att.passed for att in attempts) if attempts else False

    return AssessmentOut(
        id=a.id,
        title=a.title,
        skill_name=a.skill_name,
        category=a.category,
        difficulty=a.difficulty,
        time_limit_mins=a.time_limit_mins,
        pass_score=a.pass_score,
        questions_count=len(a.questions),
        description=a.description,
        questions=questions_out,
        user_best_score=best_score,
        user_passed=passed
    )

@router.post("/{id}/submit", response_model=AssessmentResultOut)
def submit_assessment(
    id: int,
    payload: SubmitAssessmentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    a = db.query(Assessment).filter(Assessment.id == id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Assessment not found")

    total_q = len(a.questions)
    if total_q == 0:
        raise HTTPException(status_code=400, detail="Assessment has no questions configured")

    correct_count = 0
    feedback_items = []

    for q in a.questions:
        selected_idx = payload.answers.get(q.id, payload.answers.get(str(q.id), -1))
        is_corr = (selected_idx == q.correct_option_index)
        if is_corr:
            correct_count += 1

        feedback_items.append(QuestionFeedback(
            question_id=q.id,
            question_text=q.question_text,
            selected_option_index=selected_idx,
            correct_option_index=q.correct_option_index,
            is_correct=is_corr,
            explanation=q.explanation
        ))

    score_pct = round((correct_count / total_q) * 100, 1)
    passed = score_pct >= a.pass_score

    # Save Attempt
    attempt = AssessmentAttempt(
        user_id=current_user.id,
        assessment_id=a.id,
        score_percentage=score_pct,
        total_questions=total_q,
        correct_count=correct_count,
        incorrect_count=total_q - correct_count,
        passed=passed,
        user_answers_json=json.dumps(payload.answers),
        feedback_json=json.dumps([f.model_dump() for f in feedback_items]),
        completed_at=datetime.datetime.utcnow()
    )
    db.add(attempt)

    unlocked_evidence = False
    if passed:
        # Check or add SkillEvidence
        existing_ev = db.query(SkillEvidence).filter(
            SkillEvidence.user_id == current_user.id,
            SkillEvidence.skill_name == a.skill_name,
            SkillEvidence.evidence_type == "assessment"
        ).first()

        if not existing_ev:
            ev = SkillEvidence(
                user_id=current_user.id,
                skill_name=a.skill_name,
                evidence_type="assessment",
                title=f"Verified Assessment: {a.skill_name}",
                description=f"Scored {score_pct}% in SkillGap {a.difficulty.capitalize()} Technical Assessment.",
                source_reference=f"Assessment #{a.id}",
                evidence_strength="strong",
                score_or_metric=f"{score_pct}% Verified Score"
            )
            db.add(ev)
            unlocked_evidence = True
        else:
            existing_ev.score_or_metric = f"{max(score_pct, float(existing_ev.score_or_metric.split('%')[0]))}% Verified Score"
            unlocked_evidence = True

    db.commit()
    db.refresh(attempt)

    rec = "Great work! Your verified assessment score has been added as official evidence." if passed else "Review the question explanations above and practice the key concepts before attempting again."

    return AssessmentResultOut(
        attempt_id=attempt.id,
        assessment_id=a.id,
        skill_name=a.skill_name,
        score_percentage=score_pct,
        total_questions=total_q,
        correct_count=correct_count,
        incorrect_count=total_q - correct_count,
        passed=passed,
        feedback=feedback_items,
        recommendation=rec,
        unlocked_evidence=unlocked_evidence,
        completed_at=attempt.completed_at
    )
