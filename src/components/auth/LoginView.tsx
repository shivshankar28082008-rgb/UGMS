import React, { useState } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  ScanFace,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { AuthService, EXECUTIVE_REGISTRY } from '../../services/authService';
import { UserSession } from '../../types';
import { UniGrovaLogo } from '../common/UniGrovaLogo';
import { FaceCaptureModal } from '../profile/FaceCaptureModal';

interface LoginViewProps {
  onLoginSuccess: (session: UserSession) => void;
  onOpenVerification: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onOpenVerification,
}) => {
  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFaceModalOpen, setIsFaceModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanId = officerId.trim();
    const cleanPass = password.trim();

    if (!cleanId) {
      setErrorMessage('Please enter your designated Officer ID or corporate email.');
      return;
    }

    if (!cleanPass) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      // Real Firebase Authentication & Firestore profile resolution
      const result = await AuthService.loginWithPassword(cleanId, cleanPass);
      setIsLoading(false);

      if (result.success && result.session) {
        onLoginSuccess(result.session);
      } else {
        setErrorMessage(result.message || 'Firebase Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Authentication error. Please check your connection.');
    }
  };

  const handleTriggerFaceScan = () => {
    setErrorMessage(null);
    const trimmed = officerId.trim().toUpperCase();

    if (!trimmed) {
      setErrorMessage(
        'Please enter your designated Officer ID first so the system can verify your facial biometric signature.'
      );
      const input = document.getElementById('officerIdInput');
      input?.focus();
      return;
    }

    setIsFaceModalOpen(true);
  };

  const handleFaceLoginSuccess = async (scannedDataUrl: string) => {
    setIsFaceModalOpen(false);
    setIsLoading(true);

    try {
      const result = await AuthService.loginWithFace(officerId, scannedDataUrl);
      setIsLoading(false);

      if (result.success && result.session) {
        onLoginSuccess(result.session);
      } else {
        setErrorMessage(
          result.message ||
            'Biometric verification failed. Scanned face does not match registered Officer ID.'
        );
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('Biometric authentication processing error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-gradient-to-br from-slate-950 via-[#0B2545] to-slate-900 text-slate-100 selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl" />
      </div>

      {/* Top Bar */}
      <header className="relative z-10 flex items-center justify-between p-6 max-w-6xl mx-auto w-full">
        <UniGrovaLogo size="md" variant="full" inverted />
        <button
          onClick={onOpenVerification}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/60 rounded-xl transition-colors"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Verify Employee ID</span>
        </button>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 p-8 sm:p-10 space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-slate-950">
              UGMS Portal Access
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              UniGrova Management System • Firebase Secured
            </p>
          </div>

          {/* Quick Officer Selector for Convenience */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Official Executive Roles
            </label>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              {Object.values(EXECUTIVE_REGISTRY).map((exec) => (
                <button
                  key={exec.officerId}
                  type="button"
                  onClick={() => {
                    setOfficerId(exec.officerId);
                    setPassword('');
                    setErrorMessage(null);
                  }}
                  className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 ${
                    officerId.toUpperCase() === exec.officerId
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-slate-50/80 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <img
                    src={exec.profileImage}
                    alt={exec.name}
                    className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-300"
                  />
                  <div className="truncate">
                    <p className="truncate font-semibold">{exec.name.split(' ')[0]}</p>
                    <p className="text-[9px] text-slate-500 font-mono">{exec.officerId}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 text-xs rounded-xl flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                Officer ID / Email
              </label>
              <input
                id="officerIdInput"
                type="text"
                placeholder="e.g. UIG969302 or email"
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-medium"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your security password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#0B2545] hover:bg-[#113C6E] text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate Session</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Face Login Button */}
              <button
                type="button"
                onClick={handleTriggerFaceScan}
                disabled={isLoading}
                className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <ScanFace className="w-4 h-4 text-emerald-700" />
                <span>Login with Face ID Biometrics</span>
              </button>
            </div>
          </form>

          {/* Bottom Security Note */}
          <div className="pt-4 border-t border-slate-200 text-center">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1 font-medium">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Real-Time Cloud Firestore • RBAC Governance</span>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center text-xs text-slate-400 font-medium">
        <span>UniGrova Management System (UGMS) • LEARN • BUILD • GROW TOGETHER</span>
      </footer>

      {/* Face Capture Camera Modal for Biometric Login */}
      {isFaceModalOpen && (
        <FaceCaptureModal
          isOpen={isFaceModalOpen}
          onClose={() => setIsFaceModalOpen(false)}
          onCaptureSuccess={handleFaceLoginSuccess}
          title="Executive Face ID Biometric Verification"
        />
      )}
    </div>
  );
};
