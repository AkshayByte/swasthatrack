import React, { useState, useEffect } from 'react';
import { SwasthaAPI, type Patient, type QueueEntry } from '../../lib/api';
import { UserPlus, Sparkles, Clock, AlertTriangle, CheckCircle2, Search, ArrowRight, UserCheck, ShieldAlert, Activity, HeartPulse, Zap, Stethoscope, Phone, Shield } from 'lucide-react';

const fallbackQueueData: QueueEntry[] = [
  {
    id: 101,
    patient_id: 1,
    patient_name: 'Rajesh Sharma',
    service_type: 'Cardiology OPD',
    priority: 'high',
    status: 'in-progress',
    queue_number: 'Q-101',
    doctor_name: 'Dr. Vikram Sethi, MD',
    notes: 'Substernal chest tightness radiating to left shoulder on exertion | BP 145/92',
    estimated_wait_time: 5,
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    id: 102,
    patient_id: 2,
    patient_name: 'Anita Patel',
    service_type: 'Endocrinology OPD',
    priority: 'medium',
    status: 'waiting',
    queue_number: 'Q-102',
    doctor_name: 'Dr. Sunita Rao, MD',
    notes: 'Type-2 Diabetes routine HbA1c review and insulin adjustment | BP 124/80',
    estimated_wait_time: 18,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    id: 103,
    patient_id: 3,
    patient_name: 'Mohan Lal Verma',
    service_type: 'Emergency Medicine',
    priority: 'emergency',
    status: 'waiting',
    queue_number: 'Q-103',
    doctor_name: 'Dr. Vikram Sethi, MD',
    notes: 'Severe hypertensive crisis (BP 175/110 mmHg), acute dizziness and vertigo',
    estimated_wait_time: 0,
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  }
];

export default function RegistrationDashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [queue, setQueue] = useState<QueueEntry[]>(fallbackQueueData);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [temp, setTemp] = useState('98.6');
  const [bp, setBp] = useState('120/80');

  // AI Triage Assessment state
  const [aiTriage, setAiTriage] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const loadData = async () => {
    try {
      const [pList, qList] = await Promise.all([
        SwasthaAPI.getPatients(),
        SwasthaAPI.getQueue()
      ]);
      if (pList && pList.length > 0) setPatients(pList);
      if (qList && qList.length > 0) setQueue(qList);
    } catch (e) {
      // Keep fallbacks
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Recalculate AI Triage live as user types symptoms
  useEffect(() => {
    if (symptoms.trim().length > 3) {
      const assessment = SwasthaAPI.calculateAITriage(symptoms, { temp, bp });
      setAiTriage(assessment);
    } else {
      setAiTriage(null);
    }
  }, [symptoms, temp, bp]);

  const applyPreset = (presetSymptoms: string, presetBp: string, presetTemp: string) => {
    setSymptoms(presetSymptoms);
    setBp(presetBp);
    setTemp(presetTemp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setSubmitting(true);
    try {
      const triage = SwasthaAPI.calculateAITriage(symptoms || 'General Checkup', { temp, bp });

      let newPatientId = Date.now();
      try {
        const newPatient = await SwasthaAPI.createPatient({
          name,
          age: Number(age) || 30,
          gender,
          phone,
          blood_group: bloodGroup,
        });
        newPatientId = newPatient.id;
      } catch (e) {}

      const newEntry: QueueEntry = {
        id: Date.now(),
        patient_id: newPatientId,
        patient_name: name,
        service_type: triage.recommendedDepartment,
        priority: triage.urgency,
        status: 'waiting',
        queue_number: `Q-${Math.floor(100 + Math.random() * 900)}`,
        doctor_name: 'Dr. Vikram Sethi, MD',
        notes: `AI Triage: ${triage.reasoning} | BP: ${bp}, Temp: ${temp}°F`,
        estimated_wait_time: triage.estimatedWaitMinutes,
        created_at: new Date().toISOString()
      };

      setQueue(prev => [newEntry, ...prev]);
      setSuccessMessage(`Patient ${name} registered & assigned to ${triage.recommendedDepartment} (${triage.urgency.toUpperCase()} priority)!`);
      
      // Reset Form
      setName('');
      setAge('');
      setPhone('');
      setSymptoms('');
      setAiTriage(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
      setTimeout(() => setSuccessMessage(''), 6000);
    }
  };

  const updateEntryStatus = (id: number, status: 'waiting' | 'in-progress' | 'completed') => {
    setQueue(prev => prev.map(q => q.id === id ? { ...q, status } : q));
  };

  const waitingCount = queue.filter(q => q.status === 'waiting').length;
  const inProgressCount = queue.filter(q => q.status === 'in-progress').length;

  return (
    <div className="space-y-6">
      {/* Sleek Clinical Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950 to-teal-900 dark:from-slate-950 dark:via-cyan-950 dark:to-slate-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-cyan-500/20">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Department 01 • Patient Intake & Intelligent Triage</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Patient Registration & Clinical Queue Hub
            </h1>
            <p className="text-cyan-100/80 text-sm max-w-2xl">
              Rapid ABHA-compliant patient intake with real-time neural triage acuity calculation and automated departmental routing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 dark:bg-slate-900/60 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-center">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-cyan-300">In Waiting</div>
              <div className="text-2xl font-black text-white">{waitingCount}</div>
            </div>
            <div className="bg-white/10 dark:bg-slate-900/60 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-center">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">In Consult</div>
              <div className="text-2xl font-black text-white">{inProgressCount}</div>
            </div>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-semibold">{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="text-xs font-bold text-emerald-600 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Grid: Registration Form + Live Queue List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Registration & AI Triage Form */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 p-5 sm:p-6 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 text-white flex items-center justify-center font-bold shadow-md shadow-cyan-500/20">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white text-base">New Patient Intake</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Generate digital token & clinical queue slot</p>
              </div>
            </div>

            {/* Quick Presets for Demo */}
            <div className="mt-4 pt-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Fast Triage Presets
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset('Acute crushing retrosternal chest pain radiating to left jaw, diaphoresis and dizziness', '165/105', '98.8')}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/20 transition-all"
                >
                  🚨 Chest Pain (STAT)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('High grade persistent fever with rigors for 4 days, severe body ache and dry cough', '125/82', '103.2')}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/20 transition-all"
                >
                  🌡️ High Fever / Rigors
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('Chronic Type-2 Diabetes quarterly checkup, morning fasting sugar 152 mg/dL', '128/84', '98.4')}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/20 transition-all"
                >
                  🩺 Diabetes Routine
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikramaditya Rathore"
                    className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="35"
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none font-semibold"
                  >
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>O+</option>
                    <option>O-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                  </select>
                </div>
              </div>

              {/* Vitals */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Temperature (°F)</label>
                  <input
                    type="text"
                    value={temp}
                    onChange={(e) => setTemp(e.target.value)}
                    placeholder="98.6"
                    className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Blood Pressure (BP)</label>
                  <input
                    type="text"
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                    placeholder="120/80"
                    className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Chief Complaints / Symptoms */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    Chief Complaints & Symptoms (Triggers Neural Triage)
                  </label>
                </div>
                <textarea
                  rows={3}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe patient complaints, onset duration, and distress level..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              {/* Live AI Assessment Box */}
              {aiTriage && (
                <div className={`p-4 rounded-2xl border transition-all duration-200 ${
                  aiTriage.urgency === 'emergency'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200'
                    : aiTriage.urgency === 'high'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
                    : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-900 dark:text-cyan-200'
                }`}>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-1.5">
                      {aiTriage.urgency === 'emergency' ? <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" /> : <Sparkles className="w-4 h-4 text-cyan-600" />}
                      Neural Triage Priority: {aiTriage.urgency}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border text-[11px] font-mono">
                      Acuity: {aiTriage.priorityScore}/100
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">{aiTriage.reasoning}</p>
                  <div className="mt-2.5 pt-2 border-t border-current/20 flex items-center justify-between text-xs font-bold">
                    <span>Routing: {aiTriage.recommendedDepartment}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Est. Queue: ~{aiTriage.estimatedWaitMinutes}m</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? 'Registering & Calculating Queue...' : 'Register & Assign Priority Queue Slot'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right: Live Queue List & Status Updates */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 p-5 sm:p-6 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-base">Active Clinical Queue</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Live priority stream for Dr. Consultation</p>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                {queue.length} Registered
              </span>
            </div>

            <div className="space-y-3 mt-4 max-h-[580px] overflow-y-auto pr-1">
              {queue.map((entry) => {
                const isEmergency = entry.priority === 'emergency';
                const isHigh = entry.priority === 'high';
                return (
                  <div
                    key={entry.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isEmergency
                        ? 'border-rose-500/40 bg-rose-500/5 dark:bg-rose-950/20'
                        : isHigh
                        ? 'border-amber-500/40 bg-amber-500/5 dark:bg-amber-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {entry.patient_name}
                          </span>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {entry.queue_number}
                          </span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            isEmergency
                              ? 'bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 animate-pulse'
                              : isHigh
                              ? 'bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300'
                              : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300'
                          }`}>
                            {entry.priority}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Ward: <span className="font-semibold text-slate-700 dark:text-slate-300">{entry.service_type}</span> • Doctor: <span className="font-medium text-slate-600 dark:text-slate-400">{entry.doctor_name || 'Dr. Vikram Sethi'}</span>
                        </p>
                        {entry.notes && (
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 italic bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200/60 dark:border-slate-800">
                            {entry.notes}
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                          entry.status === 'in-progress'
                            ? 'bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300'
                            : entry.status === 'completed'
                            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {entry.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono text-[11px]">
                        <Clock className="w-3.5 h-3.5" /> Est. wait ~{entry.estimated_wait_time || 10}m
                      </span>
                      <div className="flex gap-2">
                        {entry.status === 'waiting' && (
                          <button
                            onClick={() => updateEntryStatus(entry.id, 'in-progress')}
                            className="px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs shadow-sm hover:from-cyan-500 hover:to-blue-500 transition-all cursor-pointer"
                          >
                            Call to Consultation
                          </button>
                        )}
                        {entry.status === 'in-progress' && (
                          <button
                            onClick={() => updateEntryStatus(entry.id, 'completed')}
                            className="px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-sm hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer"
                          >
                            Mark Completed
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
