import React, { useState, useEffect } from 'react';
import {
  getCurrentUser, logout, quickLoginAsRole, subscribeAuth,
  CLINICAL_STAFF_PROFILES, type ClinicalUser, type ClinicalRole, type RoleProfile,
} from '../../lib/auth';

export default function StaffAuthButton() {
  const [user, setUser] = useState<ClinicalUser | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    return subscribeAuth(setUser);
  }, []);

  const handleSelectRole = (role: ClinicalRole) => {
    setUser(quickLoginAsRole(role));
    setIsOpen(false);
  };

  const handleLogout = () => { logout(); setUser(null); setIsOpen(false); };

  // Signed-out state
  if (!user) {
    return (
      <div className="relative">
        <button onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-colors">
          <svg className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Staff Sign In
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1.5 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-2 z-50">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2.5 py-1.5 mb-0.5">
              Quick Login — Select a Role
            </div>
            <div className="space-y-0.5">
              {(Object.entries(CLINICAL_STAFF_PROFILES) as [ClinicalRole, RoleProfile][]).map(([roleKey, profile]) => (
                <button key={roleKey} onClick={() => handleSelectRole(roleKey)}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2.5 text-xs">
                  <div className="w-7 h-7 rounded-md bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 font-semibold flex items-center justify-center text-[11px] shrink-0">
                    {profile.avatarInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-900 dark:text-white truncate">{profile.name}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{profile.role} · {profile.staffId}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800 px-2.5 text-[10px] text-slate-400 text-center">
              Demo mode — no real credentials required
            </div>
          </div>
        )}
      </div>
    );
  }

  // Signed-in state
  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-slate-900 dark:text-white border border-sky-200 dark:border-sky-800 text-xs font-semibold transition-colors">
        <span className="w-6 h-6 rounded-md bg-sky-600 text-white font-semibold flex items-center justify-center text-[10px]">
          {user.avatarInitials}
        </span>
        <span className="max-w-[100px] truncate hidden sm:inline text-slate-800 dark:text-slate-100">{user.name.split(',')[0]}</span>
        <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 uppercase font-semibold">
          {user.role}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-2 z-50">
          {/* Current user info */}
          <div className="p-2.5 mb-1.5 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-100 dark:border-slate-700">
            <div className="text-xs font-semibold text-slate-900 dark:text-white">{user.name}</div>
            <div className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">{user.department}</div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between font-mono">
              <span>ID: {user.staffId}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
              </span>
            </div>
          </div>

          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2.5 py-1 mb-0.5">
            Switch Role
          </div>
          <div className="space-y-0.5">
            {(Object.entries(CLINICAL_STAFF_PROFILES) as [ClinicalRole, RoleProfile][]).map(([roleKey, profile]) => (
              <button key={roleKey} onClick={() => handleSelectRole(roleKey)}
                className={`w-full text-left px-2.5 py-2 rounded-lg transition-colors flex items-center justify-between text-xs ${
                  user.role === roleKey
                    ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}>
                <span className="truncate">{profile.name}</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono shrink-0 ml-2">{profile.role}</span>
              </button>
            ))}
          </div>

          <div className="mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800">
            <button onClick={handleLogout}
              className="w-full py-2 px-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5 border border-rose-200 dark:border-rose-800">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
