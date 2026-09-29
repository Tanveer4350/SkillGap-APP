import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User
from app.models.profile import StudentProfile
from app.models.github import GitHubProfile
from app.services.github_service import github_service
from app.api.auth import get_current_user

router = APIRouter(prefix="/github", tags=["GitHub Integration"])

@router.post("/connect")
async def connect_github(
    payload: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    username = payload.get("username")
    if not username:
        raise HTTPException(status_code=400, detail="GitHub username is required")

    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if profile:
        profile.github_username = username
        db.commit()

    gh_profile = await github_service.fetch_and_sync_github_data(db, current_user.id, username)

    return {
        "message": f"Successfully synced GitHub profile for @{username}",
        "username": gh_profile.username,
        "avatar_url": gh_profile.avatar_url,
        "public_repos": gh_profile.public_repos_count,
        "languages": json.loads(gh_profile.languages_breakdown_json) if gh_profile.languages_breakdown_json else {},
        "evidence_detected": json.loads(gh_profile.evidence_detected_json) if gh_profile.evidence_detected_json else []
    }

@router.get("/profile")
def get_github_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    gh_profile = db.query(GitHubProfile).filter(GitHubProfile.user_id == current_user.id).first()
    if not gh_profile:
        raise HTTPException(status_code=404, detail="No connected GitHub profile found")

    return {
        "username": gh_profile.username,
        "avatar_url": gh_profile.avatar_url,
        "public_repos": gh_profile.public_repos_count,
        "followers": gh_profile.followers_count,
        "total_stars": gh_profile.total_stars_count,
        "languages": json.loads(gh_profile.languages_breakdown_json) if gh_profile.languages_breakdown_json else {},
        "repositories": json.loads(gh_profile.repositories_json) if gh_profile.repositories_json else [],
        "evidence_detected": json.loads(gh_profile.evidence_detected_json) if gh_profile.evidence_detected_json else [],
        "synced_at": gh_profile.synced_at
    }
