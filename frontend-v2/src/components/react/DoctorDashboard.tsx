import React, { useState, useEffect } from 'react';
import { SwasthaAPI, type Patient, type QueueEntry } from '../../lib/api';
import { Stethoscope, Pill, FlaskConical, AlertCircle, CheckCircle2, User, HeartPulse, FileText, Send, Sparkles } from 'lucide-react';

export default function DoctorDashboard() {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedQueueItem, setSelectedQueueItem] = useState<QueueEntry | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  // Consultation state
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');

  // Prescription Form state (routes to Pharmacy)
  const [medName, setMedName] = useState('Paracetamol 650mg');
  const [dosage, setDosage] = useState('1 tablet');
  const [freq, setFreq] = useState('Thrice daily');
  const [duration, setDuration] = useState('5 days');
  const [prescribedMeds, setPrescribedMeds] = useState<{ name: string; dosage: string; frequency: string; duration: string; instructions: string }[]>([
    { name: 'Paracetamol 650mg', dosage: '1 Tab', frequency: 'TDS (3x/day)', duration: '5 days', instructions: 'Post meal' }
  ]);

  // Lab Test Form state (routes to Laboratory)
  const [labTestName, setLabTestName] = useState('Complete Blood Count (CBC)');
  const [labCategory, setLabCategory] = useState('Hematology');
  const [labPriority, setLabPriority] = useState<'routine' | 'urgent' | 'stat'>('urgent');

  const [notification, setNotification] = useState('');

  const loadData = async () => {
    setLoading(true);
    const [qList, pList] = await Promise.all([
      SwasthaAPI.getQueue(),
      SwasthaAPI.getPatients()
    ]);
    
    // Sort queue by priority: emergency > high > medium > low
    const priorityWeight: Record<string, number> = { emergency: 4, high: 3, medium: 2, low: 1 };
    const sorted = [...qList].sort((a, b) => (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0));
    
    setQueue(sorted);
    setPatients(pList);
    
    if (sorted.length > 0 && !selectedQueueItem) {
      setSelectedQueueItem(sorted[0]);
      const matched = pList.find(p => p.id === sorted[0].patient_id) || pList[0];
      setSelectedPatient(matched || null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectPatient = (item: QueueEntry) => {
    setSelectedQueueItem(item);
    const matched = patients.find(p => p.id === item.patient_id);
    setSelectedPatient(matched || null);
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
    await SwasthaAPI.createPrescription({
      patient_id: selectedPatient.id,
      patient_name: selectedPatient.name,
      doctor_name: 'Dr. Vikram Sethi, MD',
      medicines: prescribedMeds,
      notes: diagnosis || 'Clinical prescription',
    });
    setNotification(`✅ Prescription for ${selectedPatient.name} successfully routed to Pharmacy!`);
    setTimeout(() => setNotification(''), 5000);
  };

  // Route Lab Order to Laboratory
  const handleSendLabOrder = async () => {
    if (!selectedPatient || !labTestName) return;
    await SwasthaAPI.createLabOrder({
      patient_id: selectedPatient.id,
      patient_name: selectedPatient.name,
      doctor_name: 'Dr. Vikram Sethi, MD',
      test_name: labTestName,
      category: labCategory,
      priority: labPriority,
    });
    setNotification(`🧪 Lab Order for ${labTestName} successfully routed to Diagnostics Lab!`);
    setTimeout(() => setNotification(''), 5000);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-700 via-purple-700 to-cyan-700 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md mb-2">
              <Stethoscope className="w-3.5 h-3.5" /> Department 2: Doctor Consultation & Clinical Orders
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">AI-Prioritized Clinical Examination Hub</h1>
            <p className="text-indigo-100 text-sm mt-1 max-w-2xl">
              Examine triaged patients, review vitals, document diagnoses, and instantly route digital prescriptions to Pharmacy & lab requisitions to Laboratory.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/20 text-xs font-medium">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI Triage Active Sort</span>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Main Clinical Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Triaged Patient Queue */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                Priority Queue ({queue.length})
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">Real-time</span>
            </div>

            <div className="space-y-2.5 mt-4 max-h-[620px] overflow-y-auto pr-1">
              {queue.map((item) => {
                const isSelected = selectedQueueItem?.id === item.id;
                const isEmergency = item.priority === 'emergency';
                const isHigh = item.priority === 'high';

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectPatient(item)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-sm ring-1 ring-indigo-500'
                        : isEmergency
                        ? 'border-rose-300 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20 hover:border-rose-400'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{item.patient_name}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        isEmergency
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/80 dark:text-rose-200 animate-pulse'
                          : isHigh
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-200'
                          : 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/80 dark:text-cyan-200'
                      }`}>
                        {item.priority}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                      <span className="font-mono">{item.queue_number}</span>
                      <span>{item.service_type}</span>
                    </div>

                    {item.notes && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-1 italic bg-white/60 dark:bg-slate-900/60 p-1.5 rounded">
                        {item.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Patient Consultation & Orders */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Patient Overview Card */}
          {selectedPatient ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
                    {selectedPatient.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {selectedPatient.name}
                      <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {selectedPatient.registration_number}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {selectedPatient.age} yrs • {selectedPatient.gender} • Blood Group: {selectedPatient.blood_group || 'N/A'} • {selectedPatient.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedPatient.allergies && selectedPatient.allergies.length > 0 ? (
                    <span className="px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-1 border border-rose-200 dark:border-rose-900">
                      <AlertCircle className="w-3.5 h-3.5" /> Allergy: {selectedPatient.allergies.join(', ')}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                      No Known Drug Allergies
                    </span>
                  )}
                </div>
              </div>

              {/* Triage & Diagnosis */}
              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Clinical Diagnosis & Findings
                  </label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="e.g. Acute Bronchitis with mild wheezing / Suspected Angina"
                    className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                {/* TWO ACTION SECTIONS: Route to Pharmacy & Route to Lab */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Prescription Section (Routes to Pharmacy) */}
                  <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <Pill className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        Prescription (Routes to Pharmacy)
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={medName}
                          onChange={(e) => setMedName(e.target.value)}
                          placeholder="Medicine name"
                          className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                        <button
                          type="button"
                          onClick={handleAddMed}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                          + Add
                        </button>
                      </div>

                      {/* Meds list */}
                      <div className="space-y-1.5 max-h-32 overflow-y-auto">
                        {prescribedMeds.map((med, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            <div>
                              <span className="font-semibold text-slate-900 dark:text-white">{med.name}</span>
                              <span className="text-slate-500 dark:text-slate-400 ml-2">({med.dosage}, {med.frequency})</span>
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
                      className="w-full py-2 px-3 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Transmit Prescription to Pharmacy
                    </button>
                  </div>

                  {/* Laboratory Order Section (Routes to Lab) */}
                  <div className="rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/30 dark:bg-purple-950/20 p-4 space-y-3">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <FlaskConical className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      Lab Diagnostics (Routes to Laboratory)
                    </h3>

                    <div className="space-y-2">
                      <input
                        type="text"
                        value={labTestName}
                        onChange={(e) => setLabTestName(e.target.value)}
                        placeholder="Test name (e.g. Troponin-T, Lipid Profile)"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={labCategory}
                          onChange={(e) => setLabCategory(e.target.value)}
                          className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
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
                          className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
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
                      className="w-full py-2 px-3 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-all flex items-center justify-center gap-1.5"
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
