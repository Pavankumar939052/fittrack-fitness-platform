from datetime import datetime

from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, String

from app.database import Base


class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    workout_name = Column(String(150), nullable=False)
    category = Column(String(30), nullable=False)
    duration = Column(Integer, nullable=False)
    calories_burned = Column(Integer, nullable=False)
    workout_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
