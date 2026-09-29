import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database.connection import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    opportunity_id = Column(Integer, ForeignKey("job_opportunities.id", ondelete="SET NULL"), nullable=True)
    
    custom_title = Column(String(255), nullable=True)
    custom_company = Column(String(255), nullable=True)
    status = Column(String(50), default="saved") # saved, applied, assessment, interview, offer, rejected, withdrawn
    
    match_score = Column(Integer, default=75) # Snapshot of match % at application time
    applied_date = Column(DateTime, nullable=True)
    deadline_date = Column(String(100), nullable=True)
    interview_date = Column(String(100), nullable=True)
    salary_offered = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="applications")
    opportunity = relationship("JobOpportunity", back_populates="applications")
