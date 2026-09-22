import React from 'react';
import {
  Users,
  Building2,
  Briefcase,
  Layers,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  Activity,
  AlertCircle,
  Award,
  Sparkles,
  Compass,
} from 'lucide-react';
import {
  Employee,
  Department,
  Venture,
  TechProject,
  ApprovalItem,
  ActivityLog,
  UserSession,
} from '../../types';
import { StorageService } from '../../services/storageService';

interface FounderDashboardProps {
  session: UserSession;
  employees: Employee[];
  departments: Department[];
  ventures: Venture[];
  projects: TechProject[];
  approvals: ApprovalItem[];
  activityLogs: ActivityLog[];
  onNavigateTab: (tab: string) => void;
}

export const FounderDashboard: React.FC<FounderDashboardProps> = ({
  session,
  employees,
  departments,
  ventures,
  projects,
  approvals,
  activityLogs,
  onNavigateTab,
}) => {
  const leaders = Object.values(StorageService.getLeaders());
  const activeEmployees = employees.filter((e) => e.status === 'Active').length;
  const pendingApprovals = approvals.filter((a) => a.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Welcome Hero / Vision Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B2545] via-[#113B68] to-[#0A5C4A] p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Executive Command & Long-Term Vision</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {session.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-200 mt-2 leading-relaxed">
            Pioneered the founding philosophy and overarching multi-venture vision of UniGrova. 
            Directing organization-wide strategy, technology innovation, and ecosystem expansion.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={() => onNavigateTab('strategic')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Compass className="w-4 h-4" />
              Strategic Initiatives
            </button>
            <button
              onClick={() => onNavigateTab('projects')}
              className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 backdrop-blur-xs"
            >
              <Layers className="w-4 h-4" />
              All Ventures ({ventures.length})
            </button>
            <button
              onClick={() => onNavigateTab('executives')}
              className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 backdrop-blur-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              Executive Governance
            </button>
          </div>
        </div>
      </div>

      {/* Founder Executive Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Staff</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{employees.length}</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Across all hubs</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Staff</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{activeEmployees}</div>
          <p className="text-[11px] text-slate-400 mt-1">100% compliant</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Departments</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{departments.length}</div>
          <p className="text-[11px] text-indigo-600 font-semibold mt-1">Active operations</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Projects</span>
            <Briefcase className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{projects.length}</div>
          <p className="text-[11px] text-sky-600 font-semibold mt-1">Active tech pipelines</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Ventures</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{ventures.length}</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Ecosystem brands</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">System Ops</span>
            <Activity className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">99.98%</div>
          <p className="text-[11px] text-teal-600 font-semibold mt-1">Cloud availability</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Approvals</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">{pendingApprovals}</div>
          <p className="text-[11px] text-amber-700 font-semibold mt-1">Pending review</p>
        </div>
      </div>

      {/* Leadership Overview Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">UniGrova Executive Leadership</h3>
            <p className="text-xs text-slate-500">Governance Council & Department Oversight</p>
          </div>
          <button
            onClick={() => onNavigateTab('executives')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Executive Details</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {leaders.map((leader) => (
            <div
              key={leader.officerId}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-emerald-300 transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={leader.profileImage}
                    alt={leader.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-300 shadow-xs bg-slate-200 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        leader.name
                      )}&background=0B2545&color=fff&size=100`;
                    }}
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{leader.name}</h4>
                    <p className="text-xs font-semibold text-emerald-700 truncate">{leader.position}</p>
                    <span className="text-[10px] font-mono text-slate-500 font-semibold">
                      {leader.officerId}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                  {leader.bio}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-600">{leader.department}</span>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                  {leader.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Columns: Venture Performance & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Venture Performance (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Venture Ecosystem & Innovation Units</h3>
              <p className="text-xs text-slate-500">Multi-venture architecture and operational performance</p>
            </div>
            <button
              onClick={() => onNavigateTab('projects')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Manage Ventures</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {ventures.map((venture) => (
              <div
                key={venture.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                      {venture.code}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 truncate">{venture.name}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {venture.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-1">{venture.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-500">
                    <span>Sector: <strong className="text-slate-700">{venture.sector}</strong></span>
                    <span>Lead: <strong className="text-slate-700">{venture.lead}</strong></span>
                    <span>Projects: <strong className="text-slate-700">{venture.activeProjects}</strong></span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Score</span>
                  <div className="flex items-center gap-1 text-emerald-700 font-black text-lg">
                    <TrendingUp className="w-4 h-4" />
                    <span>{venture.performanceScore}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Organization Activity (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Live Activity Feed</h3>
                <p className="text-xs text-slate-500">Real-time governance audit stream</p>
              </div>
              <button
                onClick={() => onNavigateTab('activity')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                View All
              </button>
            </div>

            <div className="space-y-3.5">
              {activityLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="text-xs flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800 leading-snug">{log.action}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>{log.user}</span>
                      <span>•</span>
                      <span>{log.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('reports')}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-colors text-center"
            >
              Export Organization Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
