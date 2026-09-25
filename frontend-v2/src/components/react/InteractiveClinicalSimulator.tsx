import React, { useState } from 'react';
import { Stethoscope, Pill, FlaskConical, ArrowRight, CheckCircle2, Clock, User, Sparkles } from 'lucide-react';

interface ClinicalCase {
  id: string;
  name: string;
  ageGender: string;
  mrn: string;
  symptoms: string;
  vitals: { bp: string; hr: string; spo2: string; temp: string };
  triage: {
    urgency: 'emergency' | 'high' | 'medium' | 'low';
    esiLevel: string;
    priorityScore: number;
    confidenceScore: number;
    reasoning: string;
    indicators: string[];
    department: string;
    targetWaitMins: number;
  };
  doctorPlan: {
    soapDiagnosis: string;
    prescription: { name: string; dose: string; freq: string; duration: string }[];
    labRequisition: { testName: string; priority: string; tube: string };
  };
}

const CLINICAL_CASES: ClinicalCase[] = [
  {
    id: 'CASE-01',
    name: 'Amitabh Sen',
    ageGender: '68M',
    mrn: 'MRN-91-8842-1092',
    symptoms: 'Crushing retrosternal chest pain radiating to left jaw & shoulder for 45 mins. Diaphoresis & acute shortness of breath.',
    vitals: { bp: '165/102 mmHg', hr: '118 bpm', spo2: '88%', temp: '98.4°F' },
    triage: {
      urgency: 'emergency',
      esiLevel: 'Level 1: Resuscitation (STAT)',
      priorityScore: 98,
      confidenceScore: 0.96,
      reasoning: 'Critical acute coronary syndrome markers with severe arterial desaturation (SpO2 88%). Requires immediate resuscitation bypass.',
      indicators: ['Acute Ischemic Chest Pain', 'Hypoxemia SpO2 < 90%', 'Severe Diaphoresis', 'Tachycardia'],
      department: 'Emergency & Cardiology Care Unit',
      targetWaitMins: 0
    },
    doctorPlan: {
      soapDiagnosis: 'Suspected Acute ST-Elevation Myocardial Infarction (STEMI)',
      prescription: [
        { name: 'Tab. Aspirin', dose: '300mg', freq: 'STAT (Chewable)', duration: 'Single Dose' },
        { name: 'Tab. Clopidogrel', dose: '300mg', freq: 'STAT', duration: 'Single Dose' },
        { name: 'Tab. Atorvastatin', dose: '80mg', freq: 'STAT', duration: 'Single Dose' }
      ],
      labRequisition: { testName: 'High-Sensitivity Troponin-I & 12-Lead ECG', priority: 'STAT (Immediate)', tube: 'Heparin (Green)' }
    }
  },
  {
    id: 'CASE-02',
    name: 'Priya Sharma',
    ageGender: '32F',
    mrn: 'MRN-91-4431-7729',
    symptoms: 'Acute asthmatic exacerbation with audible expiratory wheezing and accessory muscle use following allergen exposure.',
    vitals: { bp: '130/84 mmHg', hr: '110 bpm', spo2: '93%', temp: '99.1°F' },
    triage: {
      urgency: 'high',
      esiLevel: 'Level 2: Emergent Urgent Care',
      priorityScore: 82,
      confidenceScore: 0.94,
      reasoning: 'Moderate respiratory distress with compromised airflow. Expedited clinical nebulization indicated within 10 mins.',
      indicators: ['Acute Bronchospasm', 'Expiratory Wheeze', 'Tachycardia', 'SpO2 93% on Room Air'],
      department: 'Urgent Care / Pulmonology OPD',
      targetWaitMins: 10
    },
    doctorPlan: {
      soapDiagnosis: 'Acute Bronchial Asthma Exacerbation (Moderate-Severe)',
      prescription: [
        { name: 'Neb. Levosalbutamol + Ipratropium', dose: '1.25mg/500mcg', freq: 'STAT via Nebulizer', duration: '20 Mins' },
        { name: 'Tab. Prednisolone', dose: '40mg', freq: 'Once Daily (Morning)', duration: '5 Days' }
      ],
      labRequisition: { testName: 'Peak Expiratory Flow Rate (PEFR) & Blood Gas', priority: 'Urgent (<30 min)', tube: 'Arterial Syringe' }
    }
  },
  {
    id: 'CASE-03',
    name: 'Rajesh Kumar',
    ageGender: '45M',
    mrn: 'MRN-91-1209-6634',
    symptoms: 'Scheduled 3-month outpatient follow-up for Type-2 Diabetes Mellitus. Stable blood sugars, routine medication refill.',
    vitals: { bp: '122/80 mmHg', hr: '74 bpm', spo2: '99%', temp: '98.6°F' },
    triage: {
      urgency: 'low',
      esiLevel: 'Level 4: Routine Outpatient Care',
      priorityScore: 28,
      confidenceScore: 0.95,
      reasoning: 'Clinically stable chronic disease maintenance visit without acute warning signs or vital instability. Standard OPD queuing.',
      indicators: ['Stable Baseline Vitals', 'Routine Chronic Followup', 'Zero Red Flag Triggers'],
      department: 'General Internal Medicine OPD',
      targetWaitMins: 35
    },
    doctorPlan: {
      soapDiagnosis: 'Type 2 Diabetes Mellitus & Primary Hypertension (Well-Controlled)',
      prescription: [
        { name: 'Tab. Metformin HCl (ER)', dose: '500mg', freq: 'Twice Daily (Post-Meal)', duration: '90 Days' },
        { name: 'Tab. Telmisartan', dose: '40mg', freq: 'Once Daily (Morning)', duration: '90 Days' }
      ],
      labRequisition: { testName: 'Glycated Hemoglobin (HbA1c) & Serum Creatinine', priority: 'Routine Outpatient', tube: 'EDTA (Purple) + Serum' }
    }
  }
];

export default function InteractiveClinicalSimulator() {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'triage' | 'doctor' | 'pharmacy' | 'lab'>('triage');

  const currentCase = CLINICAL_CASES[selectedCaseIndex];
  const isEmergency = currentCase.triage.urgency === 'emergency';
  const isHigh = currentCase.triage.urgency === 'high';

  return (
    <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1222] shadow-sm overflow-hidden text-left">
      
      {/* Console Top Header */}
      <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="font-mono text-xs font-bold tracking-wider text-slate-200 uppercase">
            LIVE CLINICAL WORKFLOW ENGINE
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>State Sync: <strong className="text-emerald-400">&lt;150ms</strong></span>
          <span>•</span>
          <span>Inference: <strong className="text-sky-400">Gemini 1.5 Flash + PostgreSQL</strong></span>
        </div>
      </div>

      {/* Case Scenario Selector Bar */}
      <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#090e1c] border-b border-slate-200 dark:border-slate-800/80">
        <div className="text-xs font-mono text-slate-500 font-semibold mb-2.5 flex items-center justify-between">
          <span>Select Clinical Case to Trace:</span>
          <span className="text-[11px] text-sky-600 dark:text-sky-400">Interactive case simulator</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {CLINICAL_CASES.map((c, idx) => {
            const isSelected = selectedCaseIndex === idx;
            const isEmerg = c.triage.urgency === 'emergency';
            const isHi = c.triage.urgency === 'high';
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCaseIndex(idx)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-sky-600 bg-white dark:bg-slate-800/90 shadow-xs ring-1 ring-sky-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {c.name} ({c.ageGender})
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                    isEmerg ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300' :
                    isHi ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300' :
                    'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                  }`}>
                    {c.triage.urgency}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 font-mono">
                  {c.triage.esiLevel}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Patient Intake Vitals Header Strip */}
      <div className="px-4 sm:px-6 py-3 bg-white dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Patient Record</span>
          <span className="font-bold text-slate-900 dark:text-white">{currentCase.name}</span>
          <span className="text-[11px] font-mono text-slate-500 block">{currentCase.mrn}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Blood Pressure</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{currentCase.vitals.bp}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Heart Rate / SpO2</span>
          <span className={`font-mono font-bold ${isEmergency ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
            {currentCase.vitals.hr} • {currentCase.vitals.spo2}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Temperature</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{currentCase.vitals.temp}</span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Target Consultation Wait</span>
          <span className="font-mono font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {currentCase.triage.targetWaitMins === 0 ? '0 mins (STAT Priority)' : `~${currentCase.triage.targetWaitMins} mins`}
          </span>
        </div>
      </div>

      {/* Department Synchronized Views Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/60 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('triage')}
          className={`px-4 py-2.5 flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'triage'
              ? 'border-sky-600 text-sky-600 dark:text-sky-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>1. Triage AI Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('doctor')}
          className={`px-4 py-2.5 flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'doctor'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5 text-blue-500" />
          <span>2. Doctor Station</span>
        </button>

        <button
          onClick={() => setActiveTab('pharmacy')}
          className={`px-4 py-2.5 flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'pharmacy'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Pill className="w-3.5 h-3.5 text-emerald-500" />
          <span>3. Pharmacy Feed</span>
        </button>

        <button
          onClick={() => setActiveTab('lab')}
          className={`px-4 py-2.5 flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'lab'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5 text-purple-500" />
          <span>4. Pathology Orders</span>
        </button>
      </div>

      {/* Main Tab Content Panel */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 min-h-[260px]">
        
        {/* 1. TRIAGE AI TAB */}
        {activeTab === 'triage' && (
          <div className="space-y-3.5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <div className="text-xs font-mono text-slate-400 uppercase">Emergency Severity Index & Neural Assessment</div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{currentCase.triage.esiLevel}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-mono font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300">
                    Confidence: {Math.round(currentCase.triage.confidenceScore * 100)}%
                  </span>
                </h4>
              </div>
              <div className="text-xs font-mono px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                Priority Score: <strong className="text-sky-600 dark:text-sky-400">{currentCase.triage.priorityScore}/100</strong>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-xs">
              <span className="font-mono font-bold text-slate-500 block mb-1">Reported Symptoms:</span>
              <p className="text-slate-800 dark:text-slate-200 italic font-serif leading-relaxed">"{currentCase.symptoms}"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                <span className="font-mono font-bold text-slate-500 block mb-1">Extracted Clinical Markers:</span>
                <div className="flex flex-wrap gap-1">
                  {currentCase.triage.indicators.map((ind, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[11px] font-mono">
                      • {ind}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                <span className="font-mono font-bold text-slate-500 block mb-0.5">Assigned Department Routing:</span>
                <span className="font-bold text-slate-900 dark:text-white block text-xs">{currentCase.triage.department}</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{currentCase.triage.reasoning}</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. DOCTOR CONSULTATION TAB */}
        {activeTab === 'doctor' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Doctor Clinical Notes (SOAP Format)</span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Dr. Vikram Sethi, MD (Attending Physician)</h4>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 font-mono font-bold">
                Consultation Active
              </span>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-xs">
              <span className="font-mono font-bold text-slate-500 block mb-0.5">Assessment / Diagnosis:</span>
              <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{currentCase.doctorPlan.soapDiagnosis}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 block mb-1 flex items-center gap-1">
                  <Pill className="w-3.5 h-3.5" /> Electronic Prescription ({currentCase.doctorPlan.prescription.length} Items)
                </span>
                <ul className="space-y-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  {currentCase.doctorPlan.prescription.map((rx, idx) => (
                    <li key={idx} className="pb-0.5 border-b border-slate-200/60 dark:border-slate-800/60 last:border-0">
                      <strong>{rx.name}</strong> • {rx.dose} • {rx.freq} ({rx.duration})
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                <span className="font-mono font-bold text-purple-600 dark:text-purple-400 block mb-1 flex items-center gap-1">
                  <FlaskConical className="w-3.5 h-3.5" /> Pathology Test Requisition
                </span>
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">{currentCase.doctorPlan.labRequisition.testName}</span>
                  <span className="font-mono text-[11px] text-slate-500 block">Specimen Container: {currentCase.doctorPlan.labRequisition.tube}</span>
                  <span className="inline-block font-mono text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 font-bold uppercase">
                    Priority: {currentCase.doctorPlan.labRequisition.priority}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. PHARMACY TAB */}
        {activeTab === 'pharmacy' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Live Prescription Dispensation Queue</span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Rx-Dispatch Channel: Instant from Doctor Console</h4>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized (&lt;50ms)
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
              <table className="w-full text-left font-mono">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 border-b border-slate-200 dark:border-slate-800 text-[11px]">
                  <tr>
                    <th className="p-2.5">Medication Name</th>
                    <th className="p-2.5">Dosage</th>
                    <th className="p-2.5">Frequency</th>
                    <th className="p-2.5">Stock Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {currentCase.doctorPlan.prescription.map((rx, idx) => (
                    <tr key={idx} className="bg-white dark:bg-slate-900">
                      <td className="p-2.5 font-bold text-slate-900 dark:text-white">{rx.name}</td>
                      <td className="p-2.5 text-slate-600 dark:text-slate-400">{rx.dose}</td>
                      <td className="p-2.5 text-slate-600 dark:text-slate-400">{rx.freq}</td>
                      <td className="p-2.5">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                          Verified in Stock
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl text-xs flex items-center justify-between font-mono text-slate-600 dark:text-slate-400">
              <span>Pharmacist Safety Verification: Passed</span>
              <span className="font-bold text-sky-600 dark:text-sky-400">Ready for 1-Click Dispense</span>
            </div>
          </div>
        )}

        {/* 4. LAB TAB */}
        {activeTab === 'lab' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Pathology Requisition & Telemetry</span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Diagnostic Laboratory Order Desk</h4>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 font-mono font-bold">
                Tube: {currentCase.doctorPlan.labRequisition.tube}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block">{currentCase.doctorPlan.labRequisition.testName}</span>
                  <span className="text-xs font-mono text-slate-500">Order ID: LAB-2026-0912-{(selectedCaseIndex + 1) * 104}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold uppercase ${
                  isEmergency ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                }`}>
                  {currentCase.doctorPlan.labRequisition.priority}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-center font-mono text-xs">
                <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Accessioning</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Sample Logged</span>
                </div>
                <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Analyzer</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">Processing</span>
                </div>
                <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Results</span>
                  <span className="font-bold text-slate-400">Pending Review</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl text-xs font-mono text-slate-500 flex items-center justify-between">
              <span>Automatic result dispatch to Doctor Console & Patient Portal upon pathologist sign-off</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">Barcode Assigned</span>
            </div>
          </div>
        )}

      </div>

      {/* Interactive Footer Action */}
      <div className="px-5 py-3 bg-slate-50 dark:bg-[#080d1a] border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span className="font-mono text-slate-500">
          Trace: <strong className="text-slate-900 dark:text-white">Registration ➔ Doctor Station ➔ Pharmacy Hub ➔ Diagnostics Lab</strong>
        </span>
        <a
          href="/dashboard"
          className="px-3.5 py-1.5 rounded-lg font-bold text-white bg-sky-700 hover:bg-sky-800 dark:bg-sky-600 dark:hover:bg-sky-700 transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <span>Open Full 5-Department Consoles</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
}
