import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from app.database.connection import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=False)
    parsed_text = Column(Text, nullable=True)
    upload_date = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="resumes")
    analysis = relationship("ResumeAnalysis", back_populates="resume", uselist=False, cascade="all, delete-orphan")

class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    extracted_name = Column(String(255), nullable=True)
    extracted_email = Column(String(255), nullable=True)
    extracted_skills_json = Column(Text, default="[]")
    extracted_experience_json = Column(Text, default="[]")
    extracted_projects_json = Column(Text, default="[]")
    extracted_education_json = Column(Text, default="[]")
    
    # Gap analysis on resume itself
    skills_found_json = Column(Text, default="[]")
    skills_missing_json = Column(Text, default="[]")
    weak_evidence_json = Column(Text, default="[]")
    missing_sections_json = Column(Text, default="[]")
    improvement_suggestions_json = Column(Text, default="[]")
    ats_score = Column(Float, default=70.0)
    
    analyzed_at = Column(DateTime, default=datetime.datetime.utcnow)

    resume = relationship("Resume", back_populates="analysis")
