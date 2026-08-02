import React, { useState, useEffect } from 'react';
import { SwasthaAPI, type LabOrder } from '../../lib/api';
import { FlaskConical, CheckCircle2, AlertCircle, Clock, Search, FileText, UploadCloud, Activity, Zap } from 'lucide-react';

export default function LabDashboard() {
  const [labOrders, setLabOrders] = useState<LabOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
  const [resultText, setResultText] = useState('');
  const [toast, setToast] = useState('');

  const loadOrders = async () => {
    const data = await SwasthaAPI.getLabOrders();
    setLabOrders(data);
    if (data.length > 0 && !selectedOrder) {
      setSelectedOrder(data[0]);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (id: string | number, nextStatus: LabOrder['status']) => {
    await SwasthaAPI.updateLabOrderStatus(id, nextStatus, resultText || undefined);
    setToast(`Test order ${id} status updated to ${nextStatus.toUpperCase()}`);
    await loadOrders();
    if (selectedOrder?.id === id) {
      setSelectedOrder(prev => prev ? { ...prev, status: nextStatus, results: resultText || prev.results } : null);
    }
    setTimeout(() => setToast(''), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-700 via-pink-700 to-rose-700 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md mb-2">
              <FlaskConical className="w-3.5 h-3.5" /> Department 4: Laboratory & Diagnostic Pathology
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Diagnostic Specimen & Test Processing Hub</h1>
            <p className="text-purple-100 text-sm mt-1 max-w-2xl">
              Process lab orders routed from doctor consultations, collect biological specimens, log biochemical results, and publish diagnostic records to ABDM.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-xl backdrop-blur-md border border-white/20">
            <Zap className="w-5 h-5 text-amber-300 animate-pulse" />
            <div>
              <div className="text-xs text-purple-100">Pending Diagnostics</div>
              <div className="text-lg font-bold">{labOrders.filter(o => o.status !== 'completed').length} In Pipeline</div>
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

      {/* Grid: Order Stream & Result Reporting Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Orders Stream */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-purple-600" />
                Incoming Requisitions ({labOrders.length})
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">Live Routing</span>
            </div>

            <div className="space-y-3 mt-4 max-h-[580px] overflow-y-auto pr-1">
              {labOrders.map((order) => {
                const isSelected = selectedOrder?.id === order.id;
                const isStat = order.priority === 'stat';
                const isUrgent = order.priority === 'urgent';

                return (
                  <div
                    key={order.id}
                    onClick={() => {
                      setSelectedOrder(order);
                      setResultText(order.results || '');
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-purple-600 dark:border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 shadow-sm ring-1 ring-purple-500'
                        : isStat
                        ? 'border-rose-300 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">{order.test_name}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          Patient: <span className="font-semibold text-slate-800 dark:text-slate-200">{order.patient_name}</span>
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Dr: {order.doctor_name} • Cat: {order.category}
                        </p>
                      </div>

                      <div className="text-right space-y-1">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full inline-block ${
                          isStat
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/80 dark:text-rose-200 animate-pulse'
                            : isUrgent
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-200'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {order.priority}
                        </span>
                        <div>
                          <span className="text-[10px] font-semibold text-purple-700 dark:text-purple-300 capitalize">
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Lab Processing & Results Entry */}
        <div className="lg:col-span-7 space-y-6">
          {selectedOrder ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold">{selectedOrder.id}</div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedOrder.test_name}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Ordered for: <span className="font-semibold">{selectedOrder.patient_name}</span> • By: {selectedOrder.doctor_name}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    Status: {selectedOrder.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Progress Pipeline */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Diagnostic Workflow Stages:</div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { key: 'pending', label: '1. Order Placed' },
                    { key: 'sample_collected', label: '2. Specimen Collected' },
                    { key: 'in_analysis', label: '3. In Analysis' },
                    { key: 'completed', label: '4. Completed' },
                  ].map((step, idx) => {
                    const statusOrder = ['pending', 'sample_collected', 'in_analysis', 'completed'];
                    const currentIdx = statusOrder.indexOf(selectedOrder.status);
                    const isDone = currentIdx >= idx;

                    return (
                      <button
                        key={step.key}
                        onClick={() => handleUpdateStatus(selectedOrder.id, step.key as any)}
                        className={`p-2.5 rounded-xl text-xs font-bold text-center border transition-all ${
                          isDone
                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-purple-400'
                        }`}
                      >
                        {step.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Findings and Values */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Diagnostic Findings & Laboratory Interpretation
                </label>
                <textarea
                  rows={4}
                  value={resultText}
                  onChange={(e) => setResultText(e.target.value)}
                  placeholder="e.g. Troponin-T: Negative (<0.01 ng/mL). CBC: WBC 7,800/mcL (Normal), Platelets 240,000/mcL (Normal), Hemoglobin 14.2 g/dL."
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <UploadCloud className="w-4 h-4 text-purple-600" />
                  FastAPI Diagnostic DB Sync
                </div>

                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'completed')}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Save & Finalize Diagnostic Report
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-slate-400">
              Select a diagnostic requisition from the left to process specimens and enter test findings.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
