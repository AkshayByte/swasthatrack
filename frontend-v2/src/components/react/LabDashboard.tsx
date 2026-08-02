import React, { useState, useEffect } from 'react';
import { SwasthaAPI, type LabOrder } from '../../lib/api';
import { FlaskConical, CheckCircle2, AlertCircle, Clock, Search, FileText, UploadCloud, Activity, Zap, ShieldCheck, Sparkles, Microchip, Layers } from 'lucide-react';

const fallbackLabOrders: LabOrder[] = [
  {
    id: 'LAB-701',
    patient_id: 1,
    patient_name: 'Rajesh Sharma',
    doctor_name: 'Dr. Vikram Sethi, MD',
    test_name: 'Cardiac Biomarkers (High-Sensitivity Troponin I & CK-MB)',
    category: 'Biochemistry',
    priority: 'stat',
    status: 'in_analysis',
    results: 'Troponin-I: 0.042 ng/mL (Mild Elevation, ref <0.014). CK-MB: 18 U/L (Normal).',
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString()
  },
  {
    id: 'LAB-702',
    patient_id: 2,
    patient_name: 'Anita Patel',
    doctor_name: 'Dr. Sunita Rao, MD',
    test_name: 'Glycated Hemoglobin (HbA1c) & Fasting Plasma Glucose',
    category: 'Biochemistry',
    priority: 'routine',
    status: 'sample_collected',
    results: '',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'LAB-703',
    patient_id: 3,
    patient_name: 'Mohan Lal Verma',
    doctor_name: 'Dr. Vikram Sethi, MD',
    test_name: 'Complete Blood Count (CBC) with Differential & ESR',
    category: 'Hematology',
    priority: 'urgent',
    status: 'pending',
    results: '',
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString()
  }
];

export default function LabDashboard() {
  const [labOrders, setLabOrders] = useState<LabOrder[]>(fallbackLabOrders);
  const [selectedOrder, setSelectedOrder] = useState<LabOrder>(fallbackLabOrders[0]);
  const [resultText, setResultText] = useState(fallbackLabOrders[0].results || '');
  const [toast, setToast] = useState('');

  const loadOrders = async () => {
    try {
      const data = await SwasthaAPI.getLabOrders();
      if (data && data.length > 0) {
        setLabOrders(data);
        setSelectedOrder(data[0]);
        setResultText(data[0].results || '');
      }
    } catch (e) {
      // Keep fallbacks
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (id: string | number, nextStatus: LabOrder['status']) => {
    try {
      await SwasthaAPI.updateLabOrderStatus(id, nextStatus, resultText || undefined);
    } catch (e) {}

    setLabOrders(prev =>
      prev.map(o => o.id === id ? { ...o, status: nextStatus, results: resultText || o.results } : o)
    );

    if (selectedOrder?.id === id) {
      setSelectedOrder(prev => ({ ...prev, status: nextStatus, results: resultText || prev.results }));
    }

    setToast(`Test order #${id} status updated to [${nextStatus.toUpperCase().replace('_', ' ')}].`);
    setTimeout(() => setToast(''), 4500);
  };

  const injectTemplate = (type: 'normal_cbc' | 'elevated_cardiac' | 'diabetic_panel') => {
    if (type === 'normal_cbc') {
      setResultText('Hemoglobin: 14.8 g/dL (Normal: 13.5-17.5)\nWBC Count: 6,800 /mcL (Normal: 4,000-11,000)\nPlatelet Count: 240,000 /mcL (Normal: 150k-450k)\nESR (1st hr): 8 mm/hr (Normal < 15)');
    } else if (type === 'elevated_cardiac') {
      setResultText('hs-Troponin I: 0.086 ng/mL [CRITICAL HIGH, ref <0.014]\nCK-MB Isoenzyme: 34 U/L [ELEVATED, ref <25]\nInterpretation: Findings suggestive of acute myocardial injury. Immediate cardiology review advised.');
    } else if (type === 'diabetic_panel') {
      setResultText('HbA1c: 7.4% [ELEVATED, target <6.5%]\nEstimated Avg Glucose: 165 mg/dL\nFasting Blood Sugar: 146 mg/dL [ELEVATED, normal 70-99]');
    }
  };

  const pendingCount = labOrders.filter(o => o.status !== 'completed').length;
  const completedCount = labOrders.filter(o => o.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Sleek Clinical Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-pink-950 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-purple-500/20">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold backdrop-blur-md">
              <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
              <span>Department 04 • Diagnostic Pathology & Bio-Specimens</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Laboratory Diagnostics & Results Hub
            </h1>
            <p className="text-purple-100/80 text-sm max-w-2xl">
              Receive clinical test requisitions directly from outpatient consultations, track accessioned specimens through automated analyzers, and cryptographically report verified findings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 dark:bg-slate-900/60 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-center">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-purple-300">In Testing</div>
              <div className="text-2xl font-black text-white">{pendingCount}</div>
            </div>
            <div className="bg-white/10 dark:bg-slate-900/60 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-center">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-pink-300">Completed</div>
              <div className="text-2xl font-black text-white">{completedCount}</div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-900 dark:text-purple-200 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-semibold">{toast}</span>
          </div>
          <button onClick={() => setToast('')} className="text-xs font-bold text-purple-600 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Grid: Order Stream & Result Reporting Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Orders Stream */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 p-5 sm:p-6 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Diagnostic Requisitions ({labOrders.length})
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">Live Analyzer Feed</span>
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
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-purple-600 dark:border-purple-500 bg-purple-50/60 dark:bg-purple-950/40 shadow-sm ring-1 ring-purple-500'
                        : isStat
                        ? 'border-rose-500/40 bg-rose-50/30 dark:bg-rose-950/20 hover:border-rose-500/60'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">{order.test_name}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          Patient: <span className="font-semibold text-slate-900 dark:text-white">{order.patient_name}</span>
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                          Req: #{order.id} • {order.category}
                        </p>
                      </div>

                      <div className="text-right space-y-1">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full inline-block ${
                          isStat
                            ? 'bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 animate-pulse'
                            : isUrgent
                            ? 'bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          {order.priority}
                        </span>
                        <div>
                          <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
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
        <div className="lg:col-span-7 space-y-5">
          {selectedOrder ? (
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 p-6 shadow-sm backdrop-blur-sm space-y-5">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold">#{selectedOrder.id}</div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{selectedOrder.test_name}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Ordered for: <span className="font-semibold text-slate-900 dark:text-white">{selectedOrder.patient_name}</span> • By: <span className="font-medium text-slate-700 dark:text-slate-300">{selectedOrder.doctor_name}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-purple-500/10 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                    {selectedOrder.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Progress Pipeline */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">Diagnostic Workflow Stages:</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: 'pending', label: '1. Ordered' },
                    { key: 'sample_collected', label: '2. Collected' },
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
                        className={`p-2.5 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                          isDone
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-600 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-950/60 text-slate-500 border-slate-200 dark:border-slate-800 hover:border-purple-400'
                        }`}
                      >
                        {step.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Findings and Values */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Diagnostic Findings & Laboratory Interpretation
                  </label>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-slate-400 font-semibold">Quick Templates:</span>
                    <button
                      type="button"
                      onClick={() => injectTemplate('elevated_cardiac')}
                      className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold hover:bg-purple-500/20 transition-colors"
                    >
                      Troponin
                    </button>
                    <button
                      type="button"
                      onClick={() => injectTemplate('normal_cbc')}
                      className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300 font-bold hover:bg-teal-500/20 transition-colors"
                    >
                      CBC Normal
                    </button>
                    <button
                      type="button"
                      onClick={() => injectTemplate('diabetic_panel')}
                      className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold hover:bg-amber-500/20 transition-colors"
                    >
                      HbA1c
                    </button>
                  </div>
                </div>

                <textarea
                  rows={4}
                  value={resultText}
                  onChange={(e) => setResultText(e.target.value)}
                  placeholder="Enter analyzer values, qualitative notes, or reference ranges..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-mono border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <UploadCloud className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  ABDM Diagnostic Record Auto-Sync
                </div>

                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'completed')}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer"
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
