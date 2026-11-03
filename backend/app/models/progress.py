from datetime import date
from sqlalchemy import Column, Date, ForeignKey, Integer, UniqueConstraint
from app.database import Base


class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    total_workouts = Column(Integer, default=0, nullable=False)
    total_calories = Column(Integer, default=0, nullable=False)
    total_duration = Column(Integer, default=0, nullable=False)
    date = Column(Date, default=date.today, nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "date", name="uq_progress_user_date"),
    )
