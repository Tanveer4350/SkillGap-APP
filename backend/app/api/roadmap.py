import json
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User
from app.models.profile import StudentProfile
from app.models.target_role import TargetRole
from app.models.roadmap import Roadmap, RoadmapItem
from app.schemas.roadmap import RoadmapOut, RoadmapItemOut, RoadmapItemUpdate
from app.services.recommendation_service import recommendation_service
from app.api.auth import get_current_user

router = APIRouter(prefix="/roadmap", tags=["Roadmap"])

def format_roadmap_response(roadmap: Roadmap) -> RoadmapOut:
    items_out = []
    for item in roadmap.items:
        items_out.append(RoadmapItemOut(
            id=item.id,
            phase_number=item.phase_number,
            title=item.title,
            skill_name=item.skill_name,
            category=item.category,
            why_learn=item.why_learn,
            prerequisites=json.loads(item.prerequisites_json) if item.prerequisites_json else [],
            learning_objectives=json.loads(item.learning_objectives_json) if item.learning_objectives_json else [],
            suggested_resources=json.loads(item.suggested_resources_json) if item.suggested_resources_json else [],
            mini_task=json.loads(item.mini_task_json) if item.mini_task_json else None,
            project=json.loads(item.project_json) if item.project_json else None,
            assessment_skill=item.assessment_skill,
            status=item.status,
            completed_at=item.completed_at
        ))

    return RoadmapOut(
        id=roadmap.id,
        target_role_id=roadmap.target_role_id,
        title=roadmap.title,
        description=roadmap.description,
        total_phases=roadmap.total_phases,
        current_phase=roadmap.current_phase,
        progress_pct=roadmap.progress_pct,
        items=items_out,
        created_at=roadmap.created_at,
        updated_at=roadmap.updated_at
    )

@router.get("", response_model=RoadmapOut)
def get_student_roadmap(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    roadmap = db.query(Roadmap).filter(Roadmap.user_id == current_user.id).order_by(Roadmap.id.desc()).first()
    if not roadmap:
        profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
        target_role_id = profile.target_role_id if profile and profile.target_role_id else 1
        roadmap = recommendation_service.generate_personalized_roadmap(db, current_user.id, target_role_id)

    return format_roadmap_response(roadmap)

@router.post("/generate", response_model=RoadmapOut)
def generate_roadmap(
    payload: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_role_id = payload.get("target_role_id", 1)
    roadmap = recommendation_service.generate_personalized_roadmap(db, current_user.id, target_role_id)
    return format_roadmap_response(roadmap)

@router.put("/items/{item_id}", response_model=RoadmapOut)
def update_roadmap_item_status(
    item_id: int,
    payload: RoadmapItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(RoadmapItem).filter(RoadmapItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Roadmap milestone item not found")

    roadmap = db.query(Roadmap).filter(Roadmap.id == item.roadmap_id, Roadmap.user_id == current_user.id).first()
    if not roadmap:
        raise HTTPException(status_code=403, detail="Not authorized to modify this roadmap")

    item.status = payload.status
    if payload.status == "completed":
        item.completed_at = datetime.datetime.utcnow()
    else:
        item.completed_at = None

    # Recalculate roadmap overall progress percentage
    all_items = roadmap.items
    completed_count = sum(1 for i in all_items if i.status == "completed")
    roadmap.progress_pct = round((completed_count / len(all_items)) * 100, 1) if all_items else 0.0
    roadmap.current_phase = min(len(all_items), completed_count + 1)

    db.commit()
    db.refresh(roadmap)
    return format_roadmap_response(roadmap)
