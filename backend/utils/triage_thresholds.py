from enum import IntEnum


class UrgencyBand(IntEnum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    EMERGENCY = 4


EMERGENCY_SCORE_MIN = 90
EMERGENCY_SCORE_MAX = 100

HIGH_SCORE_MIN = 70
HIGH_SCORE_MAX = 89

MEDIUM_SCORE_MIN = 40
MEDIUM_SCORE_MAX = 69

LOW_SCORE_MIN = 1
LOW_SCORE_MAX = 39


def urgency_to_band(urgency: str) -> int:
    mapping = {
        "emergency": UrgencyBand.EMERGENCY,
        "high": UrgencyBand.HIGH,
        "medium": UrgencyBand.MEDIUM,
        "low": UrgencyBand.LOW,
    }
    return mapping.get(urgency.lower(), UrgencyBand.MEDIUM)


def clamp_score(score: int, urgency: str) -> int:
    band = urgency_to_band(urgency)
    if band == UrgencyBand.EMERGENCY:
        return max(EMERGENCY_SCORE_MIN, min(score, EMERGENCY_SCORE_MAX))
    elif band == UrgencyBand.HIGH:
        return max(HIGH_SCORE_MIN, min(score, HIGH_SCORE_MAX))
    elif band == UrgencyBand.MEDIUM:
        return max(MEDIUM_SCORE_MIN, min(score, MEDIUM_SCORE_MAX))
    else:
        return max(LOW_SCORE_MIN, min(score, LOW_SCORE_MAX))


# ─── Clinical thresholds ─────────────────────────────────────────────────────
# TODO(clinician-review): All thresholds below require clinical validation.
# Adjust based on institutional protocols and local epidemiology.

# Vital sign thresholds for emergency escalation
# TODO(clinician-review): SpO2 < 90% defines severe hypoxemia per WHO guidelines.
CRITICAL_SPO2_THRESHOLD = 90.0  # %
# TODO(clinician-review): SpO2 90-93% defines moderate hypoxemia.
MODERATE_SPO2_THRESHOLD = 93.0  # %
# TODO(clinician-review): Temperature >= 103.5°F (39.7°C) defines hyperpyrexia.
HYPERPYREXIA_F_THRESHOLD = 103.5  # °F
# TODO(clinician-review): Temperature 101.5-103.5°F defines high fever.
HIGH_FEVER_F_THRESHOLD = 101.5  # °F
# TODO(clinician-review): Heart rate > 130 bpm defines severe tachycardia.
SEVERE_TACHYCARDIA_THRESHOLD = 130  # bpm
# TODO(clinician-review): Heart rate 100-130 bpm defines moderate tachycardia.
MODERATE_TACHYCARDIA_THRESHOLD = 100  # bpm
# TODO(clinician-review): Heart rate < 50 bpm defines critical bradycardia.
# TODO(clinician-review): Pediatric bradycardia threshold differs from adults; see age bands below.
CRITICAL_BRADYCARDIA_THRESHOLD = 50  # bpm
# TODO(clinician-review): Systolic BP < 90 mmHg defines hypotensive shock.
SHOCK_SYSTOLIC_THRESHOLD = 90  # mmHg
# TODO(clinician-review): Systolic BP >= 180 or diastolic >= 110 defines hypertensive crisis.
HYPERTENSIVE_CRISIS_SYSTOLIC = 180  # mmHg
HYPERTENSIVE_CRISIS_DIASTOLIC = 110  # mmHg
# TODO(clinician-review): Shock index (HR/SBP) >= 0.9 indicates hemodynamic stress.
SHOCK_INDEX_THRESHOLD = 0.9

# Pediatric age bands
# TODO(clinician-review): Neonatal: 0-28 days. Infant: 1-23 months. Toddler: 1-3 years.
# Preschool: 4-6 years. School-age: 7-12 years. Adolescent: 13-17 years.
PEDIATRIC_AGE_THRESHOLD = 18  # years
NEONATAL_AGE_DAYS = 28
INFANT_AGE_MONTHS = 23

# Pediatric heart rate norms (bpm) per age band — TODO(clinician-review)
# TODO(clinician-review): Neonatal HR is naturally higher; bradycardia <100 for neonates.
PEDIATRIC_NEONATAL_HR_MIN = 100
PEDIATRIC_NEONATAL_HR_MAX = 180
# TODO(clinician-review): Infant/toddler HR range.
PEDIATRIC_INFANT_HR_MIN = 90
PEDIATRIC_INFANT_HR_MAX = 150

# Emergency symptom triggers (word-boundary matched)
EMERGENCY_SYMPTOMS = [
    "chest pain",
    "heart attack",
    "cardiac arrest",
    "unconscious",
    "unresponsive",
    "stroke",
    "facial droop",
    "slurred speech",
    "paralysis",
    "breathing difficulty",
    "severe shortness of breath",
    "gasping",
    "dyspnea",
    "anaphylaxis",
    "choking",
    "cyanosis",
    "severe head injury",
    "gunshot",
    "stab wound",
    "too much blood",
    "heavy bleeding",
    "severe bleeding",
    "profuse bleeding",
    "blood gushing",
    "uncontrolled bleeding",
    "massive blood loss",
    "arterial bleeding",
    "vomiting blood",
    "hematemesis",
    "coughing blood",
    "hemoptysis",
    "bleeding heavily",
    "rectal bleeding",
    "melena",
    "wound bleeding profusely",
    "head hemorrhage",
]

# High-urgency symptom triggers
HIGH_SYMPTOMS = [
    "fracture",
    "broken bone",
    "high fever",
    "asthma",
    "severe pain",
    "severe abdominal",
    "burn",
    "palpitation",
    "dehydration",
    "seizure",
    "convulsion",
    "diabetic",
    "ketoacidosis",
    "kidney stone",
    "acute pancreatitis",
    "moderate bleeding",
]

# Medium-urgency symptom triggers
MEDIUM_SYMPTOMS = [
    "cough",
    "vomiting",
    "headache",
    "sprain",
    "infection",
    "diarrhea",
    "rash",
    "urinary",
    "throat pain",
    "earache",
    "mild bleeding",
    "nausea",
    "back pain",
    "stomach ache",
    "allergy",
    "fever",
]

# Negation phrases — if present with a symptom, the symptom is negated
# TODO(clinician-review): Expand negation detection with comprehensive medical terminology list.
NEGATION_PATTERNS = [
    "no ",
    "not ",
    "denies ",
    "without ",
    "absent ",
    "nil ",
    "resolved ",
    "resolved: ",
    "history of ",
    "prior ",
    "previous ",
]

# Negation overrides — symptoms that indicate the absence of an emergency
# when combined with a trigger. Maps trigger → list of negating phrases.
# TODO(clinician-review): Review these negation-specific symptom pairs.
NEGATION_OVERRIDES = {
    "chest pain": ["heartburn", "heartburn", "reflux", "indigestion"],
    "shortness of breath": ["heat stroke", "heat exhaustion"],
    "stroke": ["heat stroke"],
    "asthma": ["history of asthma", "prior asthma", "previous asthma"],
}
