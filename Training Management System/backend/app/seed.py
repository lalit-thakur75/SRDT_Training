import logging
from sqlalchemy.orm import Session
from .models import User, Track, EligibleStudent, Schedule
from .auth import hash_password

logger = logging.getLogger(__name__)

def seed_initial_data(db: Session):
    # 1. Create Tracks if not exist
    track_fs = db.query(Track).filter(Track.name == "Full Stack Development").first()
    if not track_fs:
        track_fs = Track(
            name="Full Stack Development",
            description="Master HTML5, CSS3, Modern JavaScript, REST APIs and Backend Integration."
        )
        db.add(track_fs)

    track_ai = db.query(Track).filter(Track.name == "Artificial Intelligence").first()
    if not track_ai:
        track_ai = Track(
            name="Artificial Intelligence",
            description="Explore AI foundations, prompt engineering, LLM API integration and practical projects."
        )
        db.add(track_ai)
    db.commit()
    db.refresh(track_fs)
    db.refresh(track_ai)

    # 2. Create Default Admin if not exist
    admin_user = db.query(User).filter(User.role == "admin").first()
    if not admin_user:
        admin_user = User(
            name="Super Admin",
            email="admin@tms.com",
            password_hash=hash_password("admin123"),
            role="admin"
        )
        db.add(admin_user)
        logger.info("Created default Admin: admin@tms.com / admin123")

    # 3. Create Default Trainer
    trainer_user = db.query(User).filter(User.email == "trainer@tms.com").first()
    if not trainer_user:
        trainer_user = User(
            name="Er. Vikram Sen",
            email="trainer@tms.com",
            password_hash=hash_password("trainer123"),
            role="trainer",
            track_id=track_fs.id
        )
        db.add(trainer_user)
        logger.info("Created default Trainer: trainer@tms.com / trainer123")

    db.commit()
    db.refresh(trainer_user)

    # 4. Create Pre-approved Eligible Students for Registration Verification
    eligible_samples = [
        {"roll_no": "FS2026-01", "email": "rahul@student.com", "name": "Rahul Sharma", "track_id": track_fs.id},
        {"roll_no": "AI2026-02", "email": "priya@student.com", "name": "Priya Patel", "track_id": track_ai.id},
        {"roll_no": "FS2026-03", "email": "amit@student.com", "name": "Amit Kumar", "track_id": track_fs.id},
    ]
    for sample in eligible_samples:
        existing = db.query(EligibleStudent).filter(EligibleStudent.roll_no == sample["roll_no"]).first()
        if not existing:
            db.add(EligibleStudent(**sample))

    # 5. Create Initial 2 Schedules (Full Stack & AI)
    existing_schedules = db.query(Schedule).count()
    if existing_schedules == 0:
        sch1 = Schedule(
            track_id=track_fs.id,
            trainer_id=trainer_user.id,
            title="Session 01: Modern Web Architecture & Frontend Setup",
            date="2026-11-20",
            time="10:00 AM - 12:30 PM",
            mode="online",
            meeting_link="https://meet.google.com/tms-fullstack-class",
            classroom=None,
            status="upcoming"
        )
        sch2 = Schedule(
            track_id=track_ai.id,
            trainer_id=trainer_user.id,
            title="Session 01: AI Fundamentals & Generative Model APIs",
            date="2026-11-21",
            time="02:00 PM - 04:30 PM",
            mode="offline",
            meeting_link=None,
            classroom="Lab 4, AI Center (2nd Floor)",
            status="upcoming"
        )
        db.add(sch1)
        db.add(sch2)

    db.commit()
    logger.info("Initial data seeded successfully.")
