import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from models.audit_log import AuditLog
from models.patient import Patient


@pytest.fixture
def sample_patient(db_session: Session):
    patient = Patient(
        name="Audit Test Patient",
        age=35,
        gender="Female",
        phone="+918888833333",
        registration_number="REG-AUDIT-001",
        status="active",
    )
    db_session.add(patient)
    db_session.commit()
    db_session.refresh(patient)
    return patient


def test_audit_log_created_on_patient_create(client: TestClient, admin_token: str, db_session: Session):
    """Creating a patient via API should create an audit_log entry."""
    res = client.post(
        "/api/patients/",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={
            "name": "Audit Create Patient",
            "age": 45,
            "gender": "Male",
            "phone": "+917777788888",
            "registration_number": "REG-AUDIT-003",
        },
    )
    assert res.status_code == 201

    logs = (
        db_session.query(AuditLog)
        .filter(
            AuditLog.resource_type == "patient",
            AuditLog.action == "create",
        )
        .all()
    )
    assert len(logs) >= 1
    assert any(l.role == "admin" for l in logs)


def test_audit_log_created_on_prescription_status_update(
    client: TestClient,
    doctor_token: str,
    pharmacist_token: str,
    db_session: Session,
    sample_patient: Patient,
):
    """Updating prescription status should create an audit_log entry."""
    res = client.post(
        "/api/prescriptions/",
        headers={"Authorization": f"Bearer {doctor_token}"},
        json={"patient_id": sample_patient.id, "medicines": [{"name": "Aspirin 75mg"}]},
    )
    rx_id = res.json()["id"]

    client.put(
        f"/api/prescriptions/{rx_id}/status",
        headers={"Authorization": f"Bearer {pharmacist_token}"},
        json={"status": "dispensed"},
    )

    logs = (
        db_session.query(AuditLog)
        .filter(
            AuditLog.resource_type == "prescription",
            AuditLog.action == "update",
        )
        .all()
    )
    assert len(logs) >= 1


def test_audit_log_records_user_and_role(client: TestClient, admin_token: str, db_session: Session):
    """Audit log entries must record user_id and role."""
    res = client.post(
        "/api/patients/",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={
            "name": "Audit User Test",
            "age": 50,
            "gender": "Male",
            "phone": "+917777766666",
            "registration_number": "REG-AUDIT-002",
        },
    )
    assert res.status_code == 201

    log = (
        db_session.query(AuditLog)
        .filter(
            AuditLog.resource_type == "patient",
            AuditLog.resource_id == str(res.json()["id"]),
        )
        .first()
    )
    assert log is not None
    assert log.role == "admin"
    assert log.action == "create"


def test_audit_log_read_operations(client: TestClient, admin_token: str, db_session: Session, sample_patient: Patient):
    """Reading a patient should create an audit_log read entry."""
    client.get(
        "/api/patients/",
        headers={"Authorization": f"Bearer {admin_token}"},
    )

    logs = db_session.query(AuditLog).filter(AuditLog.action == "read").all()
    assert len(logs) >= 1


def test_audit_log_delete_operation(client: TestClient, admin_token: str, db_session: Session, sample_patient: Patient):
    """Deleting a patient should create an audit_log delete entry."""
    client.delete(
        f"/api/patients/{sample_patient.id}",
        headers={"Authorization": f"Bearer {admin_token}"},
    )

    log = (
        db_session.query(AuditLog)
        .filter(
            AuditLog.resource_type == "patient",
            AuditLog.action == "delete",
        )
        .first()
    )
    assert log is not None
    assert log.resource_id == str(sample_patient.id)
