import pytest
from schemas.queue import TriageRequest, VitalsInput
from utils.gemini_triage import analyze_clinical_triage, _heuristic_triage


@pytest.mark.asyncio
async def test_heuristic_emergency_triage():
    req = TriageRequest(
        symptoms="Severe crushing chest pain radiating to left jaw, sweating profusely",
        vitals=VitalsInput(temperature_f=98.6, heart_rate_bpm=115, blood_pressure="160/100", spo2_percent=88.0),
        age=58,
        gender="Male"
    )
    result = await analyze_clinical_triage(req)
    assert result.urgency == "emergency"
    assert result.priority_score >= 90
    assert result.estimated_wait_minutes == 0
    assert result.confidence_score >= 0.90
    assert len(result.diagnostic_indicators) > 0


@pytest.mark.asyncio
async def test_heuristic_hemorrhage_emergency():
    # User's explicit question: "too much blood should be highest priority"
    req = TriageRequest(
        symptoms="Patient has too much blood loss from deep laceration, heavy bleeding not stopping",
        vitals=VitalsInput(temperature_f=97.8, heart_rate_bpm=128, blood_pressure="85/55", spo2_percent=94.0),
        age=27,
        gender="Male"
    )
    result = await analyze_clinical_triage(req)
    assert result.urgency == "emergency"
    assert result.priority_score >= 95
    assert result.estimated_wait_minutes == 0
    assert any("shock" in ind.lower() or "hypotension" in ind.lower() or "emergency" in ind.lower() for ind in result.diagnostic_indicators)


@pytest.mark.asyncio
async def test_heuristic_high_urgency_triage():
    req = TriageRequest(
        symptoms="Possible compound fracture in right wrist after fall, acute severe pain",
        vitals=VitalsInput(temperature_f=99.1, heart_rate_bpm=95, blood_pressure="130/85", spo2_percent=98.0),
        age=34
    )
    result = await analyze_clinical_triage(req)
    assert result.urgency == "high"
    assert result.priority_score >= 70
    assert result.estimated_wait_minutes <= 15
    assert result.confidence_score >= 0.85


@pytest.mark.asyncio
async def test_heuristic_routine_low_triage():
    req = TriageRequest(
        symptoms="Routine annual wellness checkup, general health evaluation",
        vitals=VitalsInput(temperature_f=98.4, heart_rate_bpm=68, blood_pressure="118/78", spo2_percent=99.0),
        age=29
    )
    result = await analyze_clinical_triage(req)
    assert result.urgency == "low"
    assert result.priority_score <= 40
    assert result.estimated_wait_minutes >= 30
    assert result.confidence_score >= 0.90


def test_api_queue_ai_triage_endpoint(client, admin_token):
    payload = {
        "symptoms": "High fever of 103F with severe chills and body ache for 3 days",
        "vitals": {
            "temperature_f": 103.2,
            "heart_rate_bpm": 108,
            "blood_pressure": "125/80",
            "spo2_percent": 96.5
        },
        "age": 42,
        "gender": "Female",
        "medical_history": ["Asthma"]
    }
    response = client.post("/api/queue/ai-triage", json=payload, headers={"Authorization": f"Bearer {admin_token}"})
    assert response.status_code == 200
    data = response.json()
    assert "urgency" in data
    assert data["urgency"] in ["emergency", "high", "medium", "low"]
    assert "priority_score" in data
    assert "recommended_department" in data
    assert "confidence_score" in data
    assert data["confidence_score"] >= 0.85
    assert "diagnostic_indicators" in data
    assert "reasoning" in data


def test_api_queue_ai_triage_unauthorized(client):
    response = client.post("/api/queue/ai-triage", json={"symptoms": "Headache"})
    assert response.status_code == 401
