import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database.connection import Base

class GitHubProfile(Base):
    __tablename__ = "github_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    username = Column(String(255), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    public_repos_count = Column(Integer, default=0)
    followers_count = Column(Integer, default=0)
    total_stars_count = Column(Integer, default=0)
    
    languages_breakdown_json = Column(Text, default="{}") # {"Python": 45.2, "JavaScript": 30.1, "TypeScript": 24.7}
    repositories_json = Column(Text, default="[]") # [{name, description, language, stars, forks, url, topics}]
    evidence_detected_json = Column(Text, default="[]") # Extracted skill evidence
    
    synced_at = Column(DateTime, default=datetime.datetime.utcnow)
