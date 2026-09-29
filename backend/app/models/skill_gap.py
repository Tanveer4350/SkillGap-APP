import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from app.database.connection import Base

class SkillGapAnalysis(Base):
    __tablename__ = "skill_gap_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    target_role_id = Column(Integer, ForeignKey("target_roles.id", ondelete="SET NULL"), nullable=True)
    target_role_name = Column(String(255), nullable=False)
    
    # Readiness Metrics (Explainable)
    overall_readiness_pct = Column(Float, default=0.0)
    skill_coverage_pct = Column(Float, default=0.0)
    evidence_coverage_pct = Column(Float, default=0.0)
    project_score_pct = Column(Float, default=0.0)
    resume_score_pct = Column(Float, default=0.0)
    assessment_score_pct = Column(Float, default=0.0)
    
    # Detailed Gap Items
    # JSON list of { skill: str, category: str, status: "strong"|"developing"|"needs_improvement"|"missing",
    #                importance: "critical"|"high"|"medium"|"preferred",
    #                why_it_matters: str, current_evidence: list[str], what_is_missing: str, recommendation: str }
    gaps_json = Column(Text, default="[]")
    
    # Category Breakdown for Radar & Bar Charts
    # JSON dict of { category: { score: int, required_count: int, matched_count: int } }
    category_breakdown_json = Column(Text, default="{}")
    
    # Actionable Next Steps
    # JSON list of { step_number: int, title: str, description: str, action_type: str, action_payload: dict }
    recommendations_json = Column(Text, default="[]")
    
    # Recommended Projects
    # JSON list of { title: str, description: str, skills: list, difficulty: str, duration_days: int, impact: str }
    recommended_projects_json = Column(Text, default="[]")
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="skill_gaps")
    target_role = relationship("TargetRole", back_populates="skill_gaps")
