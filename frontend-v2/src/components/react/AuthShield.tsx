import React, { useState, useEffect } from 'react';
import {
  getCurrentUser,
  loginWithCredentials,
  logout,
  canAccessDepartment,
  subscribeAuth,
  CLINICAL_STAFF_PROFILES,
  type ClinicalUser,
  type ClinicalRole,
} from '../../lib/auth';
import GoogleSignInButton from './GoogleSignInButton';

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

  useEffect(() => {
    const current = getCurrentUser();
    setUser(current);
    const unsubscribe = subscribeAuth((updatedUser) => {
      setUser(updatedUser);
    });
    return () => unsubscribe();
  }, []);

  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setLoginError('Please enter your clinical email address.');
      return;
    }
    if (!passwordInput.trim()) {
      setLoginError('Please enter your password.');
      return;
    }
    setLoginError('');
    setIsSubmitting(true);
    try {
      const logged = await loginWithCredentials(emailInput, passwordInput);
      setUser(logged);
    } catch (err: any) {
      if (err?.code === 'ECONNABORTED' || err?.message?.includes('timeout')) {
        setLoginError('Server connection timed out (30s). The backend service may be offline or waking up. Please verify your backend server is running and try again.');
      } else if (err?.response?.data?.detail) {
        setLoginError(err.response.data.detail);
      } else if (err?.code === 'ERR_NETWORK' || !err?.response) {
        setLoginError('Cannot connect to backend server. Please ensure the backend is running at ' + (import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:8000'));
      } else {
        const message = err?.message || 'Authentication failed. Please verify credentials.';
        setLoginError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  // 1. UNAUTHENTICATED STATE: SHOW LOGIN FORM
  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 px-4">
        {/* Security Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-400 text-xs font-semibold tracking-wide uppercase mb-3">
            <svg className="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Staff Authentication Required
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {departmentTitle ? `${departmentTitle} Console` : 'Clinical Console Access'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-sm mx-auto mt-2">
            Sign in with your hospital credentials to access patient records and clinical workflows.
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
          {loginError && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleFormLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Clinical Email
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="doctor@swasthatrack.org"
                autoComplete="email"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow-md hover:shadow-sky-500/25 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Social Auth Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Or
            </span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Google Sign-In */}
          <GoogleSignInButton
            onSuccess={() => {
              const current = getCurrentUser();
              if (current) setUser(current);
            }}
          />

          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Secured with JWT authentication and role-based access control.</span>
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
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-amber-500/30 dark:border-amber-500/20 shadow-2xl text-center">
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
            Please sign out and log in with the correct account.
          </p>

          <div className="bg-slate-100 dark:bg-slate-900/80 p-4 rounded-xl text-left border border-slate-200 dark:border-slate-800 mb-6">
            <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Current Active Session</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-500 font-bold flex items-center justify-center text-sm">
                  {user.avatarInitials}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.department} &middot; Staff ID: {user.staffId}</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase">
                {user.role}
              </span>
            </div>
          </div>

          <button
            onClick={() => { handleLogout(); window.location.href = '/login'; }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow-md transition"
          >
            Sign Out &amp; Log In as Different Role
          </button>
        </div>
      </div>
    );
  }

  // 3. AUTHORIZED STATE: RENDER CHILD COMPONENT DIRECTLY
  return <>{children}</>;
}
