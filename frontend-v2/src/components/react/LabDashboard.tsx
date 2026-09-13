import React, { useState, useEffect } from 'react';
import { SwasthaAPI, type LabOrder } from '../../lib/api';
import { FlaskConical, CheckCircle2, UploadCloud } from 'lucide-react';
import {
  priorityBadge, statusBadge,
  btnPrimary, btnSuccess,
  textareaMonoClass,
  card, cardHeader, pageHeader, statPill, toast as toastCls,
  listItem, listItemSelected, listItemEmergency,
} from '../../lib/ui';

const fallbackLabOrders: LabOrder[] = [
  { id: 'LAB-701', patient_id: 1, patient_name: 'Rajesh Sharma', doctor_name: 'Dr. Vikram Sethi, MD', test_name: 'Cardiac Biomarkers (High-Sensitivity Troponin I & CK-MB)', category: 'Biochemistry', priority: 'stat', status: 'in_analysis', results: 'Troponin-I: 0.042 ng/mL (Mild Elevation, ref <0.014). CK-MB: 18 U/L (Normal).', created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
  { id: 'LAB-702', patient_id: 2, patient_name: 'Anita Patel', doctor_name: 'Dr. Sunita Rao, MD', test_name: 'Glycated Hemoglobin (HbA1c) & Fasting Plasma Glucose', category: 'Biochemistry', priority: 'routine', status: 'sample_collected', results: '', created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
  { id: 'LAB-703', patient_id: 3, patient_name: 'Mohan Lal Verma', doctor_name: 'Dr. Vikram Sethi, MD', test_name: 'Complete Blood Count (CBC) with Differential & ESR', category: 'Hematology', priority: 'urgent', status: 'pending', results: '', created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
];

export default function LabDashboard() {
  const [labOrders, setLabOrders] = useState<LabOrder[]>(fallbackLabOrders);
  const [selectedOrder, setSelectedOrder] = useState<LabOrder>(fallbackLabOrders[0]);
  const [resultText, setResultText] = useState(fallbackLabOrders[0].results || '');
  const [toast, setToast] = useState('');

  const loadOrders = async () => {
    try {
      const data = await SwasthaAPI.getLabOrders();
      if (data && data.length > 0) { setLabOrders(data); setSelectedOrder(data[0]); setResultText(data[0].results || ''); }
    } catch {}
  };

  useEffect(() => { loadOrders(); }, []);

  const handleUpdateStatus = async (id: string | number, nextStatus: LabOrder['status']) => {
    try { await SwasthaAPI.updateLabOrderStatus(id, nextStatus, resultText || undefined); } catch {}
    setLabOrders(prev => prev.map(o => o.id === id ? { ...o, status: nextStatus, results: resultText || o.results } : o));
    if (selectedOrder?.id === id) setSelectedOrder(prev => ({ ...prev, status: nextStatus, results: resultText || prev.results }));
    setToast(`Order #${id} updated to ${nextStatus.replace('_', ' ')}.`);
    setTimeout(() => setToast(''), 4500);
  };

  const injectTemplate = (type: 'normal_cbc' | 'elevated_cardiac' | 'diabetic_panel') => {
    const templates: Record<string, string> = {
      normal_cbc: 'Hemoglobin: 14.8 g/dL (Normal: 13.5-17.5)\nWBC Count: 6,800 /mcL (Normal: 4,000-11,000)\nPlatelet Count: 240,000 /mcL (Normal: 150k-450k)\nESR (1st hr): 8 mm/hr (Normal < 15)',
      elevated_cardiac: 'hs-Troponin I: 0.086 ng/mL [CRITICAL HIGH, ref <0.014]\nCK-MB Isoenzyme: 34 U/L [ELEVATED, ref <25]\nInterpretation: Findings suggestive of acute myocardial injury. Immediate cardiology review advised.',
      diabetic_panel: 'HbA1c: 7.4% [ELEVATED, target <6.5%]\nEstimated Avg Glucose: 165 mg/dL\nFasting Blood Sugar: 146 mg/dL [ELEVATED, normal 70-99]',
    };
    setResultText(templates[type] || '');
  };

  const pendingCount = labOrders.filter(o => o.status !== 'completed').length;
  const completedCount = labOrders.filter(o => o.status === 'completed').length;

  const workflowSteps = [
    { key: 'pending', label: '1. Ordered' },
    { key: 'sample_collected', label: '2. Collected' },
    { key: 'in_analysis', label: '3. Analyzing' },
    { key: 'completed', label: '4. Complete' },
  ];
  const statusOrder = ['pending', 'sample_collected', 'in_analysis', 'completed'];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className={pageHeader}>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            Pathology & Lab Diagnostics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Process diagnostic orders, track samples, and publish verified results.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className={statPill('purple')}>
            <div className="text-[10px] font-semibold uppercase tracking-wider opacity-70">In Testing</div>
            <div className="text-xl font-bold">{pendingCount}</div>
          </div>
          <div className={statPill('emerald')}>
            <div className="text-[10px] font-semibold uppercase tracking-wider opacity-70">Completed</div>
            <div className="text-xl font-bold">{completedCount}</div>
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

        {/* ─── Left: Order Stream ─── */}
        <div className="lg:col-span-5">
          <div className={`${card} p-5`}>
            <div className={cardHeader}>
              <h2 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Diagnostic Orders ({labOrders.length})
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">Live feed</span>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {labOrders.map(order => {
                const isSelected = selectedOrder?.id === order.id;
                const isStat = order.priority === 'stat';
                return (
                  <div key={order.id}
                    onClick={() => { setSelectedOrder(order); setResultText(order.results || ''); }}
                    className={isSelected ? listItemSelected : isStat ? listItemEmergency : listItem}>

                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1">{order.test_name}</div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Patient: <span className="font-medium text-slate-700 dark:text-slate-300">{order.patient_name}</span>
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">#{order.id} · {order.category}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={priorityBadge[order.priority] || priorityBadge.routine}>{order.priority}</span>
                        <span className={statusBadge[order.status] || statusBadge.pending}>{order.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── Right: Results Entry Panel ─── */}
        <div className="lg:col-span-7">
          {selectedOrder ? (
            <div className={`${card} p-6 space-y-5`}>
              {/* Selected order header */}
              <div className={`${cardHeader} flex-wrap gap-3`}>
                <div>
                  <div className="text-xs font-mono text-slate-400 mb-0.5">#{selectedOrder.id}</div>
                  <h2 className="font-bold text-lg text-slate-900 dark:text-white">{selectedOrder.test_name}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Patient: <span className="font-medium text-slate-700 dark:text-slate-300">{selectedOrder.patient_name}</span> · Dr. {selectedOrder.doctor_name}
                  </p>
                </div>
                <span className={statusBadge[selectedOrder.status] || statusBadge.pending}>
                  {selectedOrder.status.replace('_', ' ')}
                </span>
              </div>

              {/* Workflow stage buttons */}
              <div>
                <div className="text-xs font-semibold text-slate-400 mb-2.5 uppercase tracking-wider">Diagnostic Workflow</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {workflowSteps.map((step, idx) => {
                    const currentIdx = statusOrder.indexOf(selectedOrder.status);
                    const isDone = currentIdx >= idx;
                    return (
                      <button key={step.key}
                        onClick={() => handleUpdateStatus(selectedOrder.id, step.key as any)}
                        className={`p-2.5 rounded-lg text-xs font-semibold text-center border transition-all cursor-pointer ${
                          isDone
                            ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-600'
                        }`}>
                        {step.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Results input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Diagnostic Findings & Lab Results
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 font-medium">Templates:</span>
                    {[
                      { key: 'elevated_cardiac' as const, label: 'Troponin', color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800' },
                      { key: 'normal_cbc' as const, label: 'CBC', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' },
                      { key: 'diabetic_panel' as const, label: 'HbA1c', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' },
                    ].map(t => (
                      <button key={t.key} type="button" onClick={() => injectTemplate(t.key)}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border transition-colors hover:opacity-80 ${t.color}`}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea rows={5} value={resultText} onChange={e => setResultText(e.target.value)}
                  placeholder="Enter analyzer values, qualitative notes, or reference ranges..."
                  className={textareaMonoClass} />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-1">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <UploadCloud className="w-4 h-4" /> EMR record auto-sync
                </div>
                <button onClick={() => handleUpdateStatus(selectedOrder.id, 'completed')} className={btnSuccess}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Finalize & Publish Report
                </button>
              </div>
            </div>
          ) : (
            <div className={`${card} p-12 text-center text-sm text-slate-400`}>
              Select a diagnostic order from the list to process specimens and enter findings.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
