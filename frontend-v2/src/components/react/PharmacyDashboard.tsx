import React, { useState, useEffect } from 'react';
import { SwasthaAPI, type Prescription } from '../../lib/api';
import { Pill, CheckCircle2, Package, Truck, AlertTriangle, Search, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

interface MedicineStock {
  id: number;
  name: string;
  category: string;
  stock: number;
  minThreshold: number;
  batchNumber: string;
  expiryDate: string;
}

const initialInventory: MedicineStock[] = [
  { id: 1, name: 'Paracetamol 650mg', category: 'Analgesic', stock: 450, minThreshold: 100, batchNumber: 'BAT-2026-08A', expiryDate: '2027-12' },
  { id: 2, name: 'Metformin 500mg', category: 'Antidiabetic', stock: 280, minThreshold: 80, batchNumber: 'BAT-2026-04C', expiryDate: '2028-03' },
  { id: 3, name: 'Atorvastatin 20mg', category: 'Cardiovascular', stock: 65, minThreshold: 75, batchNumber: 'BAT-2025-11B', expiryDate: '2026-11' },
  { id: 4, name: 'Amoxicillin 500mg', category: 'Antibiotic', stock: 190, minThreshold: 60, batchNumber: 'BAT-2026-02D', expiryDate: '2027-08' },
  { id: 5, name: 'Aspirin 75mg', category: 'Antiplatelet', stock: 520, minThreshold: 100, batchNumber: 'BAT-2026-09E', expiryDate: '2028-06' }
];

export default function PharmacyDashboard() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [inventory, setInventory] = useState<MedicineStock[]>(initialInventory);
  const [filter, setFilter] = useState<'all' | 'pending' | 'dispensed'>('pending');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  const loadPrescriptions = async () => {
    const data = await SwasthaAPI.getPrescriptions();
    setPrescriptions(data);
  };

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const handleDispense = async (rxId: string | number) => {
    await SwasthaAPI.updatePrescriptionStatus(rxId, 'dispensed');
    setToast(`Prescription ${rxId} marked as DISPENSED. Inventory updated.`);
    loadPrescriptions();
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

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md mb-2">
              <Pill className="w-3.5 h-3.5" /> Department 3: Pharmacy & Pharmaceutical Logistics
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Prescription Dispensation & Stock Hub</h1>
            <p className="text-emerald-100 text-sm mt-1 max-w-2xl">
              Receive digital prescriptions routed directly from doctor consultations, verify batch inventory, and dispense with ABDM record verification.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-xl backdrop-blur-md border border-white/20">
            <Clock className="w-5 h-5 text-emerald-300 animate-pulse" />
            <div>
              <div className="text-xs text-emerald-100">Prescriptions To Fill</div>
              <div className="text-lg font-bold">{pendingCount} Pending Orders</div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      {/* Grid: Live Prescriptions + Inventory Levels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Incoming Prescriptions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Pill className="w-5 h-5 text-emerald-600" />
                  Prescription Orders Stream
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Routed from Doctor Consultations</p>
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-3 py-1 rounded-lg transition-colors ${filter === 'pending' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  Pending ({pendingCount})
                </button>
                <button
                  onClick={() => setFilter('dispensed')}
                  className={`px-3 py-1 rounded-lg transition-colors ${filter === 'dispensed' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  Dispensed
                </button>
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-lg transition-colors ${filter === 'all' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  All
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="my-4 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient, doctor, or medication..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Prescriptions List */}
            <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
              {filteredRx.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">No prescriptions found.</div>
              ) : (
                filteredRx.map((rx) => {
                  const isPending = rx.status === 'pending';
                  return (
                    <div
                      key={rx.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isPending
                          ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/20 dark:bg-emerald-950/20'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">{rx.patient_name}</span>
                            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                              {rx.id}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Prescribed by: <span className="font-medium text-slate-700 dark:text-slate-300">{rx.doctor_name}</span>
                          </p>
                        </div>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          isPending
                            ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                            : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                        }`}>
                          {rx.status}
                        </span>
                      </div>

                      {/* Medicines breakdown */}
                      <div className="mt-3 space-y-1.5 bg-white dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Prescribed Drugs:</div>
                        {rx.medicines.map((m, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs py-1 border-b last:border-b-0 border-slate-100 dark:border-slate-800">
                            <span className="font-medium text-slate-900 dark:text-white">{m.name}</span>
                            <span className="text-slate-500 dark:text-slate-400 font-mono">{m.dosage} • {m.frequency} • {m.duration}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          Order time: {new Date(rx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isPending && (
                          <button
                            onClick={() => handleDispense(rx.id)}
                            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all flex items-center gap-1.5"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" /> Dispense & Fulfill
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right: Real-time Pharmacy Stock Levels */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Package className="w-5 h-5 text-teal-600" />
                Current Stock & Batch Levels
              </h2>
              <span className="text-[10px] text-slate-400">Auto-audited</span>
            </div>

            <div className="mt-4 space-y-3">
              {inventory.map((item) => {
                const isLow = item.stock <= item.minThreshold;
                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border ${
                      isLow
                        ? 'border-rose-300 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{item.name}</span>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          Batch: {item.batchNumber} • Exp: {item.expiryDate}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-bold ${isLow ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                          {item.stock} units
                        </div>
                        {isLow && (
                          <div className="text-[10px] text-rose-600 dark:text-rose-400 font-bold flex items-center gap-0.5 justify-end">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stock level bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isLow ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(100, (item.stock / 600) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-teal-900 dark:text-teal-200 text-xs">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <Truck className="w-4 h-4 text-teal-600" />
                ABDM Drug Logistics Gateway
              </div>
              All dispensations trigger secure cryptographic receipts compliant with Ayushman Bharat Digital Mission supply records.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
