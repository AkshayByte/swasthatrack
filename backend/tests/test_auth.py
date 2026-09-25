from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from models.user import User

def test_register_user(client: TestClient, db_session: Session):
    response = client.post(
        "/api/auth/register",
        json={
            "email": "newuser@example.com",
            "password": "newpassword123",
            "full_name": "New User",
            "role": "user"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert "id" in data
    
    # Verify user in database
    user = db_session.query(User).filter(User.email == "newuser@example.com").first()
    assert user is not None
    assert user.full_name == "New User"

def test_register_existing_email(client: TestClient, test_user: User):
    response = client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",  # Already exists
            "password": "password123",
            "full_name": "Duplicate User",
            "role": "user"
        }
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

def test_login_success(client: TestClient, test_user: User):
    response = client.post(
        "/api/auth/login",
        json={
            "email": "test@example.com",
            "password": "testpassword"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_credentials(client: TestClient, test_user: User):
    response = client.post(
        "/api/auth/login",
        json={
            "email": "test@example.com",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"

def test_get_current_user(client: TestClient, token: str):
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"

def test_get_current_user_invalid_token(client: TestClient):
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": "Bearer invalidtoken"}
    )
    assert response.status_code == 401

from unittest.mock import patch

def test_google_login_invalid_token(client: TestClient):
    with patch("google.oauth2.id_token.verify_oauth2_token", side_effect=ValueError("Token expired or malformed")):
        response = client.post(
            "/api/auth/google",
            json={"credential": "invalid_fake_jwt_token"}
        )
        assert response.status_code == 401
        assert "Invalid Google ID token" in response.json()["detail"]

def test_self_register_privilege_escalation_blocked(client: TestClient, db_session: Session):
    # Attempting to inject "role": "admin" during public registration must be ignored
    response = client.post(
        "/api/auth/register",
        json={
            "email": "hacker@example.com",
            "password": "strongpassword123",
            "full_name": "Wannabe Admin",
            "role": "admin"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "user"  # Forced to user role

    user = db_session.query(User).filter(User.email == "hacker@example.com").first()
    assert user.role == "user"

def test_admin_can_create_staff_account(client: TestClient, token: str, test_user: User, db_session: Session):
    # Make test_user admin
    test_user.role = "admin"
    db_session.commit()

    response = client.post(
        "/api/auth/users",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "email": "dr.sharma@swasthatrack.org",
            "password": "DoctorPassword123",
            "full_name": "Dr. Sharma",
            "role": "doctor"
        }
    )
    assert response.status_code == 201
    assert response.json()["role"] == "doctor"

def test_rate_limiting_on_auth_endpoint(client: TestClient):
    from utils.limiter import limiter
    # Temporarily enable rate limiter for this specific verification test
    limiter.enabled = True
    try:
        status_codes = []
        for i in range(12):
            res = client.post(
                "/api/auth/login",
                json={"email": f"ratelimit_{i}@test.com", "password": "wrongpassword"}
            )
            status_codes.append(res.status_code)
        
        # 429 should appear after exceeding the 10/minute limit
        assert 429 in status_codes
    finally:
        limiter.enabled = False
