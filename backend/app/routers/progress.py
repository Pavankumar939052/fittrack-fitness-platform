from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.workout import Workout

router = APIRouter(prefix="/progress", tags=["Daily Progress"])


@router.get("/today")
def get_today_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()

    stats = db.query(
        func.count(Workout.id),
        func.coalesce(func.sum(Workout.calories_burned), 0),
        func.coalesce(func.sum(Workout.duration), 0)
    ).filter(
        Workout.user_id == current_user.id,
        Workout.workout_date == today
    ).first()

    return {
        "date": today,
        "total_workouts": stats[0],
        "total_calories": stats[1],
        "total_duration": stats[2]
    }


@router.get("/history")
def get_progress_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    daily_stats = db.query(
        Workout.workout_date.label("date"),
        func.count(Workout.id).label("total_workouts"),
        func.coalesce(func.sum(Workout.calories_burned), 0).label("total_calories"),
        func.coalesce(func.sum(Workout.duration), 0).label("total_duration")
    ).filter(
        Workout.user_id == current_user.id
    ).group_by(
        Workout.workout_date
    ).order_by(
        Workout.workout_date.desc()
    ).all()

    return [
        {
            "date": item.date,
            "total_workouts": item.total_workouts,
            "total_calories": item.total_calories,
            "total_duration": item.total_duration
        }
        for item in daily_stats
    ]
