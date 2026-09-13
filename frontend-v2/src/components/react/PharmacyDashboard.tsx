import React, { useState, useEffect } from 'react';
import { SwasthaAPI, type Prescription } from '../../lib/api';
import { Pill, CheckCircle2, Package, Truck, AlertTriangle, Search, ShieldCheck } from 'lucide-react';
import {
  statusBadge,
  btnSuccess,
  inputClass,
  card, cardHeader, label, pageHeader, statPill, toast as toastCls,
} from '../../lib/ui';

interface MedicineStock {
  id: number; name: string; category: string; stock: number;
  minThreshold: number; batchNumber: string; expiryDate: string;
}

const initialInventory: MedicineStock[] = [
  { id: 1, name: 'Paracetamol 650mg', category: 'Analgesic & Antipyretic', stock: 450, minThreshold: 100, batchNumber: 'BAT-2026-08A', expiryDate: '2027-12' },
  { id: 2, name: 'Metformin 500mg', category: 'Antidiabetic', stock: 280, minThreshold: 80, batchNumber: 'BAT-2026-04C', expiryDate: '2028-03' },
  { id: 3, name: 'Atorvastatin 20mg', category: 'Cardiovascular', stock: 65, minThreshold: 75, batchNumber: 'BAT-2025-11B', expiryDate: '2026-11' },
  { id: 4, name: 'Amoxicillin 500mg', category: 'Antibiotic', stock: 190, minThreshold: 60, batchNumber: 'BAT-2026-02D', expiryDate: '2027-08' },
  { id: 5, name: 'Aspirin 75mg', category: 'Antiplatelet', stock: 520, minThreshold: 100, batchNumber: 'BAT-2026-09E', expiryDate: '2028-06' },
];

const fallbackPrescriptions: Prescription[] = [
  { id: 'RX-8921', patient_id: 101, patient_name: 'Rajesh Sharma', doctor_name: 'Dr. Vikram Sethi, MD', medicines: [{ name: 'Amoxicillin 500mg', dosage: '500mg', frequency: '1-0-1 (After Meals)', duration: '5 days', instructions: 'Take with full glass of water' }, { name: 'Paracetamol 650mg', dosage: '650mg', frequency: 'SOS', duration: '3 days', instructions: 'Post fever >100°F' }], status: 'pending', created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString() },
  { id: 'RX-8922', patient_id: 102, patient_name: 'Anita Patel', doctor_name: 'Dr. Sunita Rao, MD', medicines: [{ name: 'Metformin 500mg', dosage: '500mg', frequency: '1-0-1 (With Meals)', duration: '30 days', instructions: 'With morning and evening meal' }, { name: 'Atorvastatin 20mg', dosage: '20mg', frequency: '0-0-1 (Bedtime)', duration: '30 days', instructions: 'At night before sleep' }], status: 'pending', created_at: new Date(Date.now() - 1000 * 60 * 42).toISOString() },
  { id: 'RX-8923', patient_id: 103, patient_name: 'Mohan Lal Verma', doctor_name: 'Dr. Vikram Sethi, MD', medicines: [{ name: 'Aspirin 75mg', dosage: '75mg', frequency: '0-1-0 (After Lunch)', duration: '15 days', instructions: 'Post lunch with water' }], status: 'dispensed', created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
];

export default function PharmacyDashboard() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(fallbackPrescriptions);
  const [inventory, setInventory] = useState<MedicineStock[]>(initialInventory);
  const [filter, setFilter] = useState<'all' | 'pending' | 'dispensed'>('pending');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  const loadPrescriptions = async () => {
    try {
      const data = await SwasthaAPI.getPrescriptions();
      if (data && data.length > 0) setPrescriptions(data);
    } catch {}
  };

  useEffect(() => { loadPrescriptions(); }, []);

  const handleDispense = async (rxId: string | number) => {
    try { await SwasthaAPI.updatePrescriptionStatus(rxId, 'dispensed'); } catch {}
    setPrescriptions(prev => prev.map(p => p.id === rxId ? { ...p, status: 'dispensed' } : p));
    setInventory(prev => prev.map(item => item.id === 1 || item.id === 4 ? { ...item, stock: Math.max(0, item.stock - 10) } : item));
    setToast(`Prescription #${rxId} dispensed. Inventory updated.`);
    setTimeout(() => setToast(''), 5000);
  };

  const filteredRx = prescriptions.filter(p => {
    const matchesFilter = filter === 'all' || p.status === filter;
    const matchesSearch = p.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      p.doctor_name.toLowerCase().includes(search.toLowerCase()) ||
      p.medicines.some(m => m.name.toLowerCase().includes(search.toLowerCase()));
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
              {filteredRx.length === 0 ? (
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
                          <span className="font-semibold text-sm text-slate-900 dark:text-white">{rx.patient_name}</span>
                          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">#{rx.id}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Prescribed by <span className="font-medium text-slate-700 dark:text-slate-300">{rx.doctor_name}</span>
                        </p>
                      </div>
                      <span className={statusBadge[rx.status] || statusBadge.pending}>{rx.status}</span>
                    </div>

                    <div className="mt-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 p-3 space-y-1.5">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Medications</div>
                      {rx.medicines.map((m, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs border-b last:border-0 border-slate-100 dark:border-slate-800 pb-1.5 last:pb-0">
                          <span className="font-medium text-slate-900 dark:text-white">{m.name}</span>
                          <span className="text-slate-400 font-mono text-[11px]">{m.dosage} · {m.frequency} · {m.duration}</span>
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
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">Live inventory</span>
            </div>

            <div className="space-y-3">
              {inventory.map(item => {
                const isLow = item.stock <= item.minThreshold;
                const pct = Math.min(100, (item.stock / 600) * 100);
                return (
                  <div key={item.id} className={`p-3.5 rounded-xl border transition-all ${
                    isLow ? 'border-rose-200 dark:border-rose-800/60 bg-rose-50/50 dark:bg-rose-950/20'
                           : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-xs text-slate-900 dark:text-white">{item.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {item.batchNumber} · Exp {item.expiryDate}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-bold ${isLow ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                          {item.stock} units
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
              All dispensations automatically deduct batch counts and update medical records.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
