import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.database.connection import Base, engine
from app.database.seed import seed_database

# Import routers
from app.api.auth import router as auth_router
from app.api.profile import router as profile_router
from app.api.skills import router as skills_router
from app.api.projects import router as projects_router
from app.api.resume import router as resume_router
from app.api.roles import router as roles_router
from app.api.skill_gap import router as skill_gap_router
from app.api.roadmap import router as roadmap_router
from app.api.assessments import router as assessments_router
from app.api.opportunities import router as opportunities_router
from app.api.applications import router as applications_router
from app.api.github import router as github_router
from app.api.ai import router as ai_router
from app.api.placement import router as placement_router
from app.api.evidence import router as evidence_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="SkillGap - AI-powered Student Employability Intelligence Platform API"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for uploads
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(profile_router, prefix=settings.API_V1_STR)
app.include_router(skills_router, prefix=settings.API_V1_STR)
app.include_router(projects_router, prefix=settings.API_V1_STR)
app.include_router(resume_router, prefix=settings.API_V1_STR)
app.include_router(roles_router, prefix=settings.API_V1_STR)
app.include_router(skill_gap_router, prefix=settings.API_V1_STR)
app.include_router(roadmap_router, prefix=settings.API_V1_STR)
app.include_router(assessments_router, prefix=settings.API_V1_STR)
app.include_router(opportunities_router, prefix=settings.API_V1_STR)
app.include_router(applications_router, prefix=settings.API_V1_STR)
app.include_router(github_router, prefix=settings.API_V1_STR)
app.include_router(ai_router, prefix=settings.API_V1_STR)
app.include_router(placement_router, prefix=settings.API_V1_STR)
app.include_router(evidence_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def on_startup():
    print("[SkillGap API] Initializing database schema...")
    Base.metadata.create_all(bind=engine)
    print("[SkillGap API] Checking and applying seed data...")
    seed_database()
    print("[SkillGap API] Ready to serve requests!")

@app.get("/")
def root():
    return {
        "platform": "SkillGap",
        "tagline": "Turn your skills into career readiness.",
        "status": "online",
        "version": settings.VERSION,
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "skillgap-backend"}
