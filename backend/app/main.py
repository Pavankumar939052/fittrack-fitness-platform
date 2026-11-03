from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.core.config import settings
from app.models.user import User
from app.models.workout import Workout
from app.models.progress import Progress
from app.models.goal import Goal
from app.models.notification import Notification
from app.routers import auth, users, workouts, progress, goals, analytics, notifications

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FitTrack - Fitness & Workout Management Platform",
    description="Fitness tracking, workout management and progress analytics API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        settings.frontend_url
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(workouts.router)
app.include_router(progress.router)
app.include_router(goals.router)
app.include_router(analytics.router)
app.include_router(notifications.router)


@app.get("/")
def root():
    return {"message": "Welcome to FitTrack API", "status": "running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
