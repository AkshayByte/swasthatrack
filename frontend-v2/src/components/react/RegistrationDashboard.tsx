import React, { useState, useEffect } from 'react';
import { SwasthaAPI, type Patient, type QueueEntry } from '../../lib/api';
import { UserPlus, Sparkles, Clock, AlertTriangle, CheckCircle2, Search, ArrowRight, UserCheck, ShieldAlert, Activity } from 'lucide-react';

export default function RegistrationDashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(true);

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
    setLoading(true);
    const [pList, qList] = await Promise.all([
      SwasthaAPI.getPatients(),
      SwasthaAPI.getQueue()
    ]);
    setPatients(pList);
    setQueue(qList);
    setLoading(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setSubmitting(true);
    try {
      // 1. Create Patient
      const newPatient = await SwasthaAPI.createPatient({
        name,
        age: Number(age) || 30,
        gender,
        phone,
        blood_group: bloodGroup,
      });

      // 2. Compute triage urgency
      const triage = SwasthaAPI.calculateAITriage(symptoms || 'General Checkup', { temp, bp });

      // 3. Add to Queue
      await SwasthaAPI.addToQueue({
        patient_id: newPatient.id,
        patient_name: newPatient.name,
        service_type: triage.recommendedDepartment,
        priority: triage.urgency,
        notes: `AI Triage: ${triage.reasoning} | Vitals: BP ${bp}, Temp ${temp}°F`,
        estimated_wait_time: triage.estimatedWaitMinutes
      });

      setSuccessMessage(`Patient ${newPatient.name} registered & assigned to ${triage.recommendedDepartment} (${triage.urgency.toUpperCase()} priority)!`);
      
      // Reset Form
      setName('');
      setAge('');
      setPhone('');
      setSymptoms('');
      setAiTriage(null);

      // Reload
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
      setTimeout(() => setSuccessMessage(''), 6000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Department 1: Registration & AI Triage
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Patient Intake & Automated Queue Assignment</h1>
            <p className="text-cyan-100 text-sm mt-1 max-w-2xl">
              Intelligent triage algorithm predicts clinical acuity from chief complaints and optimizes queue order for doctor consultation.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-xl backdrop-blur-md border border-white/20">
            <Activity className="w-5 h-5 text-cyan-300 animate-pulse" />
            <div>
              <div className="text-xs text-cyan-100">Live Active Queue</div>
              <div className="text-lg font-bold">{queue.filter(q => q.status === 'waiting' || q.status === 'in-progress').length} Patients Waiting</div>
            </div>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      {/* Grid: Registration Form + Live Queue List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Registration & AI Triage Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-400 flex items-center justify-center font-bold">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">Register New Patient</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Generate ABHA-compliant registry & triage</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikramaditya Rathore"
                    className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="35"
                    className="w-full px-3 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
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
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Temperature (°F)</label>
                  <input
                    type="text"
                    value={temp}
                    onChange={(e) => setTemp(e.target.value)}
                    placeholder="98.6"
                    className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Blood Pressure (BP)</label>
                  <input
                    type="text"
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                    placeholder="120/80"
                    className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Chief Complaints / Symptoms (Triggers AI Triage) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    Chief Complaints & Symptoms (AI Triage Input)
                  </label>
                  <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-medium">Real-time Analysis</span>
                </div>
                <textarea
                  rows={3}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. Chest pain radiating to arm, breathing difficulty, dizziness OR high fever since 3 days..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              {/* Live AI Assessment Box */}
              {aiTriage && (
                <div className={`p-4 rounded-xl border transition-all ${
                  aiTriage.urgency === 'emergency'
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                    : aiTriage.urgency === 'high'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                    : 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-300 dark:border-cyan-800 text-cyan-900 dark:text-cyan-200'
                }`}>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-1.5">
                      {aiTriage.urgency === 'emergency' ? <AlertTriangle className="w-4 h-4 text-rose-600" /> : <Sparkles className="w-4 h-4 text-cyan-600" />}
                      AI Triage Assessment: {aiTriage.urgency}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border text-xs">
                      Priority Score: {aiTriage.priorityScore}/100
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">{aiTriage.reasoning}</p>
                  <div className="mt-2.5 pt-2 border-t border-current/20 flex items-center justify-between text-xs font-semibold">
                    <span>Target: {aiTriage.recommendedDepartment}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Est. Wait: ~{aiTriage.estimatedWaitMinutes} mins</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-md hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                {submitting ? 'Registering...' : 'Register & Assign to Queue'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right: Live Queue List & Status Updates */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">Active Patient Queue</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Live priority queue for Dr. Consultation</p>
                </div>
              </div>
              <button
                onClick={loadData}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              >
                Refresh
              </button>
            </div>

            <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
              {loading ? (
                <div className="py-12 text-center text-xs text-slate-400">Loading queue data...</div>
              ) : queue.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">No patients currently in queue.</div>
              ) : (
                queue.map((entry) => {
                  const isEmergency = entry.priority === 'emergency';
                  const isHigh = entry.priority === 'high';
                  return (
                    <div
                      key={entry.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isEmergency
                          ? 'border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20'
                          : isHigh
                          ? 'border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {entry.patient_name}
                            </span>
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              {entry.queue_number}
                            </span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              isEmergency
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200'
                                : isHigh
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
                                : 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-200'
                            }`}>
                              {entry.priority}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Assigned: <span className="font-medium text-slate-700 dark:text-slate-300">{entry.service_type}</span> • Doctor: <span className="font-medium">{entry.doctor_name || 'Assigned On Duty'}</span>
                          </p>
                          {entry.notes && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 italic line-clamp-1">
                              {entry.notes}
                            </p>
                          )}
                        </div>

                        <div className="text-right">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            entry.status === 'in-progress'
                              ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                              : entry.status === 'completed'
                              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            {entry.status}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Est. wait ~{entry.estimated_wait_time}m
                        </span>
                        <div className="flex gap-2">
                          {entry.status === 'waiting' && (
                            <button
                              onClick={async () => {
                                await SwasthaAPI.updateQueueStatus(entry.id, 'in-progress');
                                loadData();
                              }}
                              className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-medium text-xs transition-colors"
                            >
                              Call to Consultation
                            </button>
                          )}
                          {entry.status === 'in-progress' && (
                            <button
                              onClick={async () => {
                                await SwasthaAPI.updateQueueStatus(entry.id, 'completed');
                                loadData();
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors"
                            >
                              Mark Completed
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
