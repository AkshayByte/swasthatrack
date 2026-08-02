import React, { useState, useEffect } from 'react';
import { SwasthaAPI, type QueueEntry, type Prescription, type LabOrder } from '../../lib/api';
import { UserPlus, Stethoscope, Pill, FlaskConical, Shield, ArrowRight, Activity, Clock, CheckCircle2, Sparkles, Building2, LayoutGrid } from 'lucide-react';

export default function UnifiedDashboard() {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [labOrders, setLabOrders] = useState<LabOrder[]>([]);

  useEffect(() => {
    Promise.all([
      SwasthaAPI.getQueue(),
      SwasthaAPI.getPrescriptions(),
      SwasthaAPI.getLabOrders(),
    ]).then(([q, p, l]) => {
      setQueue(q);
      setPrescriptions(p);
      setLabOrders(l);
    });
  }, []);

  const waitingPatients = queue.filter(q => q.status === 'waiting').length;
  const pendingRx = prescriptions.filter(p => p.status === 'pending').length;
  const pendingLab = labOrders.filter(l => l.status !== 'completed').length;

  const departments = [
    {
      id: 'registration',
      name: 'Registration & Triage',
      desc: 'Patient check-in, ABHA generation & AI symptom triage queue placement',
      icon: UserPlus,
      href: '/dashboard/registration',
      badge: `${waitingPatients} In Queue`,
      gradient: 'from-cyan-600 to-blue-600',
      accent: 'text-cyan-600 dark:text-cyan-400',
      border: 'hover:border-cyan-500/50',
    },
    {
      id: 'doctor',
      name: 'Doctor Consultation',
      desc: 'AI-prioritized clinical queue, clinical examination & order routing',
      icon: Stethoscope,
      href: '/dashboard/doctor',
      badge: `${queue.length} Active Patients`,
      gradient: 'from-indigo-600 to-purple-600',
      accent: 'text-indigo-600 dark:text-indigo-400',
      border: 'hover:border-indigo-500/50',
    },
    {
      id: 'pharmacy',
      name: 'Pharmacy & Stock',
      desc: 'Incoming doctor prescriptions stream, batch tracking & dispensation',
      icon: Pill,
      href: '/dashboard/pharmacy',
      badge: `${pendingRx} Pending Orders`,
      gradient: 'from-emerald-600 to-teal-600',
      accent: 'text-emerald-600 dark:text-emerald-400',
      border: 'hover:border-emerald-500/50',
    },
    {
      id: 'lab',
      name: 'Diagnostics Lab',
      desc: 'Specimen processing, pathology test results & ABDM reports generation',
      icon: FlaskConical,
      href: '/dashboard/lab',
      badge: `${pendingLab} Tests in Lab`,
      gradient: 'from-purple-600 to-pink-600',
      accent: 'text-purple-600 dark:text-purple-400',
      border: 'hover:border-purple-500/50',
    },
    {
      id: 'admin',
      name: 'Admin & Telemetry',
      desc: 'Hospital operations metrics, staff access roles & FastAPI health telemetry',
      icon: Shield,
      href: '/dashboard/admin',
      badge: 'All Systems OK',
      gradient: 'from-slate-800 to-slate-950',
      accent: 'text-slate-700 dark:text-slate-300',
      border: 'hover:border-slate-500/50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md mb-3 text-cyan-300">
              <Sparkles className="w-3.5 h-3.5" /> SwasthaTrack Unified Operations Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Hospital Operations & AI Triage Center
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
              Select a specialized department dashboard below to manage patient intake, doctor examinations, medication dispensation, diagnostic lab orders, or system governance.
            </p>
          </div>

          <div className="flex flex-col gap-2 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md min-w-[200px]">
            <span className="text-xs text-slate-400 font-medium">Platform Architecture</span>
            <div className="flex items-center gap-2 text-sm font-bold text-cyan-300">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span>Astro MPA + React Islands</span>
            </div>
            <span className="text-[11px] text-slate-400">FastAPI & PostgreSQL Synced</span>
          </div>
        </div>
      </div>

      {/* 5 Department Cards Grid */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-6 bg-cyan-600 rounded-full" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Departmental Dashboards</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => {
            const Icon = dept.icon;
            return (
              <a
                key={dept.id}
                href={dept.href}
                className={`group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${dept.border}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${dept.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:rotate-1 transition-all duration-300`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-950/80 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                      {dept.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {dept.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-cyan-600 dark:text-cyan-400">
                  <span>Enter Dashboard</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
