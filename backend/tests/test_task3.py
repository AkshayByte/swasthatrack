import re

import pytest
from fastapi.testclient import TestClient

# ─── (a) CORS regex only matches swasthatrack project ────────────────────────

SWASTHATRACK_CORS_REGEX = r"https:\/\/(swasthatrack|swasthatrack-.*)\.vercel\.app"


@pytest.mark.parametrize("origin", [
    "https://swasthatrack.vercel.app",
    "https://swasthatrack-git-main--abc123.vercel.app",
    "https://swasthatrack-abcd1234.vercel.app",
])
def test_cors_allows_swasthatrack_origins(origin):
    assert re.match(SWASTHATRACK_CORS_REGEX, origin), f"{origin} should match"


@pytest.mark.parametrize("origin", [
    "https://evil-hack.vercel.app",
    "https://notswasthatrack.vercel.app",
    "https://hijackswasthatrack.vercel.app",
    "https://swasthatrackphish.vercel.app",
    "https://x.swasthatrack.vercel.app",
    "http://evil.com",
])
def test_cors_blocks_non_swasthatrack_origins(origin):
    assert not re.match(SWASTHATRACK_CORS_REGEX, origin), f"{origin} should NOT match"


def test_cors_response_rejects_non_matching_origin(client: TestClient):
    """A non-matching Vercel origin must not receive Access-Control-Allow-Origin."""
    response = client.options(
        "/api/auth/login",
        headers={
            "Origin": "https://evil-hack.vercel.app",
            "Access-Control-Request-Method": "POST",
        },
    )
    assert "access-control-allow-origin" not in {k.lower() for k in response.headers}


def test_cors_response_allows_swasthatrack_origin(client: TestClient):
    """A matching Vercel preview origin should receive Access-Control-Allow-Origin."""
    response = client.options(
        "/api/auth/login",
        headers={
            "Origin": "https://swasthatrack-git-main--abc123.vercel.app",
            "Access-Control-Request-Method": "POST",
        },
    )
    assert response.headers.get("access-control-allow-origin") == "https://swasthatrack-git-main--abc123.vercel.app"


# ─── (c) seed.py password resolution ─────────────────────────────────────────

def test_seed_resolve_password_from_env(monkeypatch):
    """SEED_ADMIN_PASSWORD env var should be used when set."""
    monkeypatch.setenv("SEED_ADMIN_PASSWORD", "MySecurePassword123!")
    from seed import resolve_seed_password
    assert resolve_seed_password("admin") == "MySecurePassword123!"


def test_seed_resolve_password_random_when_unset(monkeypatch):
    """When env var is unset, a random password must be generated."""
    monkeypatch.delenv("SEED_ADMIN_PASSWORD", raising=False)
    from seed import resolve_seed_password
    pwd1 = resolve_seed_password("admin")
    pwd2 = resolve_seed_password("admin")
    assert pwd1 != pwd2  # Each call generates a new random password
    assert len(pwd1) >= 16  # Sufficiently long


def test_seed_resolve_password_all_roles(monkeypatch):
    """All staff roles should support env-var overrides."""
    from seed import resolve_seed_password
    for role in ["admin", "doctor", "pharmacist", "lab", "registration"]:
        env_key = f"SEED_{role.upper()}_PASSWORD"
        monkeypatch.setenv(env_key, f"Password4{role}!")
        assert resolve_seed_password(role) == f"Password4{role}!"
        monkeypatch.delenv(env_key)
