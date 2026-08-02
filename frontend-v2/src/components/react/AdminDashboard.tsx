import React, { useState } from 'react';
import { Shield, Users, Activity, Building2, Server, CheckCircle2, AlertTriangle, RefreshCw, Database, Cpu, Globe, Lock, ArrowUpRight, Radio, ShieldCheck } from 'lucide-react';

export default function AdminDashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState('');

  const stats = [
    { title: 'Total Registered Patients', value: '1,428', change: '+14% this week', icon: Users, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-500/10' },
    { title: 'Avg Clinical Triage Wait', value: '12.4 min', change: '-3.2 min vs legacy', icon: Activity, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-500/10' },
    { title: 'ABDM ABHA IDs Linked', value: '98.2%', change: '+4.1% compliance', icon: ShieldCheck, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
    { title: 'Active Clinical Nodes', value: '8 Facilities', change: '100% telemetry online', icon: Building2, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10' },
  ];

  const staffMembers = [
    { name: 'Dr. Vikram Sethi, MD', role: 'Chief of Cardiology & Internal Med', status: 'Active In Consultation', department: 'OPD Clinical' },
    { name: 'Dr. Sunita Rao, MD', role: 'Consultant Endocrinologist', status: 'Reviewing Lab Panels', department: 'OPD Clinical' },
    { name: 'Sunil Verma, B.Pharm', role: 'Head Pharmacist-in-Charge', status: 'Active Dispensing', department: 'Central Pharmacy' },
    { name: 'Dr. Meenakshi Iyer, MD', role: 'Pathologist & Lab Director', status: 'Accessioning Specimens', department: 'Diagnostic Lab' },
    { name: 'Pooja Deshmukh', role: 'Triage Reception Officer', status: 'Active Intake Queue', department: 'Registration' },
  ];

  const systemServices = [
    { name: 'Clinical Care Sync Bus', status: 'Optimal', latency: '24ms', uptime: '99.99%' },
    { name: 'Neural Triage Inference Model', status: 'Optimal', latency: '42ms', uptime: '99.95%' },
    { name: 'Encrypted Health Record Vault', status: 'Connected', latency: '14ms', uptime: '100.00%' },
    { name: 'National ABHA Gateway Hub', status: 'Authenticated', latency: '110ms', uptime: '99.92%' },
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setToast('System metrics & staff credentials re-synchronized successfully.');
      setTimeout(() => setToast(''), 4000);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Sleek Clinical Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-500/20">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold backdrop-blur-md">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Department 05 • Hospital Operations & Clinical Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Hospital Administration & Network Oversight
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl">
              Cross-departmental monitoring, real-time clinical node status, staff credential verification, and National Health Authority ABDM compliance metrics.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-md shadow-indigo-500/20 cursor-pointer text-white"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Re-sync Telemetry</span>
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-semibold">{toast}</span>
          </div>
          <button onClick={() => setToast('')} className="text-xs font-bold text-emerald-600 hover:underline">Dismiss</button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 shadow-sm backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{item.title}</span>
                <div className={`p-2.5 rounded-xl ${item.bg} ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-3">{item.value}</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                <span>{item.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: System Services Health + Staff Access Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: System Infrastructure Status */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 p-5 sm:p-6 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Clinical Infrastructure Bus
              </h2>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> All Systems Online
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {systemServices.map((srv, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">{srv.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">Uptime: {srv.uptime}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">{srv.latency}</span>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">{srv.status}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 p-4 rounded-2xl bg-indigo-500/5 dark:bg-indigo-950/20 border border-indigo-500/20 text-xs text-slate-600 dark:text-slate-300">
              <div className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5 text-xs">
                <Globe className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> ABDM & Data Security Compliance
              </div>
              All patient consultations, diagnostic orders, and pharmacy logs are cryptographically sealed and end-to-end encrypted under National Health Authority guidelines.
            </div>
          </div>
        </div>

        {/* Right: Departmental Staff & Roles */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 p-5 sm:p-6 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-600" />
                On-Duty Clinical Staff & Access Roster
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">5 Active Specialists</span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-bold">Staff Member</th>
                    <th className="pb-3 font-bold">Role / Specialty</th>
                    <th className="pb-3 font-bold">Department</th>
                    <th className="pb-3 font-bold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {staffMembers.map((member, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white">{member.name}</td>
                      <td className="py-3.5 text-slate-600 dark:text-slate-300">{member.role}</td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px] font-semibold">
                          {member.department}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] uppercase tracking-wider">
                          {member.status}
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
