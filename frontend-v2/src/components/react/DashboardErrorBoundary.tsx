import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { alertDanger, card } from '../../lib/ui';

interface DashboardErrorBoundaryProps {
  label: string;
  children: ReactNode;
}

interface DashboardErrorBoundaryState {
  error: unknown;
}

export default class DashboardErrorBoundary extends Component<
  DashboardErrorBoundaryProps,
  DashboardErrorBoundaryState
> {
  state: DashboardErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): DashboardErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[${this.props.label}] dashboard render error`, error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className={`${card} p-6 space-y-3`}>
          <div className={alertDanger}>
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="flex-1">
              The {this.props.label} dashboard could not be displayed.
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {this.state.error instanceof Error
              ? this.state.error.message || 'Unknown render error.'
              : String(this.state.error)}
          </p>
          <button
            onClick={() => this.setState({ error: null })}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 hover:bg-sky-50 dark:hover:bg-sky-950/40"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
