import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
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
