import React, { useState } from 'react';
import { Shield, Users, Activity, Building2, Server, CheckCircle2, RefreshCw, Globe, ShieldCheck } from 'lucide-react';
import {
  btnPrimary,
  card, cardHeader, pageHeader, statPill, toast as toastCls,
} from '../../lib/ui';

export default function AdminDashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState('');

  const stats = [
    { title: 'Registered Patients', value: '1,428', change: '+14% this week', Icon: Users, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/40' },
    { title: 'Avg Triage Wait', value: '12.4 min', change: '−3.2 min vs paper', Icon: Activity, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
    { title: 'EHR Sync Rate', value: '99.4%', change: '+4.1% compliance', Icon: ShieldCheck, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/40' },
    { title: 'Active Facilities', value: '8', change: 'All online', Icon: Building2, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' },
  ];

  const staffMembers = [
    { name: 'Dr. Vikram Sethi, MD', role: 'Chief of Cardiology & Internal Med', status: 'In Consultation', department: 'OPD Clinical' },
    { name: 'Dr. Sunita Rao, MD', role: 'Consultant Endocrinologist', status: 'Reviewing Lab Panels', department: 'OPD Clinical' },
    { name: 'Sunil Verma, B.Pharm', role: 'Head Pharmacist', status: 'Active Dispensing', department: 'Pharmacy' },
    { name: 'Dr. Meenakshi Iyer, MD', role: 'Pathologist & Lab Director', status: 'Accessioning', department: 'Lab' },
    { name: 'Pooja Deshmukh', role: 'Triage Reception Officer', status: 'Active Intake', department: 'Registration' },
  ];

  const systemServices = [
    { name: 'Data Sync Bus', status: 'Optimal', latency: '24ms', uptime: '99.99%' },
    { name: 'AI Triage Pipeline', status: 'Optimal', latency: '42ms', uptime: '99.95%' },
    { name: 'Medical Record Vault', status: 'Connected', latency: '14ms', uptime: '100.00%' },
    { name: 'Hospital Gateway', status: 'Authenticated', latency: '35ms', uptime: '99.98%' },
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setToast('System metrics refreshed successfully.');
      setTimeout(() => setToast(''), 4000);
    }, 600);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className={pageHeader}>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            Administration
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Cross-departmental metrics, staff status, and system health.
          </p>
        </div>
        <button onClick={handleRefresh} className={btnPrimary}>
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className={toastCls}>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium">{toast}</span>
          </div>
          <button onClick={() => setToast('')} className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline shrink-0">Dismiss</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => (
          <div key={idx} className={`${card} p-5`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.title}</span>
              <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                <item.Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2.5">{item.value}</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">{item.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* ─── Left: System Health ─── */}
        <div className="lg:col-span-5">
          <div className={`${card} p-5`}>
            <div className={cardHeader}>
              <h2 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Server className="w-4 h-4 text-slate-500" />
                System Health
              </h2>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> All online
              </span>
            </div>

            <div className="space-y-2.5">
              {systemServices.map((srv, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-xs text-slate-900 dark:text-white">{srv.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">Uptime {srv.uptime}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-semibold text-sky-600 dark:text-sky-400">{srv.latency}</span>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">{srv.status}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2">
              <Globe className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              All patient data is encrypted in transit and at rest under healthcare privacy standards.
            </div>
          </div>
        </div>

        {/* ─── Right: Staff Roster ─── */}
        <div className="lg:col-span-7">
          <div className={`${card} p-5`}>
            <div className={cardHeader}>
              <h2 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-500" />
                On-Duty Staff
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{staffMembers.length} active</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-2.5 font-semibold">Staff Member</th>
                    <th className="pb-2.5 font-semibold">Role</th>
                    <th className="pb-2.5 font-semibold">Dept.</th>
                    <th className="pb-2.5 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {staffMembers.map((member, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">{member.name}</td>
                      <td className="py-3 text-slate-500 dark:text-slate-400">{member.role}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium">{member.department}</span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {member.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
