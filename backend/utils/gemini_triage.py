import asyncio
import json
import logging
import os
import re

import httpx
from dotenv import load_dotenv

from schemas.queue import TriageRequest, TriageResponse
from utils.triage_thresholds import (
    CRITICAL_BRADYCARDIA_THRESHOLD,
    CRITICAL_SPO2_THRESHOLD,
    EMERGENCY_SCORE_MAX,
    EMERGENCY_SCORE_MIN,
    EMERGENCY_SYMPTOMS,
    HIGH_FEVER_F_THRESHOLD,
    HIGH_SCORE_MAX,
    HIGH_SCORE_MIN,
    HIGH_SYMPTOMS,
    HYPERPYREXIA_F_THRESHOLD,
    HYPERTENSIVE_CRISIS_DIASTOLIC,
    HYPERTENSIVE_CRISIS_SYSTOLIC,
    LOW_SCORE_MAX,
    LOW_SCORE_MIN,
    MEDIUM_SCORE_MAX,
    MEDIUM_SCORE_MIN,
    MEDIUM_SYMPTOMS,
    MODERATE_SPO2_THRESHOLD,
    MODERATE_TACHYCARDIA_THRESHOLD,
    NEGATION_OVERRIDES,
    NEGATION_PATTERNS,
    NEONATAL_AGE_DAYS,
    PEDIATRIC_AGE_THRESHOLD,
    PEDIATRIC_INFANT_HR_MIN,
    PEDIATRIC_NEONATAL_HR_MIN,
    SEVERE_TACHYCARDIA_THRESHOLD,
    SHOCK_INDEX_THRESHOLD,
    SHOCK_SYSTOLIC_THRESHOLD,
    clamp_score,
    urgency_to_band,
)

load_dotenv()
logger = logging.getLogger(__name__)

# Read model name ONLY from environment — no retired defaults
# Recommended model: gemini-3.8-flash (set GEMINI_MODEL in production)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "").strip()

# Shared async HTTP client — created lazily, reused across calls
_shared_http_client: httpx.AsyncClient | None = None


def _get_shared_client() -> httpx.AsyncClient:
    global _shared_http_client
    if _shared_http_client is None or _shared_http_client.is_closed:
        _shared_http_client = httpx.AsyncClient(timeout=3.0)
    return _shared_http_client


async def _close_shared_client():
    global _shared_http_client
    if _shared_http_client is not None and not _shared_http_client.is_closed:
        await _shared_http_client.aclose()
        _shared_http_client = None


TRIAGE_SYSTEM_PROMPT = f"""You are an expert emergency and outpatient triage decision support AI in SwasthaTrack healthcare platform.
Analyze the patient's symptoms, vitals, age, gender, medical history, and allergies to classify clinical urgency and assign queue priority.

Follow standardized clinical triage protocols (Emergency Severity Index - ESI / Manchester Triage System):
- 'emergency': Immediate life threat. Priority Score: {EMERGENCY_SCORE_MIN}-{EMERGENCY_SCORE_MAX}. Wait time: 0 mins.
- 'high': Potentially unstable. Priority Score: {HIGH_SCORE_MIN}-{HIGH_SCORE_MAX}. Wait time: 5-15 mins.
- 'medium': Stable acute illness without vital instability. Priority Score: {MEDIUM_SCORE_MIN}-{MEDIUM_SCORE_MAX}. Wait time: 15-30 mins.
- 'low': Non-urgent, routine follow-up. Priority Score: {LOW_SCORE_MIN}-{LOW_SCORE_MAX}. Wait time: 30-60 mins.

Respond ONLY with a valid JSON object matching this exact schema:
{{
  "urgency": "emergency" | "high" | "medium" | "low",
  "priority_score": integer (1-100),
  "recommended_department": string,
  "estimated_wait_minutes": integer,
  "diagnostic_indicators": [string],
  "reasoning": string
}}
Do NOT include confidence_score in your response.
"""


def _parse_blood_pressure(bp_str: str | None) -> tuple[int | None, int | None]:
    if not bp_str:
        return None, None
    match = re.search(r"(\d{2,3})\s*/\s*(\d{2,3})", bp_str)
    if match:
        try:
            return int(match.group(1)), int(match.group(2))
        except (ValueError, TypeError):
            pass
    return None, None


def _is_negated(symptom: str, symptoms_text: str) -> bool:
    """Check if a symptom is negated in the symptoms text using word boundaries."""
    # Find the position of the symptom in the text
    pattern = re.escape(symptom)
    matches = list(re.finditer(pattern, symptoms_text, re.IGNORECASE))
    if not matches:
        return False

    for match in matches:
        before = symptoms_text[: match.start()]
        # Check if any negation pattern immediately precedes the symptom
        for neg_pattern in NEGATION_PATTERNS:
            if before.endswith((neg_pattern.strip(), neg_pattern)):
                return True
            if before.endswith((neg_pattern.strip() + " ", neg_pattern + " ")):
                return True
    return False


def _match_symptoms(symptoms_text: str, keyword_list: list[str]) -> list[str]:
    """Word-boundary match symptoms, excluding negated ones."""
    matched = []
    for kw in keyword_list:
        # Word boundary matching — match the keyword as a complete phrase
        escaped = re.escape(kw)
        pattern = r"(?<!\w)" + escaped + r"(?!\w)"
        if re.search(pattern, symptoms_text, re.IGNORECASE) and not _is_negated(kw, symptoms_text):
            matched.append(kw)
    return matched


def _heuristic_triage(request: TriageRequest) -> TriageResponse:
    """
    Deterministic clinical heuristic fallback algorithm.
    Always runs first (Task 8d requirement: heuristic first, then take higher urgency).
    """
    symptoms = request.symptoms.lower().strip()
    vitals = request.vitals

    indicators: list[str] = []

    systolic_bp, diastolic_bp = _parse_blood_pressure(vitals.blood_pressure if vitals else None)

    spo2 = vitals.spo2_percent if vitals else None
    hr = vitals.heart_rate_bpm if vitals else None
    temp_f = vitals.temperature_f if vitals else None

    # ─── Vital sign evaluation ───
    is_hypoxic_critical = spo2 is not None and spo2 < CRITICAL_SPO2_THRESHOLD
    is_hypoxic_moderate = spo2 is not None and CRITICAL_SPO2_THRESHOLD <= spo2 < MODERATE_SPO2_THRESHOLD

    is_severe_tachycardia = hr is not None and hr > SEVERE_TACHYCARDIA_THRESHOLD
    # TODO(clinician-review): Moderate tachycardia threshold — confirm with cardiac protocol.
    is_moderate_tachycardia = hr is not None and MODERATE_TACHYCARDIA_THRESHOLD < hr <= SEVERE_TACHYCARDIA_THRESHOLD
    # TODO(clinician-review): Pediatric bradycardia threshold differs from adults.
    is_critical_bradycardia = hr is not None and hr < CRITICAL_BRADYCARDIA_THRESHOLD

    is_hypotensive_shock = systolic_bp is not None and systolic_bp < SHOCK_SYSTOLIC_THRESHOLD
    is_hypertensive_crisis = (systolic_bp is not None and systolic_bp >= HYPERTENSIVE_CRISIS_SYSTOLIC) or (
        diastolic_bp is not None and diastolic_bp >= HYPERTENSIVE_CRISIS_DIASTOLIC
    )

    # ─── Pediatric age band checks ───
    # TODO(clinician-review): Pediatric age bands require pediatric protocol validation.
    age = request.age
    is_pediatric = age is not None and age < PEDIATRIC_AGE_THRESHOLD
    # TODO(clinician-review): Infant age cutoff (12 months) should be confirmed by pediatrician.
    is_infant = age is not None and age < 1
    is_neonate = age is not None and age < (NEONATAL_AGE_DAYS / 365.25)

    # Shock Index = HR / SBP (normal: 0.5-0.7; shock: >= 0.9)
    # TODO(clinician-review): Shock index is validated for adults only; pediatric patients have different norms.
    shock_index_elevated = False
    if hr and systolic_bp and systolic_bp > 0 and not is_pediatric:
        shock_index = hr / systolic_bp
        if shock_index >= SHOCK_INDEX_THRESHOLD:
            shock_index_elevated = True
            indicators.append(f"Elevated Shock Index ({shock_index:.2f})")

    is_hyperpyrexia = temp_f is not None and temp_f >= HYPERPYREXIA_F_THRESHOLD
    is_high_fever = temp_f is not None and HIGH_FEVER_F_THRESHOLD <= temp_f < HYPERPYREXIA_F_THRESHOLD

    # Pediatric bradycardia — only for infants/neonates, not all pediatric
    # TODO(clinician-review): Neonatal bradycardia threshold should be validated by pediatrician.
    if is_neonate:
        pediatric_bradycardia = hr is not None and hr < PEDIATRIC_NEONATAL_HR_MIN
    elif is_infant:
        pediatric_bradycardia = hr is not None and hr < PEDIATRIC_INFANT_HR_MIN
    else:
        pediatric_bradycardia = False

    if is_hypoxic_critical:
        indicators.append(f"Critical SpO2 Desaturation ({spo2}%)")
    elif is_hypoxic_moderate:
        indicators.append(f"Moderate Hypoxemia (SpO2 {spo2}%)")

    if is_hypotensive_shock:
        indicators.append(f"Severe Hypotension / Shock State ({systolic_bp}/{diastolic_bp} mmHg)")
    elif is_hypertensive_crisis:
        indicators.append(f"Hypertensive Crisis ({systolic_bp}/{diastolic_bp} mmHg)")

    if is_severe_tachycardia:
        indicators.append(f"Severe Tachycardia ({hr} BPM)")
    elif is_critical_bradycardia or pediatric_bradycardia:
        indicators.append(f"Critical Bradycardia ({hr} BPM)")

    if is_hyperpyrexia:
        indicators.append(f"Hyperpyrexia ({temp_f}°F)")

    # ─── 1. EMERGENCY ───
    matched_emergency = _match_symptoms(symptoms, EMERGENCY_SYMPTOMS)

    # Negation overrides: "history of asthma" or "heartburn" should not trigger
    # TODO(clinician-review): Expand negation override dictionary based on clinical review.
    for symptom_check, overrides in NEGATION_OVERRIDES.items():
        if symptom_check in matched_emergency:
            for override_kw in overrides:
                if override_kw in symptoms:
                    matched_emergency = [s for s in matched_emergency if s != symptom_check]
                    indicators.append(f"Negated: '{override_kw}' suppresses '{symptom_check}' emergency trigger")

    if matched_emergency or is_hypoxic_critical or is_hypotensive_shock or shock_index_elevated or is_hyperpyrexia:
        if matched_emergency:
            indicators.append(f"Acute emergency trigger: {', '.join(matched_emergency[:2])}")

        dept = "Emergency & Resuscitation / Trauma Center"
        if "chest pain" in matched_emergency:
            dept = "Emergency Resuscitation / Cardiology"
        elif any(k in matched_emergency for k in ["stroke", "paralysis", "slurred speech"]):
            dept = "Emergency Resuscitation / Stroke Unit"

        return TriageResponse(
            urgency="emergency",
            priority_score=EMERGENCY_SCORE_MAX - 4,
            recommended_department=dept,
            estimated_wait_minutes=0,
            diagnostic_indicators=indicators or ["Critical life-threat acuity marker"],
            reasoning="Critical life-threat symptoms, severe hemorrhage, or vital decompensation detected. Immediate physician intervention required without OPD queuing.",
            source="heuristic_fallback",
        )

    # ─── 2. HIGH ───
    matched_high = _match_symptoms(symptoms, HIGH_SYMPTOMS)

    if (
        matched_high
        or is_high_fever
        or is_hyperpyrexia
        or is_hypoxic_moderate
        or is_severe_tachycardia
        or is_hypertensive_crisis
        or is_critical_bradycardia
        or pediatric_bradycardia
    ):
        if matched_high:
            indicators.append(f"Acute high-priority indicator: {', '.join(matched_high[:2])}")
        return TriageResponse(
            urgency="high",
            priority_score=HIGH_SCORE_MAX,
            recommended_department="Urgent Care / Internal Medicine",
            estimated_wait_minutes=10,
            diagnostic_indicators=indicators or ["Elevated clinical urgency triggers"],
            reasoning="Significant physiological stress, acute distress, or moderate vital disturbance identified. Expedited clinical review scheduled.",
            source="heuristic_fallback",
        )

    # ─── 3. MEDIUM ───
    matched_med = _match_symptoms(symptoms, MEDIUM_SYMPTOMS)

    if matched_med or is_moderate_tachycardia:
        if matched_med:
            indicators.append(f"Sub-acute symptom presentation: {', '.join(matched_med[:2])}")
        return TriageResponse(
            urgency="medium",
            priority_score=MEDIUM_SCORE_MIN + 12,
            recommended_department="General Medicine OPD",
            estimated_wait_minutes=25,
            diagnostic_indicators=indicators or ["Acute symptomatic presentation without vital compromise"],
            reasoning="Moderate acute presentation with stable baseline vitals suitable for standard outpatient consultation.",
            source="heuristic_fallback",
        )

    # ─── 4. LOW ───
    return TriageResponse(
        urgency="low",
        priority_score=LOW_SCORE_MAX - 5,
        recommended_department="General OPD / Preventive Health",
        estimated_wait_minutes=40,
        diagnostic_indicators=["Stable, non-acute presentation"],
        reasoning="Routine clinical consultation, checkup, or mild chronic follow-up.",
        source="heuristic_fallback",
    )


def _band_to_priority(urgency: str) -> int:
    """Return a representative score clamped within the band of the given urgency."""
    return clamp_score(0, urgency)


async def _call_gemini(request: TriageRequest, client: httpx.AsyncClient) -> TriageResponse | None:
    """
    Call the Gemini API with the request.
    Returns a TriageResponse on success, or None on failure (caller falls back to heuristic).
    Uses x-goog-api-key header instead of URL parameter.
    """
    if not GEMINI_API_KEY:
        return None

    if not GEMINI_MODEL:
        logger.warning("GEMINI_MODEL is not set — falling back to heuristic triage.")
        return None

    patient_info = {
        "symptoms": request.symptoms,
        "age": request.age,
        "gender": request.gender,
        "medical_history": request.medical_history,
        "allergies": request.allergies,
        "vitals": request.vitals.model_dump() if request.vitals else None,
    }

    full_prompt = f"{TRIAGE_SYSTEM_PROMPT}\n\nPatient Clinical Data:\n{json.dumps(patient_info, indent=2)}"

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"
    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
    }
    payload = {
        "contents": [{"parts": [{"text": full_prompt}]}],
        "generationConfig": {
            "response_mime_type": "application/json",
            "temperature": 0.2,
        },
    }

    max_retries = 1
    for attempt in range(max_retries + 1):
        try:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            res_json = response.json()

            candidate_text = res_json["candidates"][0]["content"]["parts"][0]["text"].strip()
            data = json.loads(candidate_text)

            urgency = data.get("urgency", "medium").lower()
            if urgency not in ["emergency", "high", "medium", "low"]:
                urgency = "medium"

            priority = int(data.get("priority_score", _band_to_priority(urgency)))
            # Clamp priority_score into the band of the returned urgency
            priority = clamp_score(priority, urgency)

            return TriageResponse(
                urgency=urgency,
                priority_score=priority,
                recommended_department=str(data.get("recommended_department", "General OPD")),
                estimated_wait_minutes=int(data.get("estimated_wait_minutes", 20)),
                diagnostic_indicators=list(data.get("diagnostic_indicators", [])),
                reasoning=str(data.get("reasoning", "AI triage evaluated clinical complaint.")),
                source="gemini",
            )

        except (httpx.HTTPStatusError, json.JSONDecodeError, KeyError, ValueError, TypeError) as e:
            logger.warning(f"Gemini API triage call failed (attempt {attempt + 1}): {e!s}")
            if attempt >= max_retries:
                logger.info("Gemini API triage failed after retry — falling back to heuristic.")
                return None
            await asyncio.sleep(0.5)
        except httpx.TimeoutException:
            logger.warning(f"Gemini API triage timed out (attempt {attempt + 1})")
            if attempt >= max_retries:
                logger.info("Gemini API triage timed out after retry — falling back to heuristic.")
                return None
            await asyncio.sleep(0.5)
        except Exception as e:
            logger.warning(f"Gemini API triage encountered unexpected error (attempt {attempt + 1}): {e!s}")
            if attempt >= max_retries:
                return None
            await asyncio.sleep(0.5)

    return None


def _higher_urgency(resp1: TriageResponse, resp2: TriageResponse) -> TriageResponse:
    """
    Return the response with the higher urgency band (Task 8d).
    When bands are tied, prefer the one with the higher priority_score,
    falling back to resp2 (Gemini) when scores are equal.
    """
    band1 = urgency_to_band(resp1.urgency)
    band2 = urgency_to_band(resp2.urgency)

    if band1 > band2:
        return resp1
    if band2 > band1:
        return resp2
    # Bands tied — prefer higher priority_score, then resp2 (Gemini)
    if resp1.priority_score >= resp2.priority_score:
        return resp1
    return resp2


async def analyze_clinical_triage(request: TriageRequest) -> TriageResponse:
    """
    Triage pipeline: always runs the rule-based heuristic engine first,
    then optionally calls Gemini, and returns the HIGHER urgency of the two.
    """
    heuristic_result = _heuristic_triage(request)

    # If Gemini is not configured, return heuristic result
    if not GEMINI_API_KEY or not GEMINI_MODEL:
        logger.info("Using heuristic triage engine (Gemini API key or model not configured).")
        return heuristic_result

    client = _get_shared_client()
    gemini_result = await _call_gemini(request, client)

    if gemini_result is None:
        logger.info("Gemini triage failed — returning heuristic result.")
        return heuristic_result

    # Return the HIGHER urgency of rules and Gemini
    return _higher_urgency(heuristic_result, gemini_result)
