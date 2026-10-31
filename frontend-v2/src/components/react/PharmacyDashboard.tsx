import { useState, useEffect } from 'react';
import { SwasthaAPI, type Medicine, type Prescription } from '../../lib/api';
import { Pill, CheckCircle2, Package, Truck, AlertTriangle, Search, ShieldCheck } from 'lucide-react';
import {
  statusBadge,
  btnSuccess,
  card, cardHeader, pageHeader, statPill, toast as toastCls, alertDanger,
} from '../../lib/ui';

export default function PharmacyDashboard() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [inventory, setInventory] = useState<Medicine[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'dispensed'>('pending');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [rxList, medicineList] = await Promise.all([
        SwasthaAPI.getPrescriptions(),
        SwasthaAPI.getMedicines(),
      ]);
      setPrescriptions(rxList);
      setInventory(medicineList);
      setError('');
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to load pharmacy data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      if (!document.hidden) loadData();
    }, 10000);

    const handleVisibilityChange = () => {
      if (!document.hidden) loadData();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleDispense = async (rxId: string | number) => {
    setError('');
    try {
      await SwasthaAPI.updatePrescriptionStatus(rxId, 'dispensed');
      await loadData();
      setToast(`Prescription #${rxId} dispensed. Inventory refreshed from the server.`);
      setTimeout(() => setToast(''), 5000);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || `Failed to dispense prescription #${rxId}.`);
    }
  };

  const filteredRx = prescriptions.filter(p => {
    const term = search.toLowerCase();
    const matchesFilter = filter === 'all' || p.status === filter;
    const matchesSearch = (p.patient_name || '').toLowerCase().includes(term) ||
      (p.doctor_name || '').toLowerCase().includes(term) ||
      p.medicines.some(m => (m.name || '').toLowerCase().includes(term));
    return matchesFilter && matchesSearch;
  });

  const pendingCount = prescriptions.filter(p => p.status === 'pending').length;
  const dispensedCount = prescriptions.filter(p => p.status === 'dispensed').length;

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className={pageHeader}>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Pill className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            Pharmacy & Inventory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Fulfill electronic prescriptions and monitor medicine stock levels.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className={statPill('amber')}>
            <div className="text-[10px] font-semibold uppercase tracking-wider opacity-70">Pending</div>
            <div className="text-xl font-bold">{pendingCount}</div>
          </div>
          <div className={statPill('emerald')}>
            <div className="text-[10px] font-semibold uppercase tracking-wider opacity-70">Dispensed</div>
            <div className="text-xl font-bold">{dispensedCount}</div>
          </div>
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* ─── Left: Prescriptions ─── */}
        <div className="lg:col-span-7">
          <div className={`${card} p-5`}>
            <div className={cardHeader}>
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Pill className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  Prescription Orders
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Real-time doctor order queue</p>
              </div>

              {/* Filter tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
                {(['pending', 'dispensed', 'all'] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-md transition-all capitalize ${
                      filter === f ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm font-semibold' : 'text-slate-500 dark:text-slate-400'
                    }`}>
                    {f} ({f === 'pending' ? pendingCount : f === 'dispensed' ? dispensedCount : prescriptions.length})
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="mb-4 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search patient, doctor, or medicine..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>

            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {loading ? (
                <div className="py-12 text-center text-xs text-slate-400">Loading prescriptions…</div>
              ) : filteredRx.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  <Pill className="w-8 h-8 text-slate-200 dark:text-slate-700 mx-auto mb-2" />
                  No prescriptions match current filters.
                </div>
              ) : filteredRx.map(rx => {
                const isPending = rx.status === 'pending';
                return (
                  <div key={rx.id} className={`p-4 rounded-xl border transition-all ${
                    isPending
                      ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                      : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 opacity-75'
                  }`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-900 dark:text-white">{rx.patient_name || `Patient #${rx.patient_id}`}</span>
                          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">#{rx.id}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Prescribed by <span className="font-medium text-slate-700 dark:text-slate-300">{rx.doctor_name || 'Unassigned'}</span>
                        </p>
                      </div>
                      <span className={statusBadge[rx.status] || statusBadge.pending}>{rx.status}</span>
                    </div>

                    <div className="mt-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 p-3 space-y-1.5">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Medications</div>
                      {rx.medicines.map((m, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs border-b last:border-0 border-slate-100 dark:border-slate-800 pb-1.5 last:pb-0">
                          <span className="font-medium text-slate-900 dark:text-white">{m.name}</span>
                          <span className="text-slate-400 font-mono text-[11px]">
                            {[m.dosage, m.frequency, m.duration].filter(Boolean).join(' · ') || 'As directed'}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(rx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isPending && (
                        <button onClick={() => handleDispense(rx.id)} className={btnSuccess}>
                          <ShieldCheck className="w-3.5 h-3.5" /> Dispense & Fulfill
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── Right: Inventory ─── */}
        <div className="lg:col-span-5">
          <div className={`${card} p-5`}>
            <div className={cardHeader}>
              <h2 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Package className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                Medicine Stock
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">Server inventory</span>
            </div>

            <div className="space-y-3">
              {inventory.length === 0 && !loading ? (
                <div className="py-8 text-center text-xs text-slate-400">No medicines in the catalogue.</div>
              ) : inventory.map(item => {
                const isLow = item.current_stock <= item.minimum_stock;
                const maxStock = item.maximum_stock || Math.max(item.current_stock, item.minimum_stock, 100);
                const pct = Math.min(100, (item.current_stock / maxStock) * 100);
                return (
                  <div key={item.id} className={`p-3.5 rounded-xl border transition-all ${
                    isLow ? 'border-rose-200 dark:border-rose-800/60 bg-rose-50/50 dark:bg-rose-950/20'
                           : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-xs text-slate-900 dark:text-white">{item.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {[item.category, item.expiry_date && `Exp ${item.expiry_date}`].filter(Boolean).join(' · ') || 'No batch details'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-bold ${isLow ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                          {item.current_stock} units
                        </div>
                        {isLow && (
                          <div className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-0.5 justify-end mt-0.5">
                            <AlertTriangle className="w-3 h-3" /> Low stock
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 mt-2.5 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${isLow ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2">
              <Truck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              Dispensing decrements stock on the server for medicines linked to the prescription.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
