import React, { useState, useEffect } from 'react';
import {
  getCurrentUser,
  quickLoginAsRole,
  loginWithCredentials,
  logout,
  canAccessDepartment,
  subscribeAuth,
  CLINICAL_STAFF_PROFILES,
  type ClinicalUser,
  type ClinicalRole,
  type RoleProfile
} from '../../lib/auth';

interface AuthShieldProps {
  requiredDepartment?: string;
  departmentTitle?: string;
  children: React.ReactNode;
}

export default function AuthShield({ requiredDepartment, departmentTitle, children }: AuthShieldProps) {
  const [user, setUser] = useState<ClinicalUser | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    // Initial check
    const current = getCurrentUser();
    setUser(current);

    // Subscribe to auth changes across islands
    const unsubscribe = subscribeAuth((updatedUser) => {
      setUser(updatedUser);
    });

    return () => unsubscribe();
  }, []);

  const handleQuickRole = (role: ClinicalRole) => {
    setLoginError('');
    const loggedUser = quickLoginAsRole(role);
    setUser(loggedUser);
    setShowRoleModal(false);
  };

  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setLoginError('Please enter your clinical email address.');
      return;
    }
    setLoginError('');
    setIsSubmitting(true);
    try {
      const logged = await loginWithCredentials(emailInput, passwordInput);
      setUser(logged);
    } catch (err: any) {
      setLoginError('Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  // 1. UNAUTHENTICATED STATE: SHOW CLINICAL LOGIN GATEWAY
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto my-8 px-4">
        {/* Security Header Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-400 text-xs font-semibold tracking-wide uppercase mb-3">
            <svg className="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Hospital Staff Security Gateway
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Restricted Clinical Console Access
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base max-w-xl mx-auto mt-2">
            Authentication is required to access patient triage, clinical records, dispensary logs, and diagnostic systems.
          </p>
        </div>

        {/* Auth Box */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Quick Role Passkey Access */}
            <div className="lg:col-span-7">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Quick Role Passkey Access
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">1-Click Clinical Pass</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Select your verified clinical persona to simulate authenticated hospital workflows:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(Object.entries(CLINICAL_STAFF_PROFILES) as [ClinicalRole, RoleProfile][]).map(([roleKey, profile]) => {
                  const isMatchingTarget = requiredDepartment && profile.allowedDepartments.includes(requiredDepartment);
                  return (
                    <button
                      key={roleKey}
                      onClick={() => handleQuickRole(roleKey)}
                      className={`text-left p-3.5 rounded-xl border transition-all duration-200 group relative ${
                        isMatchingTarget
                          ? 'border-sky-500/60 bg-sky-500/10 hover:bg-sky-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/60 hover:border-slate-400 dark:hover:border-slate-700'
                      }`}
                    >
                      {isMatchingTarget && (
                        <span className="absolute top-2 right-2 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                        </span>
                      )}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-sm text-sky-600 dark:text-sky-400 group-hover:scale-105 transition-transform">
                          {profile.avatarInitials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {profile.name}
                          </div>
                          <div className="text-xs text-sky-600 dark:text-sky-400 font-semibold truncate">
                            {profile.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            ID: {profile.staffId} • {profile.department.split('&')[0]}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Standard Clinical Login Form */}
            <div className="lg:col-span-5 bg-slate-50/80 dark:bg-slate-900/80 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Hospital Staff Credentials
              </h3>

              {loginError && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleFormLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Clinical Email
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="doctor@swasthatrack.org"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Staff Passkey / PIN
                  </label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow-md hover:shadow-sky-500/25 transition duration-150 disabled:opacity-50"
                >
                  {isSubmitting ? 'Authenticating...' : 'Sign In to Console'}
                </button>
              </form>

              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>AES-256 encrypted session with ABDM audit compliance.</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // 2. UNAUTHORIZED ROLE STATE: 403 CLEARANCE RESTRICTED
  const isAuthorized = canAccessDepartment(user.role, requiredDepartment);
  if (!isAuthorized && requiredDepartment) {
    const requiredProfileKey = (Object.keys(CLINICAL_STAFF_PROFILES) as ClinicalRole[]).find(
      (k) => CLINICAL_STAFF_PROFILES[k].allowedDepartments.includes(requiredDepartment)
    );
    const requiredTitle = requiredProfileKey ? CLINICAL_STAFF_PROFILES[requiredProfileKey].title : 'Department Specialist';

    return (
      <div className="max-w-2xl mx-auto my-12 px-4">
        <div className="glass-card rounded-2xl p-8 border border-amber-500/30 dark:border-amber-500/20 shadow-2xl text-center relative">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-500">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-3">
            Security Clearance Restricted (HTTP 403)
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Insufficient Role Clearance
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto mb-6">
            Access to this console is restricted to verified <strong>{requiredTitle}</strong> or <strong>Hospital Administrators</strong>.
          </p>

          <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-xl text-left border border-slate-200 dark:border-slate-800 mb-6">
            <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Current Active Session</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-500 font-bold flex items-center justify-center text-sm">
                  {user.avatarInitials}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.department} • Staff ID: {user.staffId}</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase">
                {user.role}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {requiredProfileKey && (
              <button
                onClick={() => handleQuickRole(requiredProfileKey)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow-md transition"
              >
                Switch to {CLINICAL_STAFF_PROFILES[requiredProfileKey].name} ({CLINICAL_STAFF_PROFILES[requiredProfileKey].role})
              </button>
            )}
            <button
              onClick={() => handleQuickRole('admin')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium border border-slate-700 transition"
            >
              Sign In as Administrator
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. AUTHORIZED STATE: RENDER ACTIVE SESSION HEADER + CHILD COMPONENT
  return (
    <div>
      {/* Top Clinical Session Security Bar */}
      <div className="mb-6 p-3.5 sm:p-4 rounded-xl bg-slate-900/95 dark:bg-slate-950/95 border border-sky-500/30 text-white shadow-lg backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Staff Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-inner">
              {user.avatarInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">{user.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 text-[11px] font-semibold uppercase tracking-wider">
                  {user.role}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Encrypted Session Active
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>ID: {user.staffId}</span>
                <span>•</span>
                <span>{user.department}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRoleModal(!showRoleModal)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Switch Clinical Staff
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/30 transition flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Lock Console
            </button>
          </div>

        </div>

        {/* Modal for Switching Clinical Roles on the fly */}
        {showRoleModal && (
          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {(Object.entries(CLINICAL_STAFF_PROFILES) as [ClinicalRole, RoleProfile][]).map(([roleKey, profile]) => (
              <button
                key={roleKey}
                onClick={() => handleQuickRole(roleKey)}
                className={`p-2.5 rounded-lg text-left transition border ${
                  user.role === roleKey
                    ? 'border-sky-500 bg-sky-500/20 text-white'
                    : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="text-xs font-bold truncate">{profile.name}</div>
                <div className="text-[10px] text-sky-400 uppercase font-semibold">{profile.role}</div>
                <div className="text-[10px] text-slate-500 truncate">ID: {profile.staffId}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Protected Child Content */}
      {children}
    </div>
  );
}
