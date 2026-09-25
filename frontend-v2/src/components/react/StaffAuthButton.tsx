import React, { useState, useEffect } from 'react';
import {
  getCurrentUser, logout, subscribeAuth,
  type ClinicalUser,
} from '../../lib/auth';

export default function StaffAuthButton() {
  const [user, setUser] = useState<ClinicalUser | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
    return subscribeAuth(setUser);
  }, []);

  const handleLogout = () => { logout(); setUser(null); };

  // Signed-out state — link to login page
  if (!user) {
    return (
      <a href="/login"
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-colors">
        <svg className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Staff Sign In
      </a>
    );
  }

  // Signed-in state — show user badge + sign out
  return (
    <div className="relative flex items-center gap-2">
      <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-slate-900 dark:text-white border border-sky-200 dark:border-sky-800 text-xs font-semibold">
        <span className="w-6 h-6 rounded-md bg-sky-600 text-white font-semibold flex items-center justify-center text-[10px]">
          {user.avatarInitials}
        </span>
        <span className="max-w-[100px] truncate hidden sm:inline text-slate-800 dark:text-slate-100">{user.name.split(',')[0]}</span>
        <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 uppercase font-semibold">
          {user.role}
        </span>
      </div>
      <button onClick={handleLogout}
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-semibold border border-rose-200 dark:border-rose-800 transition-colors"
        title="Sign Out">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span className="hidden sm:inline">Sign Out</span>
      </button>
    </div>
  );
}
