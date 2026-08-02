import React, { useState } from 'react';
import { Shield, Users, Activity, Building2, Server, CheckCircle2, AlertTriangle, RefreshCw, Database, Cpu, Globe } from 'lucide-react';

export default function AdminDashboard() {
  const [refreshing, setRefreshing] = useState(false);

  const stats = [
    { title: 'Total Patients Registered', value: '1,428', change: '+14% this week', icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-950/80' },
    { title: 'Avg Triage Wait Time', value: '12.4 min', change: '-3.2 min vs legacy', icon: Activity, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-100 dark:bg-cyan-950/80' },
    { title: 'ABDM Health IDs Linked', value: '96.8%', change: '+4.1% compliance', icon: Shield, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-950/80' },
    { title: 'Active Hospital Nodes', value: '8 Facilities', change: 'All online', icon: Building2, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-950/80' },
  ];

  const staffMembers = [
    { name: 'Dr. Vikram Sethi', role: 'Doctor (Cardiology & Internal Med)', status: 'Active (Examining Q001)', department: 'OPD Clinical' },
    { name: 'Dr. Ananya Roy', role: 'Doctor (Pulmonology)', status: 'Active (Consulting Q003)', department: 'OPD Clinical' },
    { name: 'Sunil Verma', role: 'Pharmacist-in-Charge', status: 'Online (Dispensing)', department: 'Central Pharmacy' },
    { name: 'Dr. Meenakshi Iyer', role: 'Pathologist / Lab Director', status: 'Online (Analyzing)', department: 'Diagnostic Pathology' },
    { name: 'Pooja Deshmukh', role: 'Triage Receptionist', status: 'Active (Intake)', department: 'Registration' },
  ];

  const systemServices = [
    { name: 'FastAPI REST Backend', status: 'Healthy', latency: '42ms', uptime: '99.98%' },
    { name: 'Gemini AI Triage Engine', status: 'Operational', latency: '120ms', uptime: '99.94%' },
    { name: 'PostgreSQL Clinical Store', status: 'Connected', latency: '18ms', uptime: '100.00%' },
    { name: 'ABDM National Gateway', status: 'Authenticated', latency: '210ms', uptime: '99.85%' },
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md mb-2 text-cyan-300">
              <Shield className="w-3.5 h-3.5" /> Department 5: Administration & System Telemetry
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Enterprise Hospital Operations & Infrastructure</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Cross-departmental monitoring, role access management, AI inference latency, and ABDM national gateway status overview.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Telemetry Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{item.title}</span>
                <div className={`p-2.5 rounded-xl ${item.bg} ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{item.value}</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">{item.change}</div>
            </div>
          );
        })}
      </div>

      {/* Grid: System Services Health + Staff Access Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: System Infrastructure Status */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-600" />
                Service Health & Latency
              </h2>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> All Systems Nominal
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {systemServices.map((srv, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">{srv.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Uptime: {srv.uptime}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">{srv.latency}</span>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{srv.status}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
              <div className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-cyan-600" /> Cloudflare Edge + Astro MPA
              </div>
              Static Multi-Page Architecture delivers sub-50ms Time-to-First-Byte with zero hydration lag.
            </div>
          </div>
        </div>

        {/* Right: Departmental Staff & Roles */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-600" />
                Department Staff & Role Assignments
              </h2>
              <span className="text-xs text-slate-400">5 Departments</span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-2.5">Staff Member</th>
                    <th className="pb-2.5">Role</th>
                    <th className="pb-2.5">Department</th>
                    <th className="pb-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {staffMembers.map((member, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 font-bold text-slate-900 dark:text-white">{member.name}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-300">{member.role}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                          {member.department}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold text-[10px]">
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
