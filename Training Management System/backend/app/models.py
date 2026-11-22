from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    roll_no = Column(String(50), unique=True, index=True, nullable=True)  # Required for students
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="student")  # admin, trainer, student
    track_id = Column(Integer, ForeignKey("tracks.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    track = relationship("Track", back_populates="users")
    schedules = relationship("Schedule", back_populates="trainer")
    materials = relationship("Material", back_populates="trainer")
    enrollments = relationship("Enrollment", back_populates="student", cascade="all, delete-orphan")

class EligibleStudent(Base):
    __tablename__ = "eligible_students"

    id = Column(Integer, primary_key=True, index=True)
    roll_no = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(150), nullable=False)
    name = Column(String(100), nullable=True)
    track_id = Column(Integer, ForeignKey("tracks.id", ondelete="CASCADE"), nullable=False)
    is_registered = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    track = relationship("Track")

class Track(Base):
    __tablename__ = "tracks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(Text, nullable=True)

    users = relationship("User", back_populates="track")
    schedules = relationship("Schedule", back_populates="track", cascade="all, delete-orphan")
    materials = relationship("Material", back_populates="track", cascade="all, delete-orphan")
    enrollments = relationship("Enrollment", back_populates="track", cascade="all, delete-orphan")

class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    track_id = Column(Integer, ForeignKey("tracks.id", ondelete="CASCADE"), nullable=False)
    trainer_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(200), nullable=False)
    date = Column(String(50), nullable=False)   # e.g., "2026-11-25"
    time = Column(String(50), nullable=False)   # e.g., "10:00 AM - 12:00 PM"
    mode = Column(String(20), nullable=False, default="online")  # online, offline
    meeting_link = Column(String(255), nullable=True)
    classroom = Column(String(100), nullable=True)
    status = Column(String(20), default="upcoming")  # upcoming, completed, cancelled
    created_at = Column(DateTime, default=datetime.utcnow)

    track = relationship("Track", back_populates="schedules")
    trainer = relationship("User", back_populates="schedules")

class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
    track_id = Column(Integer, ForeignKey("tracks.id", ondelete="CASCADE"), nullable=False)
    trainer_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(200), nullable=False)
    file_path = Column(String(300), nullable=False)  # disk location
    file_name = Column(String(150), nullable=False)  # original filename
    file_size = Column(Integer, nullable=True)       # size in bytes
    type = Column(String(30), nullable=False)        # syllabus, notes
    created_at = Column(DateTime, default=datetime.utcnow)

    track = relationship("Track", back_populates="materials")
    trainer = relationship("User", back_populates="materials")

class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    track_id = Column(Integer, ForeignKey("tracks.id", ondelete="CASCADE"), nullable=False)
    enrolled_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("User", back_populates="enrollments")
    track = relationship("Track", back_populates="enrollments")
