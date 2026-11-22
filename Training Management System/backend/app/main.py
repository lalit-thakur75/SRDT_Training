import os
import shutil
from datetime import datetime
from typing import Optional, List
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from .config import UPLOAD_DIR
from .database import engine, Base, get_db
from .models import User, Track, EligibleStudent, Schedule, Material, Enrollment
from .schemas import (
    TokenResponse, LoginRequest, StudentRegisterRequest,
    TrainerCreateRequest, EligibleStudentCreate, EligibleStudentResponse,
    ScheduleCreate, ScheduleUpdate, ScheduleResponse,
    MaterialResponse, UserResponse
)
from .auth import hash_password, verify_password, create_access_token, get_current_user, require_role
from .seed import seed_initial_data

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Training Management System API",
    version="1.0.0",
    description="Backend API for Training Management System with Role-Based Access Control"
)

# CORS Middleware to allow HTML frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory for static file access (downloading notes/syllabus)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Seed initial admin, tracks and samples on startup
@app.on_event("startup")
def on_startup():
    db = next(get_db())
    try:
        seed_initial_data(db)
    finally:
        db.close()


# ==========================================
# 1. AUTHENTICATION & REGISTRATION
# ==========================================

@app.post("/api/auth/login", response_model=TokenResponse)
def login(creds: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == creds.email).first()
    if not user or not verify_password(creds.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    token = create_access_token({"user_id": user.id, "role": user.role, "email": user.email})
    track_name = user.track.name if user.track else None
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "roll_no": user.roll_no,
            "track_id": user.track_id,
            "track_name": track_name
        }
    }

@app.post("/api/auth/register-student", response_model=TokenResponse)
def register_student(req: StudentRegisterRequest, db: Session = Depends(get_db)):
    roll_clean = req.roll_no.strip().upper()
    email_clean = req.email.strip().lower()

    # Verify roll number and email in eligible_students whitelist
    eligible = db.query(EligibleStudent).filter(
        EligibleStudent.roll_no == roll_clean
    ).first()

    if not eligible:
        raise HTTPException(
            status_code=400,
            detail="Unauthorized: Roll Number not found in eligible trainees list. Contact Administrator."
        )

    if eligible.is_registered:
        raise HTTPException(
            status_code=400,
            detail="This Roll Number is already registered. Please log in directly."
        )

    # Check if email is already taken
    existing_user = db.query(User).filter(User.email == email_clean).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already registered.")

    # Create Student User
    new_student = User(
        name=req.name.strip(),
        email=email_clean,
        roll_no=roll_clean,
        password_hash=hash_password(req.password),
        role="student",
        track_id=eligible.track_id
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    # Mark eligible student as registered
    eligible.is_registered = True
    db.add(Enrollment(student_id=new_student.id, track_id=eligible.track_id))
    db.commit()

    token = create_access_token({"user_id": new_student.id, "role": "student", "email": new_student.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_student.id,
            "name": new_student.name,
            "email": new_student.email,
            "role": "student",
            "roll_no": new_student.roll_no,
            "track_id": new_student.track_id,
            "track_name": new_student.track.name if new_student.track else None
        }
    }

@app.get("/api/auth/me")
def get_current_user_profile(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "roll_no": user.roll_no,
        "track_id": user.track_id,
        "track_name": user.track.name if user.track else None
    }


# ==========================================
# 2. TRACKS & PUBLIC OVERVIEW
# ==========================================

@app.get("/api/tracks")
def get_tracks(db: Session = Depends(get_db)):
    tracks = db.query(Track).all()
    result = []
    for t in tracks:
        student_count = db.query(Enrollment).filter(Enrollment.track_id == t.id).count()
        session_count = db.query(Schedule).filter(Schedule.track_id == t.id).count()
        result.append({
            "id": t.id,
            "name": t.name,
            "description": t.description,
            "student_count": student_count,
            "session_count": session_count
        })
    return result

@app.get("/api/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    return {
        "total_tracks": db.query(Track).count(),
        "total_sessions": db.query(Schedule).count(),
        "total_students": db.query(User).filter(User.role == "student").count(),
        "total_trainers": db.query(User).filter(User.role == "trainer").count(),
        "total_materials": db.query(Material).count()
    }


# ==========================================
# 3. SCHEDULES (ADMIN CRUD + PUBLIC VIEW)
# ==========================================

@app.get("/api/schedules")
def list_schedules(
    track_id: Optional[int] = None,
    mode: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Schedule)
    if track_id:
        query = query.filter(Schedule.track_id == track_id)
    if mode:
        query = query.filter(Schedule.mode == mode)
    
    schedules = query.order_by(Schedule.date.asc(), Schedule.time.asc()).all()
    result = []
    for s in schedules:
        result.append({
            "id": s.id,
            "track_id": s.track_id,
            "track_name": s.track.name if s.track else "General",
            "trainer_id": s.trainer_id,
            "trainer_name": s.trainer.name if s.trainer else "Assigned Trainer",
            "title": s.title,
            "date": s.date,
            "time": s.time,
            "mode": s.mode,
            "meeting_link": s.meeting_link,
            "classroom": s.classroom,
            "status": s.status
        })
    return result

@app.post("/api/schedules", status_code=status.HTTP_201_CREATED)
def create_schedule(
    req: ScheduleCreate,
    admin: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    track = db.query(Track).filter(Track.id == req.track_id).first()
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")

    new_schedule = Schedule(
        track_id=req.track_id,
        trainer_id=req.trainer_id,
        title=req.title,
        date=req.date,
        time=req.time,
        mode=req.mode.lower(),
        meeting_link=req.meeting_link if req.mode.lower() == "online" else None,
        classroom=req.classroom if req.mode.lower() == "offline" else None,
        status=req.status
    )
    db.add(new_schedule)
    db.commit()
    db.refresh(new_schedule)
    return {"message": "Schedule created successfully", "schedule_id": new_schedule.id}

@app.put("/api/schedules/{schedule_id}")
def update_schedule(
    schedule_id: int,
    req: ScheduleUpdate,
    admin: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    if req.title is not None:
        schedule.title = req.title
    if req.date is not None:
        schedule.date = req.date
    if req.time is not None:
        schedule.time = req.time
    if req.mode is not None:
        schedule.mode = req.mode.lower()
        if schedule.mode == "online":
            schedule.meeting_link = req.meeting_link
            schedule.classroom = None
        else:
            schedule.classroom = req.classroom
            schedule.meeting_link = None
    if req.status is not None:
        schedule.status = req.status
    if req.trainer_id is not None:
        schedule.trainer_id = req.trainer_id

    db.commit()
    return {"message": "Schedule updated successfully"}

@app.delete("/api/schedules/{schedule_id}")
def delete_schedule(
    schedule_id: int,
    admin: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    db.delete(schedule)
    db.commit()
    return {"message": "Schedule deleted successfully"}


# ==========================================
# 4. MATERIALS (TRAINER UPLOADS & DOWNLOADS)
# ==========================================

@app.get("/api/materials")
def get_materials(track_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(Material)
    if track_id:
        query = query.filter(Material.track_id == track_id)
    
    materials = query.order_by(Material.created_at.desc()).all()
    result = []
    for m in materials:
        # File URL relative to backend
        file_url = f"/uploads/{os.path.basename(m.file_path)}"
        result.append({
            "id": m.id,
            "track_id": m.track_id,
            "track_name": m.track.name if m.track else "Track",
            "trainer_id": m.trainer_id,
            "trainer_name": m.trainer.name if m.trainer else "Trainer",
            "title": m.title,
            "file_name": m.file_name,
            "file_size": m.file_size,
            "type": m.type,
            "file_url": file_url,
            "created_at": m.created_at.strftime("%Y-%m-%d %H:%M")
        })
    return result

@app.post("/api/materials/upload")
async def upload_material(
    title: str = Form(...),
    type: str = Form(...),  # syllabus / notes
    track_id: int = Form(...),
    file: UploadFile = File(...),
    user: User = Depends(require_role(["trainer", "admin"])),
    db: Session = Depends(get_db)
):
    # Verify track exists
    track = db.query(Track).filter(Track.id == track_id).first()
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")

    # Clean file name & save to uploads folder
    filename = f"{int(datetime.utcnow().timestamp())}_{file.filename.replace(' ', '_')}"
    file_disk_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_disk_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size = os.path.getsize(file_disk_path)

    # Save metadata in PostgreSQL
    new_material = Material(
        track_id=track_id,
        trainer_id=user.id,
        title=title,
        file_path=file_disk_path,
        file_name=file.filename,
        file_size=file_size,
        type=type.lower()
    )
    db.add(new_material)
    db.commit()
    db.refresh(new_material)

    return {
        "message": f"{type.capitalize()} uploaded successfully!",
        "material_id": new_material.id,
        "file_name": file.filename
    }

@app.delete("/api/materials/{material_id}")
def delete_material(
    material_id: int,
    user: User = Depends(require_role(["trainer", "admin"])),
    db: Session = Depends(get_db)
):
    material = db.query(Material).filter(Material.id == material_id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")

    # If trainer, ensure they own it
    if user.role == "trainer" and material.trainer_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this material")

    # Remove physical file if exists
    if os.path.exists(material.file_path):
        try:
            os.remove(material.file_path)
        except Exception:
            pass

    db.delete(material)
    db.commit()
    return {"message": "Material deleted successfully"}


# ==========================================
# 5. ADMIN MANAGEMENT
# ==========================================

@app.get("/api/admin/trainers")
def list_trainers(admin: User = Depends(require_role(["admin"])), db: Session = Depends(get_db)):
    trainers = db.query(User).filter(User.role == "trainer").all()
    return [
        {
            "id": t.id,
            "name": t.name,
            "email": t.email,
            "track_id": t.track_id,
            "track_name": t.track.name if t.track else "None",
            "created_at": t.created_at.strftime("%Y-%m-%d")
        }
        for t in trainers
    ]

@app.post("/api/admin/trainers")
def create_trainer(
    req: TrainerCreateRequest,
    admin: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    existing = db.query(User).filter(User.email == req.email.strip().lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Trainer with this email already exists")

    new_trainer = User(
        name=req.name.strip(),
        email=req.email.strip().lower(),
        password_hash=hash_password(req.password),
        role="trainer",
        track_id=req.track_id
    )
    db.add(new_trainer)
    db.commit()
    db.refresh(new_trainer)
    return {"message": "Trainer created successfully", "trainer_id": new_trainer.id}

@app.delete("/api/admin/trainers/{trainer_id}")
def delete_trainer(
    trainer_id: int,
    admin: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    trainer = db.query(User).filter(User.id == trainer_id, User.role == "trainer").first()
    if not trainer:
        raise HTTPException(status_code=404, detail="Trainer not found")
    db.delete(trainer)
    db.commit()
    return {"message": "Trainer removed successfully"}

@app.get("/api/admin/eligible-students")
def list_eligible_students(admin: User = Depends(require_role(["admin"])), db: Session = Depends(get_db)):
    eligible = db.query(EligibleStudent).all()
    return [
        {
            "id": e.id,
            "roll_no": e.roll_no,
            "email": e.email,
            "name": e.name,
            "track_id": e.track_id,
            "track_name": e.track.name if e.track else "General",
            "is_registered": e.is_registered
        }
        for e in eligible
    ]

@app.post("/api/admin/eligible-students")
def add_eligible_student(
    req: EligibleStudentCreate,
    admin: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    roll = req.roll_no.strip().upper()
    existing = db.query(EligibleStudent).filter(EligibleStudent.roll_no == roll).first()
    if existing:
        raise HTTPException(status_code=400, detail="Roll Number already whitelisted")

    item = EligibleStudent(
        roll_no=roll,
        email=req.email.strip().lower(),
        name=req.name.strip() if req.name else None,
        track_id=req.track_id,
        is_registered=False
    )
    db.add(item)
    db.commit()
    return {"message": f"Roll number {roll} whitelisted for student registration"}

@app.get("/api/admin/students")
def list_registered_students(
    admin: User = Depends(require_role(["admin", "trainer"])),
    db: Session = Depends(get_db)
):
    students = db.query(User).filter(User.role == "student").all()
    return [
        {
            "id": s.id,
            "name": s.name,
            "email": s.email,
            "roll_no": s.roll_no,
            "track_id": s.track_id,
            "track_name": s.track.name if s.track else "None",
            "registered_at": s.created_at.strftime("%Y-%m-%d %H:%M")
        }
        for s in students
    ]

@app.post("/api/admin/clear-data")
def clear_all_data(
    confirm_password: str = Form(...),
    admin: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    # Verify admin password for security
    if not verify_password(confirm_password, admin.password_hash):
        raise HTTPException(status_code=400, detail="Admin password incorrect. Clear operation aborted.")

    # Delete all schedules, materials, and student enrollments (keep tracks & admin intact)
    db.query(Schedule).delete()
    db.query(Material).delete()
    db.query(Enrollment).delete()
    db.query(User).filter(User.role == "student").delete()
    db.query(EligibleStudent).update({"is_registered": False})

    # Clean uploads directory
    for f in os.listdir(UPLOAD_DIR):
        file_path = os.path.join(UPLOAD_DIR, f)
        if os.path.isfile(file_path):
            try:
                os.remove(file_path)
            except Exception:
                pass

    db.commit()
    return {"message": "All session schedules, student data and uploaded materials have been cleared successfully."}
