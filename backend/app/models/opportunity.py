import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.orm import relationship
from app.database.connection import Base

class JobOpportunity(Base):
    __tablename__ = "job_opportunities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    company_logo = Column(String(500), nullable=True)
    location = Column(String(255), nullable=False)
    type = Column(String(50), default="internship") # internship, full-time, contract
    workplace_type = Column(String(50), default="remote") # remote, hybrid, on-site
    experience_level = Column(String(50), default="Entry level (0-1 yrs)")
    stipend_or_salary = Column(String(100), nullable=True)
    
    required_skills_json = Column(Text, default="[]") # ["React", "Node.js", "PostgreSQL"]
    preferred_skills_json = Column(Text, default="[]") # ["Docker", "AWS", "TypeScript"]
    responsibilities_json = Column(Text, default="[]")
    qualifications_json = Column(Text, default="[]")
    
    description = Column(Text, nullable=False)
    deadline = Column(String(100), nullable=True)
    apply_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    applications = relationship("Application", back_populates="opportunity")
