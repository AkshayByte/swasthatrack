import { useState, useEffect } from 'react';
import { SwasthaAPI, formatApiError, type QueueEntry, type QueueStatus, type TriageResult, type TriageUrgency } from '../../lib/api';
import DashboardErrorBoundary from './DashboardErrorBoundary';
import { UserPlus, Sparkles, Clock, AlertTriangle, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import {
  priorityBadge, statusBadge,
  btnPrimary, btnSuccess,
  inputClass, inputMono, selectClass, textareaClass,
  card, cardHeader, label, pageHeader, statPill, toast as toastCls,
  listItem, listItemEmergency, alertDanger,
} from '../../lib/ui';

const ACTIVE_QUEUE_STATUSES: QueueStatus[] = ['waiting', 'called', 'in-progress'];

function buildTriageKey(
  symptoms: string, temp: string, bp: string, spo2: string, hr: string, age: string, gender: string
) {
  return JSON.stringify({
    symptoms: symptoms.trim(),
    temp,
    bp,
    spo2,
    hr,
    age: Number(age) || undefined,
    gender,
  });
}

function RegistrationDashboardContent() {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [temp, setTemp] = useState('98.6');
  const [bp, setBp] = useState('120/80');
  const [spo2, setSpo2] = useState('');
  const [hr, setHr] = useState('');

  const [aiTriage, setAiTriage] = useState<TriageResult | null>(null);
  const [aiTriageKey, setAiTriageKey] = useState('');
  const [overrideUrgency, setOverrideUrgency] = useState<TriageUrgency | ''>('');
  const [triageLoading, setTriageLoading] = useState(false);
  const [triageError, setTriageError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const qList = await SwasthaAPI.getQueue();
      const active = qList.filter(q => ACTIVE_QUEUE_STATUSES.includes(q.status));
      active.sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0));
      setQueue(active);
    } catch (err) {
      setError('Failed to load queue data. Please refresh the page.');
      console.error(err);
    } finally {
      setLoading(false);
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
  }, []);

  useEffect(() => {
    if (symptoms.trim().length <= 3) {
      setAiTriage(null);
      setAiTriageKey('');
      setOverrideUrgency('');
      setTriageError('');
      setTriageLoading(false);
      return;
    }

    let cancelled = false;
    setTriageLoading(true);
    setTriageError('');
    const requestKey = buildTriageKey(symptoms, temp, bp, spo2, hr, age, gender);

    const timeout = setTimeout(async () => {
      try {
        const triage = await SwasthaAPI.calculateAITriage(
          symptoms,
          { temp, bp, spo2, hr },
          { age: Number(age) || undefined, gender }
        );
        if (!cancelled) {
          setAiTriage(triage);
          setAiTriageKey(requestKey);
        }
      } catch (err: any) {
        if (!cancelled) {
          setAiTriage(null);
          setAiTriageKey('');
          setTriageError(formatApiError(err, 'Triage service unavailable.'));
        }
      } finally {
        if (!cancelled) setTriageLoading(false);
      }
    }, 600);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [symptoms, temp, bp, spo2, hr, age, gender]);

  const applyPreset = (s: string, b: string, t: string) => {
    setSymptoms(s);
    setBp(b);
    setTemp(t);
    setOverrideUrgency('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitting(true);
    setError('');
    try {
      const triageKey = buildTriageKey(symptoms, temp, bp, spo2, hr, age, gender);
      let triage: TriageResult;
      if (aiTriage && aiTriageKey === triageKey) {
        triage = aiTriage;
      } else {
        triage = await SwasthaAPI.calculateAITriage(
          symptoms || 'General Checkup',
          { temp, bp, spo2, hr },
          { age: Number(age) || undefined, gender }
        );
        setAiTriage(triage);
        setAiTriageKey(triageKey);
      }

      // Step 1: Create patient
      const np = await SwasthaAPI.createPatient({
        name, age: Number(age) || 30, gender, phone, blood_group: bloodGroup
      });

      // Step 2: Add to queue using the server triage result, unless a
      // clinician has explicitly overridden the urgency.
      const effectiveUrgency = overrideUrgency || triage.urgency;
      const overrideNote = overrideUrgency && overrideUrgency !== triage.urgency
        ? ` | Clinician override: ${overrideUrgency} (AI: ${triage.urgency})`
        : '';
      const vitalNotes = [
        bp && `BP: ${bp}`,
        temp && `Temp: ${temp}°F`,
        spo2 && `SpO2: ${spo2}%`,
        hr && `HR: ${hr} bpm`,
      ].filter(Boolean).join(', ');

      await SwasthaAPI.addToQueue({
        patient_id: np.id,
        service_type: triage.recommendedDepartment,
        priority: effectiveUrgency,
        priority_score: triage.priorityScore,
        notes: `AI Triage (${triage.source}): ${triage.reasoning}${overrideNote} | ${vitalNotes}`,
        estimated_wait_time: triage.estimatedWaitMinutes,
      });

      await loadData();
      setSuccessMessage(`${name} registered — ${effectiveUrgency.toUpperCase()} priority, routed to ${triage.recommendedDepartment}`);
      setName(''); setAge(''); setPhone(''); setSymptoms(''); setAiTriage(null); setAiTriageKey(''); setOverrideUrgency('');
    } catch (err: any) {
      setError(formatApiError(err, 'Registration failed. Please try again.'));
    } finally {
      setSubmitting(false);
      setTimeout(() => { setSuccessMessage(''); setError(''); }, 6000);
    }
  };

  const updateEntryStatus = async (id: number, status: QueueStatus) => {
    try {
      await SwasthaAPI.updateQueueStatus(id, status);
      setQueue(prev => prev.map(q => q.id === id ? { ...q, status } : q));
    } catch (err: any) {
      const msg = formatApiError(err, 'Failed to update status');
      setError(`Unable to ${status === 'completed' ? 'complete' : status === 'in-progress' ? 'call in' : 'cancel'} patient: ${msg}`);
    }
  };

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

      {/* Error Banner */}
      {error && (
        <div className={alertDanger}>
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError('')} className="text-xs font-semibold text-rose-700 dark:text-rose-300 hover:underline shrink-0">Dismiss</button>
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
                <div>
                  <label className={label}>SpO₂ (%)</label>
                  <input type="text" value={spo2} onChange={e => setSpo2(e.target.value)} placeholder="98" className={inputMono} />
                </div>
                <div>
                  <label className={label}>Heart Rate (bpm)</label>
                  <input type="text" value={hr} onChange={e => setHr(e.target.value)} placeholder="72" className={inputMono} />
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
              {triageLoading && (
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-500 dark:text-slate-400">
                  Calculating triage from the server…
                </div>
              )}
              {triageError && (
                <div className={alertDanger}>
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{triageError}</span>
                </div>
              )}
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
                       <span className="px-2 py-0.5 rounded-md bg-white/60 dark:bg-black/20 text-[11px] font-mono border border-current/20">
                         Score {aiTriage.priorityScore}/100
                       </span>
                       <span className="px-2 py-0.5 rounded-md bg-white/60 dark:bg-black/20 text-[10px] font-semibold border border-current/20">
                         {aiTriage.source === 'gemini' ? 'Gemini' : 'Rule fallback'}
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
                  <div className={`mt-2.5 pt-2 border-t border-current/20 flex items-center justify-between gap-2 text-xs font-semibold ${triageTextColor}`}>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> ~{aiTriage.estimatedWaitMinutes}m AI wait estimate</span>
                    <label className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase tracking-wider opacity-80">Clinician override</span>
                      <select
                        value={overrideUrgency}
                        onChange={e => setOverrideUrgency(e.target.value as TriageUrgency | '')}
                        className="px-1.5 py-1 rounded-md bg-white/70 dark:bg-black/30 border border-current/20 text-[11px] font-semibold"
                      >
                        <option value="">Use AI result</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="emergency">Emergency</option>
                      </select>
                    </label>
                  </div>
                  {overrideUrgency && (
                    <p className={`mt-1.5 text-[11px] ${triageTextColor} opacity-90`}>
                      Override recorded in the queue notes. AI suggested {aiTriage.urgency}.
                    </p>
                  )}
                  <div className={`mt-1.5 text-xs font-semibold ${triageTextColor}`}>
                    → {aiTriage.recommendedDepartment}
                  </div>
                </div>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
              >
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
              {loading && queue.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400">Loading queue…</div>
              ) : queue.map(entry => {
                const isEmergency = entry.priority === 'emergency' || entry.priority_score >= 90;
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
                          {entry.service_type} · {entry.doctor_name || 'Unassigned'}
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

export default function RegistrationDashboard() {
  return (
    <DashboardErrorBoundary label="Registration">
      <RegistrationDashboardContent />
    </DashboardErrorBoundary>
  );
}
