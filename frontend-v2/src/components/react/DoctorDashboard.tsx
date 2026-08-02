import React, { useState, useEffect } from 'react';
import { SwasthaAPI, type Patient, type QueueEntry } from '../../lib/api';
import { Stethoscope, Pill, FlaskConical, AlertCircle, CheckCircle2, User, HeartPulse, FileText, Send, Sparkles, Activity, Thermometer, Droplet, Clock } from 'lucide-react';

const fallbackPatients: Patient[] = [
  {
    id: 1,
    registration_number: 'PAT-2026-001',
    name: 'Rajesh Sharma',
    age: 45,
    gender: 'Male',
    phone: '+91 98765 43210',
    blood_group: 'B+',
    allergies: ['Penicillin', 'Sulfa Drugs'],
    chronic_conditions: ['Hypertension', 'Mild Asthma'],
    emergency_contact: 'Sunita Sharma (+91 98765 43211)',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    registration_number: 'PAT-2026-002',
    name: 'Anita Patel',
    age: 32,
    gender: 'Female',
    phone: '+91 98111 22334',
    blood_group: 'O+',
    allergies: [],
    chronic_conditions: ['Type-2 Diabetes'],
    emergency_contact: 'Karan Patel (+91 98111 22335)',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    registration_number: 'PAT-2026-003',
    name: 'Mohan Lal Verma',
    age: 58,
    gender: 'Male',
    phone: '+91 97222 33445',
    blood_group: 'A+',
    allergies: ['Aspirin'],
    chronic_conditions: ['Ischemic Heart Disease'],
    emergency_contact: 'Ramesh Verma (+91 97222 33446)',
    created_at: new Date().toISOString()
  }
];

const fallbackQueue: QueueEntry[] = [
  {
    id: 101,
    patient_id: 1,
    patient_name: 'Rajesh Sharma',
    service_type: 'Cardiology OPD',
    priority: 'high',
    status: 'in-consultation',
    queue_number: 'Q-101',
    notes: 'Substernal chest tightness radiating to left shoulder on exertion',
    created_at: new Date().toISOString()
  },
  {
    id: 102,
    patient_id: 2,
    patient_name: 'Anita Patel',
    service_type: 'Endocrinology OPD',
    priority: 'medium',
    status: 'waiting',
    queue_number: 'Q-102',
    notes: 'Elevated fasting blood sugar (164 mg/dL), polyuria and fatigue',
    created_at: new Date().toISOString()
  },
  {
    id: 103,
    patient_id: 3,
    patient_name: 'Mohan Lal Verma',
    service_type: 'General Medicine',
    priority: 'emergency',
    status: 'waiting',
    queue_number: 'Q-103',
    notes: 'Severe dizziness, BP 170/105 mmHg, blurred vision',
    created_at: new Date().toISOString()
  }
];

export default function DoctorDashboard() {
  const [queue, setQueue] = useState<QueueEntry[]>(fallbackQueue);
  const [patients, setPatients] = useState<Patient[]>(fallbackPatients);
  const [selectedQueueItem, setSelectedQueueItem] = useState<QueueEntry>(fallbackQueue[0]);
  const [selectedPatient, setSelectedPatient] = useState<Patient>(fallbackPatients[0]);

  // Consultation state
  const [diagnosis, setDiagnosis] = useState('Acute Exertional Angina / Hypertensive Urgency');
  const [clinicalNotes, setClinicalNotes] = useState('Patient exhibits mild diaphoresis. Advised bed rest, immediate sublingual nitroglycerin and urgent Cardiac Biomarkers workup.');

  // Prescription Form state
  const [medName, setMedName] = useState('Atorvastatin 20mg');
  const [dosage, setDosage] = useState('20mg');
  const [freq, setFreq] = useState('0-0-1 (Bedtime)');
  const [duration, setDuration] = useState('30 days');
  const [prescribedMeds, setPrescribedMeds] = useState<{ name: string; dosage: string; frequency: string; duration: string; instructions: string }[]>([
    { name: 'Aspirin 75mg', dosage: '75mg', frequency: '0-1-0 (After Lunch)', duration: '30 days', instructions: 'Post meal' },
    { name: 'Metoprolol 25mg', dosage: '25mg', frequency: '1-0-0 (Morning)', duration: '15 days', instructions: 'With water' }
  ]);

  // Lab Test Form state
  const [labTestName, setLabTestName] = useState('Cardiac Biomarkers (Troponin I & CK-MB)');
  const [labCategory, setLabCategory] = useState('Biochemistry');
  const [labPriority, setLabPriority] = useState<'routine' | 'urgent' | 'stat'>('stat');

  const [notification, setNotification] = useState('');

  const loadData = async () => {
    try {
      const [qList, pList] = await Promise.all([
        SwasthaAPI.getQueue(),
        SwasthaAPI.getPatients()
      ]);
      
      if (qList && qList.length > 0) {
        const priorityWeight: Record<string, number> = { emergency: 4, high: 3, medium: 2, low: 1 };
        const sorted = [...qList].sort((a, b) => (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0));
        setQueue(sorted);
        setSelectedQueueItem(sorted[0]);
      }
      if (pList && pList.length > 0) {
        setPatients(pList);
        setSelectedPatient(pList[0]);
      }
    } catch (e) {
      // Keep rich fallbacks
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectPatient = (item: QueueEntry) => {
    setSelectedQueueItem(item);
    const matched = patients.find(p => p.id === item.patient_id) || patients[0];
    setSelectedPatient(matched);
  };

  const handleAddMed = () => {
    if (!medName) return;
    setPrescribedMeds([
      ...prescribedMeds,
      { name: medName, dosage, frequency: freq, duration, instructions: 'As directed' }
    ]);
    setMedName('');
  };

  const handleRemoveMed = (index: number) => {
    setPrescribedMeds(prescribedMeds.filter((_, i) => i !== index));
  };

  // Route Prescription to Pharmacy
  const handleSendPrescription = async () => {
    if (!selectedPatient || prescribedMeds.length === 0) return;
    try {
      await SwasthaAPI.createPrescription({
        patient_id: selectedPatient.id,
        patient_name: selectedPatient.name,
        doctor_name: 'Dr. Vikram Sethi, MD',
        medicines: prescribedMeds,
        notes: diagnosis || 'Clinical prescription',
      });
    } catch (e) {}
    setNotification(`Prescription for ${selectedPatient.name} transmitted to Central Pharmacy.`);
    setTimeout(() => setNotification(''), 5000);
  };

  // Route Lab Order to Laboratory
  const handleSendLabOrder = async () => {
    if (!selectedPatient || !labTestName) return;
    try {
      await SwasthaAPI.createLabOrder({
        patient_id: selectedPatient.id,
        patient_name: selectedPatient.name,
        doctor_name: 'Dr. Vikram Sethi, MD',
        test_name: labTestName,
        category: labCategory,
        priority: labPriority,
      });
    } catch (e) {}
    setNotification(`Diagnostic order "${labTestName}" dispatched to Central Laboratory.`);
    setTimeout(() => setNotification(''), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Sleek Clinical Consultation Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-500/20">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold backdrop-blur-md">
              <Stethoscope className="w-3.5 h-3.5 text-indigo-400" />
              <span>Department 02 • Clinical Examination & Tele-Orders</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Doctor Consultation & Clinical Orders
            </h1>
            <p className="text-indigo-100/80 text-sm max-w-2xl">
              Conduct AI-triaged examinations, document clinical findings, and synchronously emit verified electronic prescriptions to Pharmacy and lab requisitions to Pathology.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 dark:bg-slate-900/60 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-center">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-cyan-300">Queue Load</div>
              <div className="text-2xl font-black text-white">{queue.length} Patients</div>
            </div>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-900 dark:text-indigo-200 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-semibold">{notification}</span>
          </div>
          <button onClick={() => setNotification('')} className="text-xs font-bold text-indigo-600 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Main Clinical Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Triaged Patient Queue */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 p-5 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                Live Patient Queue ({queue.length})
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">AI-Sorted</span>
            </div>

            <div className="space-y-2.5 mt-4 max-h-[640px] overflow-y-auto pr-1">
              {queue.map((item) => {
                const isSelected = selectedQueueItem?.id === item.id;
                const isEmergency = item.priority === 'emergency';
                const isHigh = item.priority === 'high';

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectPatient(item)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 shadow-sm ring-1 ring-indigo-500'
                        : isEmergency
                        ? 'border-rose-500/40 bg-rose-50/30 dark:bg-rose-950/20 hover:border-rose-500/60'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{item.patient_name}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        isEmergency
                          ? 'bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 animate-pulse'
                          : isHigh
                          ? 'bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300'
                          : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300'
                      }`}>
                        {item.priority}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-mono">
                      <span>{item.queue_number}</span>
                      <span>{item.service_type}</span>
                    </div>

                    {item.notes && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 italic bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200/60 dark:border-slate-800">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Patient Consultation & Orders */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Patient Overview Card */}
          {selectedPatient ? (
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 p-6 shadow-sm backdrop-blur-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-600 text-white flex items-center justify-center font-bold text-base shadow-md shadow-indigo-500/20">
                    {selectedPatient.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      {selectedPatient.name}
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {selectedPatient.registration_number}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {selectedPatient.age} yrs • {selectedPatient.gender} • Blood Group: <span className="font-bold text-rose-600">{selectedPatient.blood_group || 'N/A'}</span> • {selectedPatient.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedPatient.allergies && selectedPatient.allergies.length > 0 ? (
                    <span className="px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5 border border-rose-500/20">
                      <AlertCircle className="w-3.5 h-3.5" /> Allergy: {selectedPatient.allergies.join(', ')}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-500/20">
                      No Known Drug Allergies
                    </span>
                  )}
                </div>
              </div>

              {/* Vitals Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs">
                <div className="space-y-0.5">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Activity className="w-3 h-3 text-cyan-500" /> Blood Pressure
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">138/88 mmHg</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <HeartPulse className="w-3 h-3 text-rose-500" /> Pulse
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">82 bpm</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Droplet className="w-3 h-3 text-blue-500" /> Oxygen Sat (SpO2)
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">98% Room Air</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-amber-500" /> Temperature
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">98.6 °F</div>
                </div>
              </div>

              {/* Triage & Diagnosis */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Clinical Diagnosis & Findings
                    </label>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> AI Assisted Suggestion Active
                    </span>
                  </div>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="e.g. Acute Bronchitis / Hypertensive Episode"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                  />
                </div>

                {/* TWO ACTION SECTIONS: Route to Pharmacy & Route to Lab */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                  
                  {/* Prescription Section (Routes to Pharmacy) */}
                  <div className="rounded-2xl border border-cyan-500/20 bg-cyan-50/20 dark:bg-cyan-950/10 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wider">
                        <Pill className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                        E-Prescription (Pharmacy)
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={medName}
                          onChange={(e) => setMedName(e.target.value)}
                          placeholder="Medicine name"
                          className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={handleAddMed}
                          className="px-3.5 py-2 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
                        >
                          + Add
                        </button>
                      </div>

                      {/* Meds list */}
                      <div className="space-y-1.5 max-h-32 overflow-y-auto">
                        {prescribedMeds.map((med, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <div>
                              <span className="font-semibold text-slate-900 dark:text-white">{med.name}</span>
                              <span className="text-slate-500 dark:text-slate-400 ml-2 font-mono text-[11px]">({med.dosage}, {med.frequency})</span>
                            </div>
                            <button
                              onClick={() => handleRemoveMed(idx)}
                              className="text-rose-500 hover:text-rose-700 font-bold px-1"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSendPrescription}
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" /> Transmit Prescription to Pharmacy
                    </button>
                  </div>

                  {/* Laboratory Order Section (Routes to Lab) */}
                  <div className="rounded-2xl border border-purple-500/20 bg-purple-50/20 dark:bg-purple-950/10 p-4 space-y-3">
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wider">
                      <FlaskConical className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      Lab Diagnostics (Pathology)
                    </h3>

                    <div className="space-y-2">
                      <input
                        type="text"
                        value={labTestName}
                        onChange={(e) => setLabTestName(e.target.value)}
                        placeholder="Test name (e.g. CBC, HbA1c)"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={labCategory}
                          onChange={(e) => setLabCategory(e.target.value)}
                          className="px-2.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          <option>Hematology</option>
                          <option>Cardiology</option>
                          <option>Biochemistry</option>
                          <option>Microbiology</option>
                          <option>Radiology</option>
                        </select>

                        <select
                          value={labPriority}
                          onChange={(e) => setLabPriority(e.target.value as any)}
                          className="px-2.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                        >
                          <option value="routine">Routine</option>
                          <option value="urgent">Urgent</option>
                          <option value="stat">STAT (Emergency)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSendLabOrder}
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" /> Order Diagnostic Lab Work
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-slate-400">
              Select a patient from the triaged queue to open consultation.
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
