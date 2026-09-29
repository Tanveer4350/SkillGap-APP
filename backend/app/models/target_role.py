from sqlalchemy import Column, Integer, String, Text, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.database.connection import Base

class TargetRole(Base):
    __tablename__ = "target_roles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), unique=True, nullable=False)
    category = Column(String(100), nullable=False)  # Software Development, Data & AI, Cloud & DevOps, Design, Cyber
    description = Column(Text, nullable=True)
    average_salary = Column(String(100), nullable=True)
    growth_rate = Column(String(50), nullable=True)
    icon = Column(String(100), nullable=True)
    
    required_skills_json = Column(Text, default="[]")  # List of primary skills
    preferred_skills_json = Column(Text, default="[]") # List of nice-to-have skills
    responsibilities_json = Column(Text, default="[]")

    profiles = relationship("StudentProfile", back_populates="target_role")
    role_skills = relationship("RoleSkill", back_populates="role", cascade="all, delete-orphan")
    skill_gaps = relationship("SkillGapAnalysis", back_populates="target_role")
    roadmaps = relationship("Roadmap", back_populates="target_role")

class RoleSkill(Base):
    __tablename__ = "role_skills"

    id = Column(Integer, primary_key=True, index=True)
    role_id = Column(Integer, ForeignKey("target_roles.id", ondelete="CASCADE"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    importance = Column(String(50), default="high")  # critical, high, medium, preferred
    min_proficiency = Column(String(50), default="intermediate")  # beginner, intermediate, advanced

    role = relationship("TargetRole", back_populates="role_skills")
    skill = relationship("Skill", back_populates="role_skills")
