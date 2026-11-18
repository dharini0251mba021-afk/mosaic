import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  CheckCircle,
  Database,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose
}) => {
  const { loginWithGoogle, backendStatus, currentUser } = useApp();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await loginWithGoogle();
      setLoading(false);
      if (!res.success) {
        setError(res.error || 'Google sign-in could not be completed.');
        return;
      }
      onClose();
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={() => !loading && onClose()}
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E7E2DA] overflow-hidden z-10">
        {/* Header Ribbon */}
        <div className="bg-[#581C4E] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-sm bg-white/10 flex items-center justify-center text-white font-serif text-sm font-bold">
              M
            </div>
            <span className="font-editorial text-lg font-bold tracking-tight">MOSAIC</span>
            <span className="text-white/40 text-xs">|</span>
            <span className="text-[11px] text-[#E9D5FF] font-medium uppercase tracking-wider">
              Google Account
            </span>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="font-editorial text-2xl font-bold text-stone-900 leading-tight">
              Sign in to Mosaic
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed max-w-xs mx-auto">
              Join our community of authentic storytellers across India. One-click sign-in with your Google Account.
            </p>
          </div>

          {/* Backend Status Indicator */}
          <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-3 flex items-start gap-2.5 text-left text-xs">
            <div className="mt-0.5 text-[#581C4E]">
              <Database className="w-4 h-4 shrink-0" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 font-semibold text-stone-800">
                <span>{backendStatus.mode === 'firebase' ? 'Google Firebase Cloud Services' : 'Local Sandbox Mode'}</span>
                {backendStatus.isFirebaseConfigured && (
                  <span className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5 truncate">
                {backendStatus.message}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-left leading-relaxed">
                <span className="font-semibold block mb-0.5">Authentication Note</span>
                {error}
              </div>
            </div>
          )}

          {/* ONE LOGIN METHOD ONLY: Continue with Google Button */}
          <div className="space-y-3 pt-1">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3.5 px-4 bg-white hover:bg-stone-50 text-stone-800 font-medium text-sm rounded-xl border border-stone-300 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group focus:outline-none focus:ring-2 focus:ring-[#581C4E] focus:ring-offset-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-stone-400 border-t-[#581C4E] rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              )}
              <span className="text-stone-800 font-semibold text-sm group-hover:text-stone-900">
                {loading ? 'Connecting to Google...' : 'Continue with Google'}
              </span>
            </button>

            <p className="text-[11px] text-stone-500 text-center leading-normal">
              By continuing, you verify that your stories adhere to Mosaic Community Guidelines and authentic author attribution.
            </p>
          </div>

          {/* Privacy & Security Features */}
          <div className="pt-2 border-t border-[#F0ECE4] grid grid-cols-2 gap-3 text-left">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold text-stone-800">Zero Password Storage</p>
                <p className="text-[10px] text-stone-500">Secured via Google Identity</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#581C4E] shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold text-stone-800">Cloud Sync</p>
                <p className="text-[10px] text-stone-500">Drafts saved securely to Firestore</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-6 py-3 bg-[#FAF8F5] border-t border-[#E7E2DA] flex items-center justify-between text-[11px] text-stone-500">
          <span>Mosaic by Dharini Singh</span>
          <span className="flex items-center gap-1 font-medium text-[#581C4E]">
            Verified Author ID <CheckCircle className="w-3 h-3 text-emerald-600" />
          </span>
        </div>
      </div>
    </div>
  );
};
