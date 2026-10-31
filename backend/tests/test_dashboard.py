from datetime import datetime, timezone

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from models.lab_report import LabReport
from models.medicine import Medicine
from models.patient import Patient
from models.prescription import Prescription
from models.queue import QueueEntry


def test_admin_dashboard_summary(client: TestClient, admin_token: str, db_session: Session):
    patient = Patient(
        name="Summary Patient",
        age=29,
        gender="Female",
        phone="+91 90000 00001",
        registration_number="REG-SUMMARY-001",
        status="active",
    )
    db_session.add(patient)
    db_session.commit()
    db_session.refresh(patient)

    db_session.add_all([
        QueueEntry(
            patient_id=patient.id,
            queue_number="Q-SUMMARY-001",
            service_type="General Medicine OPD",
            priority="medium",
            priority_score=50,
            status="waiting",
            estimated_wait_time=15,
        ),
        Prescription(
            patient_id=patient.id,
            medicines="[]",
            prescribed_by="Dr. Summary",
            valid_until=datetime(2030, 1, 1, tzinfo=timezone.utc),
            status="pending",
        ),
        LabReport(
            patient_id=patient.id,
            test_name="CBC",
            test_type="Hematology",
            status="pending",
            ordered_by="Dr. Summary",
            priority="routine",
        ),
        Medicine(name="Low Stock Med", current_stock=1, minimum_stock=10),
    ])
    db_session.commit()

    response = client.get("/api/dashboard/", headers={"Authorization": f"Bearer {admin_token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["total_patients"] >= 1
    assert data["active_queue"] >= 1
    assert data["pending_prescriptions"] >= 1
    assert data["pending_lab_orders"] >= 1
    assert data["low_stock_medicines"] >= 1
    assert data["total_medicines"] >= 1
    assert any(
        item["department"] == "General Medicine OPD" for item in data["queue_by_department"]
    )


def test_admin_dashboard_summary_requires_admin(client: TestClient, token: str):
    response = client.get("/api/dashboard/", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 403


def test_medicine_dashboard(client: TestClient, admin_token: str, db_session: Session):
    # Add some medicines
    med1 = Medicine(name="Med 1", current_stock=5, minimum_stock=10) # Low stock
    med2 = Medicine(name="Med 2", current_stock=20, minimum_stock=10)
    db_session.add_all([med1, med2])
    db_session.commit()

    response = client.get(
        "/api/dashboard/medicine",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total_medicines"] >= 2
    assert data["low_stock_items"] >= 1

def test_dashboard_unauthorized(client: TestClient, token: str):
    # Normal user shouldn't access admin dashboard
    response = client.get(
        "/api/dashboard/medicine",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 403
