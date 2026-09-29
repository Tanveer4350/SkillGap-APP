from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class QuestionOut(BaseModel):
    id: int
    question_text: str
    question_type: str
    code_snippet: Optional[str] = None
    options: List[str]
    # correct answer omitted for student view during test
    explanation: Optional[str] = None

    class Config:
        from_attributes = True

class AssessmentOut(BaseModel):
    id: int
    title: str
    skill_name: str
    category: str
    difficulty: str
    time_limit_mins: int
    pass_score: int
    questions_count: int
    description: Optional[str] = None
    questions: Optional[List[QuestionOut]] = None
    user_best_score: Optional[float] = None
    user_passed: Optional[bool] = None

    class Config:
        from_attributes = True

class SubmitAssessmentRequest(BaseModel):
    answers: Dict[int, int] # {question_id: selected_option_index}

class QuestionFeedback(BaseModel):
    question_id: int
    question_text: str
    selected_option_index: int
    correct_option_index: int
    is_correct: bool
    explanation: str

class AssessmentResultOut(BaseModel):
    attempt_id: int
    assessment_id: int
    skill_name: str
    score_percentage: float
    total_questions: int
    correct_count: int
    incorrect_count: int
    passed: bool
    feedback: List[QuestionFeedback]
    recommendation: str
    unlocked_evidence: bool = False
    completed_at: datetime
