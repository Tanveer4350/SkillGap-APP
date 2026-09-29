import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from app.database.connection import Base

class SkillEvidence(Base):
    __tablename__ = "skill_evidence"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String(100), nullable=False, index=True)
    evidence_type = Column(String(50), nullable=False) # project, github, resume, assessment
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    source_reference = Column(String(255), nullable=True) # e.g. "Project #2: Airline Booking" or "Assessment: React (86%)"
    evidence_strength = Column(String(50), default="strong") # strong, moderate, weak
    score_or_metric = Column(String(50), nullable=True) # e.g. "86%", "5 repos", "Production URL"
    url = Column(String(500), nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="evidence_items")
