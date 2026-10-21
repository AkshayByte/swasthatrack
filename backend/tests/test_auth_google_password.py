from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from unittest.mock import patch
from models.user import User
from utils.security import verify_password


def _google_id_info(email: str = "googleuser@example.com", name: str = "Google User", email_verified: bool = True):
    return {
        "email": email,
        "name": name,
        "email_verified": email_verified,
        "sub": "google_sub_12345",
    }


def test_google_login_creates_user_with_unpredictable_password(client: TestClient, db_session: Session):
    """A Google-created user must NOT have a password derived from their email."""
    email = "googleuser@example.com"
    predictable_password = "OAuth_Google_Managed_" + email

    with patch("google.oauth2.id_token.verify_oauth2_token", return_value=_google_id_info(email)):
        response = client.post(
            "/api/auth/google",
            json={"credential": "fake_google_jwt_token"},
        )
    assert response.status_code == 200

    user = db_session.query(User).filter(User.email == email).first()
    assert user is not None
    assert user.hashed_password != ""

    # The predictable password must NOT verify against the stored hash
    assert not verify_password(predictable_password, user.hashed_password)


def test_login_rejects_predictable_google_password(client: TestClient, db_session: Session):
    """POST /api/auth/login must reject the predictable password for a Google-created user."""
    email = "googletest@example.com"
    predictable_password = "OAuth_Google_Managed_" + email

    with patch("google.oauth2.id_token.verify_oauth2_token", return_value=_google_id_info(email)):
        client.post("/api/auth/google", json={"credential": "fake_google_jwt_token"})

    response = client.post(
        "/api/auth/login",
        json={"email": email, "password": predictable_password},
    )
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]


def test_token_rejects_predictable_google_password(client: TestClient, db_session: Session):
    """POST /api/auth/token (OAuth2 form) must reject the predictable password for a Google-created user."""
    email = "googletoken@example.com"
    predictable_password = "OAuth_Google_Managed_" + email

    with patch("google.oauth2.id_token.verify_oauth2_token", return_value=_google_id_info(email)):
        client.post("/api/auth/google", json={"credential": "fake_google_jwt_token"})

    response = client.post(
        "/api/auth/token",
        data={"username": email, "password": predictable_password},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 401
    assert "Incorrect username or password" in response.json()["detail"]


def test_google_login_rejects_unverified_email(client: TestClient, db_session: Session):
    """Google tokens with email_verified=False must be rejected."""
    email = "unverified@example.com"

    with patch("google.oauth2.id_token.verify_oauth2_token", return_value=_google_id_info(email, email_verified=False)):
        response = client.post(
            "/api/auth/google",
            json={"credential": "fake_google_jwt_token"},
        )
    assert response.status_code == 401
    assert "not verified" in response.json()["detail"].lower()
