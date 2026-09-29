import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from app.database.connection import Base

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    bio = Column(Text, nullable=True)
    branch = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    target_role_id = Column(Integer, ForeignKey("target_roles.id", ondelete="SET NULL"), nullable=True)
    custom_target_role = Column(String(255), nullable=True)
    
    # Progress & Readiness
    profile_completion_pct = Column(Float, default=20.0)
    profile_readiness_pct = Column(Float, default=0.0)
    
    # External Links & Social
    github_username = Column(String(255), nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    portfolio_url = Column(String(500), nullable=True)
    
    # Career preferences
    preferred_workplace_type = Column(String(50), default="remote")  # remote, hybrid, on-site, any
    available_from = Column(String(100), nullable=True)
    
    # Gamification
    earned_badges_json = Column(Text, default="[]")  # List of unlocked badge ids/names
    experience_points = Column(Integer, default=100)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="profile")
    target_role = relationship("TargetRole", back_populates="profiles")
    skills = relationship("StudentSkill", back_populates="profile", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="profile", cascade="all, delete-orphan")
    educations = relationship("Education", back_populates="profile", cascade="all, delete-orphan")
    experiences = relationship("Experience", back_populates="profile", cascade="all, delete-orphan")
    certifications = relationship("Certification", back_populates="profile", cascade="all, delete-orphan")

class Education(Base):
    __tablename__ = "educations"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    institution = Column(String(255), nullable=False)
    degree = Column(String(255), nullable=False)
    field_of_study = Column(String(255), nullable=True)
    start_year = Column(Integer, nullable=True)
    end_year = Column(Integer, nullable=True)
    grade = Column(String(50), nullable=True)
    current = Column(Integer, default=1)

    profile = relationship("StudentProfile", back_populates="educations")

class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    company = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False)
    location = Column(String(255), nullable=True)
    start_date = Column(String(100), nullable=True)
    end_date = Column(String(100), nullable=True)
    current = Column(Integer, default=0)
    description = Column(Text, nullable=True)

    profile = relationship("StudentProfile", back_populates="experiences")

class Certification(Base):
    __tablename__ = "certifications"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    issuing_org = Column(String(255), nullable=False)
    issue_date = Column(String(100), nullable=True)
    expiry_date = Column(String(100), nullable=True)
    credential_url = Column(String(500), nullable=True)

    profile = relationship("StudentProfile", back_populates="certifications")
