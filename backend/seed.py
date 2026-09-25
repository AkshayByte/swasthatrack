"""
Seed script — Creates clinical staff accounts, sample patients, live OPD queue,
and pharmacy inventory in the database.

Usage:
    cd backend
    python seed.py

Idempotent: Skips records that already exist.
"""

import sys
import os
import json
from datetime import date, datetime, timezone, timedelta

# Ensure backend package is importable
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, create_tables
from models.user import User
from models.patient import Patient
from models.queue import QueueEntry
from models.medicine import Medicine
from models.prescription import Prescription
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

SAMPLE_PATIENTS = [
    {
        "name": "Rajesh Sharma",
        "age": 45,
        "gender": "Male",
        "phone": "+91 98765 43210",
        "email": "rajesh.sharma@example.com",
        "address": "B-402, Shanti Heights, Mumbai",
        "emergency_contact": "+91 98765 43211",
        "blood_group": "B+",
        "allergies": ["Penicillin", "Sulfa Drugs"],
        "medical_history": ["Hypertension", "Mild Asthma"],
        "registration_number": "PAT-2026-001",
        "status": "active",
    },
    {
        "name": "Anita Patel",
        "age": 32,
        "gender": "Female",
        "phone": "+91 98111 22334",
        "email": "anita.patel@example.com",
        "address": "12, Lotus Enclave, Ahmedabad",
        "emergency_contact": "+91 98111 22335",
        "blood_group": "O+",
        "allergies": [],
        "medical_history": ["Type-2 Diabetes"],
        "registration_number": "PAT-2026-002",
        "status": "active",
    },
    {
        "name": "Mohan Lal Verma",
        "age": 58,
        "gender": "Male",
        "phone": "+91 97222 33445",
        "email": "mohan.verma@example.com",
        "address": "Flat 3A, Green Valley, Jaipur",
        "emergency_contact": "+91 97222 33446",
        "blood_group": "A+",
        "allergies": ["Aspirin"],
        "medical_history": ["Ischemic Heart Disease"],
        "registration_number": "PAT-2026-003",
        "status": "active",
    },
]

SAMPLE_QUEUE = [
    {
        "patient_reg": "PAT-2026-001",
        "queue_number": "Q-101",
        "service_type": "Cardiology OPD",
        "priority": "high",
        "status": "waiting",
        "notes": "Substernal chest tightness radiating to left shoulder on exertion",
        "estimated_wait_time": 15,
    },
    {
        "patient_reg": "PAT-2026-002",
        "queue_number": "Q-102",
        "service_type": "Endocrinology OPD",
        "priority": "medium",
        "status": "waiting",
        "notes": "Elevated fasting blood sugar (164 mg/dL), polyuria and fatigue",
        "estimated_wait_time": 25,
    },
    {
        "patient_reg": "PAT-2026-003",
        "queue_number": "Q-103",
        "service_type": "General Medicine",
        "priority": "emergency",
        "status": "waiting",
        "notes": "Severe dizziness, BP 170/105 mmHg, blurred vision",
        "estimated_wait_time": 0,
    },
]

SAMPLE_MEDICINES = [
    {
        "name": "Paracetamol 650mg",
        "generic_name": "Acetaminophen",
        "description": "Antipyretic and mild analgesic for fever and acute pain relief",
        "manufacturer": "Cipla Ltd",
        "current_stock": 450,
        "minimum_stock": 100,
        "maximum_stock": 1000,
        "unit_price": 2.50,
        "expiry_date": date(2027, 12, 31),
        "category": "Analgesics",
    },
    {
        "name": "Atorvastatin 20mg",
        "generic_name": "Atorvastatin Calcium",
        "description": "Lipid-lowering agent for hypercholesterolemia and cardiovascular prevention",
        "manufacturer": "Sun Pharma",
        "current_stock": 180,
        "minimum_stock": 50,
        "maximum_stock": 500,
        "unit_price": 12.00,
        "expiry_date": date(2026, 11, 30),
        "category": "Cardiovascular",
    },
    {
        "name": "Aspirin 75mg",
        "generic_name": "Acetylsalicylic Acid",
        "description": "Antiplatelet aggregation inhibitor for acute coronary syndrome",
        "manufacturer": "Bayer India",
        "current_stock": 520,
        "minimum_stock": 100,
        "maximum_stock": 1000,
        "unit_price": 1.75,
        "expiry_date": date(2028, 6, 30),
        "category": "Cardiovascular",
    },
    {
        "name": "Metoprolol 25mg",
        "generic_name": "Metoprolol Succinate",
        "description": "Selective beta-1 blocker for hypertension and angina prophylaxis",
        "manufacturer": "AstraZeneca",
        "current_stock": 140,
        "minimum_stock": 40,
        "maximum_stock": 400,
        "unit_price": 8.50,
        "expiry_date": date(2027, 9, 30),
        "category": "Cardiovascular",
    },
    {
        "name": "Metformin 500mg",
        "generic_name": "Metformin Hydrochloride",
        "description": "Biguanide antihyperglycemic agent for Type-2 Diabetes Mellitus",
        "manufacturer": "USV Pvt Ltd",
        "current_stock": 280,
        "minimum_stock": 80,
        "maximum_stock": 800,
        "unit_price": 3.20,
        "expiry_date": date(2028, 3, 31),
        "category": "Antidiabetic",
    },
    {
        "name": "Amoxicillin 500mg",
        "generic_name": "Amoxicillin Trihydrate",
        "description": "Broad-spectrum beta-lactam antibiotic for bacterial infections",
        "manufacturer": "GlaxoSmithKline",
        "current_stock": 190,
        "minimum_stock": 60,
        "maximum_stock": 600,
        "unit_price": 9.00,
        "expiry_date": date(2027, 8, 31),
        "category": "Antibiotics",
    },
]


def seed():
    create_tables()
    db = SessionLocal()
    try:
        # 1. Staff Accounts
        for account in STAFF_ACCOUNTS:
            existing = db.query(User).filter(User.email == account["email"]).first()
            if not existing:
                user = User(
                    email=account["email"],
                    hashed_password=get_password_hash(account["password"]),
                    full_name=account["full_name"],
                    role=account["role"],
                    is_active=True,
                )
                db.add(user)
        db.commit()

        # 2. Patients
        patient_map = {}
        for p_data in SAMPLE_PATIENTS:
            existing = db.query(Patient).filter(Patient.registration_number == p_data["registration_number"]).first()
            if not existing:
                p = Patient(
                    name=p_data["name"],
                    age=p_data["age"],
                    gender=p_data["gender"],
                    phone=p_data["phone"],
                    email=p_data["email"],
                    address=p_data["address"],
                    emergency_contact=p_data["emergency_contact"],
                    blood_group=p_data["blood_group"],
                    allergies=json.dumps(p_data["allergies"]),
                    medical_history=json.dumps(p_data["medical_history"]),
                    registration_number=p_data["registration_number"],
                    status=p_data["status"],
                )
                db.add(p)
                db.commit()
                db.refresh(p)
                patient_map[p_data["registration_number"]] = p.id
            else:
                patient_map[p_data["registration_number"]] = existing.id

        # 3. Queue Entries
        for q_data in SAMPLE_QUEUE:
            pid = patient_map.get(q_data["patient_reg"])
            if not pid:
                continue
            existing = db.query(QueueEntry).filter(QueueEntry.queue_number == q_data["queue_number"]).first()
            if not existing:
                q = QueueEntry(
                    patient_id=pid,
                    queue_number=q_data["queue_number"],
                    service_type=q_data["service_type"],
                    priority=q_data["priority"],
                    status=q_data["status"],
                    notes=q_data["notes"],
                    estimated_wait_time=q_data["estimated_wait_time"],
                )
                db.add(q)
        db.commit()

        # 4. Medicines
        for m_data in SAMPLE_MEDICINES:
            existing = db.query(Medicine).filter(Medicine.name == m_data["name"]).first()
            if not existing:
                m = Medicine(**m_data)
                db.add(m)
        db.commit()

        # 5. Sample Prescription (for Pharmacy live demo)
        rajesh_id = patient_map.get("PAT-2026-001")
        if rajesh_id:
            existing_rx = db.query(Prescription).filter(Prescription.patient_id == rajesh_id).first()
            if not existing_rx:
                rx = Prescription(
                    patient_id=rajesh_id,
                    medicines=json.dumps([
                        {"name": "Atorvastatin 20mg", "dosage": "20mg", "frequency": "0-0-1 (Bedtime)", "duration": "30 days", "instructions": "Post dinner"},
                        {"name": "Aspirin 75mg", "dosage": "75mg", "frequency": "0-1-0 (After Lunch)", "duration": "30 days", "instructions": "With water"},
                    ]),
                    instructions="Take regular medications and report immediately if chest tightness recurs.",
                    prescribed_by="Dr. Vikram Sethi, MD",
                    valid_until=datetime.now(timezone.utc) + timedelta(days=30),
                    status="active",
                    notes="Acute Exertional Angina / Hypertensive Urgency"
                )
                db.add(rx)
                db.commit()

        print("Done. Seeded clinical staff, patients, live OPD queue, and pharmacy inventory successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    print("Seeding SwasthaTrack clinical staff, patients, queue, and pharmacy...\n")
    seed()
