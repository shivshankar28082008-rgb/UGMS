import React, { useState } from 'react';
import {
  UserPlus,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Building2,
  FileCheck,
  Laptop,
  Plus,
  AlertCircle,
} from 'lucide-react';
import { OnboardingCandidate, OnboardingStage, UserSession } from '../../types';
import { StorageService } from '../../services/storageService';

interface OnboardingViewProps {
  session: UserSession;
  candidates: OnboardingCandidate[];
  onRefresh: () => void;
  onNavigateGenerateID: () => void;
}

const STAGES: OnboardingStage[] = [
  'Candidate Created',
  'Document Verification',
  'ID Card Generation',
  'Asset Assignment',
  'Completed',
];

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  session,
  candidates,
  onRefresh,
  onNavigateGenerateID,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    fullName: '',
    email: '',
    phone: '',
    roleProposed: 'Associate Software Engineer',
    department: 'Technology',
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleAdvance = (candidate: OnboardingCandidate) => {
    const currentIndex = STAGES.indexOf(candidate.stage);
    if (currentIndex < STAGES.length - 1) {
      const nextStage = STAGES[currentIndex + 1];
      StorageService.advanceOnboardingStage(candidate.id, nextStage, session);
      onRefresh();
      setStatusMessage(`Advanced ${candidate.fullName} to "${nextStage}".`);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidate.fullName || !newCandidate.email) return;

    const created: OnboardingCandidate = {
      id: `ONB-${Date.now().toString().slice(-4)}`,
      fullName: newCandidate.fullName,
      email: newCandidate.email,
      phone: newCandidate.phone || '+91 98765 00000',
      roleProposed: newCandidate.roleProposed,
      department: newCandidate.department,
      stage: 'Candidate Created',
      assignedOfficer: session.preferredName || session.name,
      documentsSubmitted: false,
      idCardReady: false,
      assetsAssigned: false,
      createdDate: new Date().toISOString().split('T')[0],
    };

    StorageService.addOnboardingCandidate(created, session);
    setIsAddOpen(false);
    setNewCandidate({
      fullName: '',
      email: '',
      phone: '',
      roleProposed: 'Associate Software Engineer',
      department: 'Technology',
    });
    onRefresh();
    setStatusMessage(`Candidate ${created.fullName} added to onboarding pipeline.`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Onboarding Pipeline & Governance</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              {candidates.length} Active Candidates
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standardized 5-stage induction workflow: Candidate Created → Document Verification → ID Card Generation → Asset Assignment → Completed.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Induction Candidate</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Stage Roadmap Visual */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          UniGrova Standard 5-Stage Onboarding Flow
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {STAGES.map((st, idx) => (
            <div
              key={st}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-700">STAGE 0{idx + 1}</span>
                <p className="text-xs font-bold text-slate-900 mt-1">{st}</p>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span>In Stage:</span>
                <span className="font-bold text-slate-800">
                  {candidates.filter((c) => c.stage === st).length}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Candidates List */}
      <div className="space-y-3">
        {candidates.map((cand) => {
          const stageIndex = STAGES.indexOf(cand.stage);
          return (
            <div
              key={cand.id}
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-[#0B2545] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {cand.id}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{cand.fullName}</h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {cand.stage}
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  {cand.roleProposed} • <strong className="text-slate-800">{cand.department}</strong>
                </p>

                {/* Progress bar */}
                <div className="w-full max-w-md mt-3">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span>Pipeline Progress</span>
                    <span className="font-bold">{((stageIndex + 1) / STAGES.length) * 100}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${((stageIndex + 1) / STAGES.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] text-slate-500">
                  <span>Assigned Officer: <strong className="text-slate-700">{cand.assignedOfficer}</strong></span>
                  <span>•</span>
                  <span>Email: <span className="text-slate-700">{cand.email}</span></span>
                  <span>•</span>
                  <span>Joined Queue: {cand.createdDate}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                {cand.stage === 'ID Card Generation' && (
                  <button
                    onClick={onNavigateGenerateID}
                    className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Issue Badge</span>
                  </button>
                )}

                {cand.stage !== 'Completed' ? (
                  <button
                    onClick={() => handleAdvance(cand)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Advance Stage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Fully Inducted</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Candidate Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="bg-[#0B2545] p-5 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">New Induction Candidate</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-300 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Sen"
                  value={newCandidate.fullName}
                  onChange={(e) => setNewCandidate({ ...newCandidate, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="candidate@unigrova.com"
                  value={newCandidate.email}
                  onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                <input
                  type="text"
                  placeholder="+91 98000 00000"
                  value={newCandidate.phone}
                  onChange={(e) => setNewCandidate({ ...newCandidate, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Proposed Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud Security Analyst"
                  value={newCandidate.roleProposed}
                  onChange={(e) => setNewCandidate({ ...newCandidate, roleProposed: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Department</label>
                <select
                  value={newCandidate.department}
                  onChange={(e) => setNewCandidate({ ...newCandidate, department: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Technology">Technology</option>
                  <option value="Operations">Operations</option>
                  <option value="Product">Product</option>
                  <option value="Research & Development">Research & Development</option>
                  <option value="Corporate Governance">Corporate Governance</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  Enroll Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
