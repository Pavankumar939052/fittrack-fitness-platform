from datetime import date, datetime
from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, String
from app.database import Base


class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    goal_type = Column(String(30), nullable=False)
    target_value = Column(Integer, nullable=False)
    current_value = Column(Integer, default=0, nullable=False)
    deadline = Column(Date, nullable=False)
    status = Column(String(20), default="IN_PROGRESS", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
