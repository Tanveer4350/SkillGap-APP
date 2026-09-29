import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from app.database.connection import Base

class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    target_role_id = Column(Integer, ForeignKey("target_roles.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    total_phases = Column(Integer, default=6)
    current_phase = Column(Integer, default=1)
    progress_pct = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="roadmaps")
    target_role = relationship("TargetRole", back_populates="roadmaps")
    items = relationship("RoadmapItem", back_populates="roadmap", cascade="all, delete-orphan", order_by="RoadmapItem.phase_number")

class RoadmapItem(Base):
    __tablename__ = "roadmap_items"

    id = Column(Integer, primary_key=True, index=True)
    roadmap_id = Column(Integer, ForeignKey("roadmaps.id", ondelete="CASCADE"), nullable=False)
    phase_number = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    skill_name = Column(String(100), nullable=False)
    category = Column(String(50), default="core")
    why_learn = Column(Text, nullable=False)
    
    prerequisites_json = Column(Text, default="[]")
    learning_objectives_json = Column(Text, default="[]")
    suggested_resources_json = Column(Text, default="[]") # [{title, type: video|doc|interactive, url, duration}]
    mini_task_json = Column(Text, default="{}") # {title, description, test_criteria}
    project_json = Column(Text, default="{}") # {title, description, skills, estimated_hours}
    
    assessment_skill = Column(String(100), nullable=True)
    status = Column(String(50), default="not_started") # not_started, in_progress, completed
    completed_at = Column(DateTime, nullable=True)

    roadmap = relationship("Roadmap", back_populates="items")
