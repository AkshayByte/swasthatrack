from enum import Enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime, timezone
from database import Base

class UserRole(str, Enum):
    ADMIN = "admin"
    DOCTOR = "doctor"
    PHARMACIST = "pharmacist"
    LAB = "lab"
    REGISTRATION = "registration"
    USER = "user"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    role = Column(String, default=UserRole.USER.value)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
