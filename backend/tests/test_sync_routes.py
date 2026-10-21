import inspect

from routes.auth import get_current_user, google_login, login, login_for_access_token
from routes.prescriptions import update_prescription_status
from routes.queue import perform_ai_triage


def test_get_current_user_is_sync():
    """get_current_user must be sync (blocking DB/bcrypt) so FastAPI runs it in a threadpool."""
    assert not inspect.iscoroutinefunction(get_current_user)


def test_login_is_sync():
    """login must be sync (blocking DB/bcrypt) so FastAPI runs it in a threadpool."""
    assert not inspect.iscoroutinefunction(login)


def test_google_login_is_sync():
    """google_login must be sync (blocking DB/bcrypt) so FastAPI runs it in a threadpool."""
    assert not inspect.iscoroutinefunction(google_login)


def test_token_is_sync():
    """login_for_access_token (/token) must be sync (blocking DB/bcrypt)."""
    assert not inspect.iscoroutinefunction(login_for_access_token)


def test_ai_triage_route_remains_async():
    """perform_ai_triage should stay async (it awaits the Gemini API client)."""
    assert inspect.iscoroutinefunction(perform_ai_triage)


def test_prescription_update_is_sync():
    """Prescription status update is blocking DB work — should be sync."""
    assert not inspect.iscoroutinefunction(update_prescription_status)
