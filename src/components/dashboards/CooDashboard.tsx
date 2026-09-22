import React from 'react';
import {
  Users,
  CreditCard,
  UserPlus,
  Building2,
  FileBarChart,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  PlusCircle,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import {
  Employee,
  Department,
  OnboardingCandidate,
  ActivityLog,
  UserSession,
} from '../../types';

interface CooDashboardProps {
  session: UserSession;
  employees: Employee[];
  departments: Department[];
  onboarding: OnboardingCandidate[];
  activityLogs: ActivityLog[];
  onNavigateTab: (tab: string) => void;
  onOpenAddEmployee: () => void;
  onOpenGenerateID: (employee?: Employee) => void;
}

export const CooDashboard: React.FC<CooDashboardProps> = ({
  session,
  employees,
  departments,
  onboarding,
  activityLogs,
  onNavigateTab,
  onOpenAddEmployee,
  onOpenGenerateID,
}) => {
  const activeEmployees = employees.filter((e) => e.status === 'Active').length;
  const idCardsGenerated = employees.filter((e) => e.idCardGenerated).length;
  const pendingOnboarding = onboarding.filter((o) => o.stage !== 'Completed').length;
  const pendingIdGeneration = employees.filter((e) => !e.idCardGenerated);

  return (
    <div className="space-y-6">
      {/* Operations Command Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B2545] via-[#0A5C4A] to-[#047857] p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/25 text-emerald-200 border border-emerald-400/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Chief Operating Officer Command • Employee & Credential Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {session.preferredName || session.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-200 mt-2 leading-relaxed">
            Driving UniGrova's day-to-day operations, organizational growth, employee lifecycle, and cross-venture coordination. 
            Directing official ID card generation, credential verification, and structured onboarding pipelines.
          </p>

          {/* Quick Actions Bar as requested in Section 8 */}
          <div className="flex flex-wrap gap-2.5 mt-5">
            <button
              onClick={onOpenAddEmployee}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Add Employee
            </button>
            <button
              onClick={() => onOpenGenerateID()}
              className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <CreditCard className="w-4 h-4 text-emerald-700" />
              Generate ID Card
            </button>
            <button
              onClick={() => onNavigateTab('onboarding')}
              className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 backdrop-blur-xs"
            >
              <UserPlus className="w-4 h-4" />
              Onboarding Pipeline ({pendingOnboarding})
            </button>
            <button
              onClick={() => onNavigateTab('operations')}
              className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 backdrop-blur-xs"
            >
              <Building2 className="w-4 h-4" />
              Departments ({departments.length})
            </button>
            <button
              onClick={() => onNavigateTab('reports')}
              className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 backdrop-blur-xs"
            >
              <FileBarChart className="w-4 h-4" />
              Operations Reports
            </button>
          </div>
        </div>
      </div>

      {/* COO Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Staff</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{employees.length}</div>
          <p className="text-[11px] text-blue-600 font-semibold mt-1">Managed by COO</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Staff</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{activeEmployees}</div>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">In active service</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">New This Q</span>
            <UserPlus className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">3</div>
          <p className="text-[11px] text-indigo-600 font-semibold mt-1">Growth rate +18%</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">ID Cards Issued</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{idCardsGenerated}</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            {Math.round((idCardsGenerated / (employees.length || 1)) * 100)}% coverage
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Onboarding</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">{pendingOnboarding}</div>
          <p className="text-[11px] text-amber-700 font-semibold mt-1">Active candidates</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Departments</span>
            <Building2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{departments.length}</div>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">Operational divisions</p>
        </div>
      </div>

      {/* Two Column Section: ID Card Issuance Desk + Onboarding Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ID Card Desk (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Official ID Card Dispatch & Queue</h3>
              <p className="text-xs text-slate-500">
                Authorized executive credentials awaiting generation and physical / PDF issue
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('idcards')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>ID Card Console</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {pendingIdGeneration.length > 0 ? (
              pendingIdGeneration.map((emp) => (
                <div
                  key={emp.id}
                  className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={emp.profilePhoto}
                      alt={emp.fullName}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-300 shadow-xs"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          emp.fullName
                        )}&background=0B2545&color=fff&size=100`;
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{emp.fullName}</h4>
                        <span className="font-mono text-xs text-slate-600 font-bold">{emp.employeeId}</span>
                      </div>
                      <p className="text-xs text-slate-600">{emp.designation} • {emp.department}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenGenerateID(emp)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Generate & Print Card</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-500">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">All Active Staff Have Verified ID Cards</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  100% of employees have received their authorized official badge.
                </p>
              </div>
            )}

            {/* Issued preview list */}
            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Recently Issued Badges
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {employees
                  .filter((e) => e.idCardGenerated)
                  .slice(0, 4)
                  .map((emp) => (
                    <div
                      key={emp.id}
                      onClick={() => onOpenGenerateID(emp)}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-slate-800 truncate">{emp.fullName}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{emp.employeeId}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                        Issued
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Onboarding & Operations Audit (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900">Onboarding Queue</h3>
              <button
                onClick={() => onNavigateTab('onboarding')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Pipeline
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">Candidates moving through operational workflow</p>

            <div className="space-y-3">
              {onboarding.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{item.fullName}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{item.roleProposed}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      Stage: {item.stage}
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigateTab('onboarding')}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Operations Audit Stream
              </h4>
              <div className="space-y-2">
                {activityLogs
                  .filter((l) => l.role === 'COO' || l.category === 'Employee' || l.category === 'IDCard')
                  .slice(0, 3)
                  .map((log) => (
                    <div key={log.id} className="text-xs flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-800 line-clamp-1">{log.action}</p>
                        <span className="text-[10px] text-slate-400">{log.time}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('employees')}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-colors text-center"
            >
              View Full Employee Directory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
