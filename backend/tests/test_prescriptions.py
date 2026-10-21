import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from models.medicine import Medicine
from models.patient import Patient


@pytest.fixture
def sample_patient(db_session: Session):
    patient = Patient(
        name="Anil Kumar",
        age=42,
        gender="Male",
        phone="+91 99999 11111",
        blood_group="B+",
        registration_number="REG-TEST-001",
        status="active"
    )
    db_session.add(patient)
    db_session.commit()
    db_session.refresh(patient)
    return patient


def test_doctor_can_create_prescription(client: TestClient, doctor_token: str, sample_patient: Patient):
    response = client.post(
        "/api/prescriptions/",
        headers={"Authorization": f"Bearer {doctor_token}"},
        json={
            "patient_id": sample_patient.id,
            "medicines": [
                {"name": "Atorvastatin 20mg", "dosage": "20mg", "frequency": "0-0-1", "duration": "30 days"}
            ],
            "instructions": "Take with dinner",
            "notes": "Hyperlipidemia"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["patient_id"] == sample_patient.id
    assert data["status"] == "pending"
    assert len(data["medicines"]) == 1


def test_unauthorized_user_cannot_create_prescription(client: TestClient, token: str, sample_patient: Patient):
    # Standard user cannot issue prescriptions
    response = client.post(
        "/api/prescriptions/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "patient_id": sample_patient.id,
            "medicines": [{"name": "Aspirin 75mg"}],
        }
    )
    assert response.status_code == 403


def test_pharmacist_can_dispense_prescription(client: TestClient, doctor_token: str, pharmacist_token: str, sample_patient: Patient):
    # 1. Doctor creates prescription
    create_res = client.post(
        "/api/prescriptions/",
        headers={"Authorization": f"Bearer {doctor_token}"},
        json={
            "patient_id": sample_patient.id,
            "medicines": [{"name": "Paracetamol 650mg"}],
            "notes": "Fever"
        }
    )
    assert create_res.status_code == 201
    rx_id = create_res.json()["id"]

    # 2. Pharmacist dispenses prescription
    dispense_res = client.put(
        f"/api/prescriptions/{rx_id}/status",
        headers={"Authorization": f"Bearer {pharmacist_token}"},
        json={"status": "dispensed"}
    )
    assert dispense_res.status_code == 200
    assert dispense_res.json()["status"] == "dispensed"


def test_get_prescriptions_list(client: TestClient, pharmacist_token: str, doctor_token: str, sample_patient: Patient):
    client.post(
        "/api/prescriptions/",
        headers={"Authorization": f"Bearer {doctor_token}"},
        json={"patient_id": sample_patient.id, "medicines": [{"name": "Amoxicillin 500mg"}]}
    )
    response = client.get(
        "/api/prescriptions/",
        headers={"Authorization": f"Bearer {pharmacist_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1

def test_unauthorized_user_cannot_access_individual_or_patient_prescriptions(client: TestClient, token: str, doctor_token: str, sample_patient: Patient):
    res = client.post(
        "/api/prescriptions/",
        headers={"Authorization": f"Bearer {doctor_token}"},
        json={"patient_id": sample_patient.id, "medicines": [{"name": "Amoxicillin 500mg"}]}
    )
    rx_id = res.json()["id"]

    rx_res = client.get(
        f"/api/prescriptions/{rx_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert rx_res.status_code == 403

    patient_res = client.get(
        f"/api/prescriptions/patient/{sample_patient.id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert patient_res.status_code == 403


def test_doctor_can_not_dispense_prescription(client: TestClient, doctor_token: str, sample_patient: Patient):
    """Doctor role must NOT be allowed to change prescription status (only pharmacist + admin)."""
    create_res = client.post(
        "/api/prescriptions/",
        headers={"Authorization": f"Bearer {doctor_token}"},
        json={"patient_id": sample_patient.id, "medicines": [{"name": "Paracetamol 650mg"}]}
    )
    rx_id = create_res.json()["id"]

    response = client.put(
        f"/api/prescriptions/{rx_id}/status",
        headers={"Authorization": f"Bearer {doctor_token}"},
        json={"status": "dispensed"}
    )
    assert response.status_code == 403


def test_illegal_transition_dispensed_to_cancelled(client: TestClient, pharmacist_token: str, doctor_token: str, sample_patient: Patient):
    """After dispensing, status must not transition to cancelled."""
    rx_id = client.post(
        "/api/prescriptions/",
        headers={"Authorization": f"Bearer {doctor_token}"},
        json={"patient_id": sample_patient.id, "medicines": [{"name": "Paracetamol 650mg"}]}
    ).json()["id"]

    client.put(
        f"/api/prescriptions/{rx_id}/status",
        headers={"Authorization": f"Bearer {pharmacist_token}"},
        json={"status": "dispensed"}
    )

    response = client.put(
        f"/api/prescriptions/{rx_id}/status",
        headers={"Authorization": f"Bearer {pharmacist_token}"},
        json={"status": "cancelled"}
    )
    assert response.status_code in (400, 409)


def test_illegal_transition_cancelled_to_dispensed(client: TestClient, pharmacist_token: str, doctor_token: str, sample_patient: Patient):
    """After cancelling, status must not transition to dispensed."""
    rx_id = client.post(
        "/api/prescriptions/",
        headers={"Authorization": f"Bearer {doctor_token}"},
        json={"patient_id": sample_patient.id, "medicines": [{"name": "Paracetamol 650mg"}]}
    ).json()["id"]

    client.put(
        f"/api/prescriptions/{rx_id}/status",
        headers={"Authorization": f"Bearer {pharmacist_token}"},
        json={"status": "cancelled"}
    )

    response = client.put(
        f"/api/prescriptions/{rx_id}/status",
        headers={"Authorization": f"Bearer {pharmacist_token}"},
        json={"status": "dispensed"}
    )
    assert response.status_code in (400, 409)


def test_double_dispense_is_idempotent(client: TestClient, pharmacist_token: str, doctor_token: str, sample_patient: Patient):
    """Dispensing an already-dispensed prescription must not succeed twice."""
    rx_id = client.post(
        "/api/prescriptions/",
        headers={"Authorization": f"Bearer {doctor_token}"},
        json={"patient_id": sample_patient.id, "medicines": [{"name": "Paracetamol 650mg"}]}
    ).json()["id"]

    # First dispense should succeed
    first = client.put(
        f"/api/prescriptions/{rx_id}/status",
        headers={"Authorization": f"Bearer {pharmacist_token}"},
        json={"status": "dispensed"}
    )
    assert first.status_code == 200
    assert first.json()["status"] == "dispensed"

    # Second dispense must fail (idempotent-safe)
    second = client.put(
        f"/api/prescriptions/{rx_id}/status",
        headers={"Authorization": f"Bearer {pharmacist_token}"},
        json={"status": "dispensed"}
    )
    assert second.status_code in (400, 409)


def test_prescribed_by_uses_authenticated_user(client: TestClient, doctor_token: str, sample_patient: Patient):
    """prescribed_by must come from the authenticated user, not client-supplied doctor_name."""
    response = client.post(
        "/api/prescriptions/",
        headers={"Authorization": f"Bearer {doctor_token}"},
        json={
            "patient_id": sample_patient.id,
            "medicines": [{"name": "Aspirin 75mg"}],
            "doctor_name": "Fake Doctor",
            "prescribed_by": "Fake Prescriber",
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["doctor_name"] != "Fake Doctor"
    assert data["doctor_name"] != "Fake Prescriber"
    assert data["doctor_name"]  # Must have the real authenticated user's name


# ─── Task 6: Real inventory deduction ─────────────────────────────────────────

def _create_medicine(db_session: Session, name: str, stock: int):
    med = Medicine(
        name=name,
        generic_name=name,
        manufacturer="Test Labs",
        current_stock=stock,
        minimum_stock=0,
        unit_price=5.0,
        is_active=True,
    )
    db_session.add(med)
    db_session.commit()
    db_session.refresh(med)
    return med


def test_dispense_decrements_stock(client: TestClient, db_session: Session, doctor_token: str, pharmacist_token: str, sample_patient: Patient):
    """Dispensing a prescription must decrement medicine stock in the database."""
    med = _create_medicine(db_session, "Amoxicillin 500mg", stock=10)

    rx = client.post(
        "/api/prescriptions/",
        headers={"Authorization": f"Bearer {doctor_token}"},
        json={"patient_id": sample_patient.id, "medicines": [{"name": med.name, "quantity": 3}]}
    )
    rx_id = rx.json()["id"]

    res = client.put(
        f"/api/prescriptions/{rx_id}/status",
        headers={"Authorization": f"Bearer {pharmacist_token}"},
        json={"status": "dispensed"}
    )
    assert res.status_code == 200

    db_session.expire_all()
    updated = db_session.query(Medicine).filter(Medicine.id == med.id).first()
    assert updated.current_stock == 7  # 10 - 3


def test_dispense_fails_on_insufficient_stock(client: TestClient, db_session: Session, doctor_token: str, pharmacist_token: str, sample_patient: Patient):
    """Dispensing must fail with 409 if stock is insufficient, and not change status."""
    med = _create_medicine(db_session, "Paracetamol 650mg", stock=1)

    rx = client.post(
        "/api/prescriptions/",
        headers={"Authorization": f"Bearer {doctor_token}"},
        json={"patient_id": sample_patient.id, "medicines": [{"name": med.name, "quantity": 3}]}
    )
    rx_id = rx.json()["id"]

    res = client.put(
        f"/api/prescriptions/{rx_id}/status",
        headers={"Authorization": f"Bearer {pharmacist_token}"},
        json={"status": "dispensed"}
    )
    assert res.status_code == 409
    assert "insufficient stock" in res.json()["detail"].lower()

    db_session.expire_all()
    updated = db_session.query(Medicine).filter(Medicine.id == med.id).first()
    assert updated.current_stock == 1


def test_dispense_rejects_expired_medicine(client: TestClient, db_session: Session, doctor_token: str, pharmacist_token: str, sample_patient: Patient):
    """Dispensing must fail with 409 if any medicine is expired."""
    from datetime import date, timedelta
    med = _create_medicine(db_session, "Expired Med", stock=5)
    med.expiry_date = date.today() - timedelta(days=1)
    db_session.commit()

    rx = client.post(
        "/api/prescriptions/",
        headers={"Authorization": f"Bearer {doctor_token}"},
        json={"patient_id": sample_patient.id, "medicines": [{"name": med.name, "quantity": 1}]}
    )
    rx_id = rx.json()["id"]

    res = client.put(
        f"/api/prescriptions/{rx_id}/status",
        headers={"Authorization": f"Bearer {pharmacist_token}"},
        json={"status": "dispensed"}
    )
    assert res.status_code == 409
    assert "expired" in res.json()["detail"].lower()


def test_cancel_does_not_decrement_stock(client: TestClient, db_session: Session, doctor_token: str, pharmacist_token: str, sample_patient: Patient):
    """Cancelling a prescription must NOT decrement stock."""
    med = _create_medicine(db_session, "Ibuprofen 400mg", stock=10)

    rx = client.post(
        "/api/prescriptions/",
        headers={"Authorization": f"Bearer {doctor_token}"},
        json={"patient_id": sample_patient.id, "medicines": [{"name": med.name, "quantity": 2}]}
    )
    rx_id = rx.json()["id"]

    res = client.put(
        f"/api/prescriptions/{rx_id}/status",
        headers={"Authorization": f"Bearer {pharmacist_token}"},
        json={"status": "cancelled"}
    )
    assert res.status_code == 200

    db_session.expire_all()
    updated = db_session.query(Medicine).filter(Medicine.id == med.id).first()
    assert updated.current_stock == 10  # Unchanged


def test_double_dispense_rolls_back_stock(client: TestClient, db_session: Session, doctor_token: str, pharmacist_token: str, sample_patient: Patient):
    """Second dispense attempt must not further decrement stock (idempotent-safe)."""
    med = _create_medicine(db_session, "Vitamin C 500mg", stock=5)

    rx = client.post(
        "/api/prescriptions/",
        headers={"Authorization": f"Bearer {doctor_token}"},
        json={"patient_id": sample_patient.id, "medicines": [{"name": med.name, "quantity": 2}]}
    )
    rx_id = rx.json()["id"]

    first = client.put(
        f"/api/prescriptions/{rx_id}/status",
        headers={"Authorization": f"Bearer {pharmacist_token}"},
        json={"status": "dispensed"}
    )
    assert first.status_code == 200

    second = client.put(
        f"/api/prescriptions/{rx_id}/status",
        headers={"Authorization": f"Bearer {pharmacist_token}"},
        json={"status": "dispensed"}
    )
    assert second.status_code == 409

    db_session.expire_all()
    updated = db_session.query(Medicine).filter(Medicine.id == med.id).first()
    assert updated.current_stock == 3  # 5 - 2, not 5 - 4
