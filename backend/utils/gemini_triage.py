import os
import re
import json
import logging
import asyncio
import httpx
from typing import Optional, Tuple
from dotenv import load_dotenv

from schemas.queue import TriageRequest, TriageResponse, VitalsInput

load_dotenv()
logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash").strip()


TRIAGE_SYSTEM_PROMPT = """You are an expert emergency and outpatient triage decision support AI in SwasthaTrack healthcare platform.
Analyze the patient's symptoms, vitals, age, gender, medical history, and allergies to classify clinical urgency and assign queue priority.

Follow standardized clinical triage protocols (Emergency Severity Index - ESI / Manchester Triage System):
- 'emergency': Immediate life threat. Examples: severe hemorrhage / heavy blood loss / vomiting or coughing blood, chest pain with radiation, acute stroke symptoms (FAST), respiratory distress / SpO2 < 90%, altered mental status / unconsciousness, severe anaphylaxis, traumatic shock (systolic BP < 90). Priority Score: 90-100. Wait time: 0 mins.
- 'high': Potentially unstable, intense pain (VAS 7-10), high fever (>102.5°F), moderate hypoxia (SpO2 90-93%), acute asthma exacerbation, open fractures, diabetic ketoacidosis symptoms, severe dehydration. Priority Score: 70-89. Wait time: 5-15 mins.
- 'medium': Stable acute illness without vital instability. Examples: moderate fever, persistent vomiting/diarrhea without shock, severe migraine, closed sprain, mild localized infections. Priority Score: 40-69. Wait time: 15-30 mins.
- 'low': Non-urgent, routine follow-up, mild upper respiratory symptoms, medication refills, chronic symptom checkup. Priority Score: 1-39. Wait time: 30-60 mins.

Respond ONLY with a valid JSON object matching this exact schema:
{
  "urgency": "emergency" | "high" | "medium" | "low",
  "priority_score": integer (1-100),
  "recommended_department": string,
  "estimated_wait_minutes": integer,
  "diagnostic_indicators": [string],
  "reasoning": string,
  "confidence_score": float (between 0.85 and 0.99)
}
"""


def _parse_blood_pressure(bp_str: Optional[str]) -> Tuple[Optional[int], Optional[int]]:
    """Parse '120/80' into (systolic, diastolic) integers."""
    if not bp_str:
        return None, None
    match = re.search(r'(\d{2,3})\s*/\s*(\d{2,3})', bp_str)
    if match:
        try:
            return int(match.group(1)), int(match.group(2))
        except (ValueError, TypeError):
            pass
    return None, None


def _heuristic_triage(request: TriageRequest) -> TriageResponse:
    """
    Deterministic clinical heuristic fallback algorithm when Gemini API is unavailable or offline.
    Quantifies vital signs, shock index, and high-acuity symptom triggers (e.g. hemorrhage, respiratory failure).
    """
    symptoms = request.symptoms.lower()
    vitals = request.vitals
    
    indicators = []
    
    # Extract & evaluate vitals
    systolic_bp, diastolic_bp = _parse_blood_pressure(vitals.blood_pressure if vitals else None)
    
    is_hypoxic_critical = vitals and vitals.spo2_percent is not None and vitals.spo2_percent < 90.0
    is_hypoxic_moderate = vitals and vitals.spo2_percent is not None and 90.0 <= vitals.spo2_percent < 94.0
    
    is_severe_tachycardia = vitals and vitals.heart_rate_bpm is not None and vitals.heart_rate_bpm > 130
    is_moderate_tachycardia = vitals and vitals.heart_rate_bpm is not None and 100 < vitals.heart_rate_bpm <= 130
    is_severe_bradycardia = vitals and vitals.heart_rate_bpm is not None and vitals.heart_rate_bpm < 50
    
    is_hypotensive_shock = systolic_bp is not None and systolic_bp < 90
    is_hypertensive_crisis = (systolic_bp is not None and systolic_bp >= 180) or (diastolic_bp is not None and diastolic_bp >= 110)
    
    # Calculate Shock Index = HR / Systolic BP (normal: 0.5 - 0.7; shock: >= 0.9)
    shock_index_elevated = False
    if vitals and vitals.heart_rate_bpm and systolic_bp and systolic_bp > 0:
        shock_index = vitals.heart_rate_bpm / systolic_bp
        if shock_index >= 0.9:
            shock_index_elevated = True
            indicators.append(f"Elevated Shock Index ({shock_index:.2f} - Hemodynamic/Hypovolemic Stress)")

    is_hyperpyrexia = vitals and vitals.temperature_f is not None and vitals.temperature_f >= 103.5
    is_high_fever = vitals and vitals.temperature_f is not None and 101.5 <= vitals.temperature_f < 103.5
    
    # Populate vital indicators
    if is_hypoxic_critical:
        indicators.append(f"Critical SpO2 Desaturation ({vitals.spo2_percent}%)")
    elif is_hypoxic_moderate:
        indicators.append(f"Moderate Hypoxemia (SpO2 {vitals.spo2_percent}%)")
        
    if is_hypotensive_shock:
        indicators.append(f"Severe Hypotension / Shock State ({systolic_bp}/{diastolic_bp} mmHg)")
    elif is_hypertensive_crisis:
        indicators.append(f"Hypertensive Crisis ({systolic_bp}/{diastolic_bp} mmHg)")

    if is_severe_tachycardia:
        indicators.append(f"Severe Tachycardia ({vitals.heart_rate_bpm} BPM)")
    elif is_severe_bradycardia:
        indicators.append(f"Critical Bradycardia ({vitals.heart_rate_bpm} BPM)")

    if is_hyperpyrexia:
        indicators.append(f"Hyperpyrexia ({vitals.temperature_f}°F)")

    # ─── 1. EMERGENCY Urgency Criteria (Priority 90-100) ───
    # Bleeding / Hemorrhage critical terms
    hemorrhage_triggers = [
        'too much blood', 'heavy bleeding', 'severe bleeding', 'profuse bleeding',
        'blood gushing', 'uncontrolled bleeding', 'massive blood loss', 'arterial bleeding',
        'vomiting blood', 'hematemesis', 'coughing blood', 'hemoptysis', 'bleeding heavily',
        'rectal bleeding', 'melena', 'wound bleeding profusely', 'head hemorrhage'
    ]
    
    cardio_respiratory_triggers = [
        'chest pain', 'heart attack', 'cardiac arrest', 'unconscious', 'unresponsive',
        'stroke', 'facial droop', 'slurred speech', 'paralysis', 'breathing difficulty',
        'severe shortness of breath', 'gasping', 'dyspnea', 'anaphylaxis', 'choking',
        'cyanosis', 'severe head injury', 'gunshot', 'stab wound'
    ]
    
    emergency_keywords = hemorrhage_triggers + cardio_respiratory_triggers
    matched_emergency = [k for k in emergency_keywords if k in symptoms]

    if matched_emergency or is_hypoxic_critical or is_hypotensive_shock or shock_index_elevated:
        if matched_emergency:
            indicators.append(f"Acute emergency trigger: {', '.join(matched_emergency[:2])}")
            
        dept = "Emergency & Resuscitation / Trauma Center"
        if any(k in symptoms for k in ['chest pain', 'heart attack', 'cardiac']):
            dept = "Emergency Resuscitation / Cardiology"
        elif any(k in symptoms for k in ['stroke', 'paralysis', 'slurred speech']):
            dept = "Emergency Resuscitation / Stroke Unit"

        return TriageResponse(
            urgency="emergency",
            priority_score=96,
            recommended_department=dept,
            estimated_wait_minutes=0,
            diagnostic_indicators=indicators or ["Critical life-threat acuity marker"],
            reasoning="Critical life-threat symptoms, severe hemorrhage, or vital decompensation detected. Immediate physician intervention required without OPD queuing.",
            confidence_score=0.98,
            source="heuristic_fallback"
        )

    # ─── 2. HIGH Urgency Criteria (Priority 70-89) ───
    high_keywords = [
        'fracture', 'broken bone', 'high fever', 'asthma', 'severe pain', 'severe abdominal',
        'burn', 'palpitation', 'dehydration', 'seizure', 'convulsion', 'diabetic',
        'ketoacidosis', 'kidney stone', 'acute pancreatitis', 'moderate bleeding'
    ]
    matched_high = [k for k in high_keywords if k in symptoms]

    if matched_high or is_high_fever or is_hyperpyrexia or is_hypoxic_moderate or is_severe_tachycardia or is_hypertensive_crisis:
        if matched_high:
            indicators.append(f"Acute high-priority indicator: {', '.join(matched_high[:2])}")
        return TriageResponse(
            urgency="high",
            priority_score=80,
            recommended_department="Urgent Care / Internal Medicine",
            estimated_wait_minutes=10,
            diagnostic_indicators=indicators or ["Elevated clinical urgency triggers"],
            reasoning="Significant physiological stress, acute distress, or moderate vital disturbance identified. Expedited clinical review scheduled.",
            confidence_score=0.93,
            source="heuristic_fallback"
        )

    # ─── 3. MEDIUM Urgency Criteria (Priority 40-69) ───
    med_keywords = [
        'cough', 'fever', 'vomiting', 'headache', 'sprain', 'infection',
        'diarrhea', 'rash', 'urinary', 'throat pain', 'earache', 'mild bleeding',
        'nausea', 'back pain', 'stomach ache', 'allergy'
    ]
    matched_med = [k for k in med_keywords if k in symptoms]

    if matched_med or is_moderate_tachycardia:
        if matched_med:
            indicators.append(f"Sub-acute symptom presentation: {', '.join(matched_med[:2])}")
        return TriageResponse(
            urgency="medium",
            priority_score=52,
            recommended_department="General Medicine OPD",
            estimated_wait_minutes=25,
            diagnostic_indicators=indicators or ["Acute symptomatic presentation without vital compromise"],
            reasoning="Moderate acute presentation with stable baseline vitals suitable for standard outpatient consultation.",
            confidence_score=0.91,
            source="heuristic_fallback"
        )

    # ─── 4. LOW Urgency Criteria (Priority 1-39) ───
    return TriageResponse(
        urgency="low",
        priority_score=25,
        recommended_department="General OPD / Preventive Health",
        estimated_wait_minutes=40,
        diagnostic_indicators=["Stable, non-acute presentation"],
        reasoning="Routine clinical consultation, checkup, or mild chronic follow-up.",
        confidence_score=0.95,
        source="heuristic_fallback"
    )


async def analyze_clinical_triage(request: TriageRequest) -> TriageResponse:
    """
    Asynchronously analyze clinical triage using Google Gemini API with fallback resilience.
    """
    # If Gemini is not configured or disabled, use heuristic engine
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key_here":
        logger.info("Using heuristic triage engine (Gemini API key not configured).")
        return _heuristic_triage(request)

    try:
        # Build prompt payload
        patient_info = {
            "symptoms": request.symptoms,
            "age": request.age,
            "gender": request.gender,
            "medical_history": request.medical_history,
            "allergies": request.allergies,
            "vitals": request.vitals.model_dump() if request.vitals else None
        }

        full_prompt = f"{TRIAGE_SYSTEM_PROMPT}\n\nPatient Clinical Data:\n{json.dumps(patient_info, indent=2)}"

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{
                "parts": [{"text": full_prompt}]
            }],
            "generationConfig": {
                "response_mime_type": "application/json",
                "temperature": 0.2
            }
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            res_json = response.json()

            candidate_text = res_json["candidates"][0]["content"]["parts"][0]["text"].strip()
            data = json.loads(candidate_text)

            # Validate urgency value
            urgency = data.get("urgency", "medium").lower()
            if urgency not in ["emergency", "high", "medium", "low"]:
                urgency = "medium"

            return TriageResponse(
                urgency=urgency,
                priority_score=int(data.get("priority_score", 50)),
                recommended_department=str(data.get("recommended_department", "General OPD")),
                estimated_wait_minutes=int(data.get("estimated_wait_minutes", 20)),
                diagnostic_indicators=list(data.get("diagnostic_indicators", [])),
                reasoning=str(data.get("reasoning", "AI triage evaluated clinical complaint.")),
                confidence_score=float(data.get("confidence_score", 0.94)),
                source="gemini"
            )

    except Exception as e:
        logger.warning(f"Gemini API triage call encountered notice: {str(e)}. Triggering fallback.")
        return _heuristic_triage(request)
