from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class LoginRequest(BaseModel):
    email: str
    password: str

class StudentRegisterRequest(BaseModel):
    name: str
    email: str
    roll_no: str
    password: str

class TrainerCreateRequest(BaseModel):
    name: str
    email: str
    password: str
    track_id: Optional[int] = None

class EligibleStudentCreate(BaseModel):
    roll_no: str
    email: str
    name: Optional[str] = None
    track_id: int

class EligibleStudentResponse(BaseModel):
    id: int
    roll_no: str
    email: str
    name: Optional[str] = None
    track_id: int
    is_registered: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ScheduleCreate(BaseModel):
    track_id: int
    title: str
    date: str
    time: str
    mode: str = "online"  # online / offline
    meeting_link: Optional[str] = None
    classroom: Optional[str] = None
    status: str = "upcoming"
    trainer_id: Optional[int] = None

class ScheduleUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    mode: Optional[str] = None
    meeting_link: Optional[str] = None
    classroom: Optional[str] = None
    status: Optional[str] = None
    trainer_id: Optional[int] = None

class ScheduleResponse(BaseModel):
    id: int
    track_id: int
    trainer_id: Optional[int] = None
    title: str
    date: str
    time: str
    mode: str
    meeting_link: Optional[str] = None
    classroom: Optional[str] = None
    status: str
    trainer_name: Optional[str] = None
    track_name: Optional[str] = None

    class Config:
        from_attributes = True

class MaterialResponse(BaseModel):
    id: int
    track_id: int
    trainer_id: Optional[int] = None
    title: str
    file_name: str
    file_size: Optional[int] = None
    type: str
    created_at: datetime
    trainer_name: Optional[str] = None
    track_name: Optional[str] = None

    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    roll_no: Optional[str] = None
    role: str
    track_id: Optional[int] = None
    track_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
