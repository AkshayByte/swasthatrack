import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from models.patient import Patient


@pytest.fixture
def sample_patient(db_session: Session):
    patient = Patient(
        name="Meera Nair",
        age=36,
        gender="Female",
        phone="+91 99999 22222",
        blood_group="O+",
        registration_number="REG-TEST-002",
        status="active"
    )
    db_session.add(patient)
    db_session.commit()
    db_session.refresh(patient)
    return patient


def test_doctor_can_create_lab_order(client: TestClient, doctor_token: str, sample_patient: Patient):
    response = client.post(
        "/api/lab-orders/",
        headers={"Authorization": f"Bearer {doctor_token}"},
        json={
            "patient_id": sample_patient.id,
            "test_name": "Complete Blood Count (CBC)",
            "category": "Hematology",
            "priority": "urgent"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["test_name"] == "Complete Blood Count (CBC)"
    assert data["status"] == "pending"


def test_unauthorized_user_cannot_create_lab_order(client: TestClient, token: str, sample_patient: Patient):
    response = client.post(
        "/api/lab-orders/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "patient_id": sample_patient.id,
            "test_name": "Lipid Profile"
        }
    )
    assert response.status_code == 403


def test_lab_tech_can_update_status_and_results(client: TestClient, doctor_token: str, lab_token: str, sample_patient: Patient):
    # 1. Doctor creates order
    create_res = client.post(
        "/api/lab-orders/",
        headers={"Authorization": f"Bearer {doctor_token}"},
        json={
            "patient_id": sample_patient.id,
            "test_name": "Blood Glucose Fasting",
            "category": "Biochemistry"
        }
    )
    assert create_res.status_code == 201
    order_id = create_res.json()["id"]

    # 2. Lab technician records results and marks completed
    update_res = client.put(
        f"/api/lab-orders/{order_id}/status",
        headers={"Authorization": f"Bearer {lab_token}"},
        json={
            "status": "completed",
            "results": "Fasting Blood Sugar: 95 mg/dL (Normal: 70-99 mg/dL)"
        }
    )
    assert update_res.status_code == 200
    data = update_res.json()
    assert data["status"] == "completed"
    assert "95 mg/dL" in data["results"]


def test_get_lab_orders_list(client: TestClient, lab_token: str, doctor_token: str, sample_patient: Patient):
    client.post(
        "/api/lab-orders/",
        headers={"Authorization": f"Bearer {doctor_token}"},
        json={"patient_id": sample_patient.id, "test_name": "Serum Creatinine"}
    )
    response = client.get(
        "/api/lab-orders/",
        headers={"Authorization": f"Bearer {lab_token}"}
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 1

def test_unauthorized_user_cannot_access_individual_or_patient_lab_orders(client: TestClient, token: str, doctor_token: str, sample_patient: Patient):
    res = client.post(
        "/api/lab-orders/",
        headers={"Authorization": f"Bearer {doctor_token}"},
        json={"patient_id": sample_patient.id, "test_name": "Serum Creatinine"}
    )
    order_id = res.json()["id"]

    order_res = client.get(
        f"/api/lab-orders/{order_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert order_res.status_code == 403

    patient_res = client.get(
        f"/api/lab-orders/patient/{sample_patient.id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert patient_res.status_code == 403
