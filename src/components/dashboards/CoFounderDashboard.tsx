import React from 'react';
import {
  Cpu,
  Server,
  Code2,
  GitBranch,
  ShieldCheck,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Terminal,
  CheckCircle2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { TechProject, ActivityLog, UserSession } from '../../types';

interface CoFounderDashboardProps {
  session: UserSession;
  projects: TechProject[];
  activityLogs: ActivityLog[];
  onNavigateTab: (tab: string) => void;
}

export const CoFounderDashboard: React.FC<CoFounderDashboardProps> = ({
  session,
  projects,
  activityLogs,
  onNavigateTab,
}) => {
  const techLogs = activityLogs.filter((l) => l.category === 'Project' || l.category === 'System');

  return (
    <div className="space-y-6">
      {/* Technology Command Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B2545] via-[#103E6D] to-[#0369A1] p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-semibold mb-3">
            <Cpu className="w-3.5 h-3.5 text-sky-300" />
            <span>Technology Hub & Architecture Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {session.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-200 mt-2 leading-relaxed">
            Architecting UniGrova's technical foundations and cross-venture engineering standards. 
            Leading product development, system design, cloud infrastructure, and technical innovation.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={() => onNavigateTab('technology')}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Server className="w-4 h-4" />
              Cloud Infrastructure
            </button>
            <button
              onClick={() => onNavigateTab('projects')}
              className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 backdrop-blur-xs"
            >
              <Code2 className="w-4 h-4" />
              Active Projects ({projects.length})
            </button>
            <button
              onClick={() => onNavigateTab('reports')}
              className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 backdrop-blur-xs"
            >
              <Activity className="w-4 h-4" />
              Technical Reports
            </button>
          </div>
        </div>
      </div>

      {/* Tech KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Projects</span>
            <Code2 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{projects.length}</div>
          <p className="text-[11px] text-sky-600 font-semibold mt-1">4 core repositories</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Dev Teams</span>
            <GitBranch className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">6</div>
          <p className="text-[11px] text-slate-400 mt-1">24 engineers</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Products</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">4</div>
          <p className="text-[11px] text-indigo-600 font-semibold mt-1">Enterprise grade</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tech Issues</span>
            <AlertTriangle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">0</div>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">No critical defects</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">System Health</span>
            <Activity className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-teal-700">99.98%</div>
          <p className="text-[11px] text-teal-600 font-semibold mt-1">Uptime SLA verified</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Deployments</span>
            <Server className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">48</div>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">This quarter</p>
        </div>
      </div>

      {/* Main Grid: Active Software Pipelines + System Health Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Active Engineering Pipelines</h3>
              <p className="text-xs text-slate-500">Production software systems, repos & tech stacks</p>
            </div>
            <button
              onClick={() => onNavigateTab('projects')}
              className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1"
            >
              <span>Manage Projects</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{project.name}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">
                        {project.status}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">{project.repo}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">Lead:</span>
                    <strong className="text-slate-700">{project.lead}</strong>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500 text-[11px]">Sprint Progress</span>
                    <span className="font-bold text-slate-800">{project.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Stack badges */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">Stack:</span>
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[10px] font-medium bg-white text-slate-700 border border-slate-200 rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health & Architecture (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">System Health & Cloud</h3>
            <p className="text-xs text-slate-500 mb-4">Real-time infrastructure node status</p>

            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <div>
                    <p className="text-xs font-bold text-emerald-900">APAC Cloud Primary</p>
                    <p className="text-[10px] text-emerald-700">Cluster 01 • Cloud Run Active</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-800">12ms</span>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-xs font-bold text-emerald-900">Zero-Trust ID Node</p>
                    <p className="text-[10px] text-emerald-700">Token Vault & RBAC Engine</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-800">18ms</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">CI/CD Deploy Pipeline</p>
                    <p className="text-[10px] text-slate-500">Automated build & smoke tests</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Ready</span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Recent Technical Activity
              </h4>
              <div className="space-y-3">
                {techLogs.slice(0, 3).map((log) => (
                  <div key={log.id} className="text-xs flex items-start gap-2">
                    <Terminal className="w-3.5 h-3.5 text-sky-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-800">{log.action}</p>
                      <span className="text-[10px] text-slate-400">{log.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('technology')}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-colors text-center"
            >
              Open Engineering Architecture Console
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
