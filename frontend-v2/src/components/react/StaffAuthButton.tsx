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
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold shadow-sm transition"
        >
          <svg className="w-3.5 h-3.5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Staff Sign In
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 mb-1">
              Select Clinical Staff Profile
            </div>
            <div className="space-y-1">
              {(Object.entries(CLINICAL_STAFF_PROFILES) as [ClinicalRole, RoleProfile][]).map(([roleKey, profile]) => (
                <button
                  key={roleKey}
                  onClick={() => handleSelectRole(roleKey)}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-800 transition flex items-center gap-2.5 text-xs group"
                >
                  <div className="w-7 h-7 rounded bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-[11px] shrink-0">
                    {profile.avatarInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white truncate">{profile.name}</div>
                    <div className="text-[10px] text-slate-400 uppercase">{profile.role} • ID: {profile.staffId}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800 px-2 text-[10px] text-slate-500 text-center">
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
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-white border border-sky-500/30 text-xs font-semibold shadow-sm transition"
      >
        <span className="w-5 h-5 rounded bg-sky-500 text-white font-bold flex items-center justify-center text-[10px]">
          {user.avatarInitials}
        </span>
        <span className="max-w-[100px] truncate hidden sm:inline">{user.name.split(',')[0]}</span>
        <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] uppercase font-bold">
          {user.role}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50">
          <div className="px-2 py-2 mb-2 bg-slate-800/60 rounded-lg border border-slate-700/50">
            <div className="text-xs font-bold text-white">{user.name}</div>
            <div className="text-[11px] text-sky-400 font-semibold">{user.department}</div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
              <span>Staff ID: {user.staffId}</span>
              <span className="text-emerald-400 font-medium">● Logged In</span>
            </div>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 mb-1">
            Switch Clinical Role
          </div>
          <div className="space-y-1">
            {(Object.entries(CLINICAL_STAFF_PROFILES) as [ClinicalRole, RoleProfile][]).map(([roleKey, profile]) => (
              <button
                key={roleKey}
                onClick={() => handleSelectRole(roleKey)}
                className={`w-full text-left p-1.5 px-2 rounded-lg transition flex items-center justify-between text-xs ${
                  user.role === roleKey ? 'bg-sky-500/20 text-sky-300 font-bold' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="truncate">{profile.name}</div>
                <span className="text-[10px] text-slate-500 uppercase">{profile.role}</span>
              </button>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full py-1.5 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold text-center transition flex items-center justify-center gap-1.5"
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
