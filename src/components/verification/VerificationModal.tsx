import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  Search,
  X,
  Building2,
  Calendar,
  UserCheck,
  AlertTriangle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { Employee } from '../../types';
import { UniGrovaLogo } from '../common/UniGrovaLogo';
import { IDCardService, VerificationResult } from '../../services/idCardService';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmployee?: Employee | null;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  initialEmployee,
}) => {
  const [searchId, setSearchId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  useEffect(() => {
    if (initialEmployee) {
      setSearchId(initialEmployee.employeeId);
      runVerification(initialEmployee.employeeId);
    } else {
      setResult(null);
      setSearchId('');
    }
  }, [initialEmployee, isOpen]);

  if (!isOpen) return null;

  const runVerification = async (code: string) => {
    if (!code.trim()) return;
    setIsVerifying(true);
    try {
      const res = await IDCardService.verifyByCode(code.trim());
      setResult(res);
    } catch {
      setResult({
        valid: false,
        status: 'NotFound',
        message: 'VERIFICATION NOT FOUND: Network check error.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    runVerification(searchId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header with Brand styling */}
        <div className="bg-gradient-to-r from-[#0B2545] via-[#113C6E] to-[#0A5C4A] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Close verification"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <UniGrovaLogo size="sm" variant="compact" inverted />
            <div>
              <h2 className="text-lg font-bold tracking-wide">UNIGROVA</h2>
              <p className="text-xs text-emerald-300 font-semibold">Employee Verification Portal</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Lookup Input */}
          <form onSubmit={handleSearch} className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Verify by Employee ID or QR Code Token
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. UIG-EMP-0001 or UGMS-VERIFY-..."
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={isVerifying}
                className="px-4 py-2 text-xs font-bold text-white bg-[#0B2545] hover:bg-[#113C6E] disabled:opacity-50 rounded-xl transition-colors flex items-center gap-1.5"
              >
                {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                <span>Verify</span>
              </button>
            </div>
          </form>

          {/* Verification Status Display */}
          {isVerifying && (
            <div className="py-8 flex flex-col items-center justify-center text-slate-500 text-xs">
              <Loader2 className="w-7 h-7 animate-spin text-emerald-600 mb-2" />
              <span>Querying real-time Firestore credential registry...</span>
            </div>
          )}

          {!isVerifying && result && (
            <div className="space-y-4 animate-in fade-in">
              {/* Verdict Banner */}
              {result.valid && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h3 className="text-sm font-extrabold text-emerald-950 uppercase tracking-wider">
                      VERIFIED EMPLOYEE
                    </h3>
                    <p className="text-xs text-emerald-800">{result.message}</p>
                  </div>
                </div>
              )}

              {!result.valid && result.status !== 'NotFound' && (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                  <div>
                    <h3 className="text-sm font-extrabold text-amber-950 uppercase tracking-wider">
                      EMPLOYEE STATUS: {result.status.toUpperCase()}
                    </h3>
                    <p className="text-xs text-amber-800">{result.message}</p>
                  </div>
                </div>
              )}

              {!result.valid && result.status === 'NotFound' && (
                <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl flex items-center gap-3">
                  <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                  <div>
                    <h3 className="text-sm font-extrabold text-rose-950 uppercase tracking-wider">
                      VERIFICATION NOT FOUND
                    </h3>
                    <p className="text-xs text-rose-800">{result.message}</p>
                  </div>
                </div>
              )}

              {/* Employee Details Card */}
              {result.employee && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-4">
                  <div className="w-16 h-20 rounded-lg overflow-hidden border border-slate-300 bg-white shrink-0">
                    <img
                      src={result.employee.profilePhoto}
                      alt={result.employee.fullName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          result.employee!.fullName
                        )}&background=0B2545&color=fff&size=120`;
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-sm truncate">
                        {result.employee.fullName}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                        {result.employee.employeeId}
                      </span>
                    </div>

                    <p className="font-semibold text-emerald-700">{result.employee.designation}</p>

                    <div className="pt-2 grid grid-cols-2 gap-2 text-slate-600 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Department</span>
                        <span className="font-medium text-slate-800">{result.employee.department}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Joining Date</span>
                        <span className="font-medium text-slate-800">{result.employee.joiningDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Blood Group</span>
                        <span className="font-medium text-slate-800">{result.employee.bloodGroup}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
                        <span className="font-medium text-slate-800">{result.employee.workLocation}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Notice */}
          <div className="pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400">
            <span>Official UniGrova Management System (UGMS) • Live Firestore Validation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
