/**
 * SwasthaTrack — Shared UI Design Tokens
 * Single source of truth for all dashboard component styles.
 * Import from this file rather than hardcoding class strings.
 */

// ─── Priority / Urgency Badges ───────────────────────────────────────────────
export const priorityBadge: Record<string, string> = {
  emergency:
    'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950/60 dark:border-rose-700 dark:text-rose-300 animate-pulse',
  high:
    'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/60 dark:border-amber-700 dark:text-amber-300',
  medium:
    'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border bg-sky-50 border-sky-300 text-sky-700 dark:bg-sky-950/60 dark:border-sky-700 dark:text-sky-300',
  low:
    'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border bg-slate-100 border-slate-300 text-slate-600 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400',
  stat:
    'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950/60 dark:border-rose-700 dark:text-rose-300 animate-pulse',
  urgent:
    'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/60 dark:border-amber-700 dark:text-amber-300',
  routine:
    'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border bg-slate-100 border-slate-300 text-slate-600 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400',
};

// ─── Status Badges ────────────────────────────────────────────────────────────
export const statusBadge: Record<string, string> = {
  waiting:
    'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border bg-slate-100 border-slate-300 text-slate-600 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400',
  'in-progress':
    'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-950/60 dark:border-blue-700 dark:text-blue-300',
  'in-consultation':
    'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-700 dark:text-indigo-300',
  completed:
    'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-700 dark:text-emerald-300',
  pending:
    'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/60 dark:border-amber-700 dark:text-amber-300',
  dispensed:
    'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-700 dark:text-emerald-300',
  sample_collected:
    'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border bg-sky-50 border-sky-300 text-sky-700 dark:bg-sky-950/60 dark:border-sky-700 dark:text-sky-300',
  in_analysis:
    'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border bg-purple-50 border-purple-300 text-purple-700 dark:bg-purple-950/60 dark:border-purple-700 dark:text-purple-300',
};

// ─── Action Buttons ───────────────────────────────────────────────────────────
/** Primary action — same everywhere, sky-blue */
export const btnPrimary =
  'inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 transition-colors shadow-sm cursor-pointer';

/** Positive action (dispense, complete, publish) */
export const btnSuccess =
  'inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-sm cursor-pointer';

/** Destructive / remove */
export const btnDanger =
  'inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer';

/** Ghost / secondary */
export const btnGhost =
  'inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer';

/** Submit / CTA — full width form button */
export const btnCta =
  'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

// ─── Form Inputs ──────────────────────────────────────────────────────────────
export const inputClass =
  'w-full px-3.5 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-shadow';

export const inputMono =
  'w-full px-3.5 py-2 rounded-lg text-sm font-mono border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-shadow';

export const selectClass =
  'w-full px-3.5 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-shadow';

export const textareaClass =
  'w-full px-3.5 py-2.5 rounded-lg text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-shadow resize-none';

export const textareaMonoClass =
  'w-full px-3.5 py-2.5 rounded-lg text-xs font-mono border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-shadow resize-none';

// ─── Cards & Panels ───────────────────────────────────────────────────────────
/** Main white card */
export const card =
  'rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm';

/** Selectable list item — default */
export const listItem =
  'p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 cursor-pointer transition-all hover:border-slate-300 dark:hover:border-slate-700';

/** Selectable list item — selected */
export const listItemSelected =
  'p-4 rounded-xl border border-sky-500 dark:border-sky-600 bg-sky-50/60 dark:bg-sky-950/40 cursor-pointer shadow-sm ring-1 ring-sky-500/30';

/** Selectable list item — emergency highlight */
export const listItemEmergency =
  'p-4 rounded-xl border border-rose-400/50 dark:border-rose-700/50 bg-rose-50/40 dark:bg-rose-950/20 cursor-pointer transition-all hover:border-rose-500/70';

// ─── Toast / Notification Banner ──────────────────────────────────────────────
export const toast =
  'p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-4';

// ─── Section header inside a card ────────────────────────────────────────────
export const cardHeader =
  'flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-4';

// ─── Label above form inputs ──────────────────────────────────────────────────
export const label =
  'block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5';

// ─── Dashboard page header ────────────────────────────────────────────────────
export const pageHeader =
  'rounded-xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4';

// ─── Stat counter pill in page header ────────────────────────────────────────
export function statPill(color: 'sky' | 'emerald' | 'rose' | 'purple' | 'amber' | 'slate') {
  const map: Record<string, string> = {
    sky:     'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/60 text-sky-700 dark:text-sky-300',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300',
    rose:    'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300',
    purple:  'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/60 text-purple-700 dark:text-purple-300',
    amber:   'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300',
    slate:   'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300',
  };
  return `border px-4 py-2 rounded-lg text-center ${map[color]}`;
}
