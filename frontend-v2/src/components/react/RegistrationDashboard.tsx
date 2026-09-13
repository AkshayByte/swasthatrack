import React, { useState, useEffect } from 'react';
import { SwasthaAPI, type Patient, type QueueEntry } from '../../lib/api';
import { UserPlus, Sparkles, Clock, AlertTriangle, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import {
  priorityBadge, statusBadge,
  btnPrimary, btnSuccess, btnCta,
  inputClass, inputMono, selectClass, textareaClass,
  card, cardHeader, label, pageHeader, statPill, toast as toastCls,
  listItem, listItemSelected, listItemEmergency,
} from '../../lib/ui';

const fallbackQueueData: QueueEntry[] = [
  { id: 101, patient_id: 1, patient_name: 'Rajesh Sharma', service_type: 'Cardiology OPD', priority: 'high', status: 'in-progress', queue_number: 'Q-101', doctor_name: 'Dr. Vikram Sethi, MD', notes: 'Substernal chest tightness radiating to left shoulder on exertion | BP 145/92', estimated_wait_time: 5, created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { id: 102, patient_id: 2, patient_name: 'Anita Patel', service_type: 'Endocrinology OPD', priority: 'medium', status: 'waiting', queue_number: 'Q-102', doctor_name: 'Dr. Sunita Rao, MD', notes: 'Type-2 Diabetes routine HbA1c review and insulin adjustment | BP 124/80', estimated_wait_time: 18, created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: 103, patient_id: 3, patient_name: 'Mohan Lal Verma', service_type: 'Emergency Medicine', priority: 'emergency', status: 'waiting', queue_number: 'Q-103', doctor_name: 'Dr. Vikram Sethi, MD', notes: 'Severe hypertensive crisis (BP 175/110 mmHg), acute dizziness and vertigo', estimated_wait_time: 0, created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
];

export default function RegistrationDashboard() {
  const [queue, setQueue] = useState<QueueEntry[]>(fallbackQueueData);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [temp, setTemp] = useState('98.6');
  const [bp, setBp] = useState('120/80');

  const [aiTriage, setAiTriage] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const loadData = async () => {
    try {
      const [, qList] = await Promise.all([SwasthaAPI.getPatients(), SwasthaAPI.getQueue()]);
      if (qList && qList.length > 0) setQueue(qList);
    } catch {}
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (symptoms.trim().length > 3) {
      setAiTriage(SwasthaAPI.calculateAITriage(symptoms, { temp, bp }));
    } else {
      setAiTriage(null);
    }
  }, [symptoms, temp, bp]);

  const applyPreset = (s: string, b: string, t: string) => { setSymptoms(s); setBp(b); setTemp(t); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitting(true);
    try {
      const triage = SwasthaAPI.calculateAITriage(symptoms || 'General Checkup', { temp, bp });
      let newPatientId = Date.now();
      try {
        const np = await SwasthaAPI.createPatient({ name, age: Number(age) || 30, gender, phone, blood_group: bloodGroup });
        newPatientId = np.id;
      } catch {}

      const newEntry: QueueEntry = {
        id: Date.now(), patient_id: newPatientId, patient_name: name,
        service_type: triage.recommendedDepartment, priority: triage.urgency,
        status: 'waiting', queue_number: `Q-${Math.floor(100 + Math.random() * 900)}`,
        doctor_name: 'Dr. Vikram Sethi, MD',
        notes: `AI Triage: ${triage.reasoning} | BP: ${bp}, Temp: ${temp}°F`,
        estimated_wait_time: triage.estimatedWaitMinutes, created_at: new Date().toISOString(),
      };
      setQueue(prev => [newEntry, ...prev]);
      setSuccessMessage(`${name} registered — ${triage.urgency.toUpperCase()} priority, routed to ${triage.recommendedDepartment}`);
      setName(''); setAge(''); setPhone(''); setSymptoms(''); setAiTriage(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
      setTimeout(() => setSuccessMessage(''), 6000);
    }
  };

  const updateEntryStatus = (id: number, status: 'waiting' | 'in-progress' | 'completed') =>
    setQueue(prev => prev.map(q => q.id === id ? { ...q, status } : q));

  const waitingCount = queue.filter(q => q.status === 'waiting').length;
  const inProgressCount = queue.filter(q => q.status === 'in-progress').length;

  const triageCardColor = aiTriage?.urgency === 'emergency'
    ? 'bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:border-rose-800/60'
    : aiTriage?.urgency === 'high'
    ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800/60'
    : 'bg-sky-50 border-sky-200 dark:bg-sky-950/30 dark:border-sky-800/60';

  const triageTextColor = aiTriage?.urgency === 'emergency'
    ? 'text-rose-800 dark:text-rose-200'
    : aiTriage?.urgency === 'high'
    ? 'text-amber-800 dark:text-amber-200'
    : 'text-sky-800 dark:text-sky-200';

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className={pageHeader}>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            Patient Registration & Triage
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Register patients and assign priority queue slots with AI-assisted triage.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className={statPill('sky')}>
            <div className="text-[10px] font-semibold uppercase tracking-wider opacity-70">Waiting</div>
            <div className="text-xl font-bold">{waitingCount}</div>
          </div>
          <div className={statPill('emerald')}>
            <div className="text-[10px] font-semibold uppercase tracking-wider opacity-70">In Progress</div>
            <div className="text-xl font-bold">{inProgressCount}</div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {successMessage && (
        <div className={toastCls}>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium">{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline shrink-0">Dismiss</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* ─── Left: Registration Form ─── */}
        <div className="lg:col-span-6">
          <div className={`${card} p-5`}>

            {/* Card header */}
            <div className={cardHeader}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white text-sm">New Patient Intake</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Generate digital token & queue slot</p>
                </div>
              </div>
            </div>

            {/* Fast triage presets */}
            <div className="mb-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Fast Triage Presets
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button type="button" onClick={() => applyPreset('Acute crushing retrosternal chest pain radiating to left jaw, diaphoresis and dizziness', '165/105', '98.8')}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:hover:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800 transition-colors">
                  🚨 Chest Pain (STAT)
                </button>
                <button type="button" onClick={() => applyPreset('High grade persistent fever with rigors for 4 days, severe body ache and dry cough', '125/82', '103.2')}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:hover:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition-colors">
                  🌡️ High Fever / Rigors
                </button>
                <button type="button" onClick={() => applyPreset('Chronic Type-2 Diabetes quarterly checkup, morning fasting sugar 152 mg/dL', '128/84', '98.4')}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-teal-50 hover:bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:hover:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800 transition-colors">
                  🩺 Diabetes Routine
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={label}>Full Name <span className="text-rose-500">*</span></label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Vikramaditya Rathore" className={inputClass} />
                </div>
                <div>
                  <label className={label}>Mobile Number <span className="text-rose-500">*</span></label>
                  <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={label}>Age</label>
                  <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="35" className={inputClass} />
                </div>
                <div>
                  <label className={label}>Gender</label>
                  <select value={gender} onChange={e => setGender(e.target.value)} className={selectClass}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className={label}>Blood Group</label>
                  <select value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} className={selectClass}>
                    {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={label}>Temperature (°F)</label>
                  <input type="text" value={temp} onChange={e => setTemp(e.target.value)} placeholder="98.6" className={inputMono} />
                </div>
                <div>
                  <label className={label}>Blood Pressure</label>
                  <input type="text" value={bp} onChange={e => setBp(e.target.value)} placeholder="120/80" className={inputMono} />
                </div>
              </div>

              <div>
                <label className={`${label} flex items-center gap-1.5`}>
                  <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                  Chief Complaints & Symptoms
                </label>
                <textarea rows={3} value={symptoms} onChange={e => setSymptoms(e.target.value)}
                  placeholder="Describe patient complaints, onset, duration, and distress level..."
                  className={textareaClass} />
              </div>

              {/* Live AI assessment box */}
              {aiTriage && (
                <div className={`p-4 rounded-xl border transition-all ${triageCardColor}`}>
                  <div className={`flex items-center justify-between mb-2 ${triageTextColor}`}>
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                      {aiTriage.urgency === 'emergency'
                        ? <AlertTriangle className="w-4 h-4 animate-pulse" />
                        : <Sparkles className="w-4 h-4" />}
                      Triage: {aiTriage.urgency}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {aiTriage.confidenceScore && (
                        <span className="px-2 py-0.5 rounded-md bg-white/60 dark:bg-black/20 text-[11px] font-semibold border border-current/20">
                          {Math.round(aiTriage.confidenceScore * 100)}% confidence
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md bg-white/60 dark:bg-black/20 text-[11px] font-mono border border-current/20">
                        Score {aiTriage.priorityScore}/100
                      </span>
                    </div>
                  </div>
                  <p className={`text-xs leading-relaxed ${triageTextColor} opacity-90`}>{aiTriage.reasoning}</p>
                  {aiTriage.diagnosticIndicators?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {aiTriage.diagnosticIndicators.map((ind: string, idx: number) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 font-medium">• {ind}</span>
                      ))}
                    </div>
                  )}
                  <div className={`mt-2.5 pt-2 border-t border-current/20 flex items-center justify-between text-xs font-semibold ${triageTextColor}`}>
                    <span>→ {aiTriage.recommendedDepartment}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> ~{aiTriage.estimatedWaitMinutes}m wait</span>
                  </div>
                </div>
              )}

              <button type="submit" disabled={submitting} className={btnCta}>
                {submitting ? 'Registering…' : 'Register & Assign Priority Queue Slot'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* ─── Right: Live Queue ─── */}
        <div className="lg:col-span-6">
          <div className={`${card} p-5`}>
            <div className={cardHeader}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white text-sm">Active Clinical Queue</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Live priority stream</p>
                </div>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                {queue.length} registered
              </span>
            </div>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {queue.map(entry => {
                const isEmergency = entry.priority === 'emergency';
                return (
                  <div key={entry.id} className={isEmergency ? listItemEmergency : listItem}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-sm text-slate-900 dark:text-white">{entry.patient_name}</span>
                          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">{entry.queue_number}</span>
                          <span className={priorityBadge[entry.priority] || priorityBadge.low}>{entry.priority}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                          {entry.service_type} · {entry.doctor_name || 'Dr. Vikram Sethi'}
                        </p>
                        {entry.notes && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-1.5 italic line-clamp-2">{entry.notes}</p>
                        )}
                      </div>
                      <span className={statusBadge[entry.status] || statusBadge.waiting}>
                        {entry.status.replace('-', ' ')}
                      </span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" /> ~{entry.estimated_wait_time || 10}m
                      </span>
                      <div className="flex gap-2">
                        {entry.status === 'waiting' && (
                          <button onClick={() => updateEntryStatus(entry.id, 'in-progress')} className={btnPrimary}>
                            Call In
                          </button>
                        )}
                        {entry.status === 'in-progress' && (
                          <button onClick={() => updateEntryStatus(entry.id, 'completed')} className={btnSuccess}>
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
