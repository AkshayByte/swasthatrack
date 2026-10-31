from fastapi.testclient import TestClient

import main


def test_startup_does_not_create_tables_in_production(monkeypatch):
    """Production schema is owned by Alembic; create_all must not run there."""
    monkeypatch.setattr(main, "IS_PRODUCTION", True)

    def fail_if_called():
        raise AssertionError("create_tables() must not run when ENVIRONMENT=production")

    monkeypatch.setattr(main, "create_tables", fail_if_called)

    with TestClient(main.app) as client:
        assert client.get("/").status_code == 200
