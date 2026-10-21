import React, { useState, useEffect } from 'react';
import { SwasthaAPI, type Patient, type QueueEntry, type QueueStatus } from '../../lib/api';
import { Stethoscope, Pill, FlaskConical, AlertCircle, CheckCircle2, HeartPulse, FileText, Send, Sparkles, Activity, Thermometer, Droplet, Clock } from 'lucide-react';
import {
  priorityBadge, statusBadge,
  btnPrimary, btnSuccess, btnDanger, btnGhost,
  inputClass, selectClass, textareaClass,
  card, cardHeader, label, pageHeader, statPill, toast as toastCls, alertDanger,
  listItem, listItemSelected, listItemEmergency,
} from '../../lib/ui';

const ACTIVE_QUEUE_STATUSES: QueueStatus[] = ['waiting', 'called', 'in-progress'];

export default function DoctorDashboard() {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedQueueItem, setSelectedQueueItem] = useState<QueueEntry | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [diagnosis, setDiagnosis] = useState('Acute Exertional Angina / Hypertensive Urgency');
  const [clinicalNotes, setClinicalNotes] = useState('Patient exhibits mild diaphoresis. Advised bed rest, immediate sublingual nitroglycerin and urgent Cardiac Biomarkers workup.');

  const [medName, setMedName] = useState('Atorvastatin 20mg');
  const [dosage, setDosage] = useState('20mg');
  const [freq, setFreq] = useState('0-0-1 (Bedtime)');
  const [duration, setDuration] = useState('30 days');
  const [prescribedMeds, setPrescribedMeds] = useState<{ name: string; dosage: string; frequency: string; duration: string; instructions: string }[]>([
    { name: 'Aspirin 75mg', dosage: '75mg', frequency: '0-1-0 (After Lunch)', duration: '30 days', instructions: 'Post meal' },
    { name: 'Metoprolol 25mg', dosage: '25mg', frequency: '1-0-0 (Morning)', duration: '15 days', instructions: 'With water' },
  ]);

  const [labTestName, setLabTestName] = useState('Cardiac Biomarkers (Troponin I & CK-MB)');
  const [labCategory, setLabCategory] = useState('Biochemistry');
  const [labPriority, setLabPriority] = useState<'routine' | 'urgent' | 'stat'>('stat');

  const [notification, setNotification] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [qList, pList] = await Promise.all([SwasthaAPI.getQueue(), SwasthaAPI.getPatients()]);

      // Filter to active statuses only (waiting, called, in-progress)
      const activeQueue = (qList || []).filter(q => ACTIVE_QUEUE_STATUSES.includes(q.status));
      const sortedQueue = activeQueue.sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0));

      setQueue(sortedQueue);
      setPatients(pList || []);
      // Auto-select first patient if not already selected
      if (sortedQueue.length > 0 && !selectedQueueItem) {
        setSelectedQueueItem(sortedQueue[0]);
      }
      if ((pList || []).length > 0 && !selectedPatient) {
        setSelectedPatient(pList[0]);
      }
      setError('');
    } catch (err: any) {
      setError('Failed to load queue data. Please refresh the page.');
      console.error(err);
    }
  };

  // Initial load + 10-second polling (paused when tab is hidden)
  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      if (!document.hidden) {
        loadData();
      }
    }, 10000);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectPatient = (item: QueueEntry) => {
    setSelectedQueueItem(item);
    const patient = patients.find(p => p.id === item.patient_id);
    if (patient) setSelectedPatient(patient);
  };

  const handleAddMed = () => {
    if (!medName) return;
    setPrescribedMeds([...prescribedMeds, { name: medName, dosage, frequency: freq, duration, instructions: 'As directed' }]);
    setMedName('');
  };

  const handleRemoveMed = (idx: number) => setPrescribedMeds(prescribedMeds.filter((_, i) => i !== idx));

  const handleSendPrescription = async () => {
    if (!selectedPatient || prescribedMeds.length === 0) return;
    try {
      await SwasthaAPI.createPrescription({
        patient_id: selectedPatient.id,
        patient_name: selectedPatient.name,
        doctor_name: 'Dr. Vikram Sethi, MD',
        medicines: prescribedMeds,
        notes: diagnosis,
      });

      if (selectedQueueItem) {
        await SwasthaAPI.updateQueueStatus(selectedQueueItem.id, 'completed');
        // Remove completed patient from doctor's active waiting queue
        setQueue((prev) => {
          const remaining = prev.filter((q) => q.id !== selectedQueueItem.id);
          if (remaining.length > 0) {
            setSelectedQueueItem(remaining[0]);
            setSelectedPatient(patients.find((p) => p.id === remaining[0].patient_id) || patients[0]);
          }
          return remaining;
        });
      }
    } catch (err) {
      console.error('Error completing consultation:', err);
    }
    setNotification(`Prescription for ${selectedPatient.name} sent to Central Pharmacy & consultation completed.`);
    setTimeout(() => setNotification(''), 5000);
  };

  const handleSendLabOrder = async () => {
    if (!selectedPatient || !labTestName) return;
    try {
      await SwasthaAPI.createLabOrder({ patient_id: selectedPatient.id, patient_name: selectedPatient.name, doctor_name: 'Dr. Vikram Sethi, MD', test_name: labTestName, category: labCategory, priority: labPriority });
    } catch {}
    setNotification(`Lab order "${labTestName}" dispatched to Pathology Lab.`);
    setTimeout(() => setNotification(''), 5000);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className={pageHeader}>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            Doctor Consultation Suite
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Examine triaged patients, record findings, and send prescriptions and lab orders.
          </p>
        </div>
        <div className={statPill('sky')}>
          <div className="text-[10px] font-semibold uppercase tracking-wider opacity-70">Triage Queue</div>
          <div className="text-xl font-bold">{queue.length} patients</div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className={alertDanger}>
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError('')} className="text-xs font-semibold text-rose-700 dark:text-rose-300 hover:underline shrink-0">Dismiss</button>
        </div>
      )}

      {/* Toast */}
      {notification && (
        <div className={toastCls}>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium">{notification}</span>
          </div>
          <button onClick={() => setNotification('')} className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline shrink-0">Dismiss</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* ─── Left: Triaged Patient Queue ─── */}
        <div className="lg:col-span-4">
          <div className={`${card} p-5`}>
            <div className={cardHeader}>
              <h2 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                Live Patient Queue
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">AI-sorted</span>
            </div>

            <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
              {queue.length === 0 ? (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
                  No patients in the active queue. All caught up!
                </div>
              ) : (
                queue.map(item => {
                const isSelected = selectedQueueItem?.id === item.id;
                const isEmergency = item.priority === 'emergency' || item.priority_score >= 90;
                return (
                  <div key={item.id} onClick={() => handleSelectPatient(item)}
                    className={isSelected ? listItemSelected : isEmergency ? listItemEmergency : listItem}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-slate-900 dark:text-white">{item.patient_name}</span>
                      <span className={priorityBadge[item.priority] || priorityBadge.low}>{item.priority}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-mono">
                      <span>{item.queue_number}</span>
                      <span className="truncate max-w-[120px]">{item.service_type}</span>
                    </div>
                    {item.notes && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-2 line-clamp-2 italic">{item.notes}</p>
                    )}
                  </div>
                );
              }))}
            </div>
          </div>
        </div>

        {/* ─── Right: Consultation Panel ─── */}
        <div className="lg:col-span-8">
          {selectedPatient ? (
            <div className={`${card} p-6 space-y-5`}>

              {/* Patient overview */}
              <div className={`${cardHeader} flex-wrap gap-3`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                    {selectedPatient.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                      {selectedPatient.name}
                      <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">{selectedPatient.registration_number}</span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {selectedPatient.age} yrs · {selectedPatient.gender} · <span className="font-semibold text-rose-600">{selectedPatient.blood_group || 'N/A'}</span> · {selectedPatient.phone}
                    </p>
                  </div>
                </div>
                {selectedPatient.allergies && selectedPatient.allergies.length > 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-300 text-xs font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" /> Allergy: {selectedPatient.allergies.join(', ')}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                    No Known Allergies
                  </span>
                )}
              </div>

              {/* Vitals ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
                {[
                  { icon: <Activity className="w-3.5 h-3.5 text-sky-500" />, label: 'Blood Pressure', value: '138/88 mmHg' },
                  { icon: <HeartPulse className="w-3.5 h-3.5 text-rose-500" />, label: 'Pulse', value: '82 bpm' },
                  { icon: <Droplet className="w-3.5 h-3.5 text-blue-500" />, label: 'SpO2', value: '98%' },
                  { icon: <Thermometer className="w-3.5 h-3.5 text-amber-500" />, label: 'Temperature', value: '98.6 °F' },
                ].map(v => (
                  <div key={v.label}>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">{v.icon}{v.label}</div>
                    <div className="font-semibold text-slate-900 dark:text-white">{v.value}</div>
                  </div>
                ))}
              </div>

              {/* Diagnosis */}
              <div>
                <label className={label}>Clinical Diagnosis & Findings</label>
                <input type="text" value={diagnosis} onChange={e => setDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Bronchitis / Hypertensive Episode"
                  className={inputClass} />
              </div>

              {/* Orders grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Prescription section */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/30 p-4 space-y-3">
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Pill className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    E-Prescription
                  </h3>

                  <div className="flex gap-2">
                    <input type="text" value={medName} onChange={e => setMedName(e.target.value)} placeholder="Medicine name"
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500" />
                    <button type="button" onClick={handleAddMed} className={btnPrimary}>Add</button>
                  </div>

                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {prescribedMeds.map((med, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white">{med.name}</span>
                          <span className="text-slate-400 ml-2 font-mono text-[11px]">({med.dosage}, {med.frequency})</span>
                        </div>
                        <button onClick={() => handleRemoveMed(idx)} className="text-rose-500 hover:text-rose-700 font-bold w-5 h-5 flex items-center justify-center rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors">✕</button>
                      </div>
                    ))}
                  </div>

                  <button type="button" onClick={handleSendPrescription} className={`${btnSuccess} w-full justify-center`}>
                    <Send className="w-3.5 h-3.5" /> Send to Pharmacy
                  </button>
                </div>

                {/* Lab order section */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/30 p-4 space-y-3">
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    Lab Order
                  </h3>

                  <input type="text" value={labTestName} onChange={e => setLabTestName(e.target.value)}
                    placeholder="Test name (e.g. CBC, HbA1c)"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500" />

                  <div className="grid grid-cols-2 gap-2">
                    <select value={labCategory} onChange={e => setLabCategory(e.target.value)}
                      className="px-2.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500">
                      {['Hematology','Cardiology','Biochemistry','Microbiology','Radiology'].map(c => <option key={c}>{c}</option>)}
                    </select>
                    <select value={labPriority} onChange={e => setLabPriority(e.target.value as any)}
                      className="px-2.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold">
                      <option value="routine">Routine</option>
                      <option value="urgent">Urgent</option>
                      <option value="stat">STAT</option>
                    </select>
                  </div>

                  <button type="button" onClick={handleSendLabOrder} className={`${btnPrimary} w-full justify-center`}>
                    <Send className="w-3.5 h-3.5" /> Order Lab Work
                  </button>
                </div>

              </div>
            </div>
          ) : (
            <div className={`${card} p-12 text-center text-sm text-slate-400`}>
              Select a patient from the queue to open their consultation.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
