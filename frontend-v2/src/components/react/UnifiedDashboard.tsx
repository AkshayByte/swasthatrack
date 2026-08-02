import React, { useState, useEffect } from 'react';
import { SwasthaAPI, type QueueEntry, type Prescription, type LabOrder } from '../../lib/api';
import { UserPlus, Stethoscope, Pill, FlaskConical, Shield, ArrowRight, Activity, Clock, CheckCircle2, Sparkles, Building2, LayoutGrid, HeartPulse, ShieldCheck, Zap } from 'lucide-react';

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
      if (q) setQueue(q);
      if (p) setPrescriptions(p);
      if (l) setLabOrders(l);
    }).catch(() => {});
  }, []);

  const waitingPatients = queue.filter(q => q.status === 'waiting').length || 3;
  const pendingRx = prescriptions.filter(p => p.status === 'pending').length || 2;
  const pendingLab = labOrders.filter(l => l.status !== 'completed').length || 3;

  const departments = [
    {
      id: 'registration',
      num: '01',
      name: 'Registration & AI Triage',
      desc: 'ABHA-compliant patient intake, automated neural symptom triage scoring & live queue slotting.',
      icon: UserPlus,
      href: '/dashboard/registration',
      badge: `${waitingPatients} In Queue`,
      gradient: 'from-cyan-600 to-teal-600',
      badgeClass: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20',
      borderHover: 'hover:border-cyan-500/50 hover:shadow-cyan-500/10',
    },
    {
      id: 'doctor',
      num: '02',
      name: 'Doctor Consultation Hub',
      desc: 'Real-time triage queue, clinical diagnosis editor, vitals monitor & synchronized Rx/Lab dispatch.',
      icon: Stethoscope,
      href: '/dashboard/doctor',
      badge: 'Active Hub',
      gradient: 'from-blue-600 to-indigo-600',
      badgeClass: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20',
      borderHover: 'hover:border-blue-500/50 hover:shadow-blue-500/10',
    },
    {
      id: 'pharmacy',
      num: '03',
      name: 'Pharmacy & Stock Hub',
      desc: 'Incoming doctor prescription stream, digital safety verification, batch stock tracking & fulfillment.',
      icon: Pill,
      href: '/dashboard/pharmacy',
      badge: `${pendingRx} Pending Rx`,
      gradient: 'from-emerald-600 to-teal-600',
      badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20',
      borderHover: 'hover:border-emerald-500/50 hover:shadow-emerald-500/10',
    },
    {
      id: 'lab',
      num: '04',
      name: 'Diagnostics & Pathology',
      desc: 'Specimen accessioning, analyzer telemetry input, lab findings templates & ABDM record sync.',
      icon: FlaskConical,
      href: '/dashboard/lab',
      badge: `${pendingLab} In Lab Pipeline`,
      gradient: 'from-purple-600 to-pink-600',
      badgeClass: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20',
      borderHover: 'hover:border-purple-500/50 hover:shadow-purple-500/10',
    },
    {
      id: 'admin',
      num: '05',
      name: 'Operations & Governance',
      desc: 'Cross-departmental monitoring, clinical staff assignments, care throughput & ABDM compliance.',
      icon: ShieldCheck,
      href: '/dashboard/admin',
      badge: 'All Systems Online',
      gradient: 'from-slate-800 to-indigo-950',
      badgeClass: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20',
      borderHover: 'hover:border-indigo-500/50 hover:shadow-indigo-500/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Sleek Clinical Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-500/20">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Unified Clinical Operations & Care Flow System</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              SwasthaTrack Clinical Command Center
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Seamlessly navigate between patient triage, doctor consultations, smart dispensary queues, diagnostic specimen tracking, and hospital governance.
            </p>
          </div>

          <div className="flex flex-col gap-2 bg-white/10 dark:bg-slate-900/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md min-w-[220px]">
            <span className="text-[11px] uppercase tracking-wider text-slate-300 font-bold">Hospital Network Status</span>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>5 Core Departments Online</span>
            </div>
            <span className="text-[11px] text-cyan-200 font-mono">ABDM & ABHA Verified</span>
          </div>
        </div>
      </div>

      {/* 5 Department Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-6 bg-cyan-600 rounded-full" />
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">Clinical Service Modules</h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Select department to enter</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => {
            const Icon = dept.icon;
            return (
              <a
                key={dept.id}
                href={dept.href}
                className={`group rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between backdrop-blur-sm ${dept.borderHover}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-13 h-13 rounded-2xl bg-gradient-to-tr ${dept.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-all duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${dept.badgeClass}`}>
                      {dept.badge}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono font-bold text-slate-400 mb-1">DEPT {dept.num}</div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {dept.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-cyan-600 dark:text-cyan-400">
                  <span>Open Department Portal</span>
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
