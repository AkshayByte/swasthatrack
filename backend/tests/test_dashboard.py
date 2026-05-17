from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from models.medicine import Medicine

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
