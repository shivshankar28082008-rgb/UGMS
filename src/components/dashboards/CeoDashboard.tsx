import React from 'react';
import {
  Users,
  Building2,
  Briefcase,
  Handshake,
  CheckSquare,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  FileText,
  Award,
  Sparkles,
} from 'lucide-react';
import {
  Employee,
  Department,
  TechProject,
  ApprovalItem,
  ActivityLog,
  UserSession,
} from '../../types';

interface CeoDashboardProps {
  session: UserSession;
  employees: Employee[];
  departments: Department[];
  projects: TechProject[];
  approvals: ApprovalItem[];
  activityLogs: ActivityLog[];
  onNavigateTab: (tab: string) => void;
}

export const CeoDashboard: React.FC<CeoDashboardProps> = ({
  session,
  employees,
  departments,
  projects,
  approvals,
  activityLogs,
  onNavigateTab,
}) => {
  const pendingApprovals = approvals.filter((a) => a.status === 'Pending');

  return (
    <div className="space-y-6">
      {/* Executive Command Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B2545] via-[#0E4749] to-[#0A5C4A] p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Chief Executive Command & Corporate Strategy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {session.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-200 mt-2 leading-relaxed">
            Driving corporate strategy, operational excellence, partnerships, and market scaling across 
            UniGrova's product ventures. Exercising executive oversight on approvals and organizational governance.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={() => onNavigateTab('approvals')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <CheckSquare className="w-4 h-4" />
              Executive Approvals ({pendingApprovals.length} Pending)
            </button>
            <button
              onClick={() => onNavigateTab('employees')}
              className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 backdrop-blur-xs"
            >
              <Users className="w-4 h-4" />
              Employee Directory ({employees.length})
            </button>
            <button
              onClick={() => onNavigateTab('partnerships')}
              className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 backdrop-blur-xs"
            >
              <Handshake className="w-4 h-4" />
              Strategic Partnerships
            </button>
          </div>
        </div>
      </div>

      {/* CEO Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Staff Headcount</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{employees.length}</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">100% active standing</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Departments</span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{departments.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Fully coordinated</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Projects</span>
            <Briefcase className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{projects.length}</div>
          <p className="text-[11px] text-sky-600 font-semibold mt-1">On schedule</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Initiatives</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">8</div>
          <p className="text-[11px] text-indigo-600 font-semibold mt-1">Active corporate OKRs</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Approvals</span>
            <CheckSquare className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">{pendingApprovals.length}</div>
          <p className="text-[11px] text-amber-700 font-semibold mt-1">Requires executive review</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Partnerships</span>
            <Handshake className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">12</div>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">Enterprise & Academic</p>
        </div>
      </div>

      {/* Two Column Grid: Pending Approvals & Operations Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CEO Approvals Queue (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Executive Approval Queue</h3>
              <p className="text-xs text-slate-500">Items submitted for CEO signature & clearance</p>
            </div>
            <button
              onClick={() => onNavigateTab('approvals')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Approval Center</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {approvals.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 truncate">{item.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{item.details}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Submitted by <strong className="text-slate-600">{item.submittedBy}</strong> ({item.submittedByRole}) on {item.submittedDate}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      item.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'Rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.status}
                  </span>
                  {item.status === 'Pending' && (
                    <button
                      onClick={() => onNavigateTab('approvals')}
                      className="px-3 py-1 bg-[#0B2545] hover:bg-[#133E68] text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Performance & Live Log (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Corporate Performance</h3>
            <p className="text-xs text-slate-500 mb-4">Organizational health indicators</p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Operational Efficiency</span>
                  <span className="text-emerald-700">94%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Quarterly Roadmap Execution</span>
                  <span className="text-blue-700">88%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>ID Card Clearance Rate</span>
                  <span className="text-teal-700">98%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: '98%' }} />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Recent Operations Audit
              </h4>
              <div className="space-y-2.5">
                {activityLogs.slice(0, 3).map((log) => (
                  <div key={log.id} className="text-xs flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-medium text-slate-800 line-clamp-1">{log.action}</p>
                      <span className="text-[10px] text-slate-400">{log.user} • {log.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('operations')}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-colors text-center"
            >
              Open Operations & Departments Console
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
