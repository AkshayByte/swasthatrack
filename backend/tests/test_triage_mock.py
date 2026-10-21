import json

import httpx
import pytest

from schemas.queue import TriageRequest, TriageResponse, VitalsInput
from utils.gemini_triage import (
    _get_shared_client,
    _heuristic_triage,
    analyze_clinical_triage,
)
from utils.triage_thresholds import (
    EMERGENCY_SCORE_MIN,
    HIGH_SCORE_MIN,
    MEDIUM_SCORE_MIN,
)

# ─── Helpers ──────────────────────────────────────────────────────────────


def _make_gemini_response(payload: dict) -> dict:
    """Build a Gemini API JSON response wrapping the triage dict as text."""
    text = json.dumps(payload)
    return {"candidates": [{"content": {"parts": [{"text": text}]}}]}


def _mock_transport(response_handler, status_code=200):
    """Create an httpx.MockTransport from a callable or fixed response."""

    def handler(request: httpx.Request) -> httpx.Response:
        if callable(response_handler):
            return response_handler(request)
        return httpx.Response(status_code, json=response_handler)

    return httpx.MockTransport(handler)


async def _run_with_mock_gkei(mock_transport, request: TriageRequest) -> TriageResponse:
    """Replace the shared client's transport with a mock and run analyze."""
    client = _get_shared_client()
    original_transport = client._transport
    client._transport = mock_transport
    try:
        result = await analyze_clinical_triage(request)
    finally:
        client._transport = original_transport
    return result


# ─── Heuristic-only tests (no Gemini configured) ──────────────────────────


@pytest.mark.asyncio
async def test_no_api_key_uses_heuristic(monkeypatch):
    """When GEMINI_API_KEY is empty, heuristic is used."""
    monkeypatch.setattr("utils.gemini_triage.GEMINI_API_KEY", "")
    monkeypatch.setattr("utils.gemini_triage.GEMINI_MODEL", "gemini-3.8-flash")
    req = TriageRequest(symptoms="Routine checkup, feeling fine", vitals=None, age=30)
    result = await analyze_clinical_triage(req)
    assert result.source == "heuristic_fallback"


@pytest.mark.asyncio
async def test_no_model_uses_heuristic(monkeypatch):
    """When GEMINI_MODEL is empty, heuristic is used."""
    monkeypatch.setattr("utils.gemini_triage.GEMINI_API_KEY", "fake-key")
    monkeypatch.setattr("utils.gemini_triage.GEMINI_MODEL", "")
    req = TriageRequest(symptoms="Routine checkup, feeling fine", vitals=None, age=30)
    result = await analyze_clinical_triage(req)
    assert result.source == "heuristic_fallback"


# ─── Negation tests ────────────────────────────────────────────────────────


@pytest.mark.asyncio
async def test_negation_chest_pain_does_not_trigger_emergency(monkeypatch):
    """'no chest pain' must not trigger an emergency."""
    monkeypatch.setattr("utils.gemini_triage.GEMINI_API_KEY", "")
    monkeypatch.setattr("utils.gemini_triage.GEMINI_MODEL", "gemini-3.8-flash")
    req = TriageRequest(
        symptoms="Patient has no chest pain, just heartburn after eating spicy food",
        vitals=VitalsInput(temperature_f=98.6, heart_rate_bpm=75, blood_pressure="120/80", spo2_percent=98.0),
        age=45,
    )
    result = _heuristic_triage(req)
    assert result.urgency != "emergency"
    assert result.priority_score < EMERGENCY_SCORE_MIN


@pytest.mark.asyncio
async def test_negation_asthma_history_does_not_trigger(monkeypatch):
    """'history of asthma' must not trigger a high-urgency asthma escalation."""
    monkeypatch.setattr("utils.gemini_triage.GEMINI_API_KEY", "")
    monkeypatch.setattr("utils.gemini_triage.GEMINI_MODEL", "gemini-3.8-flash")
    req = TriageRequest(
        symptoms="Patient has a history of asthma but currently no wheezing or breathing issues",
        vitals=VitalsInput(temperature_f=98.6, heart_rate_bpm=75, blood_pressure="120/80", spo2_percent=98.0),
        age=40,
    )
    result = _heuristic_triage(req)
    # Should not be "high" from asthma trigger alone
    assert result.urgency != "high" or result.priority_score < HIGH_SCORE_MIN


@pytest.mark.asyncio
async def test_heat_stroke_negation(monkeypatch):
    """'heat stroke' mention without actual heat stroke symptoms should not auto-trigger emergency."""
    monkeypatch.setattr("utils.gemini_triage.GEMINI_API_KEY", "")
    monkeypatch.setattr("utils.gemini_triage.GEMINI_MODEL", "gemini-3.8-flash")
    req = TriageRequest(
        symptoms="No heat stroke symptoms, patient is comfortable",
        vitals=VitalsInput(temperature_f=98.6, heart_rate_bpm=75, blood_pressure="120/80", spo2_percent=98.0),
        age=30,
    )
    result = _heuristic_triage(req)
    assert result.urgency != "emergency"


# ─── Priority score clamping ───────────────────────────────────────────────


@pytest.mark.asyncio
async def test_priority_score_clamped_to_band(monkeypatch):
    """If Gemini returns a score outside the urgency band, it must be clamped."""
    monkeypatch.setattr("utils.gemini_triage.GEMINI_API_KEY", "fake-key")
    monkeypatch.setattr("utils.gemini_triage.GEMINI_MODEL", "gemini-3.8-flash")

    # Gemini returns urgency=emergency but priority_score=5 (outside 90-100 band)
    bad_payload = _make_gemini_response(
        {
            "urgency": "emergency",
            "priority_score": 5,
            "recommended_department": "Emergency",
            "estimated_wait_minutes": 0,
            "diagnostic_indicators": [],
            "reasoning": "test",
        }
    )
    transport = _mock_transport(bad_payload)

    req = TriageRequest(symptoms="Chest pain", vitals=None)
    result = await _run_with_mock_gkei(transport, req)
    # The triage should fall back to heuristic on invalid urgency
    assert result.urgency in ["emergency", "high", "medium", "low"]
    assert result.priority_score >= EMERGENCY_SCORE_MIN
    assert result.priority_score <= 100


@pytest.mark.asyncio
async def test_higher_urgency_wins(monkeypatch):
    """When heuristic says 'medium' but Gemini says 'emergency', emergency wins."""
    monkeypatch.setattr("utils.gemini_triage.GEMINI_API_KEY", "fake-key")
    monkeypatch.setattr("utils.gemini_triage.GEMINI_MODEL", "gemini-3.8-flash")

    gemini_payload = _make_gemini_response(
        {
            "urgency": "emergency",
            "priority_score": 95,
            "recommended_department": "Emergency",
            "estimated_wait_minutes": 0,
            "diagnostic_indicators": ["test"],
            "reasoning": "gemini says emergency",
        }
    )
    transport = _mock_transport(gemini_payload)

    # Heuristic should return "low" for this symptom
    req = TriageRequest(symptoms="Annual physical exam, blood pressure check", vitals=None, age=30)

    heuristic_result = _heuristic_triage(req)
    assert heuristic_result.urgency == "low"

    result = await _run_with_mock_gkei(transport, req)
    assert result.urgency == "emergency"
    assert result.priority_score >= EMERGENCY_SCORE_MIN


# ─── Mocked Gemini API tests ──────────────────────────────────────────────


@pytest.mark.asyncio
async def test_gemini_success(monkeypatch):
    """Gemini returns valid JSON → response has source='gemini'."""
    monkeypatch.setattr("utils.gemini_triage.GEMINI_API_KEY", "fake-key")
    monkeypatch.setattr("utils.gemini_triage.GEMINI_MODEL", "gemini-3.8-flash")

    payload = _make_gemini_response(
        {
            "urgency": "medium",
            "priority_score": 55,
            "recommended_department": "General Medicine OPD",
            "estimated_wait_minutes": 20,
            "diagnostic_indicators": ["sore throat"],
            "reasoning": "Mild sore throat, stable vitals.",
        }
    )
    transport = _mock_transport(payload)

    req = TriageRequest(symptoms="Sore throat for 2 days", vitals=None, age=25)
    result = await _run_with_mock_gkei(transport, req)
    assert result.source == "gemini"
    assert result.urgency == "medium"
    assert result.priority_score == 55


@pytest.mark.asyncio
async def test_gemini_429_falls_back_to_heuristic(monkeypatch):
    """HTTP 429 from Gemini → falls back to heuristic."""
    monkeypatch.setattr("utils.gemini_triage.GEMINI_API_KEY", "fake-key")
    monkeypatch.setattr("utils.gemini_triage.GEMINI_MODEL", "gemini-3.8-flash")

    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(429, json={"error": "rate limit exceeded"})

    transport = _mock_transport(handler)

    req = TriageRequest(symptoms="Chest pain radiating to jaw, sweating", vitals=None, age=60)
    result = await _run_with_mock_gkei(transport, req)
    assert result.source == "heuristic_fallback"
    assert result.urgency == "emergency"


@pytest.mark.asyncio
async def test_gemini_timeout_falls_back_to_heuristic(monkeypatch):
    """Timeout from Gemini → falls back to heuristic."""
    monkeypatch.setattr("utils.gemini_triage.GEMINI_API_KEY", "fake-key")
    monkeypatch.setattr("utils.gemini_triage.GEMINI_MODEL", "gemini-3.8-flash")

    def handler(request: httpx.Request) -> httpx.Response:
        raise httpx.TimeoutException("Connection timed out")

    transport = _mock_transport(handler)

    req = TriageRequest(symptoms="Severe headache, nausea", vitals=None, age=35)
    result = await _run_with_mock_gkei(transport, req)
    assert result.source == "heuristic_fallback"


@pytest.mark.asyncio
async def test_gemini_invalid_json_falls_back(monkeypatch):
    """Invalid JSON response from Gemini → falls back to heuristic."""
    monkeypatch.setattr("utils.gemini_triage.GEMINI_API_KEY", "fake-key")
    monkeypatch.setattr("utils.gemini_triage.GEMINI_MODEL", "gemini-3.8-flash")

    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(200, content="This is not valid JSON {[{")

    transport = _mock_transport(handler)

    req = TriageRequest(symptoms="Routine checkup", vitals=None, age=50)
    result = await _run_with_mock_gkei(transport, req)
    assert result.source == "heuristic_fallback"


@pytest.mark.asyncio
async def test_gemini_invalid_urgency_defaults_to_medium(monkeypatch):
    """Gemini returns invalid urgency → clamped to medium."""
    monkeypatch.setattr("utils.gemini_triage.GEMINI_API_KEY", "fake-key")
    monkeypatch.setattr("utils.gemini_triage.GEMINI_MODEL", "gemini-3.8-flash")

    payload = _make_gemini_response(
        {
            "urgency": "critical",  # invalid — not in the allowed set
            "priority_score": 75,
            "recommended_department": "Emergency",
            "estimated_wait_minutes": 5,
            "diagnostic_indicators": [],
            "reasoning": "gemini says critical",
        }
    )
    transport = _mock_transport(payload)

    req = TriageRequest(symptoms="Mild cough", vitals=None, age=25)
    result = await _run_with_mock_gkei(transport, req)
    assert result.source == "gemini"
    assert result.urgency == "medium"
    # Score should be clamped to medium band (40-69)
    assert result.priority_score >= MEDIUM_SCORE_MIN
    assert result.priority_score <= 69


# ─── Heart rate < 50 escalation ───────────────────────────────────────────


@pytest.mark.asyncio
async def test_bradycardia_triggers_high_urgency(monkeypatch):
    """Heart rate below 50 should escalate urgency."""
    monkeypatch.setattr("utils.gemini_triage.GEMINI_API_KEY", "")
    monkeypatch.setattr("utils.gemini_triage.GEMINI_MODEL", "gemini-3.8-flash")

    req = TriageRequest(
        symptoms="Feeling dizzy and weak",
        vitals=VitalsInput(temperature_f=98.6, heart_rate_bpm=45, blood_pressure="110/70", spo2_percent=97.0),
        age=70,
    )
    result = _heuristic_triage(req)
    assert result.urgency == "high"
    assert result.priority_score >= HIGH_SCORE_MIN


@pytest.mark.asyncio
async def test_pediatric_age_band_handled(monkeypatch):
    """Pediatric patients should be handled without crashing."""
    monkeypatch.setattr("utils.gemini_triage.GEMINI_API_KEY", "")
    monkeypatch.setattr("utils.gemini_triage.GEMINI_MODEL", "gemini-3.8-flash")

    req = TriageRequest(
        symptoms="Vaccination checkup",
        vitals=VitalsInput(temperature_f=98.6, heart_rate_bpm=85, blood_pressure="95/60", spo2_percent=99.0),
        age=8,
    )
    result = _heuristic_triage(req)
    # 8-year-old with HR 85 is normal — should be low urgency
    assert result.urgency in ["low", "medium"]
    assert result.source == "heuristic_fallback"


@pytest.mark.asyncio
async def test_neonatal_bradycardia_escalates(monkeypatch):
    """Neonatal bradycardia (HR < 100 for infant < 1 year) should be flagged."""
    monkeypatch.setattr("utils.gemini_triage.GEMINI_API_KEY", "")
    monkeypatch.setattr("utils.gemini_triage.GEMINI_MODEL", "gemini-3.8-flash")

    req = TriageRequest(
        symptoms="Baby crying persistently, feeding poorly",
        vitals=VitalsInput(temperature_f=98.6, heart_rate_bpm=95, blood_pressure="100/65", spo2_percent=95.0),
        age=0,  # neonate
    )
    result = _heuristic_triage(req)
    assert result.urgency == "high"
    assert any("Bradycardia" in ind for ind in result.diagnostic_indicators)
