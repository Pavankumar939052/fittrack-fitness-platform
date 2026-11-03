from datetime import date, datetime
from typing import Literal
from pydantic import BaseModel, Field, ConfigDict


class GoalCreate(BaseModel):
    goal_type: Literal["Weight Loss", "Muscle Gain", "Steps"]
    target_value: int = Field(gt=0)
    current_value: int = Field(default=0, ge=0)
    deadline: date


class GoalUpdate(BaseModel):
    current_value: int | None = Field(default=None, ge=0)
    status: Literal["IN_PROGRESS", "COMPLETED"] | None = None


class GoalResponse(BaseModel):
    id: int
    user_id: int
    goal_type: str
    target_value: int
    current_value: int
    deadline: date
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
