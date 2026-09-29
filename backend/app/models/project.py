import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database.connection import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    role = Column(String(100), nullable=True)
    duration = Column(String(100), nullable=True)
    github_url = Column(String(500), nullable=True)
    live_url = Column(String(500), nullable=True)
    technologies_json = Column(Text, default="[]")  # JSON array of technology strings
    verified_skills_json = Column(Text, default="[]")  # JSON array of validated skills demonstrated
    difficulty = Column(String(50), default="intermediate")  # beginner, intermediate, advanced
    impact_metrics = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("StudentProfile", back_populates="projects")
