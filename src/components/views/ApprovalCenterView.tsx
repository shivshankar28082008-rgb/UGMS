import React, { useState } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Search,
  AlertCircle,
  FileText,
  User,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { ApprovalItem, UserSession } from '../../types';
import { StorageService } from '../../services/storageService';

interface ApprovalCenterViewProps {
  session: UserSession;
  approvals: ApprovalItem[];
  onRefresh: () => void;
}

export const ApprovalCenterView: React.FC<ApprovalCenterViewProps> = ({
  session,
  approvals,
  onRefresh,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeModalItem, setActiveModalItem] = useState<ApprovalItem | null>(null);
  const [reviewNote, setReviewNote] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const canApprove = session.role === 'CEO' || session.role === 'FOUNDER';

  const filtered = approvals.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
    const matchesCat = filterCategory === 'All' || item.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCat;
  });

  const handleAction = (item: ApprovalItem, action: 'Approved' | 'Rejected') => {
    StorageService.updateApprovalStatus(item.id, action, reviewNote, session);
    setActiveModalItem(null);
    setReviewNote('');
    onRefresh();
    setStatusMessage(`Request "${item.title}" marked as ${action}.`);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Executive Approval Center</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              {approvals.filter((a) => a.status === 'Pending').length} Pending Review
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Formal governance gate for ID card credentials, operational budgets, department initiatives, and appointments.
          </p>
        </div>

        {canApprove ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Authorized Signature Access: {session.role} ({session.name})</span>
          </div>
        ) : (
          <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            Read-Only Reviewer Mode
          </div>
        )}
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search approvals by title, submitter, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700"
          >
            <option value="All">All Categories</option>
            <option value="ID Card">ID Card</option>
            <option value="Project">Project</option>
            <option value="Department">Department</option>
            <option value="Employee">Employee</option>
            <option value="Budget">Budget</option>
          </select>
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 truncate">{item.title}</h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'Rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{item.details}</p>

                <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-400 font-medium">
                  <span>
                    Submitted by <strong className="text-slate-700">{item.submittedBy}</strong> ({item.submittedByRole})
                  </span>
                  <span>•</span>
                  <span>Date: {item.submittedDate}</span>
                  {item.actionedBy && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold">
                        Reviewed by {item.actionedBy}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                {item.status === 'Pending' && canApprove ? (
                  <>
                    <button
                      onClick={() => {
                        setActiveModalItem(item);
                        setReviewNote('');
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <CheckSquare className="w-4 h-4" />
                      <span>Review Request</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setActiveModalItem(item);
                      setReviewNote(item.notes || '');
                    }}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Audit Details
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            No approval requests matching your current filter criteria.
          </div>
        )}
      </div>

      {/* Review Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="bg-[#0B2545] p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Executive Review & Authorization</h3>
                <p className="text-xs text-slate-300 font-mono">REQ-{activeModalItem.id}</p>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                  Subject
                </span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{activeModalItem.title}</p>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                  Description & Justification
                </span>
                <p className="text-slate-700 mt-1 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {activeModalItem.details}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Submitter</span>
                  <span className="font-bold text-slate-900">{activeModalItem.submittedBy}</span>
                  <span className="block text-[11px] text-slate-500">{activeModalItem.submittedByRole}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Submission Date</span>
                  <span className="font-bold text-slate-900">{activeModalItem.submittedDate}</span>
                </div>
              </div>

              {canApprove && activeModalItem.status === 'Pending' ? (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Executive Review Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter approval comments or rejection rationale..."
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              ) : (
                activeModalItem.notes && (
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                      Recorded Executive Notes
                    </span>
                    <p className="text-slate-800 italic mt-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      "{activeModalItem.notes}"
                    </p>
                  </div>
                )
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setActiveModalItem(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>

              {canApprove && activeModalItem.status === 'Pending' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAction(activeModalItem, 'Rejected')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Request</span>
                  </button>
                  <button
                    onClick={() => handleAction(activeModalItem, 'Approved')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Authorize & Sign</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
