from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database.connection import Base

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    category = Column(String(50), nullable=False)  # programming, frontend, backend, database, cloud, devops, aiml, tools, soft_skills
    description = Column(Text, nullable=True)
    icon = Column(String(100), nullable=True)

    # Relationships
    student_skills = relationship("StudentSkill", back_populates="skill", cascade="all, delete-orphan")
    role_skills = relationship("RoleSkill", back_populates="skill", cascade="all, delete-orphan")

class StudentSkill(Base):
    __tablename__ = "student_skills"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    proficiency_level = Column(String(50), default="intermediate")  # beginner, intermediate, advanced, expert
    source = Column(String(50), default="self")  # self, resume, github, assessment
    verified = Column(Boolean, default=False)
    years_experience = Column(Integer, default=1)

    # Relationships
    profile = relationship("StudentProfile", back_populates="skills")
    skill = relationship("Skill", back_populates="student_skills")
