from app.schemas.user import UserBase, UserCreate, UserLogin, Token, UserOut
from app.schemas.profile import ProfileUpdate, ProfileOut, EducationCreate, EducationOut, ExperienceCreate, ExperienceOut, CertificationCreate, CertificationOut
from app.schemas.skill import SkillOut, StudentSkillCreate, BulkStudentSkillsCreate, StudentSkillOut
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectOut
from app.schemas.resume import ResumeOut, ResumeAnalysisOut
from app.schemas.skill_gap import SkillGapAnalysisOut, SkillGapItem, CategoryScore, RecommendationStep, RecommendedProject, AnalyzeRoleRequest, JobDescriptionAnalyzeRequest
from app.schemas.roadmap import RoadmapOut, RoadmapItemOut, RoadmapItemUpdate
from app.schemas.assessment import AssessmentOut, QuestionOut, SubmitAssessmentRequest, AssessmentResultOut
from app.schemas.opportunity import OpportunityOut, OpportunityMatchAnalysis
from app.schemas.application import ApplicationCreate, ApplicationUpdate, ApplicationOut
from app.schemas.ai import AIChatRequest, AIChatResponse, AIProfileAnalysisResponse
