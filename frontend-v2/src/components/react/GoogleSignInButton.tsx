import React, { useEffect, useRef, useState } from 'react';
import { loginWithGoogle } from '../../lib/auth';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  onSuccessRedirect?: string;
  onSuccess?: () => void;
}

export default function GoogleSignInButton({ onSuccessRedirect, onSuccess }: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfigNotice, setShowConfigNotice] = useState(false);

  const googleClientId = import.meta.env.PUBLIC_GOOGLE_CLIENT_ID || '';

  useEffect(() => {
    if (!googleClientId) {
      return;
    }

    const initGoogle = () => {
      if (typeof window !== 'undefined' && window.google?.accounts?.id && containerRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          // Clear previous render
          containerRef.current.innerHTML = '';

          window.google.accounts.id.renderButton(containerRef.current, {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: 340,
          });
        } catch (err) {
          console.warn('Google Identity Services initialization warning:', err);
        }
      }
    };

    // Check if script is already loaded, otherwise poll briefly
    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          initGoogle();
          clearInterval(interval);
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [googleClientId]);

  const handleCredentialResponse = async (response: any) => {
    if (!response || !response.credential) {
      setError('No credential received from Google.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const user = await loginWithGoogle(response.credential);
      if (onSuccess) {
        onSuccess();
      } else {
        const dest = onSuccessRedirect || `/dashboard/${user.role}`;
        window.location.href = dest;
      }
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || 'Google authentication failed.';
      setError(msg);
      setIsLoading(false);
    }
  };

  const handleFallbackClick = () => {
    setShowConfigNotice(true);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* If Google Client ID is configured and GSI is active */}
      {googleClientId ? (
        <div className="w-full flex flex-col items-center">
          <div ref={containerRef} className="min-h-[44px] flex items-center justify-center w-full" />
          {isLoading && (
            <div className="flex items-center gap-2 mt-2 text-xs font-medium text-sky-600 dark:text-sky-400">
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Verifying Google account...</span>
            </div>
          )}
        </div>
      ) : (
        /* Standalone button before Client ID is provided in .env */
        <div className="w-full">
          <button
            type="button"
            onClick={handleFallbackClick}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-all flex items-center justify-center gap-3 shadow-xs hover:border-slate-400 dark:hover:border-slate-600"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {showConfigNotice && (
            <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
              <div className="font-semibold flex items-center gap-1.5 mb-1">
                <span>Setup Step Required</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                To activate Google Sign-In, add your <strong>Google Client ID</strong> into <code>frontend-v2/.env</code> as:
              </p>
              <code className="block my-1.5 p-1.5 rounded bg-amber-100 dark:bg-amber-900/50 font-mono text-[10px] break-all select-all">
                PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
              </code>
              <p className="text-[10px] text-amber-700 dark:text-amber-400">
                Detailed instructions are in <code>google_oauth_plan.md</code>.
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-2.5 p-2.5 w-full rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}
    </div>
  );
}
