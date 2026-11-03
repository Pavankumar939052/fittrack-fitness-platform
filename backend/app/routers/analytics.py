from datetime import date, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract

from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.workout import Workout

router = APIRouter(prefix="/analytics", tags=["Reports & Analytics"])


@router.get("/weekly")
def get_weekly_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()
    start_date = today - timedelta(days=6)

    stats = db.query(
        func.count(Workout.id),
        func.coalesce(func.sum(Workout.calories_burned), 0),
        func.coalesce(func.sum(Workout.duration), 0)
    ).filter(
        Workout.user_id == current_user.id,
        Workout.workout_date >= start_date,
        Workout.workout_date <= today
    ).first()

    return {
        "period": "Last 7 days",
        "start_date": start_date,
        "end_date": today,
        "total_workouts": stats[0],
        "total_calories": stats[1],
        "total_duration": stats[2]
    }


@router.get("/monthly")
def get_monthly_report(
    year: int | None = None,
    month: int | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()
    report_year = year or today.year
    report_month = month or today.month

    if report_month < 1 or report_month > 12:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Month must be between 1 and 12")

    stats = db.query(
        func.count(Workout.id),
        func.coalesce(func.sum(Workout.calories_burned), 0),
        func.coalesce(func.sum(Workout.duration), 0)
    ).filter(
        Workout.user_id == current_user.id,
        extract("year", Workout.workout_date) == report_year,
        extract("month", Workout.workout_date) == report_month
    ).first()

    return {
        "year": report_year,
        "month": report_month,
        "total_workouts": stats[0],
        "total_calories": stats[1],
        "total_duration": stats[2]
    }


@router.get("/categories")
def get_category_breakdown(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    results = db.query(
        Workout.category,
        func.count(Workout.id).label("total_workouts"),
        func.coalesce(func.sum(Workout.calories_burned), 0).label("total_calories")
    ).filter(
        Workout.user_id == current_user.id
    ).group_by(
        Workout.category
    ).all()

    return [
        {
            "category": item.category,
            "total_workouts": item.total_workouts,
            "total_calories": item.total_calories
        }
        for item in results
    ]
