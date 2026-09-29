import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, Float, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.database.connection import Base

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    skill_name = Column(String(100), nullable=False, index=True)
    category = Column(String(50), nullable=False)
    difficulty = Column(String(50), default="intermediate") # beginner, intermediate, advanced
    time_limit_mins = Column(Integer, default=15)
    pass_score = Column(Integer, default=70)
    questions_count = Column(Integer, default=5)
    description = Column(Text, nullable=True)

    questions = relationship("Question", back_populates="assessment", cascade="all, delete-orphan")
    attempts = relationship("AssessmentAttempt", back_populates="assessment", cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False)
    question_text = Column(Text, nullable=False)
    question_type = Column(String(50), default="mcq") # mcq, scenario, coding, debugging
    code_snippet = Column(Text, nullable=True)
    options_json = Column(Text, nullable=False) # JSON array of 4 option strings
    correct_option_index = Column(Integer, nullable=False) # 0, 1, 2, 3
    explanation = Column(Text, nullable=False)

    assessment = relationship("Assessment", back_populates="questions")

class AssessmentAttempt(Base):
    __tablename__ = "assessment_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    assessment_id = Column(Integer, ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False)
    
    score_percentage = Column(Float, nullable=False)
    total_questions = Column(Integer, nullable=False)
    correct_count = Column(Integer, nullable=False)
    incorrect_count = Column(Integer, nullable=False)
    passed = Column(Boolean, default=False)
    
    user_answers_json = Column(Text, default="{}") # {question_id: selected_index}
    feedback_json = Column(Text, default="[]") # Specific feedback per question/topic
    completed_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="assessment_attempts")
    assessment = relationship("Assessment", back_populates="attempts")
