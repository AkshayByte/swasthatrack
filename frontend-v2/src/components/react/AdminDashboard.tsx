import { useState, useEffect } from 'react';
import { Shield, Users, Activity, FlaskConical, Package, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { SwasthaAPI, formatApiError, type DashboardSummary } from '../../lib/api';
import DashboardErrorBoundary from './DashboardErrorBoundary';
import {
  btnPrimary,
  card, cardHeader, pageHeader, toast as toastCls, alertDanger,
} from '../../lib/ui';

function AdminDashboardContent() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const loadSummary = async (showToast = false) => {
    setRefreshing(true);
    try {
      const data = await SwasthaAPI.getDashboardSummary();
      setSummary(data);
      setError('');
      if (showToast) {
        setToast('Dashboard metrics refreshed from the server.');
        setTimeout(() => setToast(''), 4000);
      }
    } catch (err: any) {
      setError(formatApiError(err, 'Failed to load dashboard metrics.'));
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSummary();

    const interval = setInterval(() => {
      if (!document.hidden) loadSummary();
    }, 15000);

    const handleVisibilityChange = () => {
      if (!document.hidden) loadSummary();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const stats = summary ? [
    {
      title: 'Registered Patients', value: summary.total_patients.toLocaleString(),
      detail: `${summary.today_registrations} registered today`,
      Icon: Users, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/40',
    },
    {
      title: 'Active Queue', value: summary.active_queue.toLocaleString(),
      detail: `${summary.pending_prescriptions} prescriptions pending`,
      Icon: Activity, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      title: 'Pending Lab Orders', value: summary.pending_lab_orders.toLocaleString(),
      detail: 'Awaiting sample or analysis',
      Icon: FlaskConical, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/40',
    },
    {
      title: 'Medicines Tracked', value: summary.total_medicines.toLocaleString(),
      detail: `${summary.low_stock_medicines} at or below minimum stock`,
      Icon: Package, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40',
    },
  ] : [];

  const totalQueue = summary?.queue_by_department.reduce((sum, item) => sum + item.count, 0) || 0;

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
            Live cross-departmental metrics from the hospital database.
          </p>
        </div>
        <button onClick={() => loadSummary(true)} disabled={refreshing} className={`${btnPrimary} disabled:opacity-60`}>
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

      {error && (
        <div className={alertDanger}>
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError('')} className="text-xs font-semibold text-rose-700 dark:text-rose-300 hover:underline shrink-0">Dismiss</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {!summary && !error ? (
          <div className="sm:col-span-2 lg:col-span-4 py-8 text-center text-xs text-slate-400">Loading metrics…</div>
        ) : stats.map(item => (
          <div key={item.title} className={`${card} p-5`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.title}</span>
              <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                <item.Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2.5">{item.value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">{item.detail}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* ─── Left: Department queue load ─── */}
        <div className="lg:col-span-7">
          <div className={`${card} p-5`}>
            <div className={cardHeader}>
              <h2 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-500" />
                Active Queue by Department
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{totalQueue} active</span>
            </div>

            {summary && summary.queue_by_department.length > 0 ? (
              <div className="space-y-3">
                {summary.queue_by_department.map(dept => {
                  const pct = totalQueue > 0 ? Math.round((dept.count / totalQueue) * 100) : 0;
                  return (
                    <div key={dept.department}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{dept.department}</span>
                        <span className="font-mono text-slate-500 dark:text-slate-400">{dept.count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div className="h-full rounded-full bg-sky-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">No active queue entries.</div>
            )}
          </div>
        </div>

        {/* ─── Right: Operational alerts ─── */}
        <div className="lg:col-span-5">
          <div className={`${card} p-5`}>
            <div className={cardHeader}>
              <h2 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Operational Alerts
              </h2>
            </div>

            {summary ? (
              <div className="space-y-2.5">
                <a href="/dashboard/pharmacy" className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex items-center justify-between text-xs hover:border-sky-400 transition-colors">
                  <span className="text-slate-600 dark:text-slate-300">Pending prescriptions</span>
                  <span className="font-bold text-slate-900 dark:text-white">{summary.pending_prescriptions}</span>
                </a>
                <a href="/dashboard/lab" className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex items-center justify-between text-xs hover:border-sky-400 transition-colors">
                  <span className="text-slate-600 dark:text-slate-300">Pending lab orders</span>
                  <span className="font-bold text-slate-900 dark:text-white">{summary.pending_lab_orders}</span>
                </a>
                <a href="/dashboard/pharmacy" className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                  summary.low_stock_medicines > 0
                    ? 'border-rose-200 dark:border-rose-800/60 bg-rose-50/60 dark:bg-rose-950/20 hover:border-rose-400'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 hover:border-sky-400'
                }`}>
                  <span className={summary.low_stock_medicines > 0 ? 'text-rose-700 dark:text-rose-300' : 'text-slate-600 dark:text-slate-300'}>
                    Medicines at or below minimum
                  </span>
                  <span className={`font-bold ${summary.low_stock_medicines > 0 ? 'text-rose-700 dark:text-rose-300' : 'text-slate-900 dark:text-white'}`}>
                    {summary.low_stock_medicines}
                  </span>
                </a>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">No metrics available.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <DashboardErrorBoundary label="Admin">
      <AdminDashboardContent />
    </DashboardErrorBoundary>
  );
}
