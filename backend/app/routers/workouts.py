from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.workout import Workout
from app.schemas.workout import WorkoutCreate, WorkoutUpdate, WorkoutResponse

router = APIRouter(prefix="/workouts", tags=["Workout Management"])


@router.post("/", response_model=WorkoutResponse, status_code=status.HTTP_201_CREATED)
def add_workout(
    data: WorkoutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    workout = Workout(
        **data.model_dump(),
        user_id=current_user.id
    )
    db.add(workout)
    db.commit()
    db.refresh(workout)
    return workout


@router.get("/", response_model=list[WorkoutResponse])
def get_workouts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Workout).filter(
        Workout.user_id == current_user.id
    ).order_by(Workout.workout_date.desc()).all()


@router.put("/{workout_id}", response_model=WorkoutResponse)
def update_workout(
    workout_id: int,
    data: WorkoutUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == current_user.id
    ).first()

    if not workout:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout not found"
        )

    updates = data.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No update fields provided"
        )

    for field, value in updates.items():
        setattr(workout, field, value)

    db.commit()
    db.refresh(workout)
    return workout


@router.delete("/{workout_id}")
def delete_workout(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == current_user.id
    ).first()

    if not workout:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout not found"
        )

    db.delete(workout)
    db.commit()

    return {"message": "Workout deleted successfully"}
