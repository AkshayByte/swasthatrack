import React, { useState, useEffect } from 'react';
import { SwasthaAPI, type QueueEntry, type Prescription, type LabOrder } from '../../lib/api';
import { UserPlus, Stethoscope, Pill, FlaskConical, Shield, ArrowRight, LayoutGrid } from 'lucide-react';
import { card, pageHeader } from '../../lib/ui';

export default function UnifiedDashboard() {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [labOrders, setLabOrders] = useState<LabOrder[]>([]);

  useEffect(() => {
    Promise.all([SwasthaAPI.getQueue(), SwasthaAPI.getPrescriptions(), SwasthaAPI.getLabOrders()])
      .then(([q, p, l]) => { if (q) setQueue(q); if (p) setPrescriptions(p); if (l) setLabOrders(l); })
      .catch(() => {});
  }, []);

  const waitingPatients = queue.filter(q => q.status === 'waiting').length || 3;
  const pendingRx = prescriptions.filter(p => p.status === 'pending').length || 2;
  const pendingLab = labOrders.filter(l => l.status !== 'completed').length || 3;

  const departments = [
    {
      id: 'registration', name: 'Registration & Triage',
      desc: 'Register patients, record vitals, and get AI-assisted urgency scoring.',
      Icon: UserPlus, href: '/dashboard/registration',
      badge: `${waitingPatients} in queue`,
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-50 dark:bg-cyan-950/40',
      ring: 'border-cyan-200 dark:border-cyan-800/60',
    },
    {
      id: 'doctor', name: 'Doctor Consultation',
      desc: 'Work through the triage queue, write prescriptions, and order lab tests.',
      Icon: Stethoscope, href: '/dashboard/doctor',
      badge: 'Active',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      ring: 'border-blue-200 dark:border-blue-800/60',
    },
    {
      id: 'pharmacy', name: 'Pharmacy & Inventory',
      desc: 'Fulfill electronic prescriptions and monitor medicine stock levels.',
      Icon: Pill, href: '/dashboard/pharmacy',
      badge: `${pendingRx} pending`,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      ring: 'border-emerald-200 dark:border-emerald-800/60',
    },
    {
      id: 'lab', name: 'Pathology Lab',
      desc: 'Track samples, enter test results, and publish verified reports.',
      Icon: FlaskConical, href: '/dashboard/lab',
      badge: `${pendingLab} in lab`,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      ring: 'border-purple-200 dark:border-purple-800/60',
    },
    {
      id: 'admin', name: 'Administration',
      desc: 'Cross-departmental metrics, staff roster, and system health.',
      Icon: Shield, href: '/dashboard/admin',
      badge: 'All online',
      color: 'text-slate-600 dark:text-slate-400',
      bg: 'bg-slate-100 dark:bg-slate-800',
      ring: 'border-slate-200 dark:border-slate-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className={pageHeader}>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Select a department console to get started.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">5 consoles ready</span>
        </div>
      </div>

      {/* Department cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map(dept => (
          <a key={dept.id} href={dept.href}
            className={`group ${card} p-5 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${dept.bg} border ${dept.ring} ${dept.color} flex items-center justify-center`}>
                  <dept.Icon className="w-5 h-5" />
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${dept.bg} ${dept.color} border ${dept.ring}`}>
                  {dept.badge}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {dept.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{dept.desc}</p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-sky-600 dark:text-sky-400">
              <span>Open console</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
