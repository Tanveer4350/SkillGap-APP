from app.database.connection import Base
from app.models.user import User, UserRole
from app.models.profile import StudentProfile, Education, Experience, Certification
from app.models.skill import Skill, StudentSkill
from app.models.project import Project
from app.models.resume import Resume, ResumeAnalysis
from app.models.target_role import TargetRole, RoleSkill
from app.models.skill_gap import SkillGapAnalysis
from app.models.roadmap import Roadmap, RoadmapItem
from app.models.assessment import Assessment, Question, AssessmentAttempt
from app.models.opportunity import JobOpportunity
from app.models.application import Application
from app.models.evidence import SkillEvidence
from app.models.notification import Notification
from app.models.github import GitHubProfile

__all__ = [
    "Base",
    "User",
    "UserRole",
    "StudentProfile",
    "Education",
    "Experience",
    "Certification",
    "Skill",
    "StudentSkill",
    "Project",
    "Resume",
    "ResumeAnalysis",
    "TargetRole",
    "RoleSkill",
    "SkillGapAnalysis",
    "Roadmap",
    "RoadmapItem",
    "Assessment",
    "Question",
    "AssessmentAttempt",
    "JobOpportunity",
    "Application",
    "SkillEvidence",
    "Notification",
    "GitHubProfile",
]
