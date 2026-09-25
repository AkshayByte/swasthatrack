"""
Seed script — Creates the 5 clinical staff accounts in the database.

Usage:
    cd backend
    python seed.py

Idempotent: Skips accounts that already exist (matched by email).
"""

import sys
import os

# Ensure backend package is importable
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, create_tables
from models.user import User
from utils.security import get_password_hash


STAFF_ACCOUNTS = [
    {
        "email": "admin@swasthatrack.org",
        "password": "Admin@1234",
        "full_name": "Dr. Alok Verma",
        "role": "admin",
    },
    {
        "email": "doctor@swasthatrack.org",
        "password": "Doctor@1234",
        "full_name": "Dr. Vikram Sethi",
        "role": "doctor",
    },
    {
        "email": "pharmacy@swasthatrack.org",
        "password": "Pharma@1234",
        "full_name": "Sunil Verma",
        "role": "pharmacist",
    },
    {
        "email": "lab@swasthatrack.org",
        "password": "Lab@12345",
        "full_name": "Dr. Meenakshi Iyer",
        "role": "lab",
    },
    {
        "email": "reception@swasthatrack.org",
        "password": "Recep@1234",
        "full_name": "Pooja Deshmukh",
        "role": "registration",
    },
]


def seed():
    create_tables()
    db = SessionLocal()
    try:
        created = 0
        skipped = 0
        for account in STAFF_ACCOUNTS:
            existing = db.query(User).filter(User.email == account["email"]).first()
            if existing:
                print(f"  * Already exists: {account['email']} ({account['role']})")
                skipped += 1
                continue

            user = User(
                email=account["email"],
                hashed_password=get_password_hash(account["password"]),
                full_name=account["full_name"],
                role=account["role"],
                is_active=True,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"  + Created: {account['email']} ({account['role']}) -> id={user.id}")
            created += 1

        print(f"\nDone. Created: {created}, Skipped (already exist): {skipped}")
    finally:
        db.close()


if __name__ == "__main__":
    print("Seeding SwasthaTrack clinical staff accounts...\n")
    seed()
