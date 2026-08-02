import React, { useState, useEffect } from 'react';
import {
  getCurrentUser,
  logout,
  quickLoginAsRole,
  subscribeAuth,
  CLINICAL_STAFF_PROFILES,
  type ClinicalUser,
  type ClinicalRole,
  type RoleProfile
} from '../../lib/auth';

export default function StaffAuthButton() {
  const [user, setUser] = useState<ClinicalUser | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    const unsubscribe = subscribeAuth((updated) => {
      setUser(updated);
    });
    return () => unsubscribe();
  }, []);

  const handleSelectRole = (role: ClinicalRole) => {
    const logged = quickLoginAsRole(role);
    setUser(logged);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsOpen(false);
  };

  if (!user) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-bold shadow-sm transition"
        >
          <svg className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Staff Sign In
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2 py-1 mb-1">
              Select Clinical Staff Profile
            </div>
            <div className="space-y-1.5">
              {(Object.entries(CLINICAL_STAFF_PROFILES) as [ClinicalRole, RoleProfile][]).map(([roleKey, profile]) => (
                <button
                  key={roleKey}
                  onClick={() => handleSelectRole(roleKey)}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition flex items-center gap-2.5 text-xs group border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold flex items-center justify-center text-xs shrink-0 group-hover:scale-105 transition-transform">
                    {profile.avatarInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 dark:text-white truncate">{profile.name}</div>
                    <div className="text-[10px] text-cyan-600 dark:text-cyan-400 uppercase font-bold">{profile.role} • ID: {profile.staffId}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 px-2 text-[10px] text-slate-500 text-center font-medium">
              ABDM Level-3 Encrypted Authentication
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 text-slate-900 dark:text-white border border-cyan-200 dark:border-cyan-800 text-xs font-semibold shadow-sm transition"
      >
        <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-bold flex items-center justify-center text-[10px] shadow-sm">
          {user.avatarInitials}
        </span>
        <span className="max-w-[110px] truncate hidden sm:inline font-bold text-slate-800 dark:text-slate-100">{user.name.split(',')[0]}</span>
        <span className="px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 text-[10px] uppercase font-bold tracking-wider">
          {user.role}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl p-3.5 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="p-3 mb-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <div className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</div>
            <div className="text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold">{user.department}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between font-mono">
              <span>Staff ID: {user.staffId}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">● Active</span>
            </div>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2 py-1 mb-1">
            Switch Clinical Role
          </div>
          <div className="space-y-1">
            {(Object.entries(CLINICAL_STAFF_PROFILES) as [ClinicalRole, RoleProfile][]).map(([roleKey, profile]) => (
              <button
                key={roleKey}
                onClick={() => handleSelectRole(roleKey)}
                className={`w-full text-left p-2 px-2.5 rounded-xl transition flex items-center justify-between text-xs ${
                  user.role === roleKey
                    ? 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 font-bold border border-cyan-200 dark:border-cyan-800/60'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="truncate">{profile.name}</div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono">{profile.role}</span>
              </button>
            ))}
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold text-center transition flex items-center justify-center gap-1.5 border border-rose-200 dark:border-rose-800/50"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Lock Console / Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
