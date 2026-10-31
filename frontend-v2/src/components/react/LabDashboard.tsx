import { useState, useEffect } from 'react';
import { SwasthaAPI, type LabOrder } from '../../lib/api';
import { FlaskConical, CheckCircle2, AlertTriangle } from 'lucide-react';
import {
  priorityBadge, statusBadge,
  btnSuccess,
  textareaMonoClass,
  card, cardHeader, pageHeader, statPill, toast as toastCls, alertDanger,
  listItem, listItemSelected, listItemEmergency,
} from '../../lib/ui';

export default function LabDashboard() {
  const [labOrders, setLabOrders] = useState<LabOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
  const [resultText, setResultText] = useState('');
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const data = await SwasthaAPI.getLabOrders();
      setLabOrders(data);
      setSelectedOrder(prev => {
        if (!prev) return data[0] || null;
        return data.find(o => o.id === prev.id) || data[0] || null;
      });
      setError('');
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to load lab orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();

    const interval = setInterval(() => {
      if (!document.hidden) loadOrders();
    }, 10000);

    const handleVisibilityChange = () => {
      if (!document.hidden) loadOrders();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleUpdateStatus = async (id: string | number, nextStatus: LabOrder['status']) => {
    setError('');
    try {
      await SwasthaAPI.updateLabOrderStatus(id, nextStatus, resultText || undefined);
      setLabOrders(prev => prev.map(o => o.id === id ? { ...o, status: nextStatus, results: resultText || o.results } : o));
      setSelectedOrder(prev => prev?.id === id ? { ...prev, status: nextStatus, results: resultText || prev.results } : prev);
      setToast(`Order #${id} updated to ${nextStatus.replace('_', ' ')}.`);
      setTimeout(() => setToast(''), 4500);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || `Failed to update order #${id}.`);
    }
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

      {error && (
        <div className={alertDanger}>
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError('')} className="text-xs font-semibold text-rose-700 dark:text-rose-300 hover:underline shrink-0">Dismiss</button>
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
              {loading ? (
                <div className="py-10 text-center text-xs text-slate-400">Loading orders…</div>
              ) : labOrders.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400">
                  <FlaskConical className="w-8 h-8 text-slate-200 dark:text-slate-700 mx-auto mb-2" />
                  No diagnostic orders in the queue.
                </div>
              ) : labOrders.map(order => {
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
                          Patient: <span className="font-medium text-slate-700 dark:text-slate-300">{order.patient_name || `#${order.patient_id}`}</span>
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
                    Patient: <span className="font-medium text-slate-700 dark:text-slate-300">{selectedOrder.patient_name || `#${selectedOrder.patient_id}`}</span> · {selectedOrder.doctor_name || 'Unassigned'}
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
                        onClick={() => handleUpdateStatus(selectedOrder.id, step.key as LabOrder['status'])}
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
                </div>
                <textarea rows={6} value={resultText} onChange={e => setResultText(e.target.value)}
                  placeholder="Enter analyzer values, qualitative notes, or reference ranges..."
                  className={textareaMonoClass} />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-1">
                <div className="text-xs text-slate-400">
                  Results are saved to this diagnostic order.
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
